# LandingPro – SaaS de Geração de Landing Pages com IA

![LandingPro Banner](https://user-images.githubusercontent.com/landingpro/banner.png)

## Visão Geral
LandingPro é um SaaS moderno para geração automática de landing pages de alta conversão usando inteligência artificial. O frontend é construído com Next.js 14, TypeScript e TailwindCSS, seguindo padrões premium de UI/UX.

## Funcionalidades
- Cadastro e login de usuários (Supabase Auth)
- Geração de landing pages com IA
- Dashboard para gerenciamento de páginas
- Design responsivo, minimalista e focado em conversão
- Componentização total e design system próprio

## Tecnologias
- [Next.js 14 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth e Database)

## Como rodar localmente
1. **Clone o repositório:**
	```bash
	git clone https://github.com/seu-usuario/landingpro.git
	cd landingpro/frontend
	```
2. **Instale as dependências:**
	```bash
	npm install
	```
3. **Configure o Supabase:**
	- Crie um projeto no [Supabase](https://app.supabase.com/)
	- Copie as variáveis do projeto para um arquivo `.env.local`:
	  ```env
	  NEXT_PUBLIC_SUPABASE_URL=https://<sua-instancia>.supabase.co
	  NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
	  ```
4. **Rode o projeto:**
	```bash
	npm run dev
	```
5. **Acesse:**
	- [http://localhost:3000](http://localhost:3000)

## Estrutura de Pastas
```
frontend/
  src/
	 app/           # App Router, páginas e layouts
	 components/    # Componentes reutilizáveis (UI, layout, landing-page)
	 lib/           # Helpers, clients e integrações (ex: supabase)
	 types/         # Tipos TypeScript globais
  public/          # Assets estáticos
  tailwind.config.js
  package.json
```

## Scripts Úteis
- `npm run dev` – Inicia o servidor de desenvolvimento
- `npm run build` – Build de produção
- `npm run lint` – Lint do código

## Contribuição
Pull requests são bem-vindos! Siga o padrão de componentes e mantenha o design system.

## Licença
MIT

---

> Feito com ♥ por LandingPro e IA
