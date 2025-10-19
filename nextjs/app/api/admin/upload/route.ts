/**
 * Image upload endpoints are temporarily disabled while we rely on local assets.
 */

import { NextResponse } from 'next/server';

const response = NextResponse.json(
  {
    error: 'Image upload service is disabled while local image handling is being set up.'
  },
  { status: 503 }
);

export async function POST(request: Request) {
  return response;
}

export async function DELETE(request: Request) {
  return response;
}

export async function GET(request: Request) {
  return response;
}
