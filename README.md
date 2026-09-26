# QRCanvasPlatform

Una plataforma para crear y compartir páginas hermosas con códigos QR, construida con Vue 3, TypeScript, Vite, Express y PostgreSQL.

## 🚀 Tecnologías

- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia + Vue Router
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Deployment**: Docker + Vercel

## 📦 Instalación

### Desarrollo Local

1. Clona el repositorio:
```bash
cd QRCanvasPlatformLc
```

2. Instala dependencias:
```bash
npm install
```

3. Configura variables de entorno:
```bash
cp .env.example .env
# Edita .env con tus configuraciones
```

4. Inicia la base de datos con Docker:
```bash
docker-compose up -d postgres
```

5. Ejecuta migraciones:
```bash
npm run db:migrate
```

6. (Opcional) Ejecuta seed:
```bash
npm run db:seed
```

7. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Esto iniciará:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Con Docker Compose (Todo en uno)

```bash
docker-compose up --build
```

## 🏗️ Estructura del Proyecto

```
QRCanvasPlatformLc/
├── src/                    # Frontend Vue
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/            # Componentes base (Button, Card)
│   │   ├── editor/        # Componentes del editor
│   │   ├── layout/        # Header, Footer
│   │   └── sidebar/       # Paneles laterales
│   ├── pages/             # Páginas/Vistas
│   │   ├── auth/          # Login, Register
│   │   └── editor/        # Editor de páginas
│   ├── composables/       # Composables de Vue
│   ├── services/          # Servicios API
│   ├── stores/            # Pinia stores
│   ├── types/             # Tipos TypeScript
│   ├── layouts/           # Layouts
│   └── utils/             # Utilidades
├── server/                 # Backend Express
│   ├── routes/            # Rutas API
│   ├── middleware/        # Middleware
│   ├── controllers/       # Controladores
│   ├── db/                # Base de datos
│   └── utils/             # Utilidades
├── public/                 # Archivos estáticos
├── dist/                   # Build de producción
├── docker-compose.yml     # Docker Compose
├── Dockerfile             # Docker multi-stage
├── vercel.json            # Configuración Vercel
└── package.json
```

## 🔧 Scripts Disponibles

```bash
npm run dev              # Desarrollo (frontend + backend)
npm run dev:frontend     # Solo frontend
npm run dev:backend      # Solo backend
npm run build            # Build completo (frontend + backend)
npm run build:frontend   # Build solo frontend
npm run build:backend    # Build solo backend
npm run start            # Iniciar producción
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Ejecutar seed
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Páginas
- `GET /api/pages` - Listar páginas del usuario
- `GET /api/pages/editor/data` - Datos para el editor
- `GET /api/pages/:uuid` - Obtener página por UUID
- `POST /api/pages` - Crear/actualizar página
- `POST /api/pages/:id/toggle-status` - Cambiar estado
- `DELETE /api/pages/:id` - Eliminar página

### QR Codes
- `POST /api/qr/generate` - Generar QR

### Imágenes
- `GET /api/images` - Listar imágenes
- `POST /api/images` - Subir imagen
- `DELETE /api/images/:id` - Eliminar imagen

### Plantillas
- `GET /api/templates` - Listar plantillas
- `GET /api/templates/:id` - Obtener plantilla

### Usuario
- `PUT /api/user/profile` - Actualizar perfil
- `PUT /api/user/password` - Cambiar contraseña
- `DELETE /api/user/account` - Eliminar cuenta

## 🎨 Características del Editor

- **Múltiples tarjetas** por página
- **Elementos**: Texto, Imágenes, Formas, QR, Carrusel, Animaciones, Navegación
- **Drag & Drop** para posicionar elementos
- **Redimensionamiento** con handles
- **Propiedades** por tipo de elemento
- **Fondos**: Colores, gradientes, patrones, imágenes
- **Plantillas** predefinidas
- **Vista previa** e impresión

## 🚀 Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `DATABASE_URL` (PostgreSQL)
   - `JWT_SECRET`
   - `FRONTEND_URL`
3. Vercel detectará automáticamente la configuración en `vercel.json`
4. Despliega

## 🐳 Despliegue con Docker

```bash
# Build
docker build -t qrcanvas-platform .

# Run
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret \
  qrcanvas-platform
```

## 📝 Licencia

MIT