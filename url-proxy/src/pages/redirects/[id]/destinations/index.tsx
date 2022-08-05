import { GetServerSideProps } from "next";
import RedirectsHome from "../../../../modules/destinations";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  const { redirectSource } = context.query || {};

  console.log({ id, redirectSource });
  if (!id) {
    return {
      notFound: true,
    };
  }
  return {
    props: { redirectId: id, redirectSource },
  };
};
export default RedirectsHome;
