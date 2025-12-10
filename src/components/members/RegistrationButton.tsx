'use client';

import { useState } from 'react';
import { registerForEvent, cancelRegistration } from '@/lib/actions/event.actions';

interface RegistrationButtonProps {
    eventId: string;
    initialStatus: any;
    eventPrice: number;
    eventCapacity: number;
    attendeeCount: number;
}

export default function RegistrationButton({
    eventId,
    initialStatus,
    eventPrice,
    eventCapacity,
    attendeeCount
}: RegistrationButtonProps) {
    const [status, setStatus] = useState(initialStatus?.status || null);
    const [loading, setLoading] = useState(false);
    const [currentAttendeeCount, setCurrentAttendeeCount] = useState(attendeeCount);

    const isFull = eventCapacity > 0 && currentAttendeeCount >= eventCapacity;

    const handleRegister = async () => {
        if (!confirm(eventPrice > 0 ? `This event costs $${eventPrice}. Proceed to payment? (Mock)` : 'Confirm registration?')) return;

        setLoading(true);
        try {
            await registerForEvent(eventId);
            setStatus('registered');
            setCurrentAttendeeCount(prev => prev + 1);
        } catch (error) {
            console.error(error);
            alert('Failed to register');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your registration?')) return;

        setLoading(true);
        try {
            await cancelRegistration(eventId);
            setStatus('cancelled');
            setCurrentAttendeeCount(prev => prev - 1);
        } catch (error) {
            console.error(error);
            alert('Failed to cancel registration');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'registered') {
        return (
            <div className="text-center">
                <div className="mb-3 inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    You are registered!
                </div>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="block w-full px-6 py-3 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Cancel Registration'}
                </button>
            </div>
        );
    }

    if (isFull && status !== 'registered') {
        return (
            <button
                disabled
                className="w-full px-6 py-3 bg-gray-100 text-gray-400 font-medium rounded-xl cursor-not-allowed"
            >
                Event Full
            </button>
        );
    }

    return (
        <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Processing...' : eventPrice > 0 ? `Register for $${eventPrice}` : 'Register for Free'}
        </button>
    );
}
