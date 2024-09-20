import { Box, Card, Grid, Typography } from "@mui/material";
import VideoCardComponent from "components/Downloader/VideoComponent";
import { useNavigate } from "react-router-dom";

function FeedCard() {
  const navigate = useNavigate();
  return (
    <Card sx={{ backgroundColor: "#fff", px: 0, borderRadius: "10px", mt: 10 }}>
      <Box sx={{ px: 4 }}>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Popular
        </Typography>
      </Box>
      <Grid container sx={{ mt: 4 }} spacing={4}>
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
          (_, indx) =>
            indx < 4 && (
              <Grid item key={indx} xs={12} sm={6} md={4} lg={3}>
                <VideoCardComponent
                  title="Lorem ipsum dolor sit amet."
                  control={true}
                  autoPlay={false}
                  muted={true}
                  url="https://videos.pexels.com/video-files/12364482/12364482-hd_1080_1920_60fps.mp4"
                  onView={() => navigate("/video_view")}
                />
              </Grid>
            ),
        )}
      </Grid>
    </Card>
  );
}

export default FeedCard;
