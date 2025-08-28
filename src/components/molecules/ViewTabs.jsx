import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

const ViewTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "all", label: "All Tasks", path: "/" },
    { id: "today", label: "Today", path: "/today" },
    { id: "upcoming", label: "Upcoming", path: "/upcoming" },
    { id: "completed", label: "Completed", path: "/completed" }
  ];

  const currentPath = location.pathname;
  const activeTabIndex = tabs.findIndex(tab => tab.path === currentPath);

  return (
    <div className="relative">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab, index) => {
          const isActive = tab.path === currentPath;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "text-primary-700 bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full tab-indicator" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ViewTabs;