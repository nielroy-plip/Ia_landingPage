'use client'
export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-full p-4 hidden md:block">
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
          </li>
          <li>
            <a href="/create" className="hover:underline">Nova Landing Page</a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}