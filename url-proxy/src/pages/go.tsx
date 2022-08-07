import { GetServerSideProps } from "next";
import { RedirectionService } from "../services/backend/redirection";

function GoPage() {
  return <div />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { origin } = context.query;

  const destination = await new RedirectionService().getDestination(
    origin as string
  );

  console.debug("Redirecting ", {
    origin,
    destination,
  });
  if (!destination) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: destination.url,
      permanent: false,
    },
  };
};

export default GoPage;
