import Head from "next/head";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Player from "../components/Player";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";

export default function Home() {
  const spotifyApi = useSpotify();
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body && data.body.is_playing) {
        setShowPlayer(true);
      }
    });
  }, [spotifyApi]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <meta name="description" content="Spotify Clone Built With NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      {showPlayer && (
        <div className="sticky bottom-0">
          <Player />
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await unstable_getServerSession(ctx.req, ctx.res, authOptions),
    },
  };
}
