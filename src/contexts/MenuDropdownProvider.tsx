// MenuStateProvider.js
import { createContext, useContext, useState } from "react";

const MenuStateContext = createContext<any>(null);

export const MenuDropdownProvider = ({ children }) => {
  const [isAutoClose, setIsAutoClose] = useState(false);
  return (
    <MenuStateContext.Provider value={{ isAutoClose, setIsAutoClose }}>
      {children}
    </MenuStateContext.Provider>
  );
};

export const MenuDropdownState = () => {
  const context = useContext(MenuStateContext);
  if (!context) {
    throw new Error("useMenuState must be used within a MenuStateProvider");
  }
  return context;
};
