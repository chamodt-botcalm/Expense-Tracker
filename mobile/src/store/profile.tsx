import React, { createContext, useCallback, useEffect, useState } from 'react';
import { profileApi } from '../config/profileApi';

type ProfileState = {
  name: string;
  profilePhoto: string | null;
  isLoading: boolean;
};

type ProfileContextValue = ProfileState & {
  loadProfile: (userId: string) => Promise<void>;
  updateName: (userId: string, name: string) => Promise<void>;
  updatePhoto: (userId: string, photo: string) => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextValue>({
  name: '',
  profilePhoto: null,
  isLoading: false,
  loadProfile: async () => {},
  updateName: async () => {},
  updatePhoto: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const data = await profileApi.getProfile(userId);
      setName(data.profile.name || '');
      setProfilePhoto(data.profile.profile_photo || null);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateName = useCallback(async (userId: string, newName: string) => {
    const data = await profileApi.updateProfile(userId, { name: newName });
    setName(data.profile.name || '');
  }, []);

  const updatePhoto = useCallback(async (userId: string, photo: string) => {
    await profileApi.updateProfile(userId, { profile_photo: photo });
    setProfilePhoto(photo);
  }, []);

  return (
    <ProfileContext.Provider value={{ name, profilePhoto, isLoading, loadProfile, updateName, updatePhoto }}>
      {children}
    </ProfileContext.Provider>
  );
}
