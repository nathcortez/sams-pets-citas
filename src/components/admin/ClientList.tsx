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
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [confirmClient, setConfirmClient]   = useState<string | null>(null);
  const [confirmPet, setConfirmPet]         = useState<string | null>(null);

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

          {/* ── Fila principal del cliente ── */}
          <div className="p-4 space-y-3">

            {/* Info + expandir */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
            >
              <div className="w-10 h-10 rounded-full bg-[#E8943D]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-500">📱 {client.whatsapp}</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                {client.pets.length} mascota{client.pets.length !== 1 ? 's' : ''}
              </span>
              <span className="text-gray-400 text-sm flex-shrink-0">
                {expandedClient === client.id ? '▲' : '▼'}
              </span>
            </div>

            {/* Botón eliminar cliente — siempre visible, rojo claro */}
            {confirmClient === client.id ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ ¿Eliminar a <strong>{client.name}</strong> y todas sus mascotas?
                </p>
                <p className="text-xs text-red-500">Esta acción no se puede deshacer.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onDeleteClient(client.id); setConfirmClient(null); }}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Sí, eliminar cliente
                  </button>
                  <button
                    onClick={() => setConfirmClient(null)}
                    className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmClient(client.id); }}
                className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-2"
              >
                🗑️ Eliminar cliente
              </button>
            )}
          </div>

          {/* ── Mascotas (expandible) ── */}
          {expandedClient === client.id && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Mascotas
              </p>

              {client.pets.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin mascotas registradas</p>
              ) : (
                client.pets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">

                    {/* Info mascota */}
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🐾</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{pet.name}</p>
                        {pet.breed && <p className="text-xs text-gray-500">{pet.breed}</p>}
                      </div>
                    </div>

                    {/* Botón eliminar mascota */}
                    {confirmPet === pet.id ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 space-y-2">
                        <p className="text-xs text-red-700 font-medium">
                          ¿Eliminar a <strong>{pet.name}</strong>?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { onDeletePet(pet.id, client.id); setConfirmPet(null); }}
                            className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            onClick={() => setConfirmPet(null)}
                            className="flex-1 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmPet(pet.id)}
                        className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1"
                      >
                        🗑️ Eliminar mascota
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
