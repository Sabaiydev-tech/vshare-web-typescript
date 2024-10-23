import { AdsContainer } from "app/pages/file-uploader/styles/fileUploader.style";
import { useEffect, useRef } from "react";

function GoogleAdsense() {
  const adRef = useRef<any>(null);

  useEffect(() => {
    if (window.adsbygoogle && adRef.current) {
      if (!adRef.current.hasAttribute("data-adsbygoogle-status")) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense error: ", e);
        }
      }
    }
  }, []);

  return (
    <AdsContainer>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7931814511159648"
        data-ad-slot="9909598547"
        data-adtest="on"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </AdsContainer>
  );
}

export default GoogleAdsense;
