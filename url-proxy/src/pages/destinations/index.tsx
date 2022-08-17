import { GetServerSideProps } from "next";
import DestinationsPage from "../../modules/destinations";
import DashboardLayout from "../../layouts/dashboard";

const Page = (props: any) => (
  <DashboardLayout>
    <DestinationsPage {...props} />
  </DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { redirectSource, redirectId, redirectGroupId } = context.query || {};

  if (!redirectId) {
    return {
      notFound: true,
    };
  }
  return {
    props: { redirectId, redirectSource, redirectGroupId },
  };
};

export default Page;
