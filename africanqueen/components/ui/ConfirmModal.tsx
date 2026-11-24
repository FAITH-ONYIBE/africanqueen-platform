'use client';
import { Modal } from './Modal';

export function ConfirmModal({ open, title, text, confirmLabel, onConfirm, onClose, danger }: { open: boolean; title: string; text: string; confirmLabel: string; onConfirm: () => void; onClose: () => void; danger?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p>{text}</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`h-10 rounded-md px-4 text-sm font-semibold text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-red hover:bg-brand-red-dark'}`}
        >
          {confirmLabel}
        </button>
        <button onClick={onClose} className="h-10 rounded-md border border-brand-line px-4 text-sm font-medium hover:bg-brand-mist">
          Cancel
        </button>
      </div>
    </Modal>
  );
}
