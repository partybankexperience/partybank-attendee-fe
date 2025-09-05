// useConfirmModal.ts
import { useState, useCallback, useRef } from "react";
import { Modal } from "../../components/modal/Modal";
import DefaultButton from "../../components/buttons/DefaultButton";

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
      <h2 className="font-bold text-lg mb-4 text-center">Leave Checkout?</h2>
      <p className="mb-6 text-center">{message}</p>
      <div className="flex justify-center gap-4">
      <DefaultButton
      variant='black'
          onClick={() => handleClose(true)}
        >
          Leave
        </DefaultButton>
        <DefaultButton
        
          onClick={() => handleClose(false)}
        >
          Stay
        </DefaultButton>
        
      </div>
    </Modal>
  );

  return { confirm, ModalComponent };
}


export function useForceLeaveModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const resolveRef = useRef<((ok: boolean) => void) | null>(null);
  
    const confirm = useCallback((msg: string,title:string) => {
      setMessage(msg);
      setTitle(title);
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
  
    const ModalForceComponent = (
      <Modal isOpen={isOpen} onClose={() => handleClose(true)}>
        <h2 className="font-semibold  text-[1.5rem] mb-4 text-center">{title}</h2>
      <p className="mb-6 text-center ">{message}</p>
      <div className="flex justify-center">
        <DefaultButton
          // className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => handleClose(true)}
        >
          Back to Tickets
        </DefaultButton>
      </div>
        
      </Modal>
    );
  
    return { confirm, ModalForceComponent };
  }