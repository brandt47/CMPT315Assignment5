import React from "react";

interface SidebarProps {
  onLogout: () => void;
  onShowStats: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout}) => {
  return (
      <div className="h-full w-64 bg-white shadow-lg flex flex-col p-4 lg:fixed">
        <nav className="flex flex-col space-y-4">
          <button
              className="w-full text-left px-4 py-3 text-lg font-semibold
              text-red-600 bg-gray-100 rounded-lg hover:bg-red-500 hover:text-white transition"
              onClick={onLogout}
          >
            Logout
          </button>
        </nav>
      </div>
  );
};

export default Sidebar;