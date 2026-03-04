import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import cors from 'cors';
import { Prisma, PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

type IdParams = { id: string };
type VersionParams = { id: string; versionId: string };
type JsonObject = Record<string, unknown>;

const app = express();
const prisma = new PrismaClient();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const jsonObjectSchema = z.record(z.string(), z.unknown());

const profileSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional().nullable(),
  full_name: z.string().min(1).max(120).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

const landingPageCreateSchema = z.object({
  user_id: z.string().uuid(),
  user_email: z.string().email().optional().nullable(),
  user_full_name: z.string().min(1).max(120).optional().nullable(),
  title: z.string().min(3).max(140),
  briefing: jsonObjectSchema.optional().nullable(),
  content: jsonObjectSchema,
  status: z.string().min(1).max(40).default('draft'),
  slug: z.string().min(3).max(180).optional().nullable(),
});

const landingPageUpdateSchema = z.object({
  title: z.string().min(3).max(140).optional(),
  briefing: jsonObjectSchema.optional().nullable(),
  content: jsonObjectSchema.optional(),
  status: z.string().min(1).max(40).optional(),
  slug: z.string().min(3).max(180).optional().nullable(),
});

const anonymousPreviewSchema = z.object({
  ip_address: z.string().max(80).optional().nullable(),
  content: jsonObjectSchema,
  briefing: jsonObjectSchema.optional().nullable(),
  expires_at: z.string().datetime(),
});

const generateSchema = z.object({
  briefing: jsonObjectSchema,
  user_id: z.string().uuid().optional(),
  user_email: z.string().email().optional().nullable(),
  user_full_name: z.string().min(1).max(120).optional().nullable(),
  title: z.string().min(3).max(140).optional(),
  save: z.boolean().default(false),
});

const versionCreateSchema = z.object({
  reason: z.string().min(1).max(120).optional(),
});

const syncProfileSchema = z.object({
  full_name: z.string().min(1).max(120).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

const asyncHandler = <P = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
  handler: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<void>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => (req, res, next) => {
  void handler(req, res, next).catch(next);
};

const parseBody = <T>(schema: z.ZodType<T>, body: unknown): T => {
  const result = schema.safeParse(body);
  if (!result.success) {
    const error = new Error('Payload inválido');
    (error as Error & { status?: number; details?: unknown }).status = 400;
    (error as Error & { status?: number; details?: unknown }).details = result.error.flatten();
    throw error;
  }
  return result.data;
};

const toJson = (value: JsonObject): Prisma.InputJsonValue => value as Prisma.InputJsonValue;

const toNullableJson = (
  value: JsonObject | null | undefined,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
};

const jsonValueToInput = (value: Prisma.JsonValue): Prisma.InputJsonValue => {
  if (value === null) {
    return {} as Prisma.InputJsonValue;
  }

  return value as Prisma.InputJsonValue;
};

const jsonValueToNullableInput = (
  value: Prisma.JsonValue | null,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput => {
  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
};

const generatePrompt = (briefing: JsonObject) => `
Você é um copywriter especialista em conversão.
Com base no briefing abaixo, gere uma landing page em formato JSON seguindo exatamente o schema fornecido.

Briefing:
${JSON.stringify(briefing, null, 2)}

Regras:
- O output deve ser um JSON válido, SEM comentários, SEM explicações.
- Siga o schema:
{
  "meta": { "titulo": "...", "descricao": "..." },
  "hero": { ... },
  "benefits": { ... },
  "how_it_works": { ... },
  "testimonials": { ... },
  "stats": { ... },
  "faq": { ... },
  "cta_final": { ... }
}
- Preencha apenas as seções relevantes para o briefing.
- Use linguagem persuasiva e clara.
- NÃO inclua nenhum texto fora do JSON.
`;

const ensureProfile = async (
  userId: string,
  userEmail?: string | null,
  userFullName?: string | null,
  avatarUrl?: string | null,
) => {
  await prisma.profile.upsert({
    where: { id: userId },
    update: {
      email: userEmail ?? undefined,
      full_name: userFullName ?? undefined,
      avatar_url: avatarUrl ?? undefined,
    },
    create: {
      id: userId,
      email: userEmail ?? null,
      full_name: userFullName ?? null,
      avatar_url: avatarUrl ?? null,
    },
  });
};

const getNextVersionNumber = async (landingPageId: string) => {
  const latestVersion = await prisma.landingPageVersion.findFirst({
    where: { landing_page_id: landingPageId },
    orderBy: { version_number: 'desc' },
    select: { version_number: true },
  });

  return (latestVersion?.version_number ?? 0) + 1;
};

const createVersionSnapshot = async (
  landingPageId: string,
  reason?: string,
  pageSnapshot?: {
    title: string;
    briefing: Prisma.JsonValue | null;
    content: Prisma.JsonValue;
  },
) => {
  const page =
    pageSnapshot ??
    (await prisma.landingPage.findUnique({
      where: { id: landingPageId },
      select: {
        title: true,
        briefing: true,
        content: true,
      },
    }));

  if (!page) {
    throw new Error('Landing page não encontrada para versionamento');
  }

  const versionNumber = await getNextVersionNumber(landingPageId);

  return prisma.landingPageVersion.create({
    data: {
      landing_page_id: landingPageId,
      version_number: versionNumber,
      title: page.title,
      briefing: jsonValueToNullableInput(page.briefing),
      content: jsonValueToInput(page.content),
      reason,
    },
  });
};

const getBearerToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/sync-profile', asyncHandler(async (req: Request, res: Response) => {
  if (!supabase) {
    res.status(500).json({ error: 'Supabase não configurado no backend (SUPABASE_URL e SUPABASE_ANON_KEY).' });
    return;
  }

  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Token ausente. Use Authorization: Bearer <access_token>' });
    return;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
    return;
  }

  const payload = parseBody(syncProfileSchema, req.body ?? {});
  const authUser = userData.user;

  const fullNameFromToken = typeof authUser.user_metadata?.full_name === 'string'
    ? authUser.user_metadata.full_name
    : null;

  await ensureProfile(
    authUser.id,
    authUser.email,
    payload.full_name ?? fullNameFromToken,
    payload.avatar_url ?? null,
  );

  const profile = await prisma.profile.findUnique({ where: { id: authUser.id } });
  res.status(200).json({ profile });
}));

