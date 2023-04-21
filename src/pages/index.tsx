import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <main className="h-screen text-center">
      <Navbar />
      <section className="max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-center pt-10">
          Welcome to ContentSpark.io ✨
        </h1>
        <h2 className="py-6">
          I'm not supposed to focus on the landing page so why don't you just
          check the app out?
        </h2>
        <Link href="/login">
          <button className="btn btn-primary">Get Started</button>
        </Link>
      </section>
    </main>
  );
};

export default HomePage;
