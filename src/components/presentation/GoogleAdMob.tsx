import { useEffect } from "react";

const GoogleAdMob = ({ client, slot, style, className }) => {
  useEffect(() => {
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
    />
  );
};

export default GoogleAdMob;
