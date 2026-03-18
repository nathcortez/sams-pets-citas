'use client';

import Image from 'next/image';
import { BUSINESS_INFO } from '@/types/appointment';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 flex flex-col items-center justify-between">

        {/* Header con logo */}
        <div className="flex items-center gap-3 w-full">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/logo-samspets.png"
              alt="Sam's Pets Logo"
              width={48}
              height={48}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-xl font-bold text-[#1B3A5C]">Sam&apos;s Pets</h1>
        </div>

        {/* Hero section */}
        <div className="text-center">
          <h2 className="text-[1.8rem] font-extrabold text-[#1B3A5C] leading-tight mb-1 whitespace-nowrap">
            Sistema de Citas 🐾
          </h2>
          <p className="text-[#6B6B6B] text-sm">
            Estética Canina en El Progreso, Jutiapa
          </p>
        </div>

        {/* Fachada Sam's Pets */}
        <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg">
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
        <div className="flex justify-center items-center gap-5 text-sm text-[#6B6B6B]">
          <div className="flex items-center gap-1.5">
            <span>📞</span>
            <span>+502 4903-7428</span>
          </div>
          <div className="w-px h-4 bg-[#E5E3DE]" />
          <div className="flex items-center gap-1.5">
            <span>⏰</span>
            <span>Lun-Vie 8:00 - 17:00</span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="/booking"
          className="w-full max-w-sm py-4 px-6 bg-[#E8943D] hover:bg-[#d4802f] text-white font-bold text-lg rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 text-center"
        >
          Agendar mi cita
        </a>

        {/* Footer integrado */}
        <div className="flex items-center justify-center gap-4 text-xs text-[#9B9B9B]">
          <a
            href={`https://instagram.com/${BUSINESS_INFO.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#E8943D] transition-colors"
          >
            {/* Instagram icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            <span>{BUSINESS_INFO.instagram}</span>
          </a>
          <div className="w-px h-3 bg-[#E5E3DE]" />
          <span>© 2026 {BUSINESS_INFO.name}</span>
        </div>

      </main>
    </div>
  );
}
