import { UserProfile } from "firebase/auth";
import { CustomUserProfile } from "./firebase";
import {
  doc,
  updateDoc,
  getDoc,
  increment as firestoreIncrement,
} from "firebase/firestore";
import { firestore } from "./firebase";

// planUtils.ts
export const hasUserHitApiLimit = (userProfile: CustomUserProfile) => {
  let apiCallLimit = 0;
  switch (userProfile.planId) {
    case "free":
      apiCallLimit = 20;
    case "regular":
      apiCallLimit = 100;
    default: {
      apiCallLimit = 20;
    }
  }

  return userProfile.apiCallUsage >= apiCallLimit;
};

export const calculateApiUsagePercentage = (
  userProfile: CustomUserProfile | null
): number => {
  if (!userProfile) return 100;

  const planId = userProfile.planId;
  const apiCallUsage = userProfile.apiCallUsage;
  let apiCallLimit = 0;

  switch (planId) {
    case "free":
      apiCallLimit = 20;
      break;
    case "regular":
      apiCallLimit = 100;
      break;
    default:
      apiCallLimit = 20;
  }

  const percentageUsed = (apiCallUsage / apiCallLimit) * 100;

  return 100 - percentageUsed;
};

export const shouldResetApiLimit = (user: CustomUserProfile) => {
  const resetPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const currentTime = new Date().getTime();
  const lastApiCallResetTime = user.lastApiCallReset.getTime();
  return currentTime - lastApiCallResetTime > resetPeriod;
};

export const checkAndUpdateApiUsage = async (
  userProfile: CustomUserProfile,
  increment: number
) => {
  const userDocRef = doc(firestore, "users", userProfile.id);

  // Get the user data
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.data();

  // Check if the API limit should be reset
  if (shouldResetApiLimit(userProfile)) {
    await updateDoc(userDocRef, {
      apiCallUsage: 0,
      lastApiCallReset: new Date(),
    });
  }

  // Check if the user has hit the API limit
  if (hasUserHitApiLimit(userProfile)) {
    // Return false if the user has hit the API limit
    alert("You have reached your API limit for the day.");
    return false;
  }

  // Proceed with incrementing the usage
  await updateDoc(userDocRef, {
    apiCallUsage: firestoreIncrement(increment),
  });

  // Return true if the API usage has been successfully updated
  return true;
};
