import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FullscreenLoading from "../components/loading/fullscreen";
import { RedirectionService } from "../services/backend/redirection";
import { RedirectsService } from "../services/redirects";

function GoPage({ origin }: any) {
  const router = useRouter();

  useEffect(() => {
    new RedirectsService().getDestination(origin).then((destination) => {
      if (destination) {
        router.push(destination.url);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <FullscreenLoading />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { origin } = context.query;

  return {
    props: {
      origin,
    },
  };
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { origin } = context.query;

//   const destination = await new RedirectionService().getDestination(
//     origin as string
//   );

//   console.debug("Redirecting ", {
//     origin,
//     destination,
//   });
//   if (!destination) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     redirect: {
//       destination: destination.url,
//       permanent: false,
//     },
//   };
// };

export default GoPage;
