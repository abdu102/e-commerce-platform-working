import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Confirm({ open, title = 'Are you sure?', description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }: ConfirmProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1002]">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="absolute inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
          >
            <div className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden bg-white">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {description && <p className="mt-1.5 text-sm text-gray-600">{description}</p>}
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">{cancelLabel}</button>
                  <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">{confirmLabel}</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


