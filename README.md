# MiApp Frontend

Frontend independiente de MiApp, construido con Next.js, React y TypeScript. La API y MongoDB se mantienen en el repositorio separado `mi-app-backend`.

## Requisitos

- Node.js compatible con Next.js 16.
- API MiApp disponible, local o desplegada.

## Configuración local

Desde esta carpeta, en PowerShell:

```powershell
npm.cmd install
Copy-Item .env.example .env.local
```

Edita `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-google-client-id
```

`NEXT_PUBLIC_API_URL` debe apuntar a la URL pública de la API. El origen del frontend también debe coincidir con `FRONTEND_ORIGIN` configurado en el backend. Para producción, usa HTTPS en ambos servicios.

## Ejecutar y validar

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

La aplicación local se abre en `http://localhost:3000`.

## Analítica web en Vercel

La aplicación integra Vercel Web Analytics para contar visitas y páginas vistas, incluidas las navegaciones internas. Antes de recibir datos, habilita **Analytics** en el proyecto de Vercel y despliega la aplicación; los resultados se consultan en el panel de ese proyecto. El seguimiento elimina parámetros de búsqueda y fragmentos de las URL para no enviar identificadores de tickets ni tokens de invitación.

## Seguridad

- No guardes secretos en variables `NEXT_PUBLIC_*`; Next.js las expone al navegador.
- `.env.local` está excluido de Git. No subas credenciales ni tokens.
- Las sesiones y la autorización se validan en la API; el frontend no sustituye esos controles.
