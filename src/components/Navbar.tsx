import React from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      router.push("/");
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          Content Spark ✨
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {!user && (
            <>
              <li>
                <Link href="/login">
                  <button>Login</button>
                </Link>
              </li>
              {/* <li>
                <Link href="/signup">
                  <button>Sign Up</button>
                </Link>
              </li> */}
            </>
          )}
          {user && (
            <div>
              <Link href="/dashboard">
                <button className="btn-sm btn-outline rounded-lg btn-primary m-2 ease-in-out duration-200">
                  Dashboard
                </button>
              </Link>
              <Link href="/profile">
                <button className="btn-sm btn-outline rounded-lg btn-primary m-2 ease-in-out duration-200">
                  Profile
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-sm btn-outline rounded-lg btn-accent m-2 ease-in-out duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
