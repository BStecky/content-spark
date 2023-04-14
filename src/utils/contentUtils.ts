// utils/contentUtils.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { firestore } from "./firebase"; // Import your firebase configuration file here

interface Tweet {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

export const saveGeneratedContent = async (
  userId: string,
  generatedText: string,
  contentType: string
) => {
  try {
    const contentCollection = getCollectionForContentType(contentType);
    if (!contentCollection) {
      console.error("Invalid content type:", contentType);
      return;
    }

    await addDoc(collection(firestore, contentCollection), {
      userId,
      content: generatedText,
      createdAt: new Date(),
    });

    console.log("Generated content saved successfully.");
  } catch (error) {
    console.error("Error saving generated content:", error);
  }
};

const getCollectionForContentType = (contentType: string): string | null => {
  switch (contentType) {
    case "linkedInPost":
      return "linkedInPosts";
    case "linkedInComment":
      return "linkedInComments";
    case "linkedInReply":
      return "linkedInReplies";
    case "twitterTweet":
      return "twitterTweets";
    case "twitterThread":
      return "twitterThreads";
    case "twitterComment":
      return "twitterComments";
    case "twitterReply":
      return "twitterReplies";
    default:
      return null;
  }
};

// TODO: Potentially abstract the tweet related functions to "twitterUtils.ts"
// and the LinkedIn related functions to "linkedInUtils.ts" etc. etc.
export const getTweets = async (userId: string): Promise<Tweet[]> => {
  try {
    const tweets: Tweet[] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "twitterTweets"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      )
    );

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tweets.push({
        id: doc.id,
        content: data.content,
        userId: data.userId,
        createdAt: data.createdAt.toDate(),
      });
    });

    return tweets;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return []; // Return an empty array in case of errors
  }
};

export const deleteTweet = async (tweetId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, "twitterTweets", tweetId));
    console.log("Tweet deleted successfully.");
  } catch (error) {
    console.error("Error deleting tweet:", error);
  }
};
