import RedirectGroupsHome from "../../modules/redirect-groups";
import DashboardLayout from "../../layouts/dashboard";
import { GetServerSideProps } from "next";

const Page = (props: any) => (
  <DashboardLayout>
    <RedirectGroupsHome {...props} />
  </DashboardLayout>
);

export default Page;
