// ============================================
// Ascend AI - Health Check API Route
// ============================================
// Health check endpoint for Docker health checks
// ============================================

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'healthy', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
