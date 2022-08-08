import type { NextRequest } from "next/server";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FullscreenLoading from "../components/loading/fullscreen";
import { RedirectionService } from "../services/backend/redirection";
import { RedirectsService } from "../services/redirects";

function GoPage({ origin, ip }: any) {
  const router = useRouter();

  //   useEffect(() => {
  //     new RedirectsService().getDestination(origin).then((destination) => {
  //       if (destination) {
  //         router.push(destination.url);
  //       }
  //     });
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  return <div>IP: {ip}</div>;
  //   return <FullscreenLoading />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;
  const { origin } = query;

  const forwarded = req.headers["x-forwarded-for"];

  const ip =
    typeof forwarded === "string"
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;

  console.log(req.headers, req.socket);

  return {
    props: {
      origin,
      ip,
    },
  };
};
export default GoPage;
