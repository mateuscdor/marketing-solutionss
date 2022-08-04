import { GetServerSideProps } from "next";
import RedirectionsHome from "../../modules/redirections/home";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;

  if (!token) {
    return {
      notFound: true,
    };
  }
  return {
    props: {},
  };
};
export default RedirectionsHome;
