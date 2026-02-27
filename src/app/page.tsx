'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookingFlow } from '@/components/booking';
import { BUSINESS_INFO } from '@/types/appointment';

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[--azul-claro]/40 via-[--azul-principal]/20 to-[--naranja]/20 relative overflow-hidden">
      {/* Paw prints pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24'%3E%3Cpath fill='%234A6FA5' d='M4.5 9.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm3 1.5c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5s.67 1.5 1.5 1.5zm9 0c.83 0 1.5-.67 1.5-1.5S17.33 8 16.5 8 15 8.67 15 9.5s.67 1.5 1.5 1.5zm-4.5 4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z'/%3E%3C/svg%3E")`,
      }} />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-[--azul-oscuro] text-center">
            Sistema de citas de Sam's Pets
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {!showBooking ? (
          // Landing Page
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="relative aspect-square max-h-96 mx-auto rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdudmpoNDVkaWZxOGhkMmljM2I0ZXowbXcxOHJpa2xhOTNkeWtoaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kaNUEFq2Ogm8wT3JSf/giphy.gif"
                alt="Sam's Pets - Cuidado profesional para tu mascota"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {/* Logo overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                <Image
                  src="/logo-samspets.png"
                  alt="Sam's Pets Logo"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl font-bold">
                  Cuidado profesional para tu mascota
                </h1>
              </div>
            </div>

            {/* CTA Button - prominent */}
            <button
              onClick={() => setShowBooking(true)}
              className="w-full py-5 px-6 bg-[#E8943D] hover:bg-[#d4802f] text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              🐾 Reserva tu cita ahora
            </button>
          </div>
        ) : showSuccess ? (
          // Success Message
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-[--verde-limon] rounded-full flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-[--azul-oscuro] mb-4">
              ¡Cita enviada!
            </h2>
            <p className="text-[--gris] mb-6">
              Serás redirigido a WhatsApp para confirmar tu cita con Sam's Pets.
            </p>
            <button
              onClick={() => {
                setShowBooking(false);
                setShowSuccess(false);
              }
              }
              className="text-[--azul-principal] font-medium hover:underline"
            >
              Reservar otra cita
            </button>
          </div>
        ) : (
          // Booking Flow
          <div className="space-y-6">
            <button
              onClick={() => setShowBooking(false)}
              className="flex items-center gap-2 text-[--azul-principal] hover:text-[--azul-oscuro] font-medium"
            >
              ← Volver
            </button>

            <BookingFlow
              onComplete={() => setShowSuccess(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 py-4 mt-8">
        <div className="max-w-md mx-auto px-4 text-center text-sm text-[--gris]">
          <p>© 2026 {BUSINESS_INFO.name}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
