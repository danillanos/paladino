import { NextRequest, NextResponse } from 'next/server';
import { ApiService } from '@/services/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, mensaje, tipo } = body;

    // Validar campos requeridos
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Obtener configuración del sitio para el logo y email de destino
    const siteConfig = await ApiService.getSiteConfiguration();
    const logoUrl = siteConfig?.Logos?.Logo_2?.[0]?.url 
      ? `https://api.paladinopropiedades.com.ar${siteConfig.Logos.Logo_2[0].url}`
      : 'https://via.placeholder.com/200x80/1e40af/ffffff?text=PALADINO';
    
    const defaultEmail = 'info@paladinopropiedades.com.ar';
    const receiverEmail = siteConfig?.email_de_contacto || defaultEmail;
    const senderEmail = defaultEmail;
    const emailSubject = siteConfig?.texto_de_contacto_web || 'Nueva consulta desde la web';

    // Log de configuración
    console.log('Configuración ZeptoMail:');
    console.log('Token configurado:', !!process.env.ZEPTO_SMTP_TOKEN);
    console.log('Mail From (config):', senderEmail);
    console.log('Mail From (env):', process.env.MAIL_FROM);
    console.log('Receiver Email (from config):', receiverEmail);
    console.log('Email Subject (from config):', emailSubject);
    console.log('Email del usuario (reply-to):', email);
    console.log('Nombre del usuario:', nombre);
    console.log('Logo URL:', logoUrl);

    // Preparar el email según la documentación de ZeptoMail
    const emailData = {
      from: {
        address: senderEmail,
        name: "Web Paladino Propiedades"
      },
      to: [
        {
          email_address: {
            address: receiverEmail,
            name: "Paladino Propiedades"
          }
        }
      ],
      reply_to: [
        {
          address: email,
          name: nombre
        }
      ],
      subject: emailSubject,
      htmlbody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- Header con logo -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; background-color: #f8fafc; border-radius: 8px;">
            <img src="${logoUrl}" alt="Paladino Propiedades" style="max-width: 200px; height: auto;">
            <h2 style="color: #1e40af; margin: 15px 0 0 0; font-size: 24px;">
              Nueva consulta desde la web
            </h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Información del contacto:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
            <p><strong>Tipo de consulta:</strong> ${getTipoConsulta(tipo)}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${mensaje}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 4px;">
            <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
              <strong>Nota:</strong> Este mensaje fue enviado desde el formulario de contacto de la web de Paladino Propiedades.
              Puedes responder directamente a este email para contactar al cliente.
            </p>
          </div>
          
          <!-- Footer con logo -->
          <div style="text-align: center; margin-top: 30px; padding: 20px 0; border-top: 1px solid #e5e7eb;">
            <img src="${logoUrl}" alt="Paladino Propiedades" style="max-width: 150px; height: auto; margin-bottom: 10px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Paladino Propiedades - Tu socio de confianza en el mercado inmobiliario
            </p>
          </div>
        </div>
      `,
      textbody: `
Nueva consulta desde la web

Información del contacto:
- Nombre: ${nombre}
- Email: ${email}
${telefono ? `- Teléfono: ${telefono}` : ''}
- Tipo de consulta: ${getTipoConsulta(tipo)}

Mensaje:
${mensaje}

---
Este mensaje fue enviado desde el formulario de contacto de la web de Paladino Propiedades.
      `
    };

    // Enviar el email usando la API REST de ZeptoMail
    console.log('Enviando email via ZeptoMail API...');
    console.log('Email data:', JSON.stringify(emailData, null, 2));
    
    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ZEPTO_SMTP_TOKEN || 'Zoho-enczapikey wSsVR61wr0b4Dqt/zWakJ+4wzV4GBFP2FUgv3FHzuXT+GauQoMc6lkSfUFX0FKMaRTJoQGcUo+ohmBoGgWJbi9t/mFkHASiF9mqRe1U4J3x17qnvhDzDXW9fmxKOKoMBxg5immZjF80r+g==',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from ZeptoMail:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`ZeptoMail API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Email enviado exitosamente via ZeptoMail API:', result);

    return NextResponse.json(
      { message: 'Email enviado correctamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error enviando email:', error);
    
    // Log más detallado del error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

function getTipoConsulta(tipo: string): string {
  const tipos: { [key: string]: string } = {
    consulta: 'Consulta general',
    venta: 'Venta de propiedad',
    alquiler: 'Alquiler de propiedad',
    tasacion: 'Tasación',
    otro: 'Otro'
  };
  return tipos[tipo] || tipo;
}
