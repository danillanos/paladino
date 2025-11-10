# Configuración de Email - ZeptoMail

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Default Email Configuration (available in both client and server)
NEXT_PUBLIC_DEFAULT_EMAIL=info@paladinopropiedades.com.ar

# ZeptoMail API Configuration (server-side only)
ZEPTO_SMTP_TOKEN=Zoho-enczapikey wSsVR61wr0b4Dqt/zWakJ+4wzV4GBFP2FUgv3FHzuXT+GauQoMc6lkSfUFX0FKMaRTJoQGcUo+ohmBoGgWJbi9t/mFkHASiF9mqRe1U4J3x17qnvhDzDXW9fmxKOKoMBxg5immZjF80r+g==
```

## Configuración

- **NEXT_PUBLIC_DEFAULT_EMAIL**: Email por defecto usado como fallback cuando no hay configuración del sitio (disponible en cliente y servidor, default: `info@paladinopropiedades.com.ar`)
- **ZEPTO_SMTP_TOKEN**: El API Key de ZeptoMail (no el token SMTP)
- **MAIL_FROM**: Ya no se usa, el email de origen se obtiene dinámicamente de `NEXT_PUBLIC_DEFAULT_EMAIL` o `email_de_contacto` en la configuración del sitio
- **MAIL_TO**: Ya no se usa, el email de destino se obtiene dinámicamente de `email_de_contacto` en la configuración del sitio (con fallback a `NEXT_PUBLIC_DEFAULT_EMAIL`)

## Nota Importante

Ahora usamos la **API REST de ZeptoMail** en lugar de SMTP para mayor compatibilidad con Next.js.

## Funcionamiento

El formulario de contacto envía emails con:
- **From**: `NEXT_PUBLIC_DEFAULT_EMAIL` (configurado en `.env.local`)
- **To**: `email_de_contacto` de la configuración del sitio (con fallback a `NEXT_PUBLIC_DEFAULT_EMAIL`)
- **Reply-To**: El email del usuario que completa el formulario

## API Endpoint

- **URL**: `/api/send-email`
- **Método**: POST
- **Campos requeridos**: nombre, email, mensaje
- **Campos opcionales**: telefono, tipo
