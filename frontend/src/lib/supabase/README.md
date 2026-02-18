# 🔧 Supabase - Guia de Uso

## Arquivos Criados

✅ [src/lib/supabase/client.ts](../lib/supabase/client.ts) - Cliente para browser  
✅ [src/lib/supabase/server.ts](../lib/supabase/server.ts) - Cliente para servidor  
✅ [src/lib/supabase/helpers.ts](../lib/supabase/helpers.ts) - Funções utilitárias  
✅ [src/middleware.ts](../middleware.ts) - Middleware de autenticação  
✅ [src/types/database.ts](../types/database.ts) - Types TypeScript do database

---

## 📖 Como Usar

### 1️⃣ Em Client Components (Browser)

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { LandingPage } from '@/types/database'

export default function MyClientComponent() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setLandingPages(data)
    }
    loadData()
  }, [])

  return <div>{landingPages.map(lp => <div key={lp.id}>{lp.title}</div>)}</div>
}
```

---

### 2️⃣ Em Server Components

```typescript
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/helpers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = createClient()
  const { data: landingPages } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>Minhas Landing Pages</h1>
      {landingPages?.map(lp => (
        <div key={lp.id}>{lp.title}</div>
      ))}
    </div>
  )
}
```

---

### 3️⃣ Em API Routes

```typescript
// app/api/landing-pages/route.ts
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/helpers'
import { NextResponse } from 'next/server'
import type { LandingPageInsert } from '@/types/database'

export async function POST(request: Request) {
  try {
    // Garante que usuário está autenticado
    const userId = await requireAuth()
    
    const body = await request.json()
    const supabase = createClient()

    const newLandingPage: LandingPageInsert = {
      user_id: userId,
      title: body.title,
      content: body.content,
      briefing: body.briefing,
      status: 'draft',
    }

    const { data, error } = await supabase
      .from('landing_pages')
      .insert(newLandingPage)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar landing page' },
      { status: 500 }
    )
  }
}
```

---

### 4️⃣ Autenticação (Login)

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
      router.refresh() // Atualiza Server Components
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

---

### 5️⃣ Autenticação (Signup)

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Cadastro realizado! Faça login.')
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Nome completo"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha (mínimo 6 caracteres)"
      />
      <button type="submit">Criar Conta</button>
    </form>
  )
}
```

---

### 6️⃣ Logout

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return <button onClick={handleLogout}>Sair</button>
}
```

---

## 🔐 Middleware - Rotas Protegidas

O middleware em [src/middleware.ts](../middleware.ts) já protege automaticamente:

- ✅ `/dashboard` - Requer autenticação
- ✅ `/create` - Requer autenticação
- ✅ `/login` e `/signup` - Redireciona se já autenticado

---

## 🎯 Type Safety

Todos os tipos estão em [src/types/database.ts](../types/database.ts):

```typescript
import type { 
  LandingPage, 
  LandingPageInsert,
  LandingPageContent,
  Briefing 
} from '@/types/database'

// Agora você tem autocomplete completo!
const content: LandingPageContent = {
  hero: {
    headline: 'Título',
    subheadline: 'Subtítulo',
    cta: 'Botão'
  },
  benefits: [
    {
      title: 'Benefício 1',
      description: 'Descrição'
    }
  ]
}
```

---

## 📚 Próximos Passos

Com o Supabase configurado, você pode:

1. ✅ Criar páginas de login e signup
2. ✅ Criar API de geração de landing pages
3. ✅ Proteger rotas do dashboard
4. ✅ Salvar landing pages no banco
5. ✅ Listar landing pages do usuário

---

**Configuração do Supabase completa!** 🎉
