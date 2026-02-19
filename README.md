# Amor en Pétalos - Guía de Configuración

## Requisitos Previos
- Node.js 18+ instalado
- Cuenta en Supabase (https://supabase.com)

## Paso 1: Configurar Base de Datos en Supabase

1. **Crear Proyecto en Supabase:**
   - Ve a https://supabase.com y crea una cuenta
   - Haz clic en "New Project"
   - Dale un nombre: "Amor en Pétalos"
   - Anota la contraseña de la base de datos (¡importante!)

2. **Ejecutar el Schema SQL:**
   - En el panel de Supabase, ve a **SQL Editor**
   - Haz clic en "+ New Query"
   - Copia y pega todo el contenido del archivo `supabase/schema.sql`
   - Haz clic en **Run** (▶️)
   - ✅ Verás el mensaje "Success. No rows returned"

3. **Obtener las Credenciales:**
   - Ve a **Project Settings** ⚙️ (esquina inferior izquierda)
   - Selecciona **API**
   - Copia:
     - `Project URL` (ej: https://xxxxx.supabase.co)
     - `anon public` key (una llave larga)

## Paso 2: Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-llave-anon-aquí
```

3. **Guarda el archivo** (Ctrl + S)

## Paso 3: Instalar Dependencias y Ejecutar

```bash
# Si aún no instalaste las dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## Paso 4: Abrir el Sistema

1. Abre tu navegador en: **http://localhost:3000**
2. 🎉 ¡El sistema estará listo!

## Datos de Prueba

El schema incluye datos de ejemplo:
- **3 clientes** de prueba
- **6 productos** (flores) con diferentes fechas de vencimiento
- **2 entregas pendientes** para hoy
- **1 venta** registrada

Esto te permitirá ver cómo funcionan:
- Las alertas de productos por vencer (verás flores expirando pronto)
- Las entregas programadas para hoy
- El tablero de estadísticas

## Estructura de Navegación

📱 **Barra de Navegación Inferior (5 secciones):**

1. **🏠 Inicio** - Dashboard con alertas y estadísticas
2. **🛒 POS** - Punto de venta rápido
3. **🚚 Delivery** - Gestión de entregas
4. **📦 Productos** - Inventario de flores
5. **👥 Clientes** - Base de datos de contactos

## Características Principales

### Dashboard (Inicio)
- ⚠️ Alertas de productos por vencer (2-3 días)
- 🚚 Entregas pendientes para hoy
- 📊 Estadísticas del día (ventas, ingresos, stock bajo)

### POS (Punto de Venta)
- ➕ Agregar productos al carrito con un tap
- 🛒 Carrito con ajuste de cantidades
- 💳 Métodos de pago: Yape, Plin, Efectivo
- ✅ Completar venta y actualizar stock automáticamente

### Delivery
- 📋 Lista de todas las entregas (filtrar por estado)
- 📍 Ver detalles completos de cada pedido
- 🗺️ Abrir dirección en Google Maps
- 💌 Ver mensaje de dedicatoria
- 🔄 Actualizar estado: Pendiente → En Ruta → Entregado

### Productos
- 📦 Ver inventario completo
- ⚠️ Alertas visuales de productos por vencer
- ➕ Agregar nuevos productos
- 📅 Fecha de vencimiento obligatoria

### Clientes
- 👥 Lista de todos los clientes
- 🎂 Sección de próximos cumpleaños (7 días)
- ➕ Registrar nuevos clientes
- 📧 Email y cumpleaños opcionales (para CRM)

## Resolución de Problemas

### Error: "Failed to fetch"
- ✅ Verifica que las variables en `.env.local` sean correctas
- ✅ Asegúrate de que el proyecto de Supabase esté activo
- ✅ Reinicia el servidor (`npm run dev`)

### No se ven los datos de prueba
- ✅ Verifica que ejecutaste el schema SQL completo en Supabase
- ✅ Ve al panel de Supabase > Table Editor y verifica que las tablas tengan datos

### La página no carga
- ✅ Verifica que Node.js esté instalado: `node --version`
- ✅ Reinstala dependencias: `rm -rf node_modules && npm install`
- ✅ Limpia caché de Next.js: `rm -rf .next && npm run dev`

## Próximos Pasos

Una vez que el sistema esté funcionando:

1. **Prueba en móvil:**
   - Abre Chrome DevTools (F12)
   - Haz clic en el ícono de móvil 📱
   - Selecciona un dispositivo (ej: iPhone 12 Pro)
   - ¡Interactúa con el sistema como si fuera un celular!

2. **Personaliza los datos:**
   - Elimina los datos de prueba desde Supabase (Table Editor)
   - Agrega tus propios productos y clientes

3. **Prepara para producción:**
   - Despliega en Vercel (https://vercel.com)
   - Conecta tu dominio personalizado

## Soporte

Si tienes preguntas o encuentras problemas, revisa:
1. Los logs en la terminal donde ejecutaste `npm run dev`
2. La consola del navegador (F12 > Console)
3. Los logs de Supabase (Panel > Logs)

## 👥 Autor

Desarrollado POR Jhosep Michael para optimizar operaciones.

---
