const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');

export type GeneratePayload = {
  briefing: Record<string, unknown>;
  user_id?: string;
  user_email?: string | null;
  user_full_name?: string | null;
  title?: string;
  save?: boolean;
};

export type LandingPageRecord = {
  id: string;
  user_id: string;
  title: string;
  briefing: Record<string, unknown> | null;
  content: Record<string, unknown>;
  status: string;
  slug: string | null;
  created_at: string;
  updated_at: string;
};

export type LandingPageVersionRecord = {
  id: string;
  landing_page_id: string;
  version_number: number;
  title: string;
  briefing: Record<string, unknown> | null;
  content: Record<string, unknown>;
  reason: string | null;
  created_at: string;
};

export type LandingPageCreatePayload = {
  user_id: string;
  user_email?: string | null;
  user_full_name?: string | null;
  title: string;
  briefing?: Record<string, unknown> | null;
  content: Record<string, unknown>;
  status?: string;
  slug?: string | null;
};

export type LandingPageUpdatePayload = Partial<{
  title: string;
  briefing: Record<string, unknown> | null;
  content: Record<string, unknown>;
  status: string;
  slug: string | null;
}>;

export type ProfilePayload = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erro ao chamar backend: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function generateLanding(payload: GeneratePayload) {
  return request<{ generated: Record<string, unknown>; saved?: LandingPageRecord }>('/api/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listLandingPages(userId?: string) {
  const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
  return request<LandingPageRecord[]>(`/api/landing-pages${query}`);
}

export async function getLandingPage(id: string) {
  return request<LandingPageRecord>(`/api/landing-pages/${id}`);
}

export async function createLandingPage(payload: LandingPageCreatePayload) {
  return request<LandingPageRecord>('/api/landing-pages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateLandingPage(id: string, payload: LandingPageUpdatePayload) {
  return request<LandingPageRecord>(`/api/landing-pages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteLandingPage(id: string) {
  return request<void>(`/api/landing-pages/${id}`, {
    method: 'DELETE',
  });
}

export async function listLandingPageVersions(id: string) {
  return request<LandingPageVersionRecord[]>(`/api/landing-pages/${id}/versions`);
}

export async function createLandingPageVersion(id: string, reason?: string) {
  return request<LandingPageVersionRecord>(`/api/landing-pages/${id}/versions`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function restoreLandingPageVersion(id: string, versionId: string) {
  return request<{ restored: LandingPageRecord; restoredVersion: LandingPageVersionRecord }>(
    `/api/landing-pages/${id}/versions/${versionId}/restore`,
    {
      method: 'POST',
    },
  );
}

export async function createProfile(payload: ProfilePayload) {
  return request('/api/profiles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function syncProfileWithToken(
  accessToken: string,
  payload?: { full_name?: string | null; avatar_url?: string | null },
) {
  return request<{ profile: ProfilePayload | null }>('/api/auth/sync-profile', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload ?? {}),
  });
}
