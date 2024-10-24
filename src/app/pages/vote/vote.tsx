import {
  Box,
  Button,
  Card,
  createTheme,
  Grid,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { useFetchVoteFiles, useFetchVoteResult } from "hooks/vote/useFetchVote";
import useFilter from "hooks/vote/useFilter";
import React from "react";
import { decryptDataLink } from "utils/secure.util";
import ShareVote from "./shareVote";
import VoteDetails from "./votedetail";
import VoteDialog from "components/vote/VoteDialog";
import { IoFilter } from "react-icons/io5";
import VoteAction from "components/vote/VoteAction";
export default function Vote() {
  const theme = createTheme();
  const filter = useFilter();
  const params = new URLSearchParams(location.search);
  const voteParams = params.get("lc");
  const decryptedData = decryptDataLink(voteParams);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const { data } = useFetchVoteResult({
    id: decryptedData?._id,
    filter: filter,
  });
  const { data: voteFiles } = useFetchVoteFiles({
    id: decryptedData?._id,
    filter: filter,
  });

  const handleClose = () => {
    setIsUploadOpen(false);
  };
  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
      author: "@bkristastucchio",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
      author: "@rollelflex_graphy726",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
      author: "@helloimnik",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
      author: "@nolanissac",
    },
  ];
  const HotVote = [
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
      author: "@helloimnik",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
      author: "@nolanissac",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
      author: "@hjrc33",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
      author: "@arwinneil",
    },
  ];
  const handleEvents = (action: string) => {
    console.log(action);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          mx: "12rem",
          py: "2rem",
          [theme.breakpoints.down("md")]: {
            mx: "5rem",
          },
          [theme.breakpoints.down("sm")]: {
            mx: 2,
          },
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Vote
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            component="p"
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: 400,
              color: theme.palette.grey[600],
            }}
          >
            Choose and Vote for your Favorite
          </Typography>
        </Box>
        <Card
          sx={{ my: 5, boxShadow: "rgba(149, 157, 165, 0.2) 5px 8px 24px" }}
        >
          <Box sx={{ m: 4 }}>
            <Typography
              component="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: theme.palette.grey[700],
              }}
            >
              Vote image
            </Typography>
            <Typography
              component="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: theme.palette.grey[600],
              }}
            >
              Vote for you like the most! Join the fun and share your thoughts.
            </Typography>
            <Box sx={{ my: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  justifyContent: "flex-end",
                }}
              >
                <VoteAction
                  icon={<IoFilter size={20} style={{ cursor: "pointer" }} />}
                  onEvent={(action: string) => {
                    handleEvents(action);
                  }}
                />

                <Button
                  variant="contained"
                  onClick={() => setIsUploadOpen(true)}
                >
                  Upload
                </Button>
              </Box>
              <Typography
                component="h6"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: theme.palette.grey[700],
                }}
              >
                Top vote.
              </Typography>
              <Grid container spacing={2}>
                {itemData.map((item) => (
                  <Grid item xs={6} sm={4} md={3}>
                    <ImageListItem
                      key={item.img}
                      sx={{
                        border: `1px solid ${theme.palette.grey[500]}`,
                        borderRadius: "6px",
                      }}
                    >
                      <img
                        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.img}?w=248&fit=crop&auto=format`}
                        alt={item.title}
                        loading="lazy"
                        style={{ borderRadius: "12px", padding: "6px" }}
                      />
                      <div
                        style={{
                          marginTop: "2px",
                          borderBottom: `1px solid ${theme.palette.grey[500]}`,
                        }}
                      ></div>
                      <ImageListItemBar
                        sx={{ px: 2 }}
                        title={item.title}
                        subtitle={<span>by: {item.author}</span>}
                        position="below"
                      />
                    </ImageListItem>
                    <Typography
                      component="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#17766B",
                      }}
                    >
                      Top 1:3100 vote.
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box sx={{ my: 4 }}>
              <Typography
                component="h6"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: theme.palette.grey[700],
                }}
              >
                Hot vote.
              </Typography>

              <Grid container spacing={2}>
                {HotVote.map((item) => (
                  <Grid item xs={6} sm={4} md={3}>
                    <ImageListItem
                      key={item.img}
                      sx={{
                        border: `1px solid ${theme.palette.grey[500]}`,
                        borderRadius: "6px",
                      }}
                    >
                      <img
                        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.img}?w=248&fit=crop&auto=format`}
                        alt={item.title}
                        loading="lazy"
                        style={{ borderRadius: "12px", padding: "6px" }}
                      />
                      <div
                        style={{
                          marginTop: "2px",
                          borderBottom: `1px solid ${theme.palette.grey[500]}`,
                        }}
                      ></div>
                      <ImageListItemBar
                        sx={{ px: 2 }}
                        title={item.title}
                        subtitle={<span>by: {item.author}</span>}
                        position="below"
                      />
                    </ImageListItem>
                    <Typography
                      component="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#17766B",
                      }}
                    >
                      Top 1:3100 vote.
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Card>
        <VoteDialog handleClose={handleClose} isOpen={isUploadOpen} />
        <VoteDetails />
        <ShareVote data={data} />
      </Box>
    </React.Fragment>
  );
}
