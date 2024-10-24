import {
  Box,
  Button,
  Card,
  createTheme,
  FormControl,
  Grid,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  Select,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Top1StartIcon from "assets/images/vote/top1StarIcon.svg?react";
import VoteDialog from "components/vote/VoteDialog";
import { ENV_KEYS } from "constants/env.constant";
import { useFetchTopVote, useFetchVoteResult } from "hooks/vote/useFetchVote";
import useFilter from "hooks/vote/useFilter";
import React from "react";
import { ITopVoteType } from "types/voteType";
import { decryptDataLink } from "utils/secure.util";
import { SubstringFilename, SubstringFilenameCard } from "utils/substr";
import ShareVote from "./shareVote";
import "./vote.css";
import VoteDetails from "./votedetail";
import { IoMdRadioButtonOn } from "react-icons/io";
import UploadVote from "./uploadVote";
const CardTopContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  marginTop: "5rem",
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
  const isMobile = useMediaQuery("(max-width: 600px)");

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
  const isToken = localStorage.getItem("alBBtydfsTtW@wdVV");
  const newUrl = `${ENV_KEYS.VITE_APP_LOAD_URL}preview?path=`;

  let top3Items = [];
  let currentRank = 1;
  if (Array.isArray(topVote?.topVotes)) {
    const sortedTopVotes = topVote.topVotes
      .slice()
      .sort((a: ITopVoteType, b: ITopVoteType) => b.score - a.score);

    for (let i = 0; i < Math.min(3, sortedTopVotes.length); i++) {
      const isSameScore =
        i < sortedTopVotes.length - 1 &&
        sortedTopVotes[i].score === sortedTopVotes[i + 1].score;
      const isSameScoreAsPrevious =
        i > 0 && sortedTopVotes[i].score === sortedTopVotes[i - 1].score;

      if (!isSameScoreAsPrevious) {
        currentRank = i + 1;
      }

      const hasSameScore = sortedTopVotes.some(
        (item: ITopVoteType, index: number) =>
          index !== i && item.score === sortedTopVotes[i].score,
      );
      top3Items.push({
        score: sortedTopVotes[i].score,
        filename: sortedTopVotes[i].filename,
        path: `${newUrl}${data?.voteData?.createdBy?.newName}-${data?.voteData?.createdBy?._id}/${sortedTopVotes[i].newFilename}`,
        top: currentRank,
        topLeve: hasSameScore,
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
          {data?.voteData?.topic}
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
            {data?.voteData?.description}
          </Typography>
        </Box>
        {data?.filesData?.data?.length !== 0 ? (
          <Box>
            {(topVote?.hotVotes?.length > 0 ||
              topVote?.hotVotes?.length > 0) && (
              <Card
                sx={{
                  my: 5,
                  backgroundImage:
                    "linear-gradient(180deg, #17766B 0%, #20A697 13%)",
                  boxShadow: "rgba(149, 157, 165, 0.2) 5px 8px 24px",
                }}
              >
                <Box sx={{ m: 4 }}>
                  {!data?.voteData?.hideResultbtn && (
                    <Box sx={{ my: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          justifyContent: "flex-start",
                        }}
                      >
                        <FormControl>
                          <Select
                            sx={{
                              height: 40,
                              fontSize: "1rem",
                              minWidth: "100px",
                              border: "none",
                              borderRadius: "6px",
                              bgcolor: "white !important",
                              "&:focus": {
                                bgcolor: "white",
                                border: "1px solid white",
                              },
                              "&hover": {
                                border: "1px solid white",
                              },
                            }}
                            value={filter.data.offset}
                            onChange={(e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.LIMIT,
                                payload: e.target.value,
                              })
                            }
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                                },
                              },
                            }}
                          >
                            <MenuItem sx={{ fontSize: "1rem" }} value="3">
                              Top3
                            </MenuItem>
                            <MenuItem sx={{ fontSize: "1rem" }} value="10">
                              Top10
                            </MenuItem>
                          </Select>
                        </FormControl>

                        <Button
                          sx={{ height: 40 }}
                          variant="contained"
                          onClick={() => {
                            if (!isToken) {
                              window.location.href = `${ENV_KEYS.VITE_APP_URL_REDIRECT_LANDING_PAGE}auth/sign-in/${voteParams}`;
                            } else {
                              setIsUploadOpen(true);
                            }
                          }}
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
                                    src={top3Items[1]?.path}
                                    alt={top3Items[1]?.filename}
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
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div className="ribbon23">
                                        No. {top3Items[1]?.top}
                                      </div>
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
                                      {SubstringFilename(
                                        top3Items[1]?.filename,
                                      )}
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
                                      {top3Items[1]?.score} Vote
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
                                      <div className="ribbon">
                                        No. {top3Items[0]?.top}
                                      </div>
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
                                      {SubstringFilename(
                                        top3Items[0]?.filename,
                                      )}
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
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div className="ribbon23">
                                        No. {top3Items[2]?.top}
                                      </div>
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
                                      {SubstringFilename(
                                        top3Items[2]?.filename,
                                      )}
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
                                      {top3Items[2]?.score} Vote
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </CardTopItemRight>
                          </CardTopContainer>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {topVote?.hotVotes?.length > 0 && (
                    <Box sx={{ my: 5 }}>
                      <Typography
                        component="h6"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 500,
                          color: "white !important",
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
                                <Box
                                  sx={{
                                    bgcolor: "white !important",
                                    borderRadius: "6px",
                                    pt: 1,
                                  }}
                                >
                                  <ImageListItem
                                    sx={{
                                      m: 2,
                                      borderRadius: "6px",
                                      bgcolor: "white !important",
                                      position: "relative",
                                      minHeight: isMobile ? "100px" : "200px",
                                      maxHeight: isMobile ? "100px" : "200px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <img
                                      src={newUrl + sourcePath}
                                      alt={item.filename}
                                      loading="lazy"
                                      style={{
                                        minHeight: isMobile ? "100px" : "200px",
                                        maxHeight: isMobile ? "100px" : "200px",
                                        objectFit: "cover",
                                      }}
                                    />

                                    <Box
                                      sx={{
                                        bgcolor: "rgba(0, 0, 0, 0.4)",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "40px",
                                        borderTopLeftRadius: "6px",
                                        borderTopRightRadius: "6px",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          py: 2,
                                          px: 3,
                                          color: "white !important",
                                        }}
                                      >
                                        {item?.score} Votes
                                      </Typography>
                                    </Box>
                                  </ImageListItem>
                                  <div
                                    style={{
                                      marginTop: "2px",
                                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                    }}
                                  ></div>
                                  <Box
                                    sx={{
                                      mx: 3,
                                      p: 2,
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      component="h6"
                                      sx={{
                                        fontSize: "1rem",
                                        fontWeight: 400,
                                        color: theme.palette.grey[700],
                                      }}
                                    >
                                      {SubstringFilenameCard(item.filename)}
                                    </Typography>
                                    <IoMdRadioButtonOn
                                      style={{ color: "#17766B" }}
                                      size={18}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            );
                          },
                        )}
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Card>
            )}
            <VoteDetails/>
            <ShareVote data={data} />
            <VoteDialog handleClose={handleClose} isOpen={isUploadOpen} />
          </Box>
        ) : (
          <Box>
            <UploadVote hideClose={true} handleClose={handleClose} />
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
}
