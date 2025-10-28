import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar que las variables de entorno estén configuradas
    const envCheck = {
      ZEPTO_SMTP_HOST: !!process.env.ZEPTO_SMTP_HOST,
      ZEPTO_SMTP_PORT: !!process.env.ZEPTO_SMTP_PORT,
      ZEPTO_SMTP_TOKEN: !!process.env.ZEPTO_SMTP_TOKEN,
      ZEPTO_SMTP_SECRET: !!process.env.ZEPTO_SMTP_SECRET,
      MAIL_FROM: !!process.env.MAIL_FROM,
      MAIL_TO: !!process.env.MAIL_TO,
    };

    // Mostrar valores (sin credenciales sensibles)
    const envValues = {
      ZEPTO_SMTP_HOST: process.env.ZEPTO_SMTP_HOST || 'No configurado',
      ZEPTO_SMTP_PORT: process.env.ZEPTO_SMTP_PORT || 'No configurado',
      ZEPTO_SMTP_TOKEN: process.env.ZEPTO_SMTP_TOKEN ? 
        `Configurado (${process.env.ZEPTO_SMTP_TOKEN.substring(0, 20)}...)` : 'No configurado',
      ZEPTO_SMTP_SECRET: process.env.ZEPTO_SMTP_SECRET ? 'Configurado' : 'No configurado',
      MAIL_FROM: process.env.MAIL_FROM || 'No configurado',
      MAIL_TO: process.env.MAIL_TO || 'No configurado',
    };

    return NextResponse.json({
      message: 'Verificación de variables de entorno',
      envCheck,
      envValues,
      allConfigured: Object.values(envCheck).every(Boolean)
    });

  } catch {
    return NextResponse.json(
      { error: 'Error verificando variables de entorno' },
      { status: 500 }
    );
  }
}
