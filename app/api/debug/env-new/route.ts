import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    DATABASE_URL_NEW_EXISTS: !!process.env.DATABASE_URL_NEW,
    DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
    DATABASE_URL_NEW_LENGTH: process.env.DATABASE_URL_NEW?.length || 0,
    DATABASE_URL_USED: process.env.DATABASE_URL_NEW || process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV
  })
}