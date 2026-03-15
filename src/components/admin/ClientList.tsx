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
  const [confirmDeleteClient, setConfirmDeleteClient] = useState<string | null>(null);
  const [confirmDeletePet, setConfirmDeletePet] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

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

          {/* Encabezado del cliente */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
              >
                <div className="w-10 h-10 rounded-full bg-[#E8943D]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">📱 {client.whatsapp}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-auto mr-3">
                  {client.pets.length} mascota{client.pets.length !== 1 ? 's' : ''}
                </span>
                <span className="text-gray-400 text-sm">
                  {expandedClient === client.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Botón eliminar cliente */}
              {confirmDeleteClient === client.id ? (
                <div className="flex gap-2 ml-3">
                  <button
                    onClick={() => { onDeleteClient(client.id); setConfirmDeleteClient(null); }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    onClick={() => setConfirmDeleteClient(null)}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteClient(client.id); }}
                  className="ml-3 py-2 px-3 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-lg transition-colors text-sm"
                  title="Eliminar cliente y sus mascotas"
                >
                  🗑️
                </button>
              )}
            </div>

            {/* Aviso de borrado de cliente */}
            {confirmDeleteClient === client.id && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">
                  ⚠️ ¿Eliminar a <strong>{client.name}</strong> y todas sus mascotas?
                  Esta acción no se puede deshacer.
                </p>
              </div>
            )}
          </div>

          {/* Mascotas del cliente (expandible) */}
          {expandedClient === client.id && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Mascotas
              </p>
              {client.pets.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin mascotas registradas</p>
              ) : (
                client.pets.map((pet) => (
                  <div key={pet.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🐾</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{pet.name}</p>
                        {pet.breed && (
                          <p className="text-xs text-gray-500">{pet.breed}</p>
                        )}
                      </div>
                    </div>

                    {/* Botón eliminar mascota */}
                    {confirmDeletePet === pet.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { onDeletePet(pet.id, client.id); setConfirmDeletePet(null); }}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setConfirmDeletePet(null)}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeletePet(pet.id)}
                        className="py-1.5 px-2.5 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-lg transition-colors text-sm"
                        title="Eliminar mascota"
                      >
                        🗑️
                      </button>
                    )}
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
