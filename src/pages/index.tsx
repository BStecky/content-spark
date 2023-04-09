import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className=" h-screen text-center">
      <Navbar />
      <h1 className="text-3xl font-bold text-center pt-10 text-primary">
        Welcome to ContentSpark.io
      </h1>
      <h2>This is the homepage containing information</h2>
    </div>
  );
};

export default HomePage;
