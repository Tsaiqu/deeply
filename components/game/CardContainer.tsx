"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Question } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useRouter, useSearchParams } from "next/navigation";
import { QuestionCard } from "./QuestionCard";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardContainerProps {
  questions: Question[];
  isSafeMode: boolean;
  currentIndex: number;
}

export function CardContainer({ questions, isSafeMode, currentIndex: initialIndex }: CardContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [internalIndex, setInternalIndex] = useState(initialIndex);
  const [exitX, setExitX] = useState(0);
  
  const handleSwipe = useCallback((direction: "left" | "right") => {
    const nextIndex = (internalIndex + 1) % questions.length;
    setExitX(direction === "right" ? 500 : -500);
    setInternalIndex(nextIndex);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("index", nextIndex.toString());
    
    // Sync URL without triggering a full page transition that would reset state
    // Next.js 15 router.replace with scroll:false is efficient
    router.replace(`/play?${params.toString()}`, { scroll: false });
  }, [internalIndex, questions.length, router, searchParams]);

  // Update internal index if the prop changes (e.g. via back button)
  useEffect(() => {
    setInternalIndex(initialIndex);
  }, [initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleSwipe("right");
      } else if (e.key === "ArrowLeft") {
        handleSwipe("left");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipe]);

  return (
    <div className="relative w-full max-w-md h-[500px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <QuestionCard
          key={internalIndex}
          question={questions[internalIndex % questions.length]}
          isSafeMode={isSafeMode}
          onSwipe={handleSwipe}
          exitX={exitX}
        />
      </AnimatePresence>

      {/* Session Counter */}
      <div className="absolute -bottom-16 flex flex-col items-center">
        <div className="text-[#D4AF37] font-sans font-light tracking-[0.3em] text-sm">
          {String((internalIndex % questions.length) + 1).padStart(2, "0")} <span className="opacity-40">/</span> {String(questions.length).padStart(2, "0")}
        </div>
        <div className="mt-4 flex gap-1">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1 h-1 rounded-full transition-all duration-300",
                i === (internalIndex % questions.length) ? "bg-[#D4AF37] w-4" : "bg-[#D4AF37]/20"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
