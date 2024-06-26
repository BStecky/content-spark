import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Head from "next/head";

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <main className="h-screen text-center">
      <Head>
        <title>ContentSpark | AI-Powered Social Media Content Generation</title>
        <meta
          name="description"
          content="ContentSpark.io revolutionizes the content creation process with AI-powered content generation for social media platforms. Get tailored content ideas, Twitter threads, Facebook posts, and more!"
        />
        <meta
          name="keywords"
          content="content generation, social media, AI, content ideas, Twitter threads, Facebook posts, OpenAI API"
        />
        <meta
          property="og:title"
          content="ContentSpark | AI-Powered Social Media Content Generation"
        />
        <meta
          property="og:description"
          content="Revolutionize your content creation process with AI-powered content generation for social media platforms. Get tailored content ideas, Twitter threads, Facebook posts, and more!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.contentspark.io/" />
        {/* <meta
          property="og:image"
          content="https://www.contentspark.io/og-image.jpg"
        /> */}
        <link rel="canonical" href="https://www.contentspark.io/" />
      </Head>
      <Navbar />
      {/* <section className="max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-center pt-10">
          Welcome to ContentSpark.io ✨
        </h1>
        <h2 className="py-6">
          For when you need a little help with your content creation process.
        </h2>
        <Link href="/login">
          <button className="btn btn-primary">Get Started</button>
        </Link>
      </section> */}
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url("/images/contentsparkbg.png")`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-base-100">
              Spark ideas and generate content for your socials
            </h1>
            <p className="mb-5 text-base-100">
              Content Spark is here, for when you need a little help.
            </p>
            <Link href="/login">
              <button className="btn btn-primary">Get Started</button>
            </Link>{" "}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
