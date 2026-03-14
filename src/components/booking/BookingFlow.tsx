'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import PetForm from './PetForm';
import BookingSummary from './BookingSummary';
import PetBreedSelection from './PetBreedSelection';
import ServiceSelection from './ServiceSelection';
import PetPhoto from './PetPhoto';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { PetBreed, Service } from '@/types/breed';

interface BookingFlowProps {
  onComplete?: (appointment: Appointment) => void;
}

type Step = 'breed' | 'service' | 'calendar' | 'photo' | 'form' | 'summary';

export default function BookingFlow({ onComplete }: BookingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('breed');
  const [selectedBreed, setSelectedBreed] = useState<PetBreed | undefined>();
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
      setStep('photo');
    } else if (step === 'photo') {
      setStep('form');
    } else if (step === 'form' && isValidForm()) {
      setStep('summary');
    }
  };

  // Función para crear el bucket de fotos si no existe
  const ensureBucketExists = async (): Promise<boolean> => {
    try {
      // Verificar si el bucket ya existe
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();

      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }

      const bucketExists = buckets?.some(b => b.name === 'pet-photos');

      if (!bucketExists) {
        // Crear el bucket si no existe
        const { error: createError } = await supabase.storage.createBucket('pet-photos', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
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

  // Función para subir foto a Supabase Storage
  const uploadPetPhoto = async (appointmentId: string, photoData: string): Promise<string | null> => {
    try {
      // Verificar/crear bucket antes de subir
      const bucketReady = await ensureBucketExists();
      if (!bucketReady) {
        console.error('Bucket not available');
        return null;
      }

      // Convertir base64 a blob
      const response = await fetch(photoData);
      const blob = await response.blob();

      // Generar nombre de archivo con timestamp
      const timestamp = Date.now();
      const fileName = `${appointmentId}/${timestamp}.jpg`;
      const filePath = `pet-photos/${fileName}`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error processing photo:', err);
      return null;
    }
  };

  const handleBack = () => {
    if (step === 'breed') {
      router.push('/');
    } else if (step === 'service') {
      setStep('breed');
    } else if (step === 'calendar') {
      setStep('service');
    } else if (step === 'photo') {
      setStep('calendar');
    } else if (step === 'form') {
      setStep('photo');
    } else if (step === 'summary') {
      setStep('form');
    }
  };

  const handleSend = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSending(true);

    try {
      console.log('=== INICIO handleSend() ===');

      // 1. Buscar o crear el cliente
      const whatsappNormalized = formData.whatsapp.replace(/\D/g, '');
      console.log('1. Buscando cliente por WhatsApp:', whatsappNormalized);

      // Buscar cliente existente por WhatsApp
      const { data: existingClient, error: searchClientError } = await supabase
        .from('clients')
        .select('*')
        .eq('whatsapp', whatsappNormalized)
        .maybeSingle();

      if (searchClientError) {
        console.error('ERROR buscando cliente:', searchClientError);
        throw searchClientError;
      }
      console.log('Cliente encontrado:', existingClient);

      let clientId: string;

      if (existingClient) {
        // Cliente ya existe, actualizar nombre si cambió
        clientId = existingClient.id;
        console.log('Cliente existente ID:', clientId);
        if (existingClient.name !== formData.ownerName) {
          console.log('Actualizando nombre del cliente...');
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
        // Crear nuevo cliente
        console.log('2. Creando nuevo cliente...');
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
        console.log('Nuevo cliente creado:', newClient);
        clientId = newClient.id;
      }

      // 2. Buscar o crear la mascota
      console.log('3. Buscando mascota...');
      const { data: existingPet, error: searchPetError } = await supabase
        .from('pets')
        .select('*')
        .eq('client_id', clientId)
        .eq('name', formData.petName)
        .maybeSingle();

      if (searchPetError) {
        console.error('ERROR buscando mascota:', searchPetError);
        throw searchPetError;
      }

      let petId: string;

      if (existingPet) {
        petId = existingPet.id;
        console.log('Mascota existente encontrada:', existingPet);
      } else {
        // Crear nueva mascota
        console.log('4. Creando nueva mascota...');
        const { data: newPet, error: petError } = await supabase
          .from('pets')
          .insert({
            client_id: clientId,
            name: formData.petName,
            breed: selectedBreed?.name
          })
          .select()
          .single();

        if (petError) {
          console.error('ERROR creando mascota:', petError);
          throw petError;
        }
        console.log('Nueva mascota creada:', newPet);
        petId = newPet.id;
      }

      // 3. Crear la cita
      console.log('5. Insertando cita en Supabase...');
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

      // Guardar en Supabase
      console.log('Datos de la cita:', appointmentData);
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) {
        console.error('ERROR insertando cita:', error);
        throw error;
      }
      console.log('6. Cita insertada exitosamente:', data);

      // 4. Subir foto a Supabase Storage si existe
      let petPhotoUrl: string | null = null;
      if (petPhotoData && data?.id) {
        petPhotoUrl = await uploadPetPhoto(data.id, petPhotoData);

        // Actualizar la cita con la URL de la foto
        if (petPhotoUrl) {
          await supabase
            .from('appointments')
            .update({ pet_photo_url: petPhotoUrl })
            .eq('id', data.id);
        }
      }

      // Guardar en localStorage como backup
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
        petPhoto: petPhotoUrl || petPhotoData,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pendiente' as AppointmentStatus,
      };

      // Guardar en localStorage para fallback
      const existing = JSON.parse(localStorage.getItem('sams-pets-appointments') || '[]');
      localStorage.setItem('sams-pets-appointments', JSON.stringify([...existing, backupAppointment]));

      console.log('7. Guardado en localStorage exitoso');
      console.log('=== LLAMANDO onComplete() - Abriendo WhatsApp ===');

      onComplete?.(backupAppointment);
    } catch (err) {
      console.error('========================================');
      console.error('ERROR COMPLETO EN handleSend():', err);
      console.error('Error message:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      console.error('========================================');
      // Guardar en localStorage como fallback
      console.log('Guardando en localStorage como fallback...');
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
        petPhoto: petPhotoData,
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
      case 'photo':
        return (
          <PetPhoto
            photoData={petPhotoData}
            onPhotoChange={setPetPhotoData}
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
        petPhoto: petPhotoData,
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
      case 'photo':
        return true; // Foto es opcional
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
      case 'photo':
        return 'Foto de tu mascota';
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
          {['breed', 'service', 'calendar', 'photo', 'form'].map((s, index, arr) => (
            <div key={s} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step === s
                    ? 'bg-[#E8943D] text-white shadow-lg scale-110'
                    : ['breed', 'service', 'calendar', 'photo', 'form'].indexOf(step) > index
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
                    ${['breed', 'service', 'calendar', 'photo', 'form'].indexOf(step) > index
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
        ) : step === 'photo' ? (
          <>
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-[--azul-oscuro] font-medium rounded-xl transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={handleNext}
              className={`
                flex-1 py-3 px-6 font-semibold rounded-xl transition-all
                ${petPhotoData
                  ? 'bg-[#E8943D] hover:bg-[#d4802f] text-white shadow-lg'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                }
              `}
            >
              {petPhotoData ? 'Continuar' : 'Continuar sin foto'}
            </button>
          </>
        ) : step === 'breed' ? (
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
        ) : (
          <>
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-[--azul-oscuro] font-medium rounded-xl transition-colors"
            >
              Atrás
            </button>
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
