'use client'
export default function FullBriefingForm() {
  return (
    <form className="space-y-4 max-w-lg mx-auto">
      <label className="block">
        <span className="block mb-1 font-medium">Nome do Produto</span>
        <input type="text" name="produto" className="border rounded px-3 py-2 w-full" required minLength={3} />
      </label>
      <label className="block">
        <span className="block mb-1 font-medium">Público-Alvo</span>
        <input type="text" name="publico" className="border rounded px-3 py-2 w-full" required minLength={5} />
      </label>
      <label className="block">
        <span className="block mb-1 font-medium">Benefício Principal</span>
        <input type="text" name="beneficio_principal" className="border rounded px-3 py-2 w-full" required minLength={10} />
      </label>
      <label className="block">
        <span className="block mb-1 font-medium">Descrição Detalhada</span>
        <textarea name="descricao_detalhada" className="border rounded px-3 py-2 w-full" rows={3} />
      </label>
      {/* Adicione outros campos conforme o schema do briefing */}
      <button type="submit" className="btn btn-primary w-full">Gerar Landing Page</button>
    </form>
  )
}
