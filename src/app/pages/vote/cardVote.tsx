import {
  Box,
  Grid,
  ImageListItem,
  ImageListItemBar,
  Typography,
  createTheme,
} from "@mui/material";
import { ENV_KEYS } from "constants/env.constant";
import useAuth from "hooks/useAuth";
import useResizeImage from "hooks/useResizeImage";
import React from "react";
import {
  IVoteResultDataType,
  IVoteResultFilesDataType,
  IVoteResultType,
  IVoteWithFile,
} from "types/voteType";

interface TypeProps {
  item: IVoteResultDataType;
  data: IVoteResultType;
}
export default function CardVote({ item, data }: TypeProps) {
  const theme = createTheme();
  const sourcePath = `${data?.voteData?.createdBy?.newName}-${data?.voteData?.createdBy?._id}/${item?.newFilename}`;
  const newUrl = `${ENV_KEYS.VITE_APP_LOAD_URL}preview?path=`;

  return (
    <React.Fragment>
      <ImageListItem
        sx={{
          border: item.isSelected
            ? "none"
            : `1px solid ${theme.palette.grey[400]}`,
          bgcolor: `${item.isSelected ? theme.palette.grey[200] : "white"}`,
          borderRadius: "6px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
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
            {item.score} Votes
          </Typography>
        </Box>
        <div
          style={{
            marginTop: "2px",
            borderBottom: `1px solid ${theme.palette.grey[400]}`,
          }}
        />
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
          subtitle={
            <span style={{ fontSize: "12px" }}>
              {item.filename.includes(".")
                ? item.filename.substring(0, item.filename.lastIndexOf("."))
                : item.filename}
            </span>
          }
          position="below"
        />
      </ImageListItem>
    </React.Fragment>
  );
}
