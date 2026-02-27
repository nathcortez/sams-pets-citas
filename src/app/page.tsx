'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookingFlow } from '@/components/booking';
import { BUSINESS_INFO } from '@/types/appointment';

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[--azul-claro]/30 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[--azul-principal] flex items-center justify-center">
              <span className="text-white text-lg">🐕</span>
            </div>
            <span className="font-bold text-[--azul-oscuro]">{BUSINESS_INFO.name}</span>
          </div>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
            className="text-[--azul-principal] hover:text-[--azul-oscuro]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  Cuidado profesional para tu mascota
                </h1>
                <p className="text-white/90">
                  Reserva tu cita de grooming ahora
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="text-3xl mb-2">✂️</div>
                <h3 className="font-semibold text-[--azul-oscuro]">Grooming</h3>
                <p className="text-sm text-[--gris]">Corte y baño</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="text-3xl mb-2">💆</div>
                <h3 className="font-semibold text-[--azul-oscuro]">Spa</h3>
                <p className="text-sm text-[--gris]">Tratamientos especiales</p>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="font-semibold text-[--azul-oscuro] mb-3">Información de contacto</h3>
              <div className="space-y-2 text-sm text-[--gris]">
                <p>📍 {BUSINESS_INFO.location}</p>
                <p>📞 {BUSINESS_INFO.phone}</p>
                <p>📷 {BUSINESS_INFO.instagram}</p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowBooking(true)}
              className="w-full py-4 px-6 bg-[--azul-principal] hover:bg-[--azul-oscuro] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              Reservar cita ahora
            </button>

            <p className="text-center text-sm text-[--gris]">
              🐾 Tu mascota en las mejores manos
            </p>
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
      <footer className="bg-white border-t border-gray-100 py-4 mt-8">
        <div className="max-w-md mx-auto px-4 text-center text-sm text-[--gris]">
          <p>© 2026 {BUSINESS_INFO.name}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