app.get('/api/landing-pages', asyncHandler(async (_req: Request, res: Response) => {
  const userIdQuery = _req.query.user_id;
  const userId = typeof userIdQuery === 'string' ? userIdQuery : undefined;

  const pages = await prisma.landingPage.findMany({
    where: userId ? { user_id: userId } : undefined,
    orderBy: { created_at: 'desc' },
  });
  res.json(pages);
}));

app.get('/api/landing-pages/:id', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const page = await prisma.landingPage.findUnique({ where: { id: req.params.id } });
  if (!page) {
    res.status(404).json({ error: 'Landing page não encontrada' });
    return;
  }
  res.json(page);
}));

app.get('/api/landing-pages/:id/versions', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const versions = await prisma.landingPageVersion.findMany({
    where: { landing_page_id: req.params.id },
    orderBy: { version_number: 'desc' },
  });

  res.json(versions);
}));

app.post('/api/landing-pages/:id/versions', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const payload = parseBody(versionCreateSchema, req.body ?? {});

  const pageExists = await prisma.landingPage.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!pageExists) {
    res.status(404).json({ error: 'Landing page não encontrada' });
    return;
  }

  const version = await createVersionSnapshot(req.params.id, payload.reason ?? 'Snapshot manual');
  res.status(201).json(version);
}));

app.post('/api/landing-pages/:id/versions/:versionId/restore', asyncHandler(async (req: Request<VersionParams>, res: Response) => {
  const version = await prisma.landingPageVersion.findUnique({
    where: { id: req.params.versionId },
  });

  if (!version || version.landing_page_id !== req.params.id) {
    res.status(404).json({ error: 'Versão não encontrada para esta landing page' });
    return;
  }

  await createVersionSnapshot(req.params.id, `Backup antes de restaurar v${version.version_number}`);

  const restored = await prisma.landingPage.update({
    where: { id: req.params.id },
    data: {
      title: version.title,
      briefing: jsonValueToNullableInput(version.briefing),
      content: jsonValueToInput(version.content),
      status: 'draft',
    },
  });

  const restoredVersion = await createVersionSnapshot(
    req.params.id,
    `Restaurado da v${version.version_number}`,
    {
      title: restored.title,
      briefing: restored.briefing,
      content: restored.content,
    },
  );

  res.status(200).json({ restored, restoredVersion });
}));

app.post('/api/landing-pages', asyncHandler(async (req: Request, res: Response) => {
  const payload = parseBody(landingPageCreateSchema, req.body);

  await ensureProfile(payload.user_id, payload.user_email, payload.user_full_name);

  const page = await prisma.landingPage.create({
    data: {
      user_id: payload.user_id,
      title: payload.title,
      briefing: toNullableJson(payload.briefing),
      content: toJson(payload.content),
      status: payload.status ?? 'draft',
      slug: payload.slug,
    },
  });

  await createVersionSnapshot(page.id, 'Versão inicial');
  res.status(201).json(page);
}));

