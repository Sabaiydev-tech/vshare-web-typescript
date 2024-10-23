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
import VoteAction from "components/vote/VoteAction";
import VoteDialog from "components/vote/VoteDialog";
import { ENV_KEYS } from "constants/env.constant";
import { useFetchTopVote, useFetchVoteResult } from "hooks/vote/useFetchVote";
import useFilter from "hooks/vote/useFilter";
import React from "react";
import { IoFilter } from "react-icons/io5";
import { ITopVoteType } from "types/voteType";
import { decryptDataLink } from "utils/secure.util";
import ShareVote from "./shareVote";
import VoteDetails from "./votedetail";
import { styled, useMediaQuery } from "@mui/material";

const CardTopContainer = styled(Box)(({}) => ({
  display: "flex",
  backgroundColor: "gray",
  position: "relative",
}));

const CardTopItemLeft = styled(Box)(({}) => ({
  backgroundColor: "white",
  width: "250px",
  height: "240px",
  borderRadius: "8px 0 0 8px",
}));
const CardTopItemCenter = styled(Box)(({}) => ({
  backgroundColor: "white",
  position: "relative",
  width: "250px",
  height: "240px",
}));
const CardTopItemRight = styled(Box)(({}) => ({
  backgroundColor: "white",
  width: "250px",
  height: "240px",
  borderRadius: "0 8px 8px 0",
}));
const TopItem = styled(Box)(({}) => ({
  backgroundColor: "white",
  position: "absolute",
  top: -30,
  left: "10%",
  borderRadius: "6px 6px 0 0",
  width: "250px",
  height: "270px",
  zIndex: 2,
}));
const TopItemBlur = styled(Box)(({  }) => ({
  backgroundColor: "gray",
  position: "absolute",
  top: 0,
  left: 0,
  width: "300px",
  height: "240px",
  zIndex: 1,
}));
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
  const { data: topVote } = useFetchTopVote({
    id: decryptedData?._id,
    filter: filter.data,
  });
  const newUrl = `${ENV_KEYS.VITE_APP_LOAD_URL}preview?path=`;

  const handleClose = () => {
    setIsUploadOpen(false);
  };
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
          sx={{
            my: 5,
            backgroundImage: "linear-gradient(180deg, #17766B 0%, #20A697 13%)",
            boxShadow: "rgba(149, 157, 165, 0.2) 5px 8px 24px",
          }}
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
              {data?.voteData?.topic}
            </Typography>
            <Typography
              component="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: theme.palette.grey[600],
              }}
            >
              {data?.voteData?.description}
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
                    filter.dispatch({
                      type: filter.ACTION_TYPE.LIMIT,
                      payload: action,
                    });
                  }}
                />

                <Button
                  variant="contained"
                  onClick={() => setIsUploadOpen(true)}
                >
                  Upload
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "60%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardTopContainer>
                    <CardTopItemLeft>NO 2</CardTopItemLeft>
                    <CardTopItemCenter>
                      <TopItem>NO 1</TopItem>
                      <TopItemBlur>NO KKLDS</TopItemBlur>
                    </CardTopItemCenter>
                    <CardTopItemRight>NO 3</CardTopItemRight>
                  </CardTopContainer>
                </Box>
              </Box>
              {topVote?.topVotes?.length > 0 && (
                <Box>
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
                    {topVote?.topVotes?.map(
                      (item: ITopVoteType, index: number) => {
                        const sourcePath = `${data?.voteData?.createdBy?.newName}-${data?.voteData?.createdBy?._id}/${item?.newFilename}`;

                        return (
                          <Grid key={index} item xs={6} sm={4} md={3}>
                            <ImageListItem
                              sx={{
                                border: `1px solid ${theme.palette.grey[500]}`,
                                borderRadius: "6px",
                              }}
                            >
                              <img
                                src={newUrl + sourcePath}
                                alt={item.filename}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  borderRadius: "12px",
                                  objectFit: "contain",
                                  padding: "6px",
                                }}
                              />
                              <div
                                style={{
                                  marginTop: "2px",
                                  borderBottom: `1px solid ${theme.palette.grey[500]}`,
                                }}
                              ></div>
                              <ImageListItemBar
                                sx={{ px: 2 }}
                                title={data?.voteData?.topic}
                                subtitle={
                                  <span>
                                    by:
                                    {item.filename.includes(".")
                                      ? item.filename.substring(
                                          0,
                                          item.filename.lastIndexOf("."),
                                        )
                                      : item.filename}
                                  </span>
                                }
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
                        );
                      },
                    )}
                  </Grid>
                </Box>
              )}
            </Box>
            {topVote?.hotVotes?.length > 0 && (
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
                  {topVote?.hotVotes?.map(
                    (item: ITopVoteType, index: number) => {
                      const sourcePath = `${data?.voteData?.createdBy?.newName}-${data?.voteData?.createdBy?._id}/${item?.newFilename}`;

                      return (
                        <Grid key={index} item xs={6} sm={4} md={3}>
                          <ImageListItem
                            sx={{
                              border: `1px solid ${theme.palette.grey[500]}`,
                              borderRadius: "6px",
                            }}
                          >
                            <img
                              src={newUrl + sourcePath}
                              alt={item.filename}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "200px",
                                borderRadius: "12px",
                                objectFit: "contain",
                                padding: "6px",
                              }}
                            />
                            <div
                              style={{
                                marginTop: "2px",
                                borderBottom: `1px solid ${theme.palette.grey[500]}`,
                              }}
                            ></div>
                            <ImageListItemBar
                              sx={{ px: 2 }}
                              title={data?.voteData?.topic}
                              subtitle={<span>by: {"item.author"}</span>}
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
                      );
                    },
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        </Card>
        <VoteDialog handleClose={handleClose} isOpen={isUploadOpen} />
        <VoteDetails topVote={topVote} />
        <ShareVote data={data} />
      </Box>
    </React.Fragment>
  );
}
