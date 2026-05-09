import { createContext, useContext } from "react";

type DiaLogContextType = {
  openDiaLog: (message: string, onConfirm: () => void) => void;
};

export const DiaLogContext = createContext<DiaLogContextType | null>(null);

export const useDiaLogContext = (): DiaLogContextType => {
  const context = useContext(DiaLogContext);
  if (!context) {
    throw new Error(
      "useDiaLogContextはDiaLogProvider内で使用する必要があります。",
    );
  }
  return context;
};
