"use client";

import LoginGithub from "@/components/LoginGithub";
import LoginGoogle from "@/components/LoginGoogle";
import {
  Sparkles,
  Mic,
  Bot,
  BarChart2,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 flex flex-col relative overflow-hidden">
      {/* Animated pixel background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 bg-green-400 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-lime-400 animate-pulse"></div>
        <div className="absolute bottom-24 left-24 w-5 h-5 bg-green-300 animate-pulse"></div>
        <div className="absolute bottom-16 right-12 w-4 h-4 bg-emerald-400 animate-pulse"></div>
        <div className="absolute top-1/2 left-8 w-2 h-2 bg-yellow-400 animate-pulse"></div>
        <div className="absolute top-1/3 right-8 w-3 h-3 bg-lime-300 animate-pulse"></div>
      </div>

      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left side - Features */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-lime-400 animate-pulse" />
                <h1 className="text-3xl lg:text-4xl font-bold text-lime-400 font-mono tracking-wide">
                  PERSONAFLUX
                </h1>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-white font-mono">
                BUILD DYNAMIC NPCs WITH PERSONALITY
              </h2>

              <p className="text-lg text-green-200 font-mono">
                Generate epic NPC dialogue using AI magic. Craft character
                backstories, branching quest lines, and immersive RPG
                interactions in mere seconds.
              </p>

              <div className="space-y-4">
                {/* Real-time dialogue */}
                <div className="flex items-start gap-3 bg-black bg-opacity-40 p-3 rounded border-2 border-green-500">
                  <Mic className="w-5 h-5 mt-1 text-lime-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lime-400 font-mono">
                      REAL-TIME NPC COMBAT
                    </h3>
                    <p className="text-green-200 text-sm font-mono">
                      Battle-test your characters like players would in-game. AI
                      responds with personality and tactical context.
                    </p>
                  </div>
                </div>

                {/* Personality-driven */}
                <div className="flex items-start gap-3 bg-black bg-opacity-40 p-3 rounded border-2 border-green-500">
                  <Bot className="w-5 h-5 mt-1 text-lime-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lime-400 font-mono">
                      PERSONALITY ENGINE
                    </h3>
                    <p className="text-green-200 text-sm font-mono">
                      Dialogue stays true to your character`s stats, backstory
                      lore, and voice tone algorithms.
                    </p>
                  </div>
                </div>

                {/* Branching dialogues */}
                <div className="flex items-start gap-3 bg-black bg-opacity-40 p-3 rounded border-2 border-green-500">
                  <BarChart2 className="w-5 h-5 mt-1 text-lime-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lime-400 font-mono">
                      BRANCHING QUEST PATHS
                    </h3>
                    <p className="text-green-200 text-sm font-mono">
                      Auto-generate multiple response trees or conversation
                      routes to match different player skill builds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Setup Box */}
              <div className="bg-black bg-opacity-60 p-4 rounded border-2 border-lime-400">
                <div className="flex items-center gap-2 text-lime-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold font-mono">
                    INSTANT SPAWN
                  </span>
                </div>
                <p className="text-green-200 text-sm mt-1 font-mono">
                  Login to create, customize, and chat with your NPCs instantly.
                  No character creation fees, no premium guild membership
                  required.
                </p>
              </div>
            </div>

            {/* Right side - Login Card */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-2xl border-4 border-black relative">
                {/* Pixel art style header */}
                <div className="bg-black text-white py-4 rounded-t-lg">
                  <h1 className="text-xl font-bold text-center font-mono tracking-wider">
                    ENTER WORLD
                  </h1>
                </div>

                <div className="p-8">
                  <div className="flex flex-col gap-3">
                    <LoginGoogle />

                    <LoginGithub />
                  </div>

                  <div className="text-center mt-6 space-y-2">
                    <p className="text-sm text-gray-600 font-mono">
                      Don`t have an account?{" "}
                      <span className="text-blue-600 font-bold cursor-pointer">
                        SIGN UP
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 font-mono cursor-pointer">
                      Forgot Password?
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-mono">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>100% secure connection</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-mono mt-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Your data stays protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center border-t-2 border-green-600">
        <p className="text-sm text-green-200 font-mono">
          © {new Date().getFullYear()} PERSONAFLUX STUDIOS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
