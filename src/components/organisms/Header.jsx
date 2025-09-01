import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ViewTabs from "@/components/molecules/ViewTabs";
import Button from "@/components/atoms/Button";
const Header = ({ onSearch, onCreateTask }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Organize your tasks, boost your productivity
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search tasks..."
            />
            
            <Button
              onClick={onCreateTask}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={18} />
              <span>Add Task</span>
            </Button>
          </div>
        </div>

<ViewTabs />
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Welcome, {user?.firstName || user?.name || 'User'}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <ApperIcon name="LogOut" size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;