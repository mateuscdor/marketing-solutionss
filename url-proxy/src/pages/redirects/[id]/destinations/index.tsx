import { GetServerSideProps } from "next";
import RedirectsHome from "../../../../modules/destinations";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (!id) {
    return {
      notFound: true,
    };
  }
  return {
    props: { redirectId: id },
  };
};
export default RedirectsHome;
