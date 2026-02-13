"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Question } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardContainerProps {
  questions: Question[];
  isSafeMode: boolean;
}

export function CardContainer({ questions, isSafeMode }: CardContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const currentQuestion = questions[currentIndex % questions.length];
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % questions.length);
      x.set(0);
    }, 200);
  };

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  return (
    <div className="relative w-full max-w-md h-[500px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ x: x.get() > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
          className="relative w-[320px] h-[450px] cursor-grab active:cursor-grabbing preserve-3d"
        >
          <motion.div
            className="w-full h-full relative preserve-3d"
            initial={false}
            animate={{ 
              rotateY: isFlipped ? 180 : 0, 
              y: isFlipped ? -40 : 0,
              scale: isFlipped ? 1.05 : 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
            }}
            onClick={handleFlip}
          >
            {/* Card Back (Midnight Black & Gold) */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl border border-[#D4AF37] bg-[#0F0F0F] flex flex-col items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
              <h1 className="text-[#D4AF37] font-serif text-4xl tracking-widest relative z-10">
                Deeply
              </h1>
              
              {/* Glint Effect Overlay */}
              <motion.div 
                className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                animate={isFlipped ? { x: "100%", opacity: [0, 0.5, 0] } : { x: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(105deg, transparent 20%, rgba(212, 175, 55, 0.4) 45%, rgba(212, 175, 55, 0.6) 50%, rgba(212, 175, 55, 0.4) 55%, transparent 80%)"
                }}
              />
            </div>

            {/* Card Front (Off-white) */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden rounded-2xl border border-[#D4AF37] bg-[#F5F5F0] p-8 flex flex-col items-center justify-center shadow-2xl"
              style={{ transform: "rotateY(180deg)" }}
            >
              {/* Thin inner black border */}
              <div className="absolute inset-3 border border-black/10 rounded-xl pointer-events-none" />
              
              <div className={cn(
                "text-center font-serif text-2xl text-[#0F0F0F] leading-relaxed transition-all duration-500 relative z-10 px-4",
                isSafeMode && "opacity-20 select-none"
              )}>
                {currentQuestion.content}
              </div>

              {isSafeMode && (
                <div className="absolute inset-0 z-20 backdrop-blur-md flex items-center justify-center rounded-2xl">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-black/60 font-sans font-medium">
                    Content Hidden
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Session Counter */}
      <div className="absolute -bottom-16 flex flex-col items-center">
        <div className="text-[#D4AF37] font-sans font-light tracking-[0.3em] text-sm">
          {String(currentIndex + 1).padStart(2, "0")} <span className="opacity-40">/</span> {String(questions.length).padStart(2, "0")}
        </div>
        <div className="mt-4 flex gap-1">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1 h-1 rounded-full transition-all duration-300",
                i === currentIndex ? "bg-[#D4AF37] w-4" : "bg-[#D4AF37]/20"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
