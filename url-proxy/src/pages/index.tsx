import { GetServerSideProps } from "next";
import DashboardLayout from "../layouts/dashboard";
import Dashboard from "../modules/dashboard";

const Page = (props: any) => (
  <DashboardLayout>
    <Dashboard {...props} />
  </DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/redirects",
      permanent: false,
    },
  };
};

export default Page;
