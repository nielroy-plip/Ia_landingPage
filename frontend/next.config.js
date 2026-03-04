/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    domains: [], // Adicionar domínios de imagens quando necessário
  },
}

module.exports = nextConfig
