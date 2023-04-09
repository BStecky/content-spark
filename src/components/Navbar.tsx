import React from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          ContentSpark
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
              <li>
                <Link href="/signup">
                  <button>Sign Up</button>
                </Link>
              </li>
            </>
          )}
          {user && (
            <div>
              <Link href="/dashboard">
                <button className="btn-sm btn-outline btn-primary m-2">
                  Dashboard
                </button>
              </Link>
              <Link href="/profile">
                <button className="btn-sm btn-outline btn-primary m-2">
                  Profile
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-sm btn-outline btn-secondary m-2"
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
