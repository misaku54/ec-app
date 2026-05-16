import type { PageInfo } from "./PageInfo";

export type ApiResponse<T> = {
  status: "success" | "error";
  data: T;
};

export type ApiListResponse<T> = {
  status: "success" | "error";
  data: T[];
  pageInfo: PageInfo;
};

export type ApiError = {
  status: "error";
  error: {
    code: number;
    message: string;
    fieldError?: Record<string, string[]>;
  };
};
