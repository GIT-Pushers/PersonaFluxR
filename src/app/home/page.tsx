"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { TraitsMultiSelect } from "@/components/ui/multiSelect";
import { useChar } from "@/store/useChar";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(2);

  const {
    showMore,
    toggleShowMore,
    isDraggable,
    setIsDraggable,
    name,
    setName,
    age,
    setAge,
    traits,
    setTraits,
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
          dragConstraints={{ top: -100, bottom: 50, left: -100, right: 100 }}
          dragElastic={0.1}
          className={`scale-250 w-[128px] h-[128px] bg-[url('/male/male1/idle.png')] bg-no-repeat absolute ${
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
        <form className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create Character
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Define your characters details
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showMore && (
              <motion.div
                key="mainFields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                }}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter age"
                    min={0}
                    required
                  />
                </div>

                <TraitsMultiSelect value={traits} onChange={setTraits} />

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="Describe the character's backstory"
                    rows={4}
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <button
              type="button"
              onClick={toggleShowMore}
              className="text-sm text-blue-600 hover:underline"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
            <AnimatePresence>
              {showMore && (
                <motion.div
                  key="advancedOptions"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-4 space-y-2 overflow-hidden"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!showMore && (
              <motion.button
                key="submitBtn"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
