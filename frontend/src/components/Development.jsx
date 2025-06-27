import { Home } from "lucide-react";
import React from "react";
import { FaReact, FaNodeJs, FaDatabase, FaFigma, FaGasPump } from "react-icons/fa";
import { IoMdCode } from "react-icons/io";
import { SiTailwindcss, SiMongodb, SiExpress, SiAuth0, SiGmail } from "react-icons/si";

const stack = [
  { name: "React.js", icon: <FaReact className="text-sky-500" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-400" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
  { name: "Express.js", icon: <SiExpress className="text-white" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-green-400" /> },
  { name: "Auth0", icon: <SiAuth0 className="text-orange-500" /> },
  { name: "Figma", icon: <FaFigma className="text-pink-400" /> },
  { name: "GSAP", icon: <FaGasPump className="text-pink-400" /> },
  { name: "ShadCn", icon: <IoMdCode className="text-pink-400" /> },
];

const Development = () => {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center px-6 py-12 lg:px-24 relative">
        <a href="/" className="absolute top-4 left-4 text-2xl">
            <h1 className="text-lg font-bold font-inter tracking-tighter text-gray hover:underline">Lumyn's home</h1>
        </a>
      {/* About Section */}
      <section className="max-w-4xl text-center mb-20">
        <h2 className="text-5xl font-bold mb-6 tracking-tight">About</h2>
        <p className="text-lg text-zinc-700 leading-relaxed">
          <span className="font-bold">Lumyn</span> is a self-discovery AI experience built to help users reflect deeply on their thoughts,
          patterns, and personal growth. Our mission is to guide users through meaningful conversations
          using 10 questions designed to uncover self-deceptive stories and reconnect with authenticity.
        </p>
      </section>

      {/* Stack Section */}
      <section className="w-full max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-10 tracking-tight">Development Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
          {stack.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-zinc-900 text-white rounded-2xl p-6 shadow-md hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-3">{tech.icon}</div>
              <p className="text-lg font-semibold">{tech.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact or Footer */}
      <footer className="mt-24 text-center text-sm text-zinc-500">
        Built with ❤️ by the Lumyn Team. <br /> Contact us at <a href="mailto:hello@lumyn.ai" className="text-blue-600 underline">hello@lumyn.ai</a>
      </footer>
    </div>
  );
};

export default Development;
