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
        <title>ContentSpark</title>
        <meta
          name="description"
          content="ContentSpark simplifies the content creation process using AI to generate tailored content ideas for your social media platforms."
        />
        <meta name="keywords" content="content generation, social media, AI" />
      </Head>
      <Navbar />
      <section className="max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-center pt-10">
          Welcome to ContentSpark.io ✨
        </h1>
        <h2 className="py-6">
          For when you need a little help with your content creation process.
        </h2>
        <Link href="/login">
          <button className="btn btn-primary">Get Started</button>
        </Link>
      </section>
    </main>
  );
};

export default HomePage;
