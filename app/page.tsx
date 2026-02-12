import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-[#D4AF37] font-serif text-6xl tracking-[0.2em] mb-12">
        Deeply
      </h1>
      <Link 
        href="/play"
        className="px-12 py-4 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-[0.4em] text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-sm"
      >
        Enter
      </Link>
    </div>
  );
}
