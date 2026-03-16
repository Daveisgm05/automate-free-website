import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

function readLeads(): Array<Record<string, unknown>> {
    try {
        if (fs.existsSync(LEADS_FILE)) {
            const data = fs.readFileSync(LEADS_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch {
        // File doesn't exist or is invalid, start fresh
    }
    return [];
}

function writeLeads(leads: Array<Record<string, unknown>>) {
    const dir = path.dirname(LEADS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

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

        const leads = readLeads();
        leads.push(lead);
        writeLeads(leads);

        return NextResponse.json({ success: true, id: lead.id });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
