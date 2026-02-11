import { NextRequest, NextResponse } from 'next/server'
import { validateMiniBriefing, validateBriefingCompleto } from '@/lib/validations/briefing'
import { openai } from '@/lib/openai/client'
import { generateLandingPagePrompt } from '../../../lib/openai/prompt'
import { parseLandingPageFromAI } from '@/lib/openai/parser'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/helpers'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        let briefing
        let isMini = false
        let result: ReturnType<typeof validateMiniBriefing> | ReturnType<typeof validateBriefingCompleto> = validateMiniBriefing(body)
        if (result.success) {
            briefing = result.data
            isMini = true
        } else {
            result = validateBriefingCompleto(body)
            if (result.success) {
                briefing = result.data
            } else {
                return NextResponse.json({ error: 'Dados do briefing inválidos', details: result.error.format()}, { status: 400 })
            }
        }

        const prompt = generateLandingPagePrompt(briefing as any)

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1800,
        })
        const aiOutput = completion.choices[0].message.content
        if (!aiOutput) {
            return NextResponse.json({ error: 'Resposta vazia da IA' }, { status: 500 })
        }
        const landingPage = parseLandingPageFromAI(aiOutput)

        const supabase = createClient()
        const user = await getCurrentUser()
        if (user) {
            const { data, error } = await supabase
            .from('landing_pages')
            .insert({
                user_id: user.id,
                title: landingPage.meta?.titulo || 'Landing Page',
                briefing,
                content: landingPage,
                status: 'draft',
            })
            .select()
            .single()
            if (error) {
                return NextResponse.json({ error: 'Erro ao salvar no banco', details: error.message }, { status: 500 })
            }
            return NextResponse.json({ landingPage: data.content, id: data.id })
        } else { 
            return NextResponse.json({ landingPage })
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Erro inesperado' }, { status: 500 })
    }
}