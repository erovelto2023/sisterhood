import { getBadges, getUserBadges } from '@/lib/actions/badge.actions';
import { FaMedal, FaLock } from 'react-icons/fa';

export default async function MyBadgesPage() {
    const [allBadges, userBadges] = await Promise.all([
        getBadges(),
        getUserBadges()
    ]);

    // Create a map of earned badge IDs for easy lookup
    const earnedBadgeIds = new Set(userBadges.map((ub: any) => ub.badge._id));

    // Group badges by category
    const badgesByCategory: Record<string, any[]> = {};
    allBadges.forEach((badge: any) => {
        const catName = badge.category?.name || 'General';
        if (!badgesByCategory[catName]) {
            badgesByCategory[catName] = [];
        }
        badgesByCategory[catName].push(badge);
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Achievements</h1>
                    <p className="text-gray-500 mt-1">Track your progress and earn badges.</p>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-100">
                    <span className="text-purple-800 font-bold">{userBadges.length}</span>
                    <span className="text-purple-600 ml-1">Badges Earned</span>
                </div>
            </div>

            {/* Recent Achievements */}
            {userBadges.length > 0 && (
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <FaMedal className="mr-2" /> Recently Earned
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {userBadges.slice(0, 4).map((ub: any) => (
                            <div key={ub._id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center border border-white/20">
                                <div className="h-16 w-16 mb-3 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                    {ub.badge.icon ? (
                                        <img src={ub.badge.icon} alt={ub.badge.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <FaMedal className="text-3xl" />
                                    )}
                                </div>
                                <h3 className="font-bold text-sm">{ub.badge.name}</h3>
                                <p className="text-xs text-white/70 mt-1">{new Date(ub.awardedAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Badges by Category */}
            <div className="space-y-8">
                {Object.entries(badgesByCategory).map(([category, badges]) => (
                    <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">{category}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {badges.map((badge: any) => {
                                const isEarned = earnedBadgeIds.has(badge._id);
                                const isHidden = badge.isHidden && !isEarned;

                                if (isHidden) {
                                    return (
                                        <div key={badge._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center text-center opacity-70">
                                            <div className="h-16 w-16 mb-3 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <FaLock className="text-2xl" />
                                            </div>
                                            <h4 className="font-bold text-gray-400">Secret Badge</h4>
                                            <p className="text-xs text-gray-400 mt-1">Keep exploring to unlock!</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={badge._id} className={`rounded-xl p-4 border flex flex-col items-center text-center transition-all ${isEarned ? 'bg-white border-purple-100 shadow-sm' : 'bg-gray-50 border-gray-100 grayscale opacity-80'}`}>
                                        <div className="h-20 w-20 mb-3 rounded-full flex items-center justify-center overflow-hidden relative">
                                            {badge.icon ? (
                                                <img src={badge.icon} alt={badge.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className={`h-full w-full flex items-center justify-center text-3xl ${isEarned ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-400'}`}>
                                                    <FaMedal />
                                                </div>
                                            )}
                                            {!isEarned && (
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                    <FaLock className="text-gray-500 text-xl" />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className={`font-bold ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>{badge.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{badge.description}</p>

                                        {/* Rarity Badge */}
                                        <div className="mt-3">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full 
                                                ${badge.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                                                    badge.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                                                        badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                                                            badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-yellow-100 text-yellow-700'}`}>
                                                {badge.rarity}
                                            </span>
                                        </div>

                                        {!isEarned && badge.triggerType !== 'manual' && (
                                            <div className="mt-3 w-full">
                                                <div className="text-xs text-gray-400 mb-1 text-left">Progress</div>
                                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-400 w-0" /> {/* TODO: Calculate actual progress */}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
