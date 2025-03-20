import { useEffect, useState } from "react";

export function useHashTab(defaultTab = "home") {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") || defaultTab;
    setActiveTab(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      setActiveTab(newHash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [defaultTab]);

  return activeTab;
}
