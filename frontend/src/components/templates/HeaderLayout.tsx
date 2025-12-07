import { FC, ReactNode, memo } from "react";
import { Outlet } from "react-router";
import { Header } from "../organisms/layout/Header";

export const HeaderLayout: FC = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
})