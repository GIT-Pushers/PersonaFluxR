"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { TraitsMultiSelect } from "@/components/ui/multiSelect";
import { useChar } from "@/store/useChar";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(2);
  const [characterIndex, setCharacterIndex] = useState(3);
  console.log("Character Index:", characterIndex);

  const {
    showMore,
    toggleShowMore,
    isDraggable,
    setIsDraggable,
    name,
    setName,
    age,
    setAge,
    backstory,
    setBackstory,
  } = useChar();

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev >= 6 ? 1 : prev + 1));
  };

  return (
    <div className="flex h-screen w-screen">
      <section className="hero bg-amber-700 w-55/100 flex items-center justify-center relative overflow-hidden">
        <button
          className="absolute left-4 z-10 bg-transparent bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ArrowLeft />
        </button>
        <Image
          src={`/Summer${currentImage}.png`}
          alt={`Summer ${currentImage}`}
          fill
          style={{ objectFit: "cover" }}
          className="absolute inset-0"
        />
        <button
          className="absolute right-4 z-10 bg-transparent bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ArrowRight />
        </button>

        <motion.div
          drag={isDraggable}
          dragConstraints={{ top: -100, bottom: 100, left: -150, right: 150 }}
          dragElastic={0.1}
          className={`scale-[2.5] w-[128px] h-[128px] bg-[url('/male/male${characterIndex}/idle.png')] bg-no-repeat absolute ${
            isDraggable ? "cursor-grab" : "cursor-default"
          }`}
          style={{
            animation: "idle 1s steps(6) infinite",
            backgroundSize: "auto",
          }}
        >
          <style jsx>{`
            @keyframes idle {
              from {
                background-position: 0px;
              }
              to {
                background-position: -768px;
              }
            }
          `}</style>
        </motion.div>
      </section>

      <section className="bg-gray-50 w-45/100 flex items-center justify-center p-8">
        <form className="w-full max-w-lg bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Create Character
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Define your character`s core attributes and personality
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showMore && (
              <motion.div
                key="mainFields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-5 overflow-hidden"
              >
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter character name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="age"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter age"
                    min={0}
                    required
                  />
                </div>

                <TraitsMultiSelect />

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="backstory"
                  >
                    Backstory
                  </label>
                  <textarea
                    id="backstory"
                    name="backstory"
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="Describe the character's backstory"
                    rows={4}
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* More Button */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={toggleShowMore}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center space-x-1 transition-all"
            >
              <span>{showMore ? "Show Less" : "Show More"}</span>
              <motion.span
                animate={{ rotate: showMore ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.span>
            </button>
          </div>

          {/* Show More: Advanced Options */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                key="advancedOptions"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="pt-4 space-y-2 border-t border-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="draggable"
                    checked={isDraggable}
                    onChange={(e) => setIsDraggable(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="draggable"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enable Draggable Character
                  </label>
                </div>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 text-center">
                    Select Character
                  </h2>
                <div className="flex justify-evenly items-center space-x-3">
                    <div className="w-[85px] h-[85px] flex items-center justify-center ">
                        <Image
                            src="/male/male1/char.png"
                            alt="Character 1"
                            className={`cursor-pointer rounded-lg border-2 transition-all scale-110 duration-200 hover:scale-115 object-cover ${
                                characterIndex === 1
                                    ? "border-blue-500 shadow-lg"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                            width={85}
                            height={85}
                            onClick={() => setCharacterIndex(1)}
                        />
                    </div>
                    <div className="w-[85px] h-[85px] flex items-center justify-center">
                        <Image
                            src="/male/male2/char.png"
                            alt="Character 2"
                            className={`cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 object-cover ${
                                characterIndex === 2
                                    ? "border-blue-500 shadow-lg"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                            width={85}
                            height={85}
                            onClick={() => setCharacterIndex(2)}
                        />
                    </div>
                    <div className="w-[85px] h-[85px] flex items-center justify-center">
                        <Image
                            src="/male/male3/char.png"
                            alt="Character 3"
                            className={`cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 object-cover ${
                                characterIndex === 3
                                    ? "border-blue-500 shadow-lg"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                            width={85}
                            height={85}
                            onClick={() => setCharacterIndex(3)}
                        />
                    </div>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <AnimatePresence>
            {!showMore && (
              <motion.button
                key="submitBtn"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Character
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </section>
    </div>
  );
};

export default Home;
