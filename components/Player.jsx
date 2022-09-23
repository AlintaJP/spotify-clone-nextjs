import Image from "next/image";
import {
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import {
  RewindIcon,
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import React, { useCallback, useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { debounce } from "lodash";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { currenTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currenTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  console.log(isPlaying);

  const fetchCurrentSong = useCallback(() => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  }, [setCurrentTrackId, setIsPlaying, songInfo, spotifyApi]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session, fetchCurrentSong]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => console.error(err));
    }),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [debouncedAdjustVolume, volume]);

  return (
    <div
      className="h-24 bg-gradient-to-b 
    from-black to-gray-900 text-white
      grid grid-cols-3 text-xs md:text-base 
      px-2 md:px-8"
    >
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:inline h-14 w-14">
          <Image
            layout="fill"
            objectFit="contain"
            src={songInfo?.album.images?.[0].url}
            alt="album picture"
          />
        </div>
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-gray-400 text-xs">
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="btn" />
        <RewindIcon className="btn" />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="btn w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="btn w-10 h-10" />
        )}

        <FastForwardIcon className="btn" />
        <ReplyIcon className="btn" />
      </div>

      <div
        className="flex items-center space-x-3 md:space-x-4 
        justify-end pr-5"
      >
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="btn"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="btn"
        />
      </div>
    </div>
  );
};

export default Player;
