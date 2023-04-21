import React from "react";
import LoginForm from "../components/auth/LoginForm";
import SignUpForm from "../components/auth/SignUpForm";

const LoginPage: React.FC = () => {
  return (
    <div className="h-screen">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
