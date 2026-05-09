// ダイアログ用コンテキスト

import type { ReactNode } from "react";
import { useState } from "react";
import { DiaLog } from "../components/molecules/DiaLog";
import { DiaLogContext } from "./DiaLogContext";

type Props = {
  children: ReactNode;
};
// openDiaLogという関数をコンテキストにする。
export const DiaLogProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [message, setMessage] = useState<string>("");

  // ダイアログを開く処理。文言と確認ボタン押下時の関数をセット
  // 確認後に自動でダイアログを閉じるようにラップする
  const openDiaLog = (message: string, onConfirm: () => void) => {
    setIsOpen(true);
    setMessage(message);
    setOnConfirm(() => () => {
      onConfirm();
      closeDiaLog();
    });
  };

  // ダイアログを閉じる処理。どの画面でも共通のため、状態管理はしない
  const closeDiaLog = () => {
    setIsOpen(false);
    setMessage("");
    setOnConfirm(() => {});
  };

  return (
    <DiaLogContext.Provider value={{ openDiaLog }}>
      {children}
      <DiaLog
        isOpen={isOpen}
        message={message}
        onConfirm={onConfirm}
        onCancel={closeDiaLog}
      />
    </DiaLogContext.Provider>
  );
};
