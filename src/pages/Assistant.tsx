import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const Assistant = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentInput, setCurrentInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [animatedContent, setAnimatedContent] = useState("");
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "New Thread",
      lastMessage: "",
      timestamp: new Date(),
      messages: [],
    },
  ]);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages.length]);

  const animateMarkdownMessage = (fullText: string, messageId: string) => {
    setAnimatedContent("");
    setAnimatingMessageId(messageId);
    let i = 0;
    const chunkSize = 4;
    const interval = setInterval(() => {
      setAnimatedContent(fullText.slice(0, i + chunkSize));
      i += chunkSize;
      if (i >= fullText.length) {
        clearInterval(interval);
        setAnimatingMessageId(null);
        setAnimatedContent("");
      }
    }, 16);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setCurrentInput("");

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a simulated AI response to your query.",
        sender: "assistant",
        timestamp: new Date(),
      };

      animateMarkdownMessage(assistantMessage.content, assistantMessage.id);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                lastMessage: assistantMessage.content.slice(0, 50) + "...",
                title: userMessage.content.slice(0, 30) + "...",
              }
            : chat
        )
      );
    }, 1000);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Thread",
      lastMessage: "",
      timestamp: new Date(),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setCurrentInput("");
  };

  const handleDeleteChat = (chatId: string) => {
    const updated = chats.filter((chat) => chat.id !== chatId);
    setChats(updated);
    if (currentChatId === chatId && updated.length > 0) {
      setCurrentChatId(updated[0].id);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden text-black">
      {/* Sidebar */}
      <div className={`w-80 transition-all bg-white border-r border-gray-200 flex flex-col`}>
        <div className="p-4 border-b">
          <Button onClick={handleNewChat} className="w-full h-10 rounded-md bg-black text-white">
            <Plus className="h-4 w-4 mr-2" /> New Thread
          </Button>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search thread"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`group flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                    currentChatId === chat.id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold">{chat.title}</div>
                      <div className="text-xs text-gray-500">{chat.lastMessage || "No messages yet"}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {currentChat?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl px-4 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <ReactMarkdown>
                    {animatingMessageId === msg.id ? animatedContent : msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Type your message"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="bg-black text-white">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
