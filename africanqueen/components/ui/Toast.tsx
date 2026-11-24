'use client';
import { CheckCircle2, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type Toast = { id: number; text: string; tone: 'success' | 'info' };
const Ctx = createContext<(text: string, tone?: Toast['tone']) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast['tone'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-[90] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl bg-brand-navy px-4 py-3 text-sm text-white shadow-lg">
            {t.tone === 'success' ? <CheckCircle2 size={18} className="mt-0.5 flex-none text-emerald-400" aria-hidden /> : <Info size={18} className="mt-0.5 flex-none text-sky-300" aria-hidden />}
            <span>{t.text}</span>
            <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} aria-label="Dismiss" className="ml-1 flex-none text-white/70 hover:text-white">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
