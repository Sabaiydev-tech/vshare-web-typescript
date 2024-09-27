import he from "he";
import * as MUI from "styles/presentation/presentation.style";

// component
import { limitContent } from "utils/string.util";

// material ui icon and component
import { createTheme, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ENV_KEYS } from "constants/env.constant";

type FeatureProps = {
  title: string;
  content: string;
  image: string;
};

const Future = (props: FeatureProps) => {
  const { title, content, image } = props;
  const theme = createTheme();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const newPath = ENV_KEYS.VITE_APP_LOAD_URL + "preview?path=image/";

  return (
    <MUI.CardFeature sx={{ minWidth: 70 }}>
      <MUI.CardContentFeature sx={{ height: isMobile ? "14rem" : "auto" }}>
        <MUI.BoxFeatureCompIcon>
          <img src={image ? newPath + image : ""} alt="image-feature" />
        </MUI.BoxFeatureCompIcon>
        <Box>
          <Typography
            sx={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: 600,
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          >
            {he.decode(limitContent(title, 30))}
          </Typography>
          <br />
          <Box
            sx={{
              textAlign: "start",
              marginTop: "0.5rem",
              width: "100%",
              textJustify: "distribute",
              hyphens: "auto",
              textAlignLast: "left",
              fontWeight: 400,
              fontSize: "0.9rem",
              lineHeight: 1.25,
              [theme.breakpoints.down("sm")]: {
                fontWeight: 400,
                fontSize: "0.8rem",
                wordSpacing: "-3px",
                textAlign: "justify",
                textJustify: "distribute",
                hyphens: "auto",
                textAlignLast: "left",
              },
            }}
          >
            <Typography>{he.decode(limitContent(content, 120))}</Typography>
          </Box>
        </Box>
      </MUI.CardContentFeature>
    </MUI.CardFeature>
  );
};

export default Future;
