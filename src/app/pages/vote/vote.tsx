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
import { ITopVoteType, IVoteDataType } from "types/voteType";
import { decryptDataLink } from "utils/secure.util";
import ShareVote from "./shareVote";
import VoteDetails from "./votedetail";
import { styled, useMediaQuery } from "@mui/material";
import Top1StartIcon from "assets/images/vote/top1StarIcon.svg?react";
import { SubstringFilename } from "utils/substr";
import "./vote.css";

const CardTopContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    marginTop: "5rem",
    padding: 0,
  },
}));

const CardTopItemLeft = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  width: "250px",
  height: "250px",
  borderRadius: "8px 0 0 8px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "120px",
    minWidth: "120px",
    height: "150px",
  },
}));
const CardTopItemCenter = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "250px",
  height: "250px",
  backgroundColor: "white",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "120px",
    minWidth: "120px",
    height: "150px",
  },
}));
const CardTopItemRight = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  width: "250px",
  height: "250px",
  borderRadius: "0 8px 8px 0",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "120px",
    minWidth: "120px",
    height: "150px",
  },
}));
const TopItemBlur = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: -25,
  width: "300px",
  zIndex: 1,
  borderLeft: "25px solid transparent",
  borderRight: "25px solid transparent",
  borderTop: "200px solid #D9D9D9",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "150px",
    minWidth: "150px",
    left: -15,
    borderTop: "120px solid #D9D9D9",
  },
}));
const TopItem = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  position: "absolute",
  top: -40,
  left: 0,
  borderRadius: "6px 6px 0 0",
  width: "250px",
  height: "280px",
  zIndex: 2,
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    top: -20,
    maxWidth: "120px",
    minWidth: "120px",
    height: "150px",
  },
}));

const ImageContainer = styled("img")(({ theme }) => ({
  borderRadius: "50%",
  width: "150px",
  height: "150px",
  zIndex: 2,
  [theme.breakpoints.down("sm")]: {
    maxWidth: "80px",
    minWidth: "80px",
    height: "80px",
  },
}));
const ImageContainer23 = styled("img")(({ theme }) => ({
  borderRadius: "50%",
  width: "130px",
  height: "130px",
  zIndex: 2,
  [theme.breakpoints.down("sm")]: {
    maxWidth: "80px",
    minWidth: "80px",
    height: "80px",
  },
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

  let top3Items = [];

  if (Array.isArray(topVote?.topVotes)) {
    const sortedTopVotes = topVote.topVotes
      .slice()
      .sort((a: ITopVoteType, b: ITopVoteType) => b.score - a.score);

    for (let i = 0; i < Math.min(3, sortedTopVotes.length); i++) {
      top3Items.push({
        score: sortedTopVotes[i].score,
        filename: sortedTopVotes[i].filename,
        path: `${newUrl}${data?.voteData?.createdBy?.newName}-${data?.voteData?.createdBy?._id}/${sortedTopVotes[i].newFilename}`,
      });
    }
  }

  const handleClose = () => {
    setIsUploadOpen(false);
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
                  justifyContent: "flex-between",
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
                    width: { lg: "60%", sx: "100%" },
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardTopContainer>
                    <CardTopItemLeft>
                      <Box>
                        <Box
                          sx={{
                            mt: 2,
                            mb: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Top1StartIcon />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <ImageContainer23
                            src={top3Items[0]?.path}
                            alt={top3Items[0]?.filename}
                          />
                          <Box
                            sx={{
                              m: 1,
                              position: "absolute",
                              bottom: { lg: -60, xs: -40 },
                              left: { lg: 45, xs: 0 },
                              zIndex: 4,
                            }}
                          >
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <div className="ribbon23">No. 2</div>
                            </Box>
                            <Typography
                              component="p"
                              sx={{
                                mt: { lg: 1, xs: 0 },
                                fontSize: {
                                  lg: "14px",
                                  xs: "10px",
                                },
                                display: "flex",
                                justifyContent: "center",
                                textOverflow: "ellipsis",
                                width: "100%",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {SubstringFilename(top3Items[0]?.filename)}
                            </Typography>
                            <Typography
                              component="p"
                              sx={{
                                width: "100%",
                                fontSize: {
                                  lg: "14px",
                                  xs: "10px",
                                },
                                display: "flex",
                                justifyContent: "center",
                                color: "#17766B",
                                fontWeight: "600",
                              }}
                            >
                              {top3Items[0]?.score} Vote
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardTopItemLeft>
                    <CardTopItemCenter>
                      <TopItem>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            sx={{
                              mt: 2,
                              mb: 1,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Top1StartIcon />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <ImageContainer
                              src={top3Items[0]?.path}
                              alt={top3Items[0]?.filename}
                            />
                          </Box>
                          <Box
                            sx={{
                              m: 1,
                              position: "absolute",
                              bottom: { lg: 30, xs: -15 },
                              left: 0,
                              zIndex: 4,
                            }}
                          >
                            <Box>
                              <div className="ribbon">No. 1</div>
                            </Box>
                            <Typography
                              component="p"
                              sx={{
                                mt: { lg: 3, xs: 0 },
                                fontSize: { lg: "14px", xs: "10px" },
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {SubstringFilename(top3Items[0]?.filename)}
                            </Typography>
                            <Typography
                              component="p"
                              sx={{
                                width: "100%",
                                fontSize: { lg: "14px", xs: "10px" },
                                display: "flex",
                                justifyContent: "center",
                                color: "#17766B",
                                fontWeight: "600",
                              }}
                            >
                              {top3Items[0]?.score} Vote
                            </Typography>
                          </Box>
                        </Box>
                      </TopItem>
                      <TopItemBlur />
                    </CardTopItemCenter>
                    <CardTopItemRight>
                      <Box>
                        <Box
                          sx={{
                            mt: 2,
                            mb: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Top1StartIcon />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <ImageContainer23
                            src={top3Items[2]?.path}
                            alt={top3Items[2]?.filename}
                          />
                          <Box
                            sx={{
                               m: 1,
                              position: "absolute",
                              bottom: { lg: -60, xs: -40 },
                              left: { lg: 45, xs: 0 },
                              zIndex: 4,
                            }}
                          >
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <div className="ribbon23">No. 3</div>
                            </Box>
                            <Typography
                              component="p"
                              sx={{
                                width: "100%",
                                fontSize: {
                                  lg: "14px",
                                  xs: "10px",
                                },
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {SubstringFilename(top3Items[0]?.filename)}
                            </Typography>
                            <Typography
                              component="p"
                              sx={{
                                width: "100%",
                                fontSize: {
                                  lg: "14px",
                                  xs: "10px",
                                },
                                display: "flex",
                                justifyContent: "center",
                                color: "#17766B",
                                fontWeight: "600",
                              }}
                            >
                              {top3Items[0]?.score} Vote
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardTopItemRight>
                  </CardTopContainer>
                </Box>
              </Box>
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
                                minHeight: "200px",
                                maxHeight: "200px",
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
                              sx={{
                                px: 2,
                                textOverflow: "ellipsis",
                                maxWidth: {
                                  xs: "180px",
                                  sm: "200px",
                                  md: "300px",
                                  lg: "400px",
                                },
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
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
