import { useAuth0 } from "@auth0/auth0-react";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { message as instruction } from "../service/constants";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";

// ... (All imports remain the same)

const ChatHero = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  const [start, setStart] = useState(() => {
    return localStorage.getItem("chatStarted") === "true";
  });

  const [isStart, setIsStart] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  const [chat, setChat] = useState(() => {
    const stored = localStorage.getItem("chatHistory");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const storedChat = localStorage.getItem("chatHistory");
    if (storedChat) setChat(JSON.parse(storedChat));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  const startChat = async () => {
    setIsStart(true);
    const userMessage = { role: "user", message: instruction, isFirst: true };
    setStart(true);
    localStorage.setItem("chatStarted", "true");
    setChat((prev) => [...prev, userMessage]);

    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { email: user.email, userId: user.sub, message: userMessage.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage = { role: "ai", message: res.data.response };
      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("Error communicating with AI", error.message);
    } finally {
      setIsStart(false);
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || !isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const res = await axios.post(
          `http://localhost:5000/api/chat/history`,
          { userId: user.sub },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const formatted = res.data
          .map((msg) => ({
            role: msg.role === "model" ? "ai" : msg.role,
            message: msg.message,
          }))
          .filter((m) => m.message !== instruction);

        if (formatted.length > 0) {
          setChat(formatted);
          setHasHistory(true);
          setStart(true);
          localStorage.setItem("chatStarted", "true");
        }
      } catch (err) {
        console.log("Failed to fetch chat history", err.message);
      }
    };

    fetchHistory();
  }, [user, isAuthenticated]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", message: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { email: user.email, userId: user.sub, message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage = { role: "ai", message: res.data.response };
      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("Error communicating with AI", error.message);
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div className="min-h-screen w-full flex flex-col px-4 sm:px-8 md:px-12 lg:px-32 xl:px-[21.5rem] mt-10 mb-20">
      {!start && (
        <div className="flex items-center justify-center flex-1 gap-4 text-center text-zinc-100 px-4">
          {hasHistory ? (
            <div>
              <p className="text-lg sm:text-xl font-semibold">
                👋 Welcome back! Let's continue where you left off.
              </p>
              <p className="text-sm text-zinc-400 mt-2">
                You’ve answered {chat.length}/10 questions on your journey.
              </p>
            </div>
          ) : (
            <Button
              variant={isStart ? "default" : "outline"}
              disabled={isStart}
              onClick={startChat}
              className="bg-transparent text-white text-md tracking-tighter font-inter px-4 py-4 rounded-md"
            >
              {isStart ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <p>Setting up your journey</p>
                </>
              ) : (
                "Start your journey"
              )}
            </Button>
          )}
        </div>
      )}

      {/* Scrollable chat section */}
      <div className="flex-1 px-2 sm:px-4 md:px-6 py-4 overflow-y-auto">
        {chat
          .filter((val) => val.message !== instruction)
          .map((val, ind) => (
            <div
              key={ind}
              className={`flex flex-col gap-2 ${
                val.role === "ai"
                  ? "items-start ml-2 sm:ml-4 mr-auto max-w-[90%] sm:max-w-[75%]"
                  : "items-end mr-2 sm:mr-4 ml-auto max-w-[85%] sm:max-w-[65%]"
              } ${val.isFirst || val.message === instruction ? "hidden" : ""}`}
            >
              <div className="text-md flex-col gap-2 mt-4 overflow-x-hidden text-zinc-100 font-inter prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => (
                      <strong className="font-bold tracking-wide text-white">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-white/90">{children}</em>
                    ),
                    u: ({ children }) => (
                      <u className="underline underline-offset-4 decoration-zinc-300 text-white">
                        {children}
                      </u>
                    ),
                    del: ({ children }) => (
                      <del className="line-through text-red-400">
                        {children}
                      </del>
                    ),
                    p: ({ children }) => (
                      <p
                        className={`my-10 leading-relaxed tracking-normal text-white ${
                          val.role === "user" ? "font-semibold text-zinc-400" : ""
                        }`}
                      >
                        {children}
                      </p>
                    ),
                    li: ({ children }) => (
                      <li className="list-disc ml-6 mb-2 text-white">{children}</li>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-4 mb-2 text-white">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-4 mb-2 text-white">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-medium mt-4 mb-2 text-white">
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-zinc-500 pl-4 italic text-white/80 mb-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-100 font-mono text-sm">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-zinc-800 p-4 rounded-md overflow-x-auto text-sm text-white mb-4">
                        {children}
                      </pre>
                    ),
                    article: ({ children }) => (
                      <article className="bg-zinc-800 p-4 my-10 rounded-md overflow-x-auto text-sm text-white mb-4">
                        {children}
                      </article>
                    ),
                  }}
                >
                  {val.message}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        <div ref={bottomRef} />
      </div>

      {/* Chat input area at bottom */}
      <div className="bg-zinc-900 pb-10 p-3 rounded-bl-none rounded-br-none fixed bottom-0 left-1/2 -translate-x-1/2 rounded-3xl w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[60%] max-w-[900px] mx-auto">
        <div className="w-full mx-auto flex flex-col gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message here..."
            className="w-full text-lg font-inter bg-zinc-900 text-white
              focus:none border-none outline-none focus:outline-none
              focus:ring-0 focus:border-none resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={sending}
            className="text-2xl text-zinc-900 bg-white rounded-full p-2 h-fit self-end"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <IoIosSend />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHero;

