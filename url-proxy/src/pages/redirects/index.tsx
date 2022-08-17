import RedirectsHome from "../../modules/redirects/home";
import DashboardLayout from "../../layouts/dashboard";
import { GetServerSideProps } from "next";

const Page = (props: any) => (
  <DashboardLayout>
    <RedirectsHome {...props} />
  </DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { redirectGroupId, redirectGroupName } = context.query || {};

  if (!redirectGroupId) {
    return {
      notFound: true,
    };
  }
  return {
    props: { redirectGroupId, redirectGroupName },
  };
};

export default Page;
