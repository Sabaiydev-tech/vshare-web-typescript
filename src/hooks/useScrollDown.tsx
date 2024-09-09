import { useEffect, useState } from "react";

const useScroll = ({ total, limitData }) => {
  // scroll down
  const [limitScroll, setLimitScroll] = useState(limitData);
  const [isAtBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.scrollingElement!.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      setIsBottom(windowHeight + scrollTop >= documentHeight ? true : false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addMoreLimit = () => {
    setLimitScroll((prevState) => prevState + limitData);
  };

  useEffect(() => {
    if (isAtBottom && limitScroll < total) {
      setLimitScroll((prevState) => prevState + limitData);
    }
  }, [isAtBottom]);

  return { isAtBottom, limitScroll, addMoreLimit };
};

export default useScroll;
