'use client'
export default function FreeTrialForm() {
  return (
    <form className="space-y-4 max-w-md mx-auto">
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
        <input type="text" name="beneficio" className="border rounded px-3 py-2 w-full" required minLength={10} />
      </label>
      <button type="submit" className="btn btn-primary w-full">Gerar Landing Page</button>
    </form>
  )
}
