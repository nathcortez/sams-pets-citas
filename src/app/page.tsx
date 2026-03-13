'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookingFlow } from '@/components/booking';
import { BUSINESS_INFO } from '@/types/appointment';

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Título centrado arriba */}
        <h1 className="w-80 text-[2.5rem] font-[800] text-[#1C1C1C] text-center mb-6 mx-auto leading-tight">
          Sam&apos;s Pets
        </h1>

        {!showBooking ? (
          // Landing Page
          <div className="space-y-6 flex flex-col items-center">
            {/* Hero Image - cuadrada 320px */}
            <div className="relative w-80 h-80 mx-auto rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdudmpoNDVkaWZxOGhkMmljM2I0ZXowbXcxOHJpa2xhOTNkeWtoaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kaNUEFq2Ogm8wT3JSf/giphy.gif"
                alt="Sam's Pets - Cuidado profesional para tu mascota"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {/* Logo overlay en esquina superior izquierda */}
              <div className="absolute top-4 left-4 bg-white rounded-xl p-2 shadow-lg">
                <Image
                  src="/logo-samspets.png"
                  alt="Sam's Pets Logo"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>
              {/* Texto sobre la imagen en blanco */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold">
                  Cuidado profesional para tu mascota
                </h2>
              </div>
            </div>

            {/* CTA Button - misma width que imagen */}
            <button
              onClick={() => setShowBooking(true)}
              className="w-80 py-5 px-6 bg-[#E8943D] hover:bg-[#d4802f] text-white font-bold text-xl rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              Reserva tu cita ahora 🐾
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
              Serás redirigido a WhatsApp para confirmar tu cita con Sam&apos;s Pets.
            </p>
            <button
              onClick={() => {
                setShowBooking(false);
                setShowSuccess(false);
              }}
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

      {/* Footer simple */}
      <footer className="bg-white border-t border-gray-100 py-4 mt-8">
        <div className="max-w-md mx-auto px-4 text-center text-sm text-[--gris]">
          <p>© 2026 {BUSINESS_INFO.name}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
