'use client'
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 min-w-[300px] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">×</button>
        {children}
      </div>
    </div>
  );
}
