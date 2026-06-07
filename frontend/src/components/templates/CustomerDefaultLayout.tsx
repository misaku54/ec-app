import { CustomerHeader } from "../organisms/CustomerHeader";
import { BaseLayout } from "./BaseLayout";

export const CustomerDefaultLayout = () => (
  <BaseLayout header={<CustomerHeader />} />
);
