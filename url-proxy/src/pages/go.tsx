import { GetServerSideProps } from "next";
import { DestinationModel } from "../db/mongoose/models/Destination";
import { MongoId } from "../db/mongoose/utils";
import { Redirect } from "../entities/Redirect";
import { getKeyValuesByPattern, redisClient } from "../services/redis";

function GoPage() {
  return <div />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { origin } = context.query;

  const filters = {
    redirect: origin,
    clicks: {
      $lte: 1000,
    },
  };

  const destination = await DestinationModel.findOneAndUpdate(
    filters,
    {
      $inc: { clicks: 1 },
    },
    {
      sort: {
        clicks: -1,
      },
      new: true,
    }
  ).lean();

  console.log({ destination, origin });

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
