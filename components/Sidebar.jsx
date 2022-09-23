import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import SidebarBtn from "./SidebarBtn";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";

const Sidebar = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div
      className="text-gray-400 p-5 text-xs lg:text-sm border-r 
      border-gray-900 overflow-y-scroll h-screen scrollbar-hide
       sm:min-w-[9rem] lg:min-w-[11rem] hidden md:inline-flex"
    >
      <div className="space-y-4">
        <SidebarBtn Icon={HomeIcon} text="Home" />
        <SidebarBtn Icon={SearchIcon} text="Search" />
        <SidebarBtn Icon={LibraryIcon} text="Your Library" />

        <hr className="border-t-[0.1px] border-gray-900" />

        <SidebarBtn Icon={PlusCircleIcon} text="Create Playlist" />
        <SidebarBtn
          Icon={HeartIcon}
          text="Liked Songs"
          className="text-blue-500"
        />
        <SidebarBtn
          Icon={RssIcon}
          text="Your Episodes"
          className="text-green-500"
        />

        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
