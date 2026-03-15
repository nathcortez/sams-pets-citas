'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import Calendar, { isWeekend } from './Calendar';
import PetStep from './PetStep';
import OwnerStep from './OwnerStep';
import BookingSummary from './BookingSummary';
import ServiceSelection from './ServiceSelection';
import ConfirmationScreen from './ConfirmationScreen';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { PetBreed, Service } from '@/types/breed';

type Step = 'pet' | 'service' | 'calendar' | 'owner' | 'summary' | 'confirmation';

export default function BookingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('pet');
  const [selectedBreed, setSelectedBreed] = useState<PetBreed | undefined>();
  const [petName, setPetName] = useState('');
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [showRecovery, setShowRecovery] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [petPhotoData, setPetPhotoData] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    petName: '',
    petBreedAge: '',
    ownerName: '',
    whatsapp: '',
    comments: '',
    additionalService: false,
  });
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const isValidForm = () => {
    return (
      formData.ownerName.trim() !== '' &&
      formData.whatsapp.trim() !== ''
    );
  };

  const handleNext = () => {
    if (step === 'pet' && selectedBreed && petName.trim()) {
      setStep('service');
    } else if (step === 'service' && selectedService) {
      setStep('calendar');
    } else if (step === 'calendar' && selectedDate && selectedTime) {
      setStep('owner');
    } else if (step === 'owner' && isValidForm()) {
      setStep('summary');
    }
  };

  // Función para crear el bucket de fotos si no existe
  const ensureBucketExists = async (): Promise<boolean> => {
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }
      const bucketExists = buckets?.some(b => b.name === 'pet-photos');
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('pet-photos', {
          public: true,
          fileSizeLimit: 5242880,
        });
        if (createError) {
          console.error('Error creating bucket:', createError);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error('Error ensuring bucket exists:', err);
      return false;
    }
  };

  const uploadPetPhoto = async (appointmentId: string, photoData: string): Promise<string | null> => {
    try {
      const bucketReady = await ensureBucketExists();
      if (!bucketReady) return null;

      // Convertir base64 a Blob manualmente (evita errores con fetch + data URLs)
      const [header, base64] = photoData.split(',');
      const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      const binary = atob(base64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });

      const fileName = `${appointmentId}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(`pet-photos/${fileName}`, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(`pet-photos/${fileName}`);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error processing photo:', err);
      return null; // La foto es opcional — nunca bloquea la cita
    }
  };

  const handleBack = () => {
    if (step === 'pet') {
      router.push('/');
    } else if (step === 'service') {
      setStep('pet');
    } else if (step === 'calendar') {
      setStep('service');
    } else if (step === 'owner') {
      setStep('calendar');
    } else if (step === 'summary') {
      setStep('owner');
    }
  };

  const handleSend = async () => {
    if (!selectedDate || !selectedTime) return;

    // Guardia: no permitir citas en fin de semana (sábado o domingo)
    if (isWeekend(selectedDate)) {
      setSendError('No se pueden agendar citas los sábados ni domingos. Por favor selecciona otro día.');
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      console.log('=== INICIO handleSend() ===');

      // 1. Buscar o crear el cliente
      const whatsappNormalized = formData.whatsapp.replace(/\D/g, '');
      console.log('1. Buscando cliente por WhatsApp:', whatsappNormalized);

      const { data: existingClient, error: searchClientError } = await supabase
        .from('clients')
        .select('*')
        .eq('whatsapp', whatsappNormalized)
        .maybeSingle();

      if (searchClientError) {
        console.error('ERROR buscando cliente:', searchClientError);
        throw searchClientError;
      }

      let clientId: string;

      if (existingClient) {
        clientId = existingClient.id;
        if (existingClient.name !== formData.ownerName) {
          const { error: updateClientError } = await supabase
            .from('clients')
            .update({ name: formData.ownerName })
            .eq('id', clientId);
          if (updateClientError) {
            console.error('ERROR actualizando cliente:', updateClientError);
            throw updateClientError;
          }
        }
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: formData.ownerName,
            whatsapp: whatsappNormalized
          })
          .select()
          .single();

        if (clientError) {
          console.error('ERROR creando cliente:', clientError);
          throw clientError;
        }
        clientId = newClient.id;
      }

      // 2. Buscar o crear la mascota
      const { data: existingPet, error: searchPetError } = await supabase
        .from('pets')
        .select('*')
        .eq('client_id', clientId)
        .eq('name', petName)
        .maybeSingle();

      if (searchPetError) {
        console.error('ERROR buscando mascota:', searchPetError);
        throw searchPetError;
      }

      let petId: string;

      if (existingPet) {
        petId = existingPet.id;
      } else {
        const { data: newPet, error: petError } = await supabase
          .from('pets')
          .insert({
            client_id: clientId,
            name: petName,
            breed: selectedBreed?.name
          })
          .select()
          .single();

        if (petError) {
          console.error('ERROR creando mascota:', petError);
          throw petError;
        }
        petId = newPet.id;
      }

      // 3. Crear la cita
      const appointmentData = {
        pet_name: petName,
        pet_breed_age: formData.petBreedAge || selectedBreed?.name || '',
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

      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) {
        console.error('ERROR insertando cita:', error);
        throw error;
      }

      // 4. Subir foto si existe
      let petPhotoUrl: string | null = null;
      if (petPhotoData && data?.id) {
        petPhotoUrl = await uploadPetPhoto(data.id, petPhotoData);
        if (petPhotoUrl) {
          await supabase
            .from('appointments')
            .update({ pet_photo_url: petPhotoUrl })
            .eq('id', data.id);
        }
      }

      // Objeto de la cita (con foto base64 en memoria para la pantalla de confirmación)
      const confirmedApt: Appointment = {
        id: data?.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        petName: petName,
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
        petPhoto: petPhotoUrl || petPhotoData, // base64 solo en memoria, no en localStorage
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pendiente' as AppointmentStatus,
      };

      // Guardar en localStorage como backup — SIN la foto (el base64 es muy pesado)
      try {
        const backupApt = { ...confirmedApt, petPhoto: petPhotoUrl || undefined };
        const existing = JSON.parse(localStorage.getItem('sams-pets-appointments') || '[]');
        localStorage.setItem('sams-pets-appointments', JSON.stringify([...existing, backupApt]));
      } catch (storageErr) {
        // Quota excedida u otro error de Storage — no es crítico, Supabase ya tiene la cita
        console.warn('localStorage backup fallido (no crítico):', storageErr);
      }

      setConfirmedAppointment(confirmedApt);
      setStep('confirmation');
    } catch (err: any) {
      console.error('ERROR EN handleSend():', err);
      const msg = err?.message || err?.details || 'Hubo un problema al guardar tu cita. Intenta de nuevo.';
      setSendError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'pet':
        return (
          <PetStep
            selectedBreed={selectedBreed}
            petName={petName}
            onBreedSelect={setSelectedBreed}
            onPetNameChange={setPetName}
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
      case 'owner':
        return (
          <OwnerStep
            formData={formData}
            onChange={setFormData}
            petPhotoData={petPhotoData}
            onPhotoChange={setPetPhotoData}
          />
        );
      case 'summary':
        if (!selectedDate || !selectedTime) return null;
        return (
          <BookingSummary
            appointment={{
              id: '',
              createdAt: '',
              petName: petName,
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
              petPhoto: petPhotoData,
              date: format(selectedDate, 'yyyy-MM-dd'),
              time: selectedTime,
              status: 'pendiente' as AppointmentStatus,
            }}
            onSend={handleSend}
            isSending={isSending}
            error={sendError}
          />
        );
      case 'confirmation':
        if (!confirmedAppointment) return null;
        return <ConfirmationScreen appointment={confirmedAppointment} />;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'pet':
        return !!selectedBreed && petName.trim().length > 0;
      case 'service':
        return !!selectedService;
      case 'calendar':
        return !!selectedDate && !!selectedTime;
      case 'owner':
        return isValidForm();
      case 'summary':
        return false;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'pet':
        return '¿Cómo es tu mascota?';
      case 'service':
        return '¿Qué servicio necesitas?';
      case 'calendar':
        return '¿Cuándo la traes?';
      case 'owner':
        return 'Tus datos de contacto';
      case 'summary':
        return 'Resumen de tu cita';
      case 'confirmation':
        return '';
    }
  };

  // No mostrar layout en confirmación
  if (step === 'confirmation') {
    return renderStep();
  }

  return (
    <div className="space-y-6">
      {/* Step title */}
      <h2 className="text-xl font-bold text-[#1B3A5C] text-center">
        {getStepTitle()}
      </h2>

      {/* Step content */}
      {renderStep()}

      {/* Progress indicator - hide on summary */}
      {step !== 'summary' && (
        <div className="flex items-center justify-center gap-2">
          {(['pet', 'service', 'calendar', 'owner'] as const).map((s, index, arr) => (
            <div key={s} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step === s
                    ? 'bg-[#E8943D] text-white shadow-lg scale-110'
                    : (['pet', 'service', 'calendar', 'owner'] as const).indexOf(step) > index
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
                    ${(['pet', 'service', 'calendar', 'owner'] as const).indexOf(step) > index
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
        {/* Botón Atrás — siempre presente excepto en confirmación */}
        <button
          onClick={handleBack}
          className="flex-1 py-3 px-6 bg-white border-2 border-[#E5E3DE] hover:border-[#E8943D] text-[#1B3A5C] font-semibold rounded-xl transition-all"
        >
          ← Atrás
        </button>

        {/* Botón Continuar — oculto en summary (el envío está dentro de BookingSummary) */}
        {step !== 'summary' && (
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
        )}
      </div>
    </div>
  );
}
