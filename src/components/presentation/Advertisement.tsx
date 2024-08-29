import { Box, Button, Typography } from "@mui/material";
import {
  AdsCard,
  AdsContainer,
  AdsContent,
} from "app/pages/file-uploader/styles/fileUploader.style";

function Advertisement() {
  return (
    <AdsContainer>
      <AdsContent>
        <AdsCard>
          <Typography variant="h4" component={"h4"}>
            Mltidiscriplinary, Monthly
          </Typography>
          <Typography component={"p"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
            molestias.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center !important",
            }}
          >
            <Typography component={"div"} sx={{ opacity: 0.7 }}>
              TIJER Research Journal
            </Typography>
            <Button variant="contained">Open</Button>
          </Box>
        </AdsCard>
      </AdsContent>
    </AdsContainer>
  );
}

export default Advertisement;
