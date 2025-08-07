"use client";

import { signInWithGithub } from "@/actions/auth";
import React, { useTransition } from "react";
import { FaGithub } from "react-icons/fa";

const LoginGithub = () => {
  const [isPending, startTransition] = useTransition();

  const handleGithubLogin = () => {
    startTransition(async () => {
      await signInWithGithub();
    });
  };

  return (
    <div
      onClick={handleGithubLogin}
      role="button"
      tabIndex={0}
      className="w-full bg-gray-800 hover:bg-gray-900 text-white border-2 border-gray-800 rounded font-mono font-bold py-3 px-4 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex items-center justify-center gap-2">
        <FaGithub className="text-lg" />
        <span>{isPending ? "Redirecting..." : "Sign in with GitHub"}</span>
      </div>
    </div>
  );
};

export default LoginGithub;
