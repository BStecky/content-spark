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
import { CustomUserProfile, firestore } from "./firebase"; // Import your firebase configuration file here
import { UserProfile } from "firebase/auth";

interface Content {
  id: string;
  userId: string;
  contentType: string;
  content: string;
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
    case "contentIdeas":
      return "contentIdeas";
    default:
      return null;
  }
};

export const createBasicPrompt = (
  userProfile: CustomUserProfile,
  contentType: string,
  replyTo: string,
  about: string,
  selectedTone: string,
  selectedPlatform: string,
  threadLength: number
): string => {
  const businessName = userProfile.businessName;
  const targetType = userProfile.targetAudience;
  const tone = selectedTone.toLowerCase();

  const format =
    contentType === "Thread"
      ? "Tweet 1: [tweet1]\nTweet 2: [tweet2]\n..."
      : "Tweet: [response]";

  let prompt = `
  Instruction: Please generate an engaging ${selectedPlatform} ${contentType}.
  About me: I am a ${userProfile.userType}. 
  Info about me or my business: ${userProfile.businessDescription}, ${businessName}. 
  Post Tone: ${tone} 
  Target audience: ${targetType}.
  Do not include any hashtags.
  Please provide the content in the following format: ${format}`;

  switch (contentType) {
    case "Thread":
      prompt += `\n Thread length: ${threadLength} tweets. `;
      prompt += `\n Thread context: ${about}. `;
    case "Reply":
      prompt += `\n Reply to the following tweet: "${replyTo}". `;
    default:
      prompt += `\n ${contentType} context: ${about}. `;
  }

  return prompt;
};

export const createBasicSparkPrompt = (
  userProfile: CustomUserProfile,
  contentType: string,
  theme: string,
  keywords: string[]
): string => {
  const targetAudience = userProfile.targetAudience;
  const businessName = userProfile.businessName;
  const businessDescription = userProfile.businessDescription;
  const userType = userProfile.userType;

  if ((contentType = "anything")) {
    contentType = "random social media content";
  }

  const format = "Idea 1: [idea1]\nIdea 2: [idea2]\nIdea 3: [idea3]";

  let prompt = `Generate three ${contentType} ideas for a ${userType}, their business name is ${businessName} and 
  the description is ${businessDescription}.
  The content theme should be ${theme}.
  Reference the following keywords: ${keywords}. 
  The target audience is ${targetAudience}.
  Please provide the ideas in the following format: ${format}`;

  return prompt;
};

export const createTweetSuggestionPrompt = (
  userProfile: CustomUserProfile | null,
  contentType: string,
  tweetContext: string | null,
  tone: string,
  keywords: string[]
): string => {
  const targetAudience = userProfile?.targetAudience;
  const businessName = userProfile?.businessName;
  const businessDescription = userProfile?.businessDescription;
  const userType = userProfile?.userType;

  if ((contentType = "anything")) {
    contentType = "random social media content";
  }

  const format = "1: [tweet1]\n2: [tweet2]\n3: [tweet3]";

  let prompt = `Come up with three unique and relatable tweet ideas for a ${userType}, their name or business name is ${businessName}.
  The background context for this creator is: ${businessDescription}.
  IMPORTANT: Do not explicitly mention the context information in the tweets unless it is absolutely relevant to the tweet idea. Instead, use it as a context for generating ideas.
  The tone of the tweets should be: ${tone}.
  The target audience is: ${targetAudience}.
  The tweets must be relatable, not overly promotional, and written in a way that feels genuine and human-like. Avoid using a lot of hashtags and overly upbeat language that may come across as "cringe" or unrelatable.
  ${
    tweetContext
      ? `The tweets should be about this: ${tweetContext}.`
      : `Reference the following keywords to come up with tweet ideas: ${keywords.join(
          ", "
        )}.`
  }

  Please provide the ideas in the following format: ${format}`;

  return prompt;
};

export const createPostSuggestionPrompt = (
  userProfile: CustomUserProfile | null,
  contentType: string,
  postContext: string | null,
  tone: string,
  keywords: string[]
): string => {
  const targetAudience = userProfile?.targetAudience;
  const businessName = userProfile?.businessName;
  const businessDescription = userProfile?.businessDescription;
  const userType = userProfile?.userType;
  const format = "1: [post1]\n2: [post2]\n3: [post3]";

  let prompt = `Come up with three unique and relatable social media post ideas for a ${userType}, the posts should be a paragraph or two at least, their name or business name is ${businessName}.
  The background context for this creator is: ${businessDescription}.
  IMPORTANT: Do not explicitly mention the the background information in the posts unless it is absolutely relevant to the tweet idea. Instead, use it as a context for generating ideas.
  The tone of the posts should be: ${tone}.
  The target audience is: ${targetAudience}.
  The posts must be relatable, not overly promotional, and written in a way that feels genuine and human-like. Avoid using a lot of hashtags and overly upbeat language that may come across as "cringe" or unrelatable. 
  ${
    postContext
      ? `The post should be about this: ${postContext}.`
      : `Reference the following keywords to come up with post ideas: ${keywords.join(
          ", "
        )}.`
  }
  Please provide the ideas in the following format: ${format}`;

  return prompt;
};

// TODO: Potentially abstract the tweet related functions to "twitterUtils.ts"
// and the LinkedIn related functions to "linkedInUtils.ts" etc. etc.
export const getTweets = async (userId: string): Promise<Content[]> => {
  try {
    const tweets: Content[] = [];
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
        userId: data.userId,
        content: data.content,
        contentType: "twitterTweet",
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

export const getIdeas = async (userId: string): Promise<Content[]> => {
  try {
    const ideas: Content[] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "contentIdeas"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      )
    );
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      ideas.push({
        id: doc.id,
        userId: data.userId,
        content: data.content,
        contentType: "contentIdeas",
        createdAt: data.createdAt.toDate(),
      });
    });
    return ideas;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return []; // Return an empty array in case of errors
  }
};

export const getAllContent = async (userId: string): Promise<Content[]> => {
  const contentTypes = [
    // "linkedInPost",
    // "linkedInComment",
    // "linkedInReply",
    "twitterTweet",
    "twitterThread",
    // "twitterComment",
    "twitterReply",
    "contentIdeas",
  ];

  const allContent: Content[] = [];
  for (const contentType of contentTypes) {
    const contentCollection = getCollectionForContentType(contentType);
    if (!contentCollection) {
      console.error("Invalid content type:", contentType);
      continue;
    }
    const contentQuery = query(
      collection(firestore, contentCollection),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const contentSnapshot = await getDocs(contentQuery);
    const contentArray: Content[] = contentSnapshot.docs.map((doc) => ({
      id: doc.id,
      contentType,
      ...doc.data(),
    })) as Content[];
    allContent.push(...contentArray);
  }

  return allContent;
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, "contentIdeas", ideaId));
    console.log("Idea deleted successfully.");
  } catch (error) {
    console.error("Error deleting idea:", error);
  }
};

export const deleteContent = async (
  contentId: string,
  contentType: string
): Promise<void> => {
  try {
    const contentCollection = getCollectionForContentType(contentType);
    if (!contentCollection) {
      console.error("Invalid content type:", contentType);
      return;
    }

    await deleteDoc(doc(firestore, contentCollection, contentId));
    console.log(`${contentType} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting ${contentType}:`, error);
  }
};
