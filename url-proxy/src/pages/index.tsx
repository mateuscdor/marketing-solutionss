import RedirectsHome from "../modules/redirects/home";
import DashboardLayout from "../layouts/dashboard";

const Page = (props: any) => (
  <DashboardLayout>
    <RedirectsHome {...props} />
  </DashboardLayout>
);

export default Page;
