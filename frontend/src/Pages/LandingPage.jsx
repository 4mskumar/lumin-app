import React, { useEffect, useRef, useState } from "react";
import Hero from "../components/Hero";

const LandingPage = () => {
  const imageRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;

      const moveX = (e.clientX - centerX) / 100;
      const moveY = (e.clientY - centerY) / 100;

      setOffset({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-zinc-900 overflow-hidden relative">
    <Hero />
    <div className="relative w-full flex justify-center items-center lg:block">
      <img
        ref={imageRef}
        src="/images/LPimage.png"
        alt="Landing"
        className="w-[20rem] sm:w-[28rem] md:w-[35rem] lg:w-[45rem] max-w-none
                   object-contain transition-transform duration-700 ease-out
                   lg:absolute lg:top-[12rem] lg:right-[10rem]"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      />
    </div>
  </div>
  
  );
};

export default LandingPage;
