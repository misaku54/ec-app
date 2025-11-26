import { Page1 } from "../Page1";
import { Page1DetailA } from "../Page1DetailA";
import { Page1DetailB } from "../Page1DetailB";

export const Page1Routes = [
  {
    path: "/page1",
    Component: Page1,
    children: [
      { path: "detailA", Component: Page1DetailA },
      { path: "detailB", Component: Page1DetailB }
    ]
  }
];