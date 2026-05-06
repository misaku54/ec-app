import { useEffect, useRef } from "react";
import { Button } from "../atoms/button/Button";

type Props = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DiaLog = ({ isOpen, message, onConfirm, onCancel }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg shadow-lg p-6 w-full max-w-sm backdrop:bg-black/50 m-auto"
    >
      <p className="text-sm text-zinc-700 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-zinc-600 border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors"
        >
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
        >
          削除する
        </Button>
      </div>
    </dialog>
  );
};
