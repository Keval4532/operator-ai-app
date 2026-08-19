import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const { client, db } = await connectToDatabase();
    const isConfigured = !!process.env.MONGODB_URI;
    const databaseName = process.env.MONGODB_DATABASE || 'operator_ai_db';

    if (!isConfigured || !db) {
      return NextResponse.json({
        status: 'STANDALONE_IN_MEMORY_MODE',
        databaseConfigured: false,
        databaseName,
        message: 'Operator AI running in standalone reactive in-memory mode.',
      });
    }

    // Ping the database
    await db.command({ ping: 1 });

    return NextResponse.json({
      status: 'CONNECTED',
      databaseConfigured: true,
      databaseName,
      clusterConnected: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'ERROR',
        error: err.message,
        databaseName: process.env.MONGODB_DATABASE || 'operator_ai_db',
      },
      { status: 500 }
    );
  }
}
