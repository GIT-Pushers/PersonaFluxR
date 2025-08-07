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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left side - Features */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                <h1 className="text-3xl lg:text-4xl font-bold text-indigo-600">
                  PersonaFlux
                </h1>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                Build Dynamic NPCs With Personality
              </h2>

              <p className="text-lg text-gray-600">
                Generate lifelike NPC dialogue using AI. Create character
                backstories, branching conversations, and immersive interactions
                in seconds.
              </p>

              <div className="space-y-4">
                {/* Real-time dialogue */}
                <div className="flex items-start gap-3">
                  <Mic className="w-5 h-5 mt-1 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Real-Time NPC Interaction
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Chat with your characters like players would in-game. The
                      AI responds in personality and context.
                    </p>
                  </div>
                </div>

                {/* Personality-driven */}
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 mt-1 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Personality-Driven Dialogue
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Dialogue stays consistent with your character’s traits,
                      backstory, and tone.
                    </p>
                  </div>
                </div>

                {/* Branching dialogues */}
                <div className="flex items-start gap-3">
                  <BarChart2 className="w-5 h-5 mt-1 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Branching Dialogue Paths
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Automatically generate multiple responses or conversation
                      routes to fit different player choices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Setup Box */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Instant Creation</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Sign in to create, customize, and chat with your NPCs right
                  away. No setup, no credit card required.
                </p>
              </div>
            </div>

            {/* Right side - Login Card */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Welcome Back!
                  </h1>
                  <p className="text-sm text-gray-500 mt-2">
                    Sign in to start building your AI-powered NPCs
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  <LoginGoogle />
                  <LoginGithub />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>100% secure login</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>We never share your data</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                  By continuing, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} PersonaFlux. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
