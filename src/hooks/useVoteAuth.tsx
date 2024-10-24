import { AuthVoteContext } from "contexts/ClientVoteProvider";
import { useContext } from "react";

const useVoteAuth = () => {
  const context = useContext(AuthVoteContext);
  if (!context)
    throw new Error("AuthVoteContext must be placed within AuthProvider");

  return context;
};

export default useVoteAuth;
