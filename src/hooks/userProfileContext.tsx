import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { getUserProfile } from "../utils/firebase";

interface UserProfileContextValue {
  userProfile: any;
  loading: boolean; // Add loading state
  updateUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue>({
  userProfile: null,
  loading: false, // Add loading state to the default context value
  updateUserProfile: () => {},
});

export const useUserProfile = (userId: string | undefined) => {
  // Add userId parameter
  const context = useContext(UserProfileContext);

  // Add an effect to update the user profile when the userId changes
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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const updateUserProfile = async () => {
    setLoading(true); // Set loading to true before fetching user profile
    if (auth.currentUser) {
      const profileData = await getUserProfile(auth.currentUser.uid);
      setUserProfile(profileData);
    } else {
      setUserProfile(null);
    }
    setLoading(false); // Set loading to false after fetching user profile
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
