import { GetServerSideProps } from "next";
import { Redirect } from "../entities/Redirect";
import { getKeyValuesByPattern, redisClient } from "../services/redis";

function GoPage() {
  return <div />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { origin } = context.query;

  const id = `redirect-${origin}`;
  console.debug("Getting", id);
  const redirectStr = await redisClient.get(id);

  if (!redirectStr) {
    return {
      notFound: true,
    };
  }

  const redirect = JSON.parse(redirectStr) as Redirect;
  const destination =
    redirect.destinations[
      Math.floor(Math.random() * redirect.destinations.length)
    ];

  return {
    redirect: {
      destination: destination.url,
      permanent: false,
    },
  };
};

export default GoPage;
