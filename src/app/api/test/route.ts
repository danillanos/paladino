import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    data: {
      test: true,
      environment: process.env.NODE_ENV
    }
  });
}
