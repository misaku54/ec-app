import { Button } from "../atoms/button/Button";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
};

export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
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
            確認
          </Button>
        </div>
      </div>
    </div>
  );
};
