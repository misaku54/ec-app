import { useCallback } from "react";
import { toaster } from "../components/ui/toaster";


type Props = {
  title: string;
  status: "info" | "warning" | "success" | "error";
  description?: string;
}

export const useMessage = () => {
  const showMessage = useCallback((props: Props) => {
    const { title, status, description } = props;

    toaster.create({
      title,
      description,
      type: status,
    });
  }, []);

  return { showMessage };
};
