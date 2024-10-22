import { AuthContext } from "contexts/AuthProvider";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("AuthContext must be placed within AuthProvider");

  return context;
};

export default useAuth;
