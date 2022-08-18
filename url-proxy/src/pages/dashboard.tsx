import DashboardLayout from "../layouts/dashboard";
import Dashboard from "../modules/dashboard";

const DashboardPage = (props: any) => (
  <DashboardLayout>
    <Dashboard {...props} />
  </DashboardLayout>
);

export default DashboardPage;
