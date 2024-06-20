import { Box, Button, Typography } from "@mui/material";
import {
  BraveBrowser,
  ChromeBrowser,
  DuckDuckgoBrowser,
  EdgeBrowser,
  FireFoxBrowser,
  OperaBrowser,
  SafariBrowser,
  VivalidBrowser,
} from "assets/icons/icon";
import vshareLogo from "assets/images/vshare-deeplink.png";
import { Fragment, useEffect, useState } from "react";
import * as MUI from "styles/presentation/deepLink.style";

function DeepLink(props) {
  const { showBottom, _platform, onClose, scriptScheme } = props;
  const [browser, setBrowser] = useState<any>("");

  const Icons = [
    {
      icon: <EdgeBrowser />,
      title: "Edge",
    },
    {
      icon: <ChromeBrowser />,
      title: "Chrome",
    },
    {
      icon: <FireFoxBrowser />,
      title: "Firefox",
    },
    {
      icon: <OperaBrowser />,
      title: "Opera",
    },
    {
      icon: <SafariBrowser />,
      title: "Safari",
    },
    {
      icon: <BraveBrowser />,
      title: "Brave",
    },
    {
      icon: <VivalidBrowser />,
      title: "Vivaldi",
    },
    {
      icon: <DuckDuckgoBrowser />,
      title: "DuckDuckGo",
    },
  ];

  function handleFindBrowser(title) {
    const result = Icons.find((icon) => icon.title === title);
    if (result) {
      setBrowser(result.title);
    }
  }

  /*   const openAppOrStore = () => {
    // Create an iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Attempt to open the deep link
    iframe.src = scriptScheme;
    // Check if the app is installed
    setTimeout(() => {
      setAppInstalled(true);
      document.body.removeChild(iframe); // Remove the iframe
    }, 1000); // Adjust timeout as needed

    // If app is still running, window.location will not change
    setTimeout(() => {
      if (!appInstalled) {
        // App is not installed, redirect to store
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.vshare.app.client";
      }
    }, 3000);
    // Adjust timeout as needed
  }; */

  function handleOpenApp() {
    window.location.href = scriptScheme;
  }

  useEffect(() => {
    function handleDetectBrowser() {
      // Get user agent string
      const userAgent = navigator.userAgent;

      // Check for common browsers
      if (userAgent.indexOf("Firefox") > -1) {
        handleFindBrowser("Firefox");
      } else if (userAgent.indexOf("Chrome") > -1) {
        handleFindBrowser("Chrome");
      } else if (userAgent.indexOf("Safari") > -1) {
        handleFindBrowser("Safari");
      } else if (userAgent.indexOf("Edge") > -1) {
        handleFindBrowser("Edge");
      } else if (userAgent.indexOf("Opera") > -1) {
        handleFindBrowser("Opera");
      } else if (userAgent.indexOf("Brave") > -1) {
        handleFindBrowser("Brave");
      } else if (userAgent.indexOf("Vivaldi") > -1) {
        handleFindBrowser("Vivaldi");
      } else if (userAgent.indexOf("DuckDuckGo") > -1) {
        handleFindBrowser("DuckDuckGo");
      } else {
        setBrowser({
          icon: <EdgeBrowser />,
          title: "Edge",
        });
      }
    }

    handleDetectBrowser();
  }, []);

  return (
    <Fragment>
      {showBottom && <MUI.BottomBackDrop onClick={onClose} />}
      <MUI.BottomContainer className={showBottom ? "active" : ""}>
        <MUI.BottomWrapper>
          <MUI.BottomHeader>Download Faster in App</MUI.BottomHeader>
          <MUI.BottomPanel>
            <MUI.BottomPanelItem>
              <MUI.BoxLeft>
                <img src={vshareLogo} alt="v-share-app" />

                <Typography variant="h2">vShare App</Typography>
              </MUI.BoxLeft>
              <MUI.BoxRight>
                <Button
                  onClick={handleOpenApp}
                  variant="contained"
                  size="medium"
                >
                  Open
                </Button>
              </MUI.BoxRight>
            </MUI.BottomPanelItem>
            <MUI.BottomPanelItem>
              {browser && (
                <Fragment>
                  <MUI.BoxLeft>
                    {Icons.map((icon, index) => {
                      return (
                        <Fragment key={index}>
                          {icon.title === browser && (
                            <Fragment>
                              <Box sx={{ mr: 3 }}>{icon.icon}</Box>
                              <Typography variant="h2">{icon.title}</Typography>
                            </Fragment>
                          )}
                        </Fragment>
                      );
                    })}
                  </MUI.BoxLeft>
                  <MUI.BoxRight>
                    <Button
                      onClick={onClose}
                      className="default"
                      variant="outlined"
                      size="medium"
                    >
                      Continue
                    </Button>
                  </MUI.BoxRight>
                </Fragment>
              )}
            </MUI.BottomPanelItem>
          </MUI.BottomPanel>
        </MUI.BottomWrapper>
      </MUI.BottomContainer>
    </Fragment>
  );
}

export default DeepLink;