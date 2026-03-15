'use client';

import { useState } from 'react';

export interface ClientWithPets {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
  pets: {
    id: string;
    name: string;
    breed?: string;
  }[];
}

interface ClientListProps {
  clients: ClientWithPets[];
  onDeleteClient: (clientId: string) => void;
  onDeletePet: (petId: string, clientId: string) => void;
}

export default function ClientList({ clients, onDeleteClient, onDeletePet }: ClientListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar al cliente ${name} y todas sus mascotas? Esta acción no se puede deshacer.`)) {
      onDeleteClient(id);
    }
  };

  const handleDeletePet = (petId: string, petName: string, clientId: string) => {
    if (window.confirm(`¿Eliminar la mascota ${petName}? Esta acción no se puede deshacer.`)) {
      onDeletePet(petId, clientId);
    }
  };

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">👤</div>
        <p className="text-gray-500">No hay clientes registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <div key={client.id} className="bg-white rounded-2xl shadow-md overflow-hidden">

          {/* ── Tarjeta cliente ── */}
          <div className="p-4 space-y-3">

            {/* Nombre + expandir mascotas */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setExpanded(expanded === client.id ? null : client.id)}
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-400">
                  {client.pets.length} mascota{client.pets.length !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-gray-400 text-sm">{expanded === client.id ? '▲' : '▼'}</span>
            </div>

            {/* Botón eliminar cliente */}
            <button
              onClick={() => handleDeleteClient(client.id, client.name)}
              className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm font-medium transition-colors"
            >
              🗑️ Eliminar registro
            </button>
          </div>

          {/* ── Mascotas (expandible) ── */}
          {expanded === client.id && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Mascotas
              </p>

              {client.pets.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin mascotas registradas</p>
              ) : (
                client.pets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🐾</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{pet.name}</p>
                        {pet.breed && <p className="text-xs text-gray-500">{pet.breed}</p>}
                      </div>
                    </div>
                    {/* Botón eliminar mascota */}
                    <button
                      onClick={() => handleDeletePet(pet.id, pet.name, client.id)}
                      className="w-full py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-medium transition-colors"
                    >
                      🗑️ Eliminar registro
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
