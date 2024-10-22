import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  createTheme,
} from "@mui/material";
import ResultIcon from "assets/images/ShareVote.svg?react";
import { ENV_KEYS } from "constants/env.constant";
import useAuth from "hooks/useAuth";
import { useFetchVoteFiles } from "hooks/vote/useFetchVote";
import useFilter from "hooks/vote/useFilter";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsFillShareFill } from "react-icons/bs";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoHelpCircleSharp } from "react-icons/io5";
import {
  IVoteResultFilesDataType,
  IVoteResultType,
  IVoteWithFile,
} from "types/voteType";
import { decryptDataLink } from "utils/secure.util";
import CardVote from "./cardVote";

export default function VoteDetails() {
  const theme = createTheme();
  const filter = useFilter();
  const params = new URLSearchParams(location.search);
  const voteParams = params.get("lc");
  const decryptedData = decryptDataLink(voteParams);
  const { data: voteFiles } = useFetchVoteFiles({
    id: decryptedData?._id,
    filter: filter,
  });
  const [newVoteData, setNewVoteData] = useState(voteFiles);

  useEffect(() => {
    setNewVoteData(voteFiles);
  }, [voteFiles]);

  const handleSelecte = (data: IVoteWithFile) => {
    setNewVoteData((prev: IVoteResultType) => ({
      ...prev,
      filesData: {
        ...prev.filesData,
        data: prev.filesData.data.map((file) => {
          if (file._id === data._id) {
           
            return { ...file, isSelected: !file?.isSelected }; 
          }
          return file; 
        }),
      },
    }));
  };

  console.log(newVoteData);

  return (
    <React.Fragment>
      <Card sx={{ my: 5, boxShadow: "rgba(149, 157, 165, 0.2) 5px 8px 24px" }}>
        <Box sx={{ m: 4 }}>
          <Box sx={{ bgcolor: "#D9D9D942", py: 3, borderRadius: "5px" }}>
            <Box sx={{ mx: 5 }}>
              <Typography
                component="h6"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: theme.palette.grey[700],
                }}
              >
                Title
              </Typography>
              <Typography
                component="h6"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: theme.palette.grey[600],
                }}
              >
                Description
              </Typography>
              <Typography
                component="h6"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: theme.palette.grey[600],
                }}
              >
                Expired
              </Typography>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: 2,
                }}
              >
                <IoHelpCircleSharp size={20} />
                <Typography
                  component="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: theme.palette.grey[600],
                  }}
                >
                  One vote
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ my: 5, display: "flex", justifyContent: "space-between" }}>
            <FormControl sx={{ mt: 3, minWidth: 150 }}>
              <Select
                sx={{ height: 40, fontSize: "1rem" }}
                value={filter.data.select}
                onChange={(e) =>
                  filter.dispatch({
                    type: filter.ACTION_TYPE.SELECT,
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
                <MenuItem sx={{ fontSize: "1rem" }} value="score_DESC">
                  Max vote
                </MenuItem>
                <MenuItem sx={{ fontSize: "1rem" }} value="score_ASC">
                  Min vote
                </MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <InputLabel>Start Date</InputLabel>
                <input
                  type="date"
                  style={{
                    marginTop: "4px",
                    height: "40px",
                    width: "200px",
                    fontSize: "1rem",
                    padding: "0 8px",
                    fontFamily: "inherit",
                    borderRadius: "4px",
                    border: `1px solid ${theme.palette.grey[400]}`,
                    transition: "borderColor 0.3s ease",
                  }}
                  value={filter.data.start_date}
                  onChange={(e) =>
                    filter.dispatch({
                      type: filter.ACTION_TYPE.START_DATE,
                      payload: e.target.value,
                    })
                  }
                />
              </Box>
              <Box>
                <InputLabel>End Date</InputLabel>
                <input
                  type="date"
                  style={{
                    marginTop: "4px",
                    height: "40px",
                    width: "200px",
                    fontSize: "1rem",
                    padding: "0 8px",
                    fontFamily: "inherit",
                    borderRadius: "4px",
                    border: `1px solid ${theme.palette.grey[400]}`,
                    transition: "borderColor 0.3s ease",
                  }}
                  value={filter.data.end_date}
                  onChange={(e) =>
                    filter.dispatch({
                      type: filter.ACTION_TYPE.END_DATE,
                      payload: e.target.value,
                    })
                  }
                />
              </Box>
            </Box>
          </Box>
          <Typography
            component="h6"
            sx={{
              mt: 4,
              fontSize: "1rem",
              fontWeight: 600,
              color: theme.palette.grey[700],
            }}
          >
            Make a choise
          </Typography>
          <Typography
            component="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              color: theme.palette.grey[600],
            }}
          >
            Total votes:{newVoteData?.filesData?.total}
          </Typography>
          <Box sx={{ my: 3 }}>
            <Grid
              container
              spacing={2}
              sx={{ overflow: "auto", height: "600px" }}
            >
              {newVoteData?.filesData?.data &&
                newVoteData?.filesData?.data?.map(
                  (item: IVoteWithFile, index: number) => {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        onClick={() => handleSelecte(item)}
                      >
                        <CardVote item={item} data={newVoteData} />
                      </Grid>
                    );
                  },
                )}
            </Grid>
          </Box>
        </Box>
        <Box sx={{ mx: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="button"
              variant="outlined"
              sx={{ borderRadius: "50px", fontSize: "14px" }}
            >
              Load more
            </Button>
          </Box>
          <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="button"
                variant="contained"
                sx={{ borderRadius: "8px", fontSize: "14px" }}
                endIcon={
                  <HiOutlineArrowNarrowRight
                    size={20}
                    style={{ marginTop: "2px" }}
                  />
                }
              >
                Vote
              </Button>
              <Button
                type="button"
                variant="outlined"
                sx={{ borderRadius: "8px", fontSize: "14px" }}
                endIcon={<ResultIcon />}
              >
                Show Results
              </Button>
            </Box>
            <Button
              type="button"
              variant="outlined"
              sx={{ borderRadius: "8px", fontSize: "14px" }}
              startIcon={<BsFillShareFill size={18} />}
            >
              Share
            </Button>
          </Box>
        </Box>
      </Card>
    </React.Fragment>
  );
}
