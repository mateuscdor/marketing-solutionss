import { GetServerSideProps } from "next";

function Home() {
  return <div />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    notFound: true,
  };
};

export default Home;
