import { MessageSquare, Settings, Database } from "lucide-react";
import Index from "./pages/Index.jsx";
import Chat from "./pages/Chat.jsx";
import ModelManagement from "./pages/ModelManagement.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Chat",
    to: "/chat",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <Chat />,
  },
  {
    title: "Models",
    to: "/models",
    icon: <Database className="h-4 w-4" />,
    page: <ModelManagement />,
  },
];
