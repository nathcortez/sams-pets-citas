'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import PetForm from './PetForm';
import BookingSummary from './BookingSummary';
import PetBreedSelection from './PetBreedSelection';
import ServiceSelection from './ServiceSelection';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { PetBreed, Service } from '@/types/breed';

interface BookingFlowProps {
  onComplete?: (appointment: Appointment) => void;
}

type Step = 'breed' | 'service' | 'calendar' | 'form' | 'summary';

export default function BookingFlow({ onComplete }: BookingFlowProps) {
  const [step, setStep] = useState<Step>('breed');
  const [selectedBreed, setSelectedBreed] = useState<PetBreed | undefined>();
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [showRecovery, setShowRecovery] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    petName: '',
    petBreedAge: '',
    ownerName: '',
    whatsapp: '',
    comments: '',
    additionalService: false,
  });
  const [isSending, setIsSending] = useState(false);

  const isValidForm = () => {
    return (
      formData.petName.trim() !== '' &&
      formData.ownerName.trim() !== '' &&
      formData.whatsapp.trim() !== ''
    );
  };

  const handleNext = () => {
    if (step === 'breed' && selectedBreed) {
      setStep('service');
    } else if (step === 'service' && selectedService) {
      setStep('calendar');
    } else if (step === 'calendar' && selectedDate && selectedTime) {
      setStep('form');
    } else if (step === 'form' && isValidForm()) {
      setStep('summary');
    }
  };

  const handleBack = () => {
    if (step === 'service') {
      setStep('breed');
    } else if (step === 'calendar') {
      setStep('service');
    } else if (step === 'form') {
      setStep('calendar');
    } else if (step === 'summary') {
      setStep('form');
    }
  };

  const handleSend = async () => {
    if (!selectedDate || !selectedTime) return;

    const appointmentData = {
      pet_name: formData.petName,
      pet_breed_age: formData.petBreedAge,
      pet_breed: selectedBreed?.name,
      pet_breed_emoji: selectedBreed?.emoji,
      pet_size: selectedBreed?.size,
      base_time_minutes: selectedBreed?.baseTimeMinutes,
      service_id: selectedService?.id,
      service_name: selectedService?.name,
      service_additional_time: selectedService?.additionalTimeMinutes,
      recovery_time: showRecovery ? 45 : 0,
      owner_name: formData.ownerName,
      whatsapp: formData.whatsapp,
      comments: formData.comments || null,
      additional_service: formData.additionalService,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      status: 'pendiente',
    };

    setIsSending(true);

    try {
      // Guardar en Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) throw error;

      // También guardar en localStorage como backup
      const backupAppointment: Appointment = {
        id: data?.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        petName: formData.petName,
        petBreedAge: formData.petBreedAge,
        petBreed: selectedBreed?.name,
        petBreedEmoji: selectedBreed?.emoji,
        petSize: selectedBreed?.size,
        serviceId: selectedService?.id,
        serviceName: selectedService?.name,
        serviceAdditionalTime: selectedService?.additionalTimeMinutes,
        recoveryTime: showRecovery ? 45 : 0,
        baseTimeMinutes: selectedBreed?.baseTimeMinutes,
        ownerName: formData.ownerName,
        whatsapp: formData.whatsapp,
        comments: formData.comments,
        additionalService: formData.additionalService,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pendiente' as AppointmentStatus,
      };

      // Guardar en localStorage para fallback
      const existing = JSON.parse(localStorage.getItem('sams-pets-appointments') || '[]');
      localStorage.setItem('sams-pets-appointments', JSON.stringify([...existing, backupAppointment]));

      onComplete?.(backupAppointment);
    } catch (err) {
      console.error('Error saving appointment:', err);
      // Guardar en localStorage como fallback
      const backupAppointment: Appointment = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        petName: formData.petName,
        petBreedAge: formData.petBreedAge,
        petBreed: selectedBreed?.name,
        petBreedEmoji: selectedBreed?.emoji,
        petSize: selectedBreed?.size,
        serviceId: selectedService?.id,
        serviceName: selectedService?.name,
        serviceAdditionalTime: selectedService?.additionalTimeMinutes,
        recoveryTime: showRecovery ? 45 : 0,
        baseTimeMinutes: selectedBreed?.baseTimeMinutes,
        ownerName: formData.ownerName,
        whatsapp: formData.whatsapp,
        comments: formData.comments,
        additionalService: formData.additionalService,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pendiente' as AppointmentStatus,
      };

      const existing = JSON.parse(localStorage.getItem('sams-pets-appointments') || '[]');
      localStorage.setItem('sams-pets-appointments', JSON.stringify([...existing, backupAppointment]));

      onComplete?.(backupAppointment);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'breed':
        return (
          <PetBreedSelection
            selectedBreed={selectedBreed}
            onSelect={setSelectedBreed}
          />
        );
      case 'service':
        return (
          <ServiceSelection
            selectedService={selectedService}
            baseTimeMinutes={selectedBreed?.baseTimeMinutes || 45}
            onSelect={setSelectedService}
            showRecovery={showRecovery}
            onRecoveryChange={setShowRecovery}
          />
        );
      case 'calendar':
        return (
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            selectedBreed={selectedBreed}
            selectedService={selectedService}
            recoveryTimeMinutes={showRecovery ? 45 : 0}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />
        );
      case 'form':
        return (
          <PetForm
            data={formData}
            onChange={setFormData}
          />
        );
      case 'summary':
        if (!selectedDate || !selectedTime) return null;
        return (
          <BookingSummary
            appointment={{
              id: '',
              createdAt: '',
              petName: formData.petName,
              petBreed: selectedBreed?.name,
              petBreedEmoji: selectedBreed?.emoji,
              petSize: selectedBreed?.size,
              serviceId: selectedService?.id,
              serviceName: selectedService?.name,
              serviceAdditionalTime: selectedService?.additionalTimeMinutes,
        recoveryTime: showRecovery ? 45 : 0,
              baseTimeMinutes: selectedBreed?.baseTimeMinutes,
              ownerName: formData.ownerName,
              whatsapp: formData.whatsapp,
              comments: formData.comments,
              additionalService: formData.additionalService,
              date: format(selectedDate, 'yyyy-MM-dd'),
              time: selectedTime,
              status: 'pendiente' as AppointmentStatus,
            }}
            onSend={handleSend}
            isSending={isSending}
          />
        );
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'breed':
        return !!selectedBreed;
      case 'service':
        return !!selectedService;
      case 'calendar':
        return !!selectedDate && !!selectedTime;
      case 'form':
        return isValidForm();
      case 'summary':
        return false;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'breed':
        return 'Selecciona el tipo de mascota';
      case 'service':
        return 'Selecciona el servicio';
      case 'calendar':
        return 'Selecciona fecha y hora';
      case 'form':
        return 'Datos de tu mascota';
      case 'summary':
        return 'Resumen de tu cita';
    }
  };

  return (
    <div className="space-y-6">
      {/* Step title at top */}
      <h2 className="text-xl font-bold text-[--azul-oscuro] text-center">
        {getStepTitle()}
      </h2>

      {/* Step content */}
      {renderStep()}

      {/* Progress indicator at bottom - hide on summary */}
      {step !== 'summary' && (
        <div className="flex items-center justify-center gap-2">
          {['breed', 'service', 'calendar', 'form'].map((s, index, arr) => (
            <div key={s} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step === s
                    ? 'bg-[#E8943D] text-white shadow-lg scale-110'
                    : ['breed', 'service', 'calendar', 'form'].indexOf(step) > index
                      ? 'bg-[#E8943D]/20 text-[#E8943D]'
                      : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                {index + 1}
              </div>
              {index < arr.length - 1 && (
                <div
                  className={`
                    w-12 h-1 mx-1 rounded transition-all
                    ${['breed', 'service', 'calendar', 'form'].indexOf(step) > index
                      ? 'bg-[#E8943D]'
                      : 'bg-gray-200'
                    }
                  `}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step === 'summary' ? (
          <button
            onClick={handleBack}
            className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-[--azul-oscuro] font-medium rounded-xl transition-colors"
          >
            Atrás
          </button>
        ) : (
          <>
            {step !== 'breed' && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-[--azul-oscuro] font-medium rounded-xl transition-colors"
              >
                Atrás
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                flex-1 py-3 px-6 font-semibold rounded-xl transition-all
                ${canProceed()
                  ? 'bg-[#E8943D] hover:bg-[#d4802f] text-white shadow-lg'
                  : 'bg-[#E8943D]/60 text-white/80 cursor-not-allowed'
                }
              `}
            >
              Continuar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
