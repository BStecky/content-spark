import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { getUserProfile } from "../utils/firebase";
import { CustomUserProfile } from "../utils/firebase";

interface UserProfileContextValue {
  userProfile: CustomUserProfile | null;
  loading: boolean;
  updateUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue>({
  userProfile: null,
  loading: false,
  updateUserProfile: () => {},
});

export const useUserProfile = (userId: string | undefined) => {
  const context = useContext(UserProfileContext);

  useEffect(() => {
    context.updateUserProfile();
  }, [userId]);

  return context;
};

interface UserProfileProvider {
  children: React.ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProvider> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<CustomUserProfile | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const updateUserProfile = async () => {
    setLoading(true);
    if (auth.currentUser) {
      const profileData = await getUserProfile(auth.currentUser.uid);
      setUserProfile(profileData);
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      updateUserProfile();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserProfileContext.Provider
      value={{ userProfile, loading, updateUserProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
