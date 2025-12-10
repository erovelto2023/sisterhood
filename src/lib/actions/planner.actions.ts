'use server';

import dbConnect from '@/lib/db';
import PlannerGoal from '@/models/PlannerGoal';
import PlannerTask from '@/models/PlannerTask';
import PlannerHabit from '@/models/PlannerHabit';
import PlannerEntry from '@/models/PlannerEntry';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

// --- Helpers ---

async function getUser() {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');
    await dbConnect();
    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');
    return user;
}

// --- Dashboard Stats ---

export async function getPlannerDashboard() {
    const user = await getUser();
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Parallel fetch
    const [
        activeGoals,
        pendingTasks,
        todayHabits,
        todayEntry
    ] = await Promise.all([
        PlannerGoal.find({ user: user._id, status: 'active' }).limit(3),
        PlannerTask.find({
            user: user._id,
            status: { $in: ['pending', 'in_progress'] },
            $or: [{ dueDate: { $lte: todayEnd } }, { dueDate: null }] // Due today or earlier, or no date
        }).sort({ priority: -1, dueDate: 1 }).limit(5),
        PlannerHabit.find({ user: user._id, active: true }),
        PlannerEntry.findOne({
            user: user._id,
            type: 'daily',
            date: { $gte: todayStart, $lte: todayEnd }
        })
    ]);

    // Process habits to see if completed today
    const processedHabits = todayHabits.map((habit: any) => ({
        ...habit.toObject(),
        completedToday: habit.completedDates.some((d: Date) => isSameDay(new Date(d), new Date()))
    }));

    return {
        goals: JSON.parse(JSON.stringify(activeGoals)),
        tasks: JSON.parse(JSON.stringify(pendingTasks)),
        habits: JSON.parse(JSON.stringify(processedHabits)),
        todayEntry: todayEntry ? JSON.parse(JSON.stringify(todayEntry)) : null
    };
}

// --- Goals ---

export async function createGoal(data: any) {
    const user = await getUser();
    const goal = await PlannerGoal.create({ ...data, user: user._id });
    revalidatePath('/members/apps/planner');
    return JSON.parse(JSON.stringify(goal));
}

export async function getGoals() {
    const user = await getUser();
    const goals = await PlannerGoal.find({ user: user._id }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(goals));
}

export async function updateGoal(id: string, data: any) {
    await getUser(); // Auth check
    const goal = await PlannerGoal.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/members/apps/planner');
    return JSON.parse(JSON.stringify(goal));
}

export async function deleteGoal(id: string) {
    await getUser(); // Auth check
    await PlannerGoal.findByIdAndDelete(id);
    revalidatePath('/members/apps/planner');
}

// --- Tasks ---

export async function createTask(data: any) {
    const user = await getUser();
    const task = await PlannerTask.create({ ...data, user: user._id });
    revalidatePath('/members/apps/planner');
    return JSON.parse(JSON.stringify(task));
}

export async function getTasks(filter: any = {}) {
    const user = await getUser();
    const query = { user: user._id, ...filter };
    const tasks = await PlannerTask.find(query).sort({ priority: -1, dueDate: 1 });
    return JSON.parse(JSON.stringify(tasks));
}

export async function updateTask(id: string, data: any) {
    await getUser();
    const task = await PlannerTask.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/members/apps/planner');
    return JSON.parse(JSON.stringify(task));
}

export async function deleteTask(id: string) {
    await getUser();
    await PlannerTask.findByIdAndDelete(id);
    revalidatePath('/members/apps/planner');
}

// --- Habits ---

export async function createHabit(data: any) {
    const user = await getUser();
    const habit = await PlannerHabit.create({ ...data, user: user._id });
    revalidatePath('/members/apps/planner');
    return JSON.parse(JSON.stringify(habit));
}

export async function toggleHabit(id: string, date: Date = new Date()) {
    const user = await getUser();
    const habit = await PlannerHabit.findOne({ _id: id, user: user._id });
    if (!habit) throw new Error('Habit not found');

    const targetDate = startOfDay(date);
    const existingIndex = habit.completedDates.findIndex((d: Date) => isSameDay(new Date(d), targetDate));

    if (existingIndex > -1) {
        // Uncheck
        habit.completedDates.splice(existingIndex, 1);
        // Recalculate streak logic could go here (simplified for now)
    } else {
        // Check
        habit.completedDates.push(targetDate);
        // Simple streak increment (real logic needs to check consecutive days)
        habit.currentStreak += 1;
        if (habit.currentStreak > habit.longestStreak) {
            habit.longestStreak = habit.currentStreak;
        }
    }

    await habit.save();
    revalidatePath('/members/apps/planner');
    return JSON.parse(JSON.stringify(habit));
}

// --- Entries (Daily Plan) ---

export async function updateDailyEntry(data: any) {
    const user = await getUser();
    const todayStart = startOfDay(new Date());

    const entry = await PlannerEntry.findOneAndUpdate(
        {
            user: user._id,
            type: 'daily',
            date: todayStart
        },
        {
            ...data,
            user: user._id,
            type: 'daily',
            date: todayStart
        },
        { upsert: true, new: true }
    );

    revalidatePath('/members/apps/planner');
    return JSON.parse(JSON.stringify(entry));
}
