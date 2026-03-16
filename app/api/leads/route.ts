import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email } = body;

        if (!name || !phone || !email) {
            return NextResponse.json(
                { success: false, error: 'Name, phone, and email are required' },
                { status: 400 }
            );
        }

        const lead = {
            id: crypto.randomUUID(),
            name,
            phone,
            email,
            source: 'free-website',
            createdAt: new Date().toISOString(),
        };

        console.log('New lead:', lead);

        return NextResponse.json({ success: true, id: lead.id });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
