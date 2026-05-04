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
    <dialog ref={dialogRef}>
      <div>
        <p>{message}</p>
        <Button onClick={onCancel}>キャンセル</Button>
        <Button onClick={onConfirm}>確認</Button>
      </div>
    </dialog>
  );
};
