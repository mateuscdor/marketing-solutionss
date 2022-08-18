import RedirectGroupsHome from "../../modules/redirect-groups";
import DashboardLayout from "../../layouts/dashboard";

const Page = (props: any) => (
  <DashboardLayout>
    <RedirectGroupsHome {...props} />
  </DashboardLayout>
);

export default Page;
