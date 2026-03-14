'use client';

import Image from 'next/image';
import { BUSINESS_INFO } from '@/types/appointment';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <main className="max-w-md mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header con logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/logo-samspets.png"
              alt="Sam's Pets Logo"
              width={56}
              height={56}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1B3A5C]">Sam&apos;s Pets</h1>
        </div>

        {/* Hero section */}
        <div className="text-center mb-8">
          <h2 className="text-[2.5rem] font-extrabold text-[#1B3A5C] leading-tight mb-3">
            Agenda tu cita 🐾
          </h2>
          <p className="text-[#6B6B6B] text-lg">
            Estética canina profesional en El Progreso, Jutiapa
          </p>
        </div>

        {/* Fachada Sam's Pets */}
        <div className="relative w-full max-w-sm mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/fachada-sams-pets.jpeg"
            alt="Fachada Sam's Pets"
            width={540}
            height={368}
            className="w-full object-cover"
            priority
          />
        </div>

        {/* Info rápida */}
        <div className="flex justify-center gap-6 mb-10 text-sm text-[#6B6B6B]">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">📍</span>
            <span>El Progreso, Jutiapa</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">📞</span>
            <span>+502 4903-7428</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">⏰</span>
            <span>Lun-Sáb 8:00 - 17:00</span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="/booking"
          className="w-full max-w-sm py-5 px-6 bg-[#E8943D] hover:bg-[#d4802f] text-white font-bold text-xl rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 text-center"
        >
          Agendar mi cita
        </a>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[#6B6B6B]">
        <p>{BUSINESS_INFO.instagram}</p>
        <p className="mt-1">© 2026 {BUSINESS_INFO.name}</p>
      </footer>
    </div>
  );
}
