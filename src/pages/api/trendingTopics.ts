import { NextApiRequest, NextApiResponse } from "next";
const googleTrends = require("google-trends-api");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { businessDescription } = req.query;

  try {
    console.log("businessDescription: ", businessDescription);

    // Set a promise to resolve in the specified time
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const result = await Promise.race([
      googleTrends.dailyTrends({
        geo: "US",
      }),
      timeout(10000), // Timeout after 10 seconds
    ]);

    if (!result) {
      throw new Error("Timeout: Google Trends API did not respond in time.");
    }

    const parsedResult = JSON.parse(result);
    console.log("parsedResult: ", parsedResult);
    // const topics = parsedResult.default.rankedList[0].rankedKeyword.map(
    //   (topic: { topic: { title: string } }) => topic.topic.title
    // );
  } catch (error) {
    console.error("Full error object:", error);
    res.status(500).json({ error: "Failed to fetch trending topics" });
  }
}
