import React, { useEffect, useState } from "react";

const MenuContext = React.createContext({
  activeTab: setActiveTabFromSession(),
});

function setActiveTabFromSession() {
  let _activeTab = sessionStorage.getItem("activeTab");
  const initialStage = "Stage1";
  if (!_activeTab) {
    sessionStorage.setItem("activeTab", initialStage);
    return initialStage;
  } else {
    return _activeTab;
  }
}

export const MenuProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(setActiveTabFromSession());

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  return (
    <MenuContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
