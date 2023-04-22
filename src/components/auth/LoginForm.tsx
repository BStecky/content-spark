import React, { useState } from "react";
import {
  signInWithRedirect,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import { useRouter } from "next/router";
import Navbar from "../Navbar";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      console.log("successfully signed in");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithRedirect(auth, googleProvider);
      setError("");
      console.log("successfully signed in");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const actionCodeSettings = {
        url: "https://contentspark.io/dashboard",
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setEmailSent(true);
      window.localStorage.setItem("emailForSignIn", email);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main>
      {" "}
      <Navbar></Navbar>
      <section className="max-w-md bg-base-200 mx-auto p-10 rounded-lg mt-10 shadow-xl">
        <form onSubmit={handleEmailLogin} className="w-full max-w-sm mx-auto">
          <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              placeholder="All we need is your email."
              className="input input-bordered input-primary w-full max-w-s"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailSent && (
            <p className="text-green-500 mb-4">
              A sign-in link has been sent to your email. Please check your
              inbox.
            </p>
          )}
          {/* <div className="mb-6">
            <label className="block font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered input-primary w-full max-w-s"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div> */}
          <div className="flex items-center justify-between">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
        <button onClick={handleGoogleLogin} className="btn btn-accent my-2">
          Sign in with Google
        </button>
      </section>
    </main>
  );
};

export default LoginForm;
