"use client";

import Image from "next/image";
import BookingFlow from "@/components/booking/BookingFlow";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header igual a la portada */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0">
            <Image
              src="/logo-samspets.png"
              alt="Sam's Pets Logo"
              width={48}
              height={48}
              className="rounded-xl"
            />
          </div>
          <h1 className="text-xl font-bold text-[#1B3A5C]">Sam&apos;s Pets</h1>
        </div>
        <BookingFlow />
      </div>
    </main>
  );
}
