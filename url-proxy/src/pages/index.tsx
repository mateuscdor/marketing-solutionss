import DashboardLayout from "../layouts/dashboard";
import Dashboard from "../modules/dashboard";

const Page = (props: any) => (
  <DashboardLayout>
    <Dashboard {...props} />
  </DashboardLayout>
);

export default Page;
