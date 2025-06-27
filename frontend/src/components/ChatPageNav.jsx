import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ChatPageNav = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth0();
  const [showClearChat, setShowClearChat] = useState(false);
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory"));

  

  useEffect(() => {
    try{
      console.log(chatHistory.length);
      if(chatHistory.length > 0){
        setShowClearChat(true);
      }else{
        setShowClearChat(false);
      }
    }catch(error){
      console.log("Failed to check chat history");
    }
  }, [chatHistory]);

  const handleClearChat = async () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      const response = await axios.post(
        "https://lumin-app.onrender.com/api/chat/clear",
        { userId: user.sub }
      );
      if (response.status === 200) {
        toast.success("Chat cleared successfully");
      }
    } catch (error) {
      toast.error("Failed to clear chat");
    } finally {
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("chatStarted");
      window.location.reload();
    }
  };

  return (
    <div className="flex py-3 bg-gray justify-between fixed top-0 left-0 w-full items-center px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
      <h1 className="text-3xl font-inter tracking-tighter text-white font-bold">
        Lumyn
      </h1>
      <Popover className="">
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src={user.picture} />
            <AvatarFallback>
              {user.name.split(" ")[0].charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="bg-black/40 flex flex-col gap-2  border-none p-0 mt-5 w-fit">
          <Button
            variant="outline"
            className="text-white border-none  bg-transparent"
            onClick={() => {
              logout({ returnTo: window.location.origin });
              localStorage.removeItem("chatHistory");
              localStorage.removeItem("chatStarted");
            }}
          >
            Logout
          </Button>
          {
            showClearChat && (
              
              <AlertDialog>
            <AlertDialogTrigger>
              <Button
                variant="outline"
                className="text-white border-none  bg-transparent"
              >
                Clear Chat
              </Button>

            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleClearChat()}
                  disabled={isLoading}
                >
                  {isLoading ? <span><Loader2 /> Clearing...</span> : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          )
        }
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatPageNav;
