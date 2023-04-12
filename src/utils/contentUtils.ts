// utils/contentUtils.ts
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebase"; // Import your firebase configuration file here

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
