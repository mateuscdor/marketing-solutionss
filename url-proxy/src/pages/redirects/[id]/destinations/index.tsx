import { GetServerSideProps } from "next";
import DestinationsPage from "../../../../modules/destinations";
import DashboardLayout from "../../../../layouts/dashboard";

const Page = (props: any) => (
  <DashboardLayout>
    <DestinationsPage {...props} />
  </DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  const { redirectSource } = context.query || {};

  if (!id) {
    return {
      notFound: true,
    };
  }
  return {
    props: { redirectId: id, redirectSource },
  };
};
export default Page;
