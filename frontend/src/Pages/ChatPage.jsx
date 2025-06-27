import React, { useState } from 'react';
import ChatPageNav from '../components/ChatPageNav';
import ChatHero from '../components/ChatHero';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const ChatPage = () => {


  return (
    <div className="bg-gray w-full min-h-screen  py-4">
      <div className="sticky top-0 z-50">
        <ChatPageNav />
      </div>
      <div className=" w-full mx-auto">
        <ChatHero />
      </div>
    </div>
  );
};

export default ChatPage;
