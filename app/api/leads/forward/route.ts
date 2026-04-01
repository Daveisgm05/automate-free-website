import { NextResponse } from 'next/server';

// Forward lead events to the video-gen-studio scoring pipeline.
// The landing page captures WhatsApp CTA clicks (no form data),
// so we send what we have — the pipeline ingests it as a
// landing_page lead with pixel identifiers for CAPI matching.

const PIPELINE_URL = process.env.PIPELINE_URL;       // e.g. https://your-ugc-studio.vercel.app
const PIPELINE_SECRET = process.env.PIPELINE_SECRET;  // shared auth token

export async function POST(request: Request) {
    if (!PIPELINE_URL || !PIPELINE_SECRET) {
        // Silently succeed — pipeline not configured yet
        return NextResponse.json({ success: true, forwarded: false, reason: 'pipeline not configured' });
    }

    try {
        const body = await request.json();
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
        const userAgent = request.headers.get('user-agent') || '';

        const payload = {
            action: 'ingest',
            lead_name: body.lead_name || 'WhatsApp Lead',
            lead_phone: body.lead_phone || '',
            lead_email: body.lead_email || '',
            source: 'landing_page',
            custom_fields: {
                channel: 'whatsapp',
                event_id: body.event_id || '',
                event_source_url: body.event_source_url || '',
                ip_address: ip,
                user_agent: userAgent,
            },
            fbp: body.fbp || '',
            fbc: body.fbc || '',
        };

        const res = await fetch(`${PIPELINE_URL}/api/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PIPELINE_SECRET}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        return NextResponse.json({ success: true, forwarded: true, pipeline: data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Lead Forward]', message);
        // Don't block the user — fail silently
        return NextResponse.json({ success: true, forwarded: false, error: message });
    }
}
