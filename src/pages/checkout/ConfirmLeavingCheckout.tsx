// useConfirmModal.ts
import { useState, useCallback, useRef } from "react";
import { Modal } from "../../components/modal/Modal";

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback((msg: string) => {
    setMessage(msg);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = (ok: boolean) => {
    setIsOpen(false);
    resolveRef.current?.(ok);
    resolveRef.current = null;
  };

  const ModalComponent = (
    <Modal isOpen={isOpen} onClose={() => handleClose(false)}>
      <h2 className="font-bold text-lg mb-4 text-center">Are you sure?</h2>
      <p className="mb-6 text-center">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => handleClose(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => handleClose(true)}
        >
          Leave
        </button>
      </div>
    </Modal>
  );

  return { confirm, ModalComponent };
}