app.put('/api/landing-pages/:id', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const payload = parseBody(landingPageUpdateSchema, req.body);

  const previousPage = await prisma.landingPage.findUnique({
    where: { id: req.params.id },
    select: {
      title: true,
      briefing: true,
      content: true,
    },
  });

  if (!previousPage) {
    res.status(404).json({ error: 'Landing page não encontrada' });
    return;
  }

  await createVersionSnapshot(req.params.id, 'Backup antes de atualização', previousPage);

  const page = await prisma.landingPage.update({
    where: { id: req.params.id },
    data: {
      title: payload.title,
      briefing: toNullableJson(payload.briefing),
      content: payload.content ? toJson(payload.content) : undefined,
      status: payload.status,
      slug: payload.slug,
    },
  });

  await createVersionSnapshot(req.params.id, 'Versão após atualização', {
    title: page.title,
    briefing: page.briefing,
    content: page.content,
  });

  res.json(page);
}));

app.delete('/api/landing-pages/:id', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  await prisma.landingPage.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get('/api/profiles', asyncHandler(async (_req: Request, res: Response) => {
  const profiles = await prisma.profile.findMany({ orderBy: { created_at: 'desc' } });
  res.json(profiles);
}));

app.get('/api/profiles/:id', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const profile = await prisma.profile.findUnique({ where: { id: req.params.id } });
  if (!profile) {
    res.status(404).json({ error: 'Perfil não encontrado' });
    return;
  }
  res.json(profile);
}));

app.post('/api/profiles', asyncHandler(async (req: Request, res: Response) => {
  const payload = parseBody(profileSchema, req.body);
  if (!payload.id) {
    res.status(400).json({ error: 'id é obrigatório para criar/sincronizar profile' });
    return;
  }

  await ensureProfile(payload.id, payload.email, payload.full_name, payload.avatar_url);
  const profile = await prisma.profile.findUnique({ where: { id: payload.id } });
  res.status(201).json(profile);
}));

app.put('/api/profiles/:id', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const payload = parseBody(profileSchema.partial(), req.body);
  const profile = await prisma.profile.update({
    where: { id: req.params.id },
    data: payload,
  });
  res.json(profile);
}));

app.delete('/api/profiles/:id', asyncHandler(async (req: Request<IdParams>, res: Response) => {
  await prisma.profile.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.post('/api/anonymous-previews', asyncHandler(async (req: Request, res: Response) => {
  const payload = parseBody(anonymousPreviewSchema, req.body);
  const preview = await prisma.anonymousPreview.create({
    data: {
      ip_address: payload.ip_address,
      content: toJson(payload.content),
      briefing: toNullableJson(payload.briefing),
      expires_at: new Date(payload.expires_at),
    },
  });
  res.status(201).json(preview);
}));

app.post('/api/generate', asyncHandler(async (req: Request, res: Response) => {
  const payload = parseBody(generateSchema, req.body);
  if (!openai) {
    res.status(500).json({ error: 'OPENAI_API_KEY não configurada no backend' });
    return;
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [{ role: 'user', content: generatePrompt(payload.briefing) }],
  });

  const content = completion.choices[0]?.message?.content ?? '{}';
  let generatedJson: JsonObject = {};

  try {
    generatedJson = JSON.parse(content) as JsonObject;
  } catch {
    const error = new Error('Resposta da OpenAI não veio em JSON válido');
    (error as Error & { status?: number; details?: unknown }).status = 502;
    (error as Error & { status?: number; details?: unknown }).details = { raw: content };
    throw error;
  }

  if (payload.save && payload.user_id) {
    await ensureProfile(payload.user_id, payload.user_email, payload.user_full_name);

    const saved = await prisma.landingPage.create({
      data: {
        user_id: payload.user_id,
        title: payload.title ?? 'Landing Page Gerada por IA',
        briefing: toJson(payload.briefing),
        content: toJson(generatedJson),
        status: 'draft',
      },
    });

    await createVersionSnapshot(saved.id, 'Versão inicial gerada por IA', {
      title: saved.title,
      briefing: saved.briefing,
      content: saved.content,
    });

    res.status(201).json({ generated: generatedJson, saved });
    return;
  }

  res.json({ generated: generatedJson });
}));

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.path}` });
});

app.use((err: Error & { status?: number; details?: unknown }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  const response: { error: string; details?: unknown } = {
    error: err.message || 'Erro interno no servidor',
  };

  if (err.details) {
    response.details = err.details;
  }

  res.status(status).json(response);
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
