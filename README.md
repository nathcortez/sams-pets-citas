# Sam's Pets Citas

Sistema de reservas de citas para Sam's Pets - Pet Shop & Grooming

## Características

- 🎨 Diseño mobile-first visualmente atractivo
- 📅 Calendario interactivo para seleccionar fecha
- ⏰ Selector de horarios (8:00 AM - 3:00 PM, con hora de almuerzo)
- 📱 Integración con WhatsApp para confirmar citas
- 🔔 Recordatorios configurables
- 📊 Panel de administración

## Tecnologías

- Next.js 16 (App Router)
- Tailwind CSS v4
- TypeScript
- Supabase (opcional)

## Getting Started

1. Instala las dependencias:
```bash
npm install
```

2. Copia el archivo de configuración:
```bash
cp .env.local.example .env.local
```

3. Configura Supabase (opcional):
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Copia las credenciales a `.env.local`

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000)

## Panel de Administración

Accede al panel de administración en [http://localhost:3000/admin](http://localhost:3000/admin)

## Configuración

### Horarios

Edita `src/types/appointment.ts` para modificar los horarios de atención.

### Información del negocio

Edita `BUSINESS_INFO` en `src/types/appointment.ts` para cambiar el nombre, dirección, teléfono, etc.

### Colores

Los colores están definidos en `src/app/globals.css`:
- Azul principal: #4A6FA5
- Azul oscuro: #2E4A7A
- Azul claro: #7BB3E0
- Naranja: #E8943D
- Amarillo: #F5B731
- Verde limón: #C5D432
- Púrpura: #5B4B9E

## Despliegue

```bash
npm run build
```

El proyecto está listo para desplegar en Vercel.
