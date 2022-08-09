import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import FullscreenLoading from "../components/loading/fullscreen";
import { RedirectsService } from "../services/redirects";

function GoPage({ origin, userIp }: any) {
  const router = useRouter();
  const alreadyCalledRef = useRef(false);

  useEffect(() => {
    if (alreadyCalledRef.current) return;
    console.debug(`==> requesting destination ${origin} - ${userIp}`);
    new RedirectsService()
      .getDestination(origin, {
        userIp,
      })
      .then((destination) => {
        if (destination) {
          router.push(destination.url);
        }
      });

    alreadyCalledRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <FullscreenLoading />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;
  const { origin } = query;

  const forwarded = req.headers["x-forwarded-for"];

  const userIp =
    typeof forwarded === "string"
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;

  return {
    props: {
      origin,
      userIp,
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
