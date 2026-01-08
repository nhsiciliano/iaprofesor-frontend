
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUser } from '@/lib/api';
import { UserProfile } from '@/lib/types';

export function useUser() {
    const { user: supabaseUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            if (!supabaseUser) {
                setLoading(false);
                return;
            }

            try {
                const response: any = await getCurrentUser();
                // The response from /auth/user is { ...supabaseUser, profile: { ... } }
                // OR it might be just the profile if we called getMe.
                // Let's assume response.profile contains the local profile with role.

                if (response.profile) {
                    setProfile(response.profile);
                    setIsAdmin(response.profile.role === 'admin');
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [supabaseUser]);

    return {
        user: supabaseUser,
        profile,
        loading,
        isAdmin
    };
}
