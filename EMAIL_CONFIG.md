# Configuración de Email - ZeptoMail

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# ZeptoMail API Configuration
ZEPTO_SMTP_TOKEN=Zoho-enczapikey wSsVR61wr0b4Dqt/zWakJ+4wzV4GBFP2FUgv3FHzuXT+GauQoMc6lkSfUFX0FKMaRTJoQGcUo+ohmBoGgWJbi9t/mFkHASiF9mqRe1U4J3x17qnvhDzDXW9fmxKOKoMBxg5immZjF80r+g==
MAIL_FROM="Web Paladino Propiedades <info@paladinopropiedades.com.ar>"
MAIL_TO=hdaniel.llanos@gmail.com
```

## Configuración

- **ZEPTO_SMTP_TOKEN**: El API Key de ZeptoMail (no el token SMTP)
- **MAIL_TO**: Para pruebas usar `hdaniel.llanos@gmail.com`, en producción usar `info@paladinopropiedades.com.ar`

## Nota Importante

Ahora usamos la **API REST de ZeptoMail** en lugar de SMTP para mayor compatibilidad con Next.js.

## Funcionamiento

El formulario de contacto envía emails con:
- **From**: info@paladinopropiedades.com.ar
- **To**: info@paladinopropiedades.com.ar (o el email de prueba)
- **Reply-To**: El email del usuario que completa el formulario

## API Endpoint

- **URL**: `/api/send-email`
- **Método**: POST
- **Campos requeridos**: nombre, email, mensaje
- **Campos opcionales**: telefono, tipo
