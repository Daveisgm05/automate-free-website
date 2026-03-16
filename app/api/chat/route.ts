import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a friendly booking assistant for Automate, an Agentic AI Service Company.

About Automate:
- We are an AI-powered agency that builds websites, automations, and digital solutions for businesses
- We are currently offering free custom websites to new clients as a way to build trust and demonstrate our capabilities
- Our team uses cutting-edge AI and automation tools to deliver professional results fast

Your role:
- Greet the user by name (their info will be provided)
- Confirm their interest in getting a free website
- Ask about their business: what they do, what kind of website they need, any specific features or style preferences
- Collect relevant details to prepare for the consultation meeting
- Be warm, professional, and concise
- If they ask about pricing: the website is 100% free, no hidden costs. We do this to build partnerships.
- If they ask about timeline: typically 1-2 weeks for a professional website
- Keep responses short (2-3 sentences max) to keep the conversation flowing

Do NOT make up availability or book meetings directly. Calendar integration will be added later. For now, let them know someone from the team will reach out to schedule a meeting based on the info collected.`;

export async function POST(request: Request) {
    try {
        if (!OPENAI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { messages, leadInfo } = body;

        const systemMessage = {
            role: 'system',
            content: `${SYSTEM_PROMPT}\n\nCurrent user info:\n- Name: ${leadInfo?.name || 'Unknown'}\n- Email: ${leadInfo?.email || 'Unknown'}\n- Phone: ${leadInfo?.phone || 'Unknown'}`,
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [systemMessage, ...messages],
                max_tokens: 300,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { success: false, error: `OpenAI error: ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

        return NextResponse.json({ success: true, message: assistantMessage });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
