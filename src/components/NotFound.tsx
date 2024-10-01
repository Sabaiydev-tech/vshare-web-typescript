import { Box, Button, Typography, createTheme } from "@mui/material";
import { styled } from "@mui/system";
import { NavLink } from "react-router-dom";

type Props = {
    msg?: string
};

const ExpiredArea = styled(Box)(({ theme }) => ({
    backgroundColor: '#F7F9FC',
    // marginTop: "5rem",
    padding: "5rem 0",
    textAlign: "center",
    h1: { margin: 0, color: "#5D596C" },
    h4: { margin: "0.5rem 0", color: "#6F6B7D" },
    [theme.breakpoints.down("sm")]: {
      padding: "5rem 1rem",
      h1: {
        fontSize: "18px",
      },
    },
  }));

const NotFound = (props: Props) => {
    const theme = createTheme();
  return (
    <ExpiredArea>
      <Box
        sx={{
          textAlign: "center",
          fontSize: "1.2rem",
          fontWeight: 700,
          [theme.breakpoints.down("sm")]: {
            fontSize: "1rem",
          },
        }}
      >
        <Typography variant="h3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 150"
            width="300"
            height="100"
          >
            <text
              x="80"
              y="110"
              fill="#17766b"
              fontSize="50px"
              fontFamily="Arial"
              fontWeight="bold"
            >
              ( •̀_•́ )
            </text>
          </svg>
        </Typography>
        {
            props?.msg ? props?.msg
            : `Unfortunately, the link was expired or not found.`
        }
      </Box>
      <Box
        sx={{
          textAlign: "center",
          fontSize: "0.9rem",
          margin: "0.5rem 0",
          fontWeight: 500,
        }}
      >
        You do not have permission to view this page using the credentials that
        you have provided while login.
      </Box>
      <Box sx={{ textAlign: "center", fontSize: "0.9rem", fontWeight: 500 }}>
        Please contact your site administrator.
      </Box>
      <Button
        variant="contained"
        component={NavLink}
        to="/filedrops"
        sx={{ mt: 7 }}
      >
        Get new link
      </Button>
      <br />
    </ExpiredArea>
  );
};


export default NotFound;