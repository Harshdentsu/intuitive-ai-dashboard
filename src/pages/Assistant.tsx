import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  Menu,
  X,
  Plus,
  Search,
  MoreHorizontal,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState("1");
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [animatedContent, setAnimatedContent] = useState("");
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(
    null
  );

  const rawUsername = "harsh.dealer";
  const firstName = rawUsername.split(".")[0];
  const lastName = rawUsername.split(".")[1];
  const initials = `${firstName[0]?.toUpperCase()}${lastName[0]?.toUpperCase()}`;
  const displayName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

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

  const hasMessages = currentChat?.messages.length > 0;
  const showGreeting =
    !hasMessages && !inputFocused && !currentInput.trim();

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
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
            }
          : chat
      )
    );

    setCurrentInput("");
    setInputFocused(false);
    setIsTyping(true);
    setShowRightPanel(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm here to help you with any questions. This is a simulated response.",
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
                lastMessage:
                  assistantMessage.content.substring(0, 50) + "...",
                title: userMessage.content.substring(0, 30) + "...",
              }
            : chat
        )
      );

      setIsTyping(false);
    }, 1200);
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
    setInputFocused(false);
    setCurrentInput("");
    setShowRightPanel(false);

    toast({
      title: "New Thread Created",
      description: "Start a fresh conversation",
    });
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId && chats.length > 1) {
      setCurrentChatId(chats.find((chat) => chat.id !== chatId)?.id || "");
    }

    toast({
      title: "Thread Deleted",
      description: "The conversation has been removed",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleSuggestedQuery = (query: string) => {
    setCurrentInput(query);
    setInputFocused(true);
    setShowRightPanel(true);
  };

  const suggestedQueries = [
    { text: "List all claims I've raised", icon: "📄" },
    { text: "Specification about product UrbanBias", icon: "🔧" },
    { text: "Available quantity of 100/45R29 73H in Mysore", icon: "🏬" },
    { text: "Show me my sales.", icon: "📊" },
  ];

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 dark:text-white flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-white dark:bg-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden shadow-sm`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <Button
            onClick={handleNewChat}
            className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-xl font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search thread"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 h-10 rounded-lg focus:bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    currentChatId === chat.id
                      ? "bg-gray-100 border border-gray-200"
                      : ""
                  }`}
                  onClick={() => setCurrentChatId(chat.id)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                        {chat.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg dark:text-white">
                      <DropdownMenuItem>Rename Thread</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteChat(chat.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        Delete Thread
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Chat area will continue here... */}
      {/* Add your existing chat UI from previous code after this line */}

    </div>
  );
};

export default Assistant;
