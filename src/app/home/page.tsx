"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(2);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev >= 6 ? 1 : prev + 1));
  };

  return (
    <div className="flex h-screen w-screen">
      <section className="hero bg-amber-700 w-55/100 flex items-center justify-center relative">
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
          className="absolute inset-0 "
        />
        <button
          className="absolute right-4 z-10 bg-transparent bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ArrowRight />
        </button>
      </section>
      <section className="chat bg-blue-700 w-45/100 flex items-center justify-center">
        Chat
      </section>
    </div>
  );
};

export default Home;
