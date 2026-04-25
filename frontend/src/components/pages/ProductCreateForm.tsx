import { useForm } from "react-hook-form";

type Inputs = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageFiles: File[]; // 一旦考える
  sortOrder: number;
};

export const ProductCreateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  return <></>;
};
