import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import NavBar from "./NavBar";

const Hero = () => {
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(`/chat/${user.sub}`);
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="w-full lg:w-[43%] bg-white flex flex-col justify-between p-6 sm:p-8 min-h-[60vh] lg:min-h-screen h-screen rounded-b-3xl lg:rounded-br-3xl lg:rounded-bl-none rounded-bl-3xl">
      <div className="flex flex-col justify-between h-full">
        <NavBar />
        <div className="mt-8 sm:mt-12 lg:-mt-20">
          <h1 className="text-4xl sm:text-8xl md:text-8xl lg:text-8xl xl:text-9xl tracking-tight font-bold font-inter text-zinc-900 leading-tight">
            Know about yourself with{" "}
            <span className="text-zinc-800 font-playfair font-semibold italic ml-1">
              Lumyn
            </span>
          </h1>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          {["Development", "Contact"].map((val, ind) => (
            <a
              key={val}
              href={`/${val}`}
              className="font-semibold font-inter text-base sm:text-lg tracking-tight hover:text-black transition-colors text-blue-600"
            >
              {val}
              {ind < 1 && <span className="text-black"> / </span>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
