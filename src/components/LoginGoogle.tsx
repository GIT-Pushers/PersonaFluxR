"use client";

import { signInWithGoogle } from "@/actions/auth";
import React, { useTransition } from "react";

const LoginGoogle = () => {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await signInWithGoogle();
    });
  };

  return (
    <div
      onClick={handleGoogleLogin}
      role="button"
      tabIndex={0}
      className="w-full bg-white hover:bg-gray-50 border-2 border-gray-800 rounded font-mono font-bold py-3 px-4 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-red-500">G</span>
        <span className="text-gray-800">
          {isPending ? "Redirecting..." : "Sign in with Google"}
        </span>
      </div>
    </div>
  );
};

export default LoginGoogle;
