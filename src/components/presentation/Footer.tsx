import fileHosting from "assets/images/file-hosting.svg";
import React from "react";
import * as MUI from "styles/presentation/presentation.style";

// material ui icons and component
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton, Link, Typography } from "@mui/material";
import { FaLine } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <React.Fragment>
      <MUI.BoxFooter>
        <MUI.ContainerFooter maxWidth="lg">
          <MUI.BoxLeftFooter>
            <MUI.BoxShowLogo>
              <img src={fileHosting} alt="" />
            </MUI.BoxShowLogo>
            <MUI.BoxShowSocialMedia>
              {/* facebook */}
              <Link
                href="https://www.facebook.com/sabaiydev"
                target="_blank"
                sx={{ color: "#ffffff" }}
              >
                <IconButton>
                  <FacebookIcon sx={{ color: "#ffffff", fontSize: "30px" }} />
                </IconButton>
              </Link>

              {/* what's app */}
              <Link
                href="https://api.whatsapp.com/send?phone=2077717897"
                target="_blank"
                sx={{ color: "#fff" }}
              >
                <IconButton>
                  <WhatsAppIcon sx={{ color: "#ffffff", fontSize: "30px" }} />
                </IconButton>
              </Link>

              {/* Link in */}
              <Link
                href="https://www.linkedin.com/company/sabaiydev-technology/?viewAsMember=true"
                target="_blank"
                sx={{ color: "#ffffff" }}
              >
                <IconButton>
                  <LinkedInIcon sx={{ color: "#ffffff", fontSize: "30px" }} />
                </IconButton>
              </Link>

              {/* Line */}
              <Link
                href="https://liff.line.me/1645278921-kWRPP32q/?accountId=517vddxa"
                target="_blank"
                sx={{ color: "#fff" }}
              >
                <IconButton>
                  <FaLine style={{ color: "#ffffff", fontSize: "24px" }} />
                </IconButton>
              </Link>
            </MUI.BoxShowSocialMedia>
          </MUI.BoxLeftFooter>
          <MUI.BoxCenterFooter>
            <span style={{ textTransform: "uppercase", fontSize: "1rem" }}>
              support
            </span>
            <span
              style={{
                color: "#FFCC6A",
                padding: "0.5rem 0",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
            >
              Live Chat
            </span>
            <span
              style={{
                fontWeight: "400",
                margin: "0.5rem 0",
                fontSize: "1rem",
              }}
            >
              Coming Soon
            </span>
            <span
              style={{
                fontWeight: "400",
                margin: "0.5rem 0",
                fontSize: "1rem",
              }}
            >
              8:30 am - 17:00 pm (Mon-Fri)
            </span>
            <span
              style={{
                fontWeight: "400",
                margin: "0.5rem 0",
                fontSize: "1rem",
              }}
            >
              & 8:30 am - 12:00 am (Sat)
            </span>
          </MUI.BoxCenterFooter>
          <MUI.BoxRightFooter>
            <NavLink to="/terms-conditions">
              <span>Terms & conditions</span>
            </NavLink>
            <br />
            <NavLink to="/privacy-policy">
              <span>Privacy Policy</span>
            </NavLink>
            <br />
            <NavLink to="/contact-us">
              <span>Contact us</span>
            </NavLink>
            <br />
            <NavLink to="/filedrops">
              <span>File drop</span>
            </NavLink>
            <br />
            <NavLink to="/feedback">
              <span>Feedback</span>
            </NavLink>
          </MUI.BoxRightFooter>
        </MUI.ContainerFooter>
        <MUI.BoxFooterCopyRight>
          <MUI.ContainerFooterCopyRight maxWidth="lg">
            <Typography>
              Copy right © 2023 Vshare-Free file hosting and file sharing
            </Typography>
          </MUI.ContainerFooterCopyRight>
        </MUI.BoxFooterCopyRight>
        {/* <MUI.BoxLiveChat>
          <ChatIcon
            sx={{ fontSize: isMobile ? "25px" : "35px", color: "#16776C" }}
          />
        </MUI.BoxLiveChat> */}
      </MUI.BoxFooter>
    </React.Fragment>
  );
}

export default Footer;
