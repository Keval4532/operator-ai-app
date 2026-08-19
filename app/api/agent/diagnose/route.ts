import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { diagnosisEngine } from '@/lib/agent/diagnostician';

export async function POST() {
  try {
    const org = store.getOrganization();
    const metrics = store.getMetricsHistory();
    const result = await diagnosisEngine.runDiagnosis(org.id, metrics);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
