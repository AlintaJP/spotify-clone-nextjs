import React from "react";
import { getProviders, signIn } from "next-auth/react";
import spotifyLogo from "../assets/spotify-logo.png";
import Image from "next/image";

const Login = ({ providers }) => {
  return (
    <div
      className="flex flex-col items-center justify-center 
      bg-black min-h-screen w-full"
    >
      <div className="relative w-52 h-52 mb-5">
        <Image
          layout="fill"
          objectFit="contain"
          src={spotifyLogo}
          alt="spotify logo"
        />
      </div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="bg-[#18D860] text-white p-5 rounded-full"
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
