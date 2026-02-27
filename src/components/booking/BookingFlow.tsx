'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import PetForm from './PetForm';
import BookingSummary from './BookingSummary';
import { Appointment, AppointmentStatus } from '@/types/appointment';

interface BookingFlowProps {
  onComplete?: (appointment: Appointment) => void;
}

type Step = 'calendar' | 'time' | 'form' | 'summary';

export default function BookingFlow({ onComplete }: BookingFlowProps) {
  const [step, setStep] = useState<Step>('calendar');
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
      formData.petBreedAge.trim() !== '' &&
      formData.ownerName.trim() !== '' &&
      formData.whatsapp.trim() !== ''
    );
  };

  const handleNext = () => {
    if (step === 'calendar' && selectedDate) {
      setStep('time');
    } else if (step === 'time' && selectedTime) {
      setStep('form');
    } else if (step === 'form' && isValidForm()) {
      setStep('summary');
    }
  };

  const handleBack = () => {
    if (step === 'time') {
      setStep('calendar');
    } else if (step === 'form') {
      setStep('time');
    } else if (step === 'summary') {
      setStep('form');
    }
  };

  const handleSend = async () => {
    if (!selectedDate || !selectedTime) return;

    const appointmentData = {
      pet_name: formData.petName,
      pet_breed_age: formData.petBreedAge,
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
      case 'calendar':
        return (
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        );
      case 'time':
        return (
          <TimeSlots
            selected={selectedTime}
            onSelect={setSelectedTime}
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
              petBreedAge: formData.petBreedAge,
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
      case 'calendar':
        return !!selectedDate;
      case 'time':
        return !!selectedTime;
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
      case 'calendar':
        return 'Selecciona una fecha';
      case 'time':
        return 'Elige un horario';
      case 'form':
        return 'Datos de tu mascota';
      case 'summary':
        return 'Confirma tu cita';
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

      {/* Progress indicator at bottom */}
      <div className="flex items-center justify-center gap-2">
        {['calendar', 'time', 'form', 'summary'].map((s, index) => (
          <div key={s} className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                ${step === s
                  ? 'bg-[--azul-principal] text-white'
                  : ['calendar', 'time', 'form', 'summary'].indexOf(step) > index
                    ? 'bg-[--verde-limon] text-[--azul-oscuro]'
                    : 'bg-gray-200 text-gray-400'
                }
              `}
            >
              {index + 1}
            </div>
            {index < 3 && (
              <div
                className={`
                  w-8 h-1 mx-1 rounded
                  ${['calendar', 'time', 'form', 'summary'].indexOf(step) > index
                    ? 'bg-[--verde-limon]'
                    : 'bg-gray-200'
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {step !== 'summary' && (
        <div className="flex gap-3">
          {step !== 'calendar' && (
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
        </div>
      )}
    </div>
  );
}
