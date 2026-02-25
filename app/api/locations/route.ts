import { NextResponse } from 'next/server';
import getSql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sql = getSql();
  try {
    // Ensure table exists with expanded schema
    await sql`
      CREATE TABLE IF NOT EXISTS markers (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL, -- 'vehicle', 'complaint', 'flood'
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        label VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active', -- 'active', 'resolved', 'pending'
        severity VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high'
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const markers = await sql`
      SELECT * FROM markers ORDER BY created_at DESC LIMIT 200
    `;
    return NextResponse.json(markers);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch markers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const sql = getSql();
  try {
    const { type, lat, lng, label, status, severity, metadata } = await request.json();

    if (typeof lat !== 'number' || typeof lng !== 'number' || !type) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const [newMarker] = await sql`
      INSERT INTO markers (type, lat, lng, label, status, severity, metadata)
      VALUES (${type}, ${lat}, ${lng}, ${label || null}, ${status || 'active'}, ${severity || 'low'}, ${metadata || {}})
      RETURNING *
    `;

    return NextResponse.json(newMarker);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to save location' }, { status: 500 });
  }
}
