import Image from "next/image";
import React from "react";
import useSpotify from "../hooks/useSpotify";
import { currenTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";
import { millisToMinutesAndSeconds } from "../lib/time";

const Song = ({ order, track }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currenTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({ uris: [track.uri] });
  };

  return (
    <div
      className="grid grid-cols-2 space-y-2 text-gray-400 py-4 px-5 
    hover:bg-gray-900 rounded-lg cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <div className="flex text-right pr-4">
          <span className="min-w-[18px]">{order + 1}</span>
        </div>
        <div className="relative h-10 w-10 min-w-[2.5rem]">
          <Image
            layout="fill"
            objectFit="contain"
            src={track.album.images[0].url}
            alt={track.name}
          />
        </div>
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{track.name}</p>
          <p className="text-gray-400">{track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden md:inline">{track.album.name}</p>
        <p className="">{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Song;
