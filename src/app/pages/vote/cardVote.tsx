import {
  Grid,
  ImageListItem,
  ImageListItemBar,
  createTheme,
} from "@mui/material";
import { ENV_KEYS } from "constants/env.constant";
import useAuth from "hooks/useAuth";
import useResizeImage from "hooks/useResizeImage";
import React from "react";
import {
  IVoteResultFilesDataType,
  IVoteResultType,
  IVoteWithFile,
} from "types/voteType";

interface TypeProps {
  item: IVoteWithFile;
  data: IVoteResultType;
}
export default function CardVote({ item, data }: TypeProps) {
  const theme = createTheme();
  const { user }: any = useAuth();
  const sourcePath = `${data?.voteData?.createdBy?.newName}-${data?.voteData?.createdBy?._id}/${item?.newFilename}`;
  const newUrl = `${ENV_KEYS.VITE_APP_LOAD_URL}preview?path=`;

  return (
    <React.Fragment>
      <ImageListItem
        sx={{
          border: `1px solid ${
            item.isSelected ? "#17766B" : theme.palette.grey[400]
          }`,
          borderRadius: "6px",
          overflow: "hidden",
          cursor: "pointer",
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
            borderBottom: `1px solid ${
              item.isSelected ? "#17766B" : theme.palette.grey[400]
            }`,
          }}
        ></div>
        <ImageListItemBar
          sx={{ px: 2, textOverflow: "ellipsis", maxWidth: "200px" }}
          title={data?.voteData?.topic}
          subtitle={
            <span style={{ fontSize: "12px" }}>
              {item.filename.substring(0, item.filename.lastIndexOf("."))}
            </span>
          }
          position="below"
        />
      </ImageListItem>
    </React.Fragment>
  );
}
