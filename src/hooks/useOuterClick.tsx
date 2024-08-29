import { useEffect, useState } from "react";

function useOuterClick(ref) {
  const [isOuterClicked, setIsOuterClicked] = useState(false);

  const handleClick = (event) => {
    setIsOuterClicked(ref.current?.contains(event.target));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return isOuterClicked;
}

export default useOuterClick;
