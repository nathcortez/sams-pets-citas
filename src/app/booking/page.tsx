"use client";

import BookingFlow from "@/components/booking/BookingFlow";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header con botón back */}
        <div className="flex items-center gap-3 mb-6">
          <a href="/" className="text-[#6B6B6B] hover:text-[#1B3A5C] transition-colors">
            ← Volver
          </a>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-[#1B3A5C]">Sam&apos;s Pets</span>
          </div>
        </div>
        <BookingFlow />
      </div>
    </main>
  );
}
