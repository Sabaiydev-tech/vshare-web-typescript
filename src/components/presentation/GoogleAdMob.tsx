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

{
  /* <script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7125131537775388"
  crossOrigin="anonymous"
></script>; */
}

// <meta name="google-adsense-account" content="ca-pub-7125131537775388">
