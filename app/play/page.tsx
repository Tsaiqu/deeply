import { createClient } from "@/lib/supabase/server";
import { CardContainer } from "@/components/game/CardContainer";
import { Question } from "@/lib/types";
import Link from "next/link";
import { Menu, ShieldCheck, ShieldAlert } from "lucide-react";

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ safe?: string }>;
}) {
  const supabase = await createClient();
  const { safe } = await searchParams;
  const isSafeMode = safe === "true";

  // Fetch questions
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .limit(15);

  // Fallback for demo/development if DB is empty
  const displayQuestions: Question[] = questions?.length 
    ? questions 
    : [
        { id: "1", content: "What is a memory you hold dear but rarely share?", category_id: "1", is_premium: false, created_at: "" },
        { id: "2", content: "If you could ask one question and get the absolute truth, what would it be?", category_id: "1", is_premium: false, created_at: "" },
        { id: "3", content: "What's the most significant lesson a past relationship taught you?", category_id: "1", is_premium: false, created_at: "" },
      ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Top Navigation */}
      <div className="absolute top-8 left-8">
        <button className="text-gold opacity-80 hover:opacity-100 transition-opacity">
          <Menu className="w-6 h-6 text-[#D4AF37]" />
        </button>
      </div>

      <div className="absolute top-8 right-8 flex items-center gap-2">
        <Link 
          href={`/play?safe=${!isSafeMode}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#1A1A1A]/50 backdrop-blur-sm text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-xs uppercase tracking-widest"
        >
          {isSafeMode ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Safe Space: ON</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Safe Space: OFF</span>
            </>
          )}
        </Link>
      </div>

      {/* Main Gameplay */}
      <CardContainer 
        questions={displayQuestions} 
        isSafeMode={isSafeMode} 
      />

      {/* Theme Styles for Gold */}
      <style jsx global>{`
        .text-gold {
          color: #D4AF37;
        }
        .border-gold {
          border-color: #D4AF37;
        }
      `}</style>
    </main>
  );
}
