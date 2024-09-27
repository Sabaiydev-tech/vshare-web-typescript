import * as React from "react";
// material ui components
import shareLogo from "assets/images/logo-vshare-all-white-11.svg";
import blackShareLogo from "assets/images/vshare-black-logo.png";
import "styles/presentation/presentation.style.css";

// material ui components
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListSubheader from "@mui/material/ListSubheader";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

// material ui icons
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Typography } from "@mui/material";
import { ENV_KEYS } from "constants/env.constant";
import { NavLink, useLocation } from "react-router-dom";

function AppBar() {
  const location = useLocation();
  const [state, setState] = React.useState({ right: false });
  const [token, setToken] = React.useState("");
  React.useEffect(() => {
    // const loggedInUser = localStorage.getItem("accessToken");
    const loggedInUser = localStorage.getItem(
      ENV_KEYS.VITE_APP_ACCESS_TOKEN as string,
    );
    if (loggedInUser) {
      const foundUser = loggedInUser;
      setToken(foundUser);
    }
  }, []);

  // responsive toggleDrawer
  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLButtonElement>,
    ) => {
      if (
        event &&
        event.type === "keydown" &&
        event instanceof KeyboardEvent &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: string) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          marginTop: "1rem",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component={NavLink}
            to="/"
            id="nested-list-subheader"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              src={blackShareLogo}
              alt="share logo"
              width={120}
              height={30}
            />
            <IconButton onClick={toggleDrawer(anchor, false)}>
              <CloseIcon />
            </IconButton>
          </ListSubheader>
        }
      >
        <ListItemButton
          component={NavLink}
          to="/pricing-plans"
          selected={"/pricing-plans" === location.pathname}
          sx={{
            padding: "0.2rem 0 0.2rem 1rem",
            borderBottom: "1px solid #DBDBDB",
            width: "100%",
          }}
        >
          <span>Pricing</span>
        </ListItemButton>
        <ListItemButton
          component={NavLink}
          to="/contact-us"
          selected={"/contact-us" === location.pathname}
          sx={{
            padding: "0.2rem 0 0.2rem 1rem",
            borderBottom: "1px solid #DBDBDB",
            width: "100%",
          }}
        >
          <span>Contact us</span>
        </ListItemButton>
        <ListItemButton
          component={NavLink}
          to="/filedrops"
          selected={"/filedrops" === location.pathname}
          sx={{
            padding: "0.2rem 0 0.2rem 1rem",
            borderBottom: "1px solid #DBDBDB",
            width: "100%",
          }}
        >
          <span>File drop</span>
        </ListItemButton>
        <ListItemButton
          component={NavLink}
          to="/feedback"
          selected={"/feedback" === location.pathname}
          sx={{
            padding: "0.2rem 0 0.2rem 1rem",
            borderBottom: "1px solid #DBDBDB",
            width: "100%",
          }}
        >
          <span>Feedback</span>
        </ListItemButton>
        {token == "" ? (
          <>
            <ListItemButton
              component={NavLink}
              // to="/auth/sign-in"
              to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-in`}
              sx={{
                padding: "0.2rem 0 0.2rem 1rem",
                borderBottom: "1px solid #DBDBDB",
                width: "100%",
              }}
            >
              <span>Sign in</span>
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              // to="/auth/sign-up"
              to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-up`}
              sx={{
                padding: "0.2rem 0 0.2rem 1rem",
                borderBottom: "1px solid #DBDBDB",
                width: "100%",
              }}
            >
              <span>Sign up</span>
            </ListItemButton>
          </>
        ) : (
          <ListItemButton
            component={NavLink}
            to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-in`}
          >
            <Typography
              variant="h6"
              sx={{
                padding: "0.2rem 0 0.2rem 0",
                borderBottom: "1px solid #DBDBDB",
                width: "100%",
              }}
            >
              Dashboard
            </Typography>
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  const navActive = (pathName: string): React.CSSProperties => {
    const isActive = location.pathname === pathName;
    return {
      color: isActive ? "#ffffff" : "white",
      borderBottom: isActive ? "1px solid #ffffff" : "none",
      borderRadius: "0 !important",
    };
  };

  return (
    <MuiAppBar className="appbar appbar-bg">
      <Container maxWidth="lg" className="container">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 2,
              display: { xs: "flex", md: "none" },
            }}
            component={NavLink}
            to="/"
          >
            <img src={shareLogo} alt="share logo" width={120} height={30} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Box component={NavLink} to="/">
              <img src={shareLogo} alt="share logo" width={200} height={50} />
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Tooltip title="Pricing">
              <Button
                className="menuList"
                component={NavLink}
                to="/pricing-plans"
                sx={{ ...navActive("/pricing-plans") }}
              >
                Pricing
              </Button>
            </Tooltip>
            <Tooltip title="Contact us">
              <Button
                className="menuList"
                component={NavLink}
                to="/contact-us"
                sx={{ ...navActive("/contact-us") }}
              >
                Contact us
              </Button>
            </Tooltip>
            <Tooltip title="File drop">
              <Button
                className="menuList"
                component={NavLink}
                to="/filedrops"
                style={{ ...navActive }}
                sx={{ ...navActive("/filedrops") }}
              >
                File drop
              </Button>
            </Tooltip>
            <Tooltip title="Feedback">
              <Button
                className="menuList"
                component={NavLink}
                to="/feedback"
                sx={{ ...navActive("/feedback") }}
              >
                Feedback
              </Button>
            </Tooltip>
            {token == "" ? (
              <>
                <Tooltip title="Sign in">
                  <Button
                    className="menuList"
                    component={NavLink}
                    to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-in`}
                    sx={{
                      borderRadius: "4px",
                      border: "1px solid #ffffff",
                      borderBottom: "1px solid #ffffff !important",
                      "&:hover": {
                        border: "1px solid #ffffff",
                        borderBottom: "1px solid #ffffff !important",
                      },
                    }}
                  >
                    Sign in
                  </Button>
                </Tooltip>
                <Tooltip title="Get started">
                  <Button
                    className="menuList"
                    component={NavLink}
                    to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-up`}
                    sx={{
                      ...navActive("/auth/sign-up"),
                      borderRadius: "4px",
                      border: "1px solid #ffffff",
                      background: "#ffffff",
                      color: "#17766B !important",
                      fontWeight: "700 !important",
                      "&:hover": {
                        border: "1px solid #ffffff",
                        background: "#ffffff",
                        color: "#17766B",
                      },
                    }}
                  >
                    Get started
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Dashboard">
                <Button
                  className="menuList"
                  component={NavLink}
                  // to="/dashboard"
                  to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-in`}
                  sx={{
                    ...navActive("/dashboard"),
                    borderRadius: "4px",
                    border: "1px solid #ffffff",
                    background: "#ffffff",
                    color: "black",
                    "&:hover": {
                      border: "1px solid #ffffff",
                      background: "#ffffff",
                      color: "#17766B",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#17766B" }}>
                    Dashboard
                  </Typography>
                </Button>
              </Tooltip>
            )}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer("right", true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {list("right")}
      </SwipeableDrawer>
    </MuiAppBar>
  );
}

export default AppBar;
