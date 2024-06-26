import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState([]);
  const [preferredLanguage, setPreferredLanguage] = useState("");

  // ... other state variables and useEffect hook code

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ... saving profile data to Firestore code
  };

  return (
    <PrivateRoute>
      <main>
        {user ? (
          <section>
            <DashboardSidebar user={user} userProfile={null} />
            <div className="flex items-center justify-center h-screen ml-16 md:ml-48 lg:ml-64">
              Profile editing coming soon.
            </div>{" "}
          </section>
        ) : (
          <div> sorry</div>
        )}
      </main>
    </PrivateRoute>
  );
};

export default Profile;

{
  /* <form
          onSubmit={handleSubmit}
          className="card glass p-6 space-y-6 w-full max-w-xl"
        >
          <h2 className="text-2xl font-bold">Profile</h2>

          <div>
            <label htmlFor="businessName" className="label">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="input input-bordered"
            />
          </div>

          <div>
            <label htmlFor="businessDescription" className="label">
              Business Description
            </label>
            <textarea
              id="businessDescription"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="input input-bordered"
            />
          </div>

          <div>
            <label htmlFor="industry" className="label">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input input-bordered"
            />
          </div>

          <div>
            <label htmlFor="targetAudience" className="label">
              Target Audience
            </label>
            <input
              type="text"
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
        </form> */
}
