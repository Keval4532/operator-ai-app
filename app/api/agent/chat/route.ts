import { NextResponse } from 'next/server';
import { operatorAssistantEngine } from '@/lib/agent/operator-assistant';
import { store } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ success: false, error: 'query string is required' }, { status: 400 });
    }

    // Add user message to store
    store.addChatMessage({ sender: 'user', text: query });

    // Process with agent engine
    const assistantMsg = await operatorAssistantEngine.processQuery(query);

    return NextResponse.json({ success: true, message: assistantMsg, chatHistory: store.getChatHistory() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
