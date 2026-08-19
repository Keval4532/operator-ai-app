import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { provider } = body;

    const integrations = store.getIntegrations();
    const updated = integrations.map((i) => {
      if (!provider || i.provider === provider) {
        return {
          ...i,
          status: 'CONNECTED' as const,
          lastSyncedAt: new Date().toISOString(),
        };
      }
      return i;
    });

    return NextResponse.json({ success: true, integrations: updated, syncedAt: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
