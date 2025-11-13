import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DarkMode = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    
    if (isDark) {
        document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition duration-300"
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default DarkMode;
