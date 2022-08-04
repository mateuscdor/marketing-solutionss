import { GetServerSideProps } from "next";
import { Redirect } from "../entities/Redirect";
import { getKeyValuesByPattern, redisClient } from "../services/redis";

function GoPage() {
  return <div />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { origin } = context.query;

  const redirectStr = await redisClient.get(`redirect-${origin}`);

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
  console.log(context, {
    resolvedUrl: context.resolvedUrl,
    redirect,
    destination,
    url: destination.url,
  });
  return {
    redirect: {
      destination: destination.url,
      permanent: false,
    },
  };
};

export default GoPage;
