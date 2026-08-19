import { NextResponse } from 'next/server';
import { actionExecutor } from '@/lib/agent/executor';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { actionId, customPayload, role = 'OWNER' } = body;

    if (!actionId) {
      return NextResponse.json({ success: false, error: 'actionId is required' }, { status: 400 });
    }

    const result = await actionExecutor.executeAction(actionId, role, customPayload);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
