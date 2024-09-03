import React, { Fragment, useEffect, useRef, useState } from "react";

//mui component and style
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import { Box, Checkbox, IconButton, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { styled as muiStyled } from "@mui/system";
import FolderEmptyIcon from "assets/images/folder-empty.svg?react";
import FolderNotEmptyIcon from "assets/images/folder-not-empty.svg?react";

import lockIcon from "assets/images/lock-icon.png";
import useHover from "hooks/useHover";
import useOuterClick from "hooks/useOuterClick";
import useResizeImage from "hooks/useResizeImage";
import { FileIcon, defaultStyles } from "react-file-icon";
import { BsPinAngleFill } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import * as MdIcon from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as selectorAction from "stores/features/selectorSlice";
import { getFileType } from "utils/file.util";
import { cutStringWithEllipsis } from "utils/string.util";
import Loader from "./Loader";
import MenuDropdown from "./MenuDropdown";

export const SelectionContainer = styled("div")({
  position: "absolute",
  top: 0,
  left: 5,
});

const CustomCheckbox = styled(Checkbox)({
  "& .MuiSvgIcon-root": {
    fontSize: 25,
    fontWeight: "300",
  },
});

const Item = styled(Paper)(({ theme, ...props }: any) => ({
  boxShadow: "rgb(0 0 0 / 9%) 0px 2px 8px",
  borderRadius: "10px",
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "white",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "201.58px",
  minHeight: "201.58px",
  ".checkbox-selected": {
    // color: "rgba(0, 0, 0, 0.4)",
  },
  ":hover": {
    ".checkbox-selected": {
      display: "block",
      // backgroundColor: "transparent",
    },
  },

  ...(props.isclicked === true && {
    ...(props.isstyledselectedcard
      ? {
          ...props.isstyledselectedcard,
        }
      : {
          boxShadow: "0px 0px 0px 3px rgba(22,118,107,0.75) inset",
        }),
  }),
  ...(!props.isdisableonhovereffect && {
    ":after": {
      transition: "100ms ease-in-out",
      position: "absolute",
      content: "''",
      display: "block",
      width: "100%",
      height: "100%",
      borderRadius: "inherit",
      backgroundColor: "black",
      opacity: props.isonhover === "true" ? 0.1 : 0,
    },
  }),
  ...(props?.ishas ? { backgroundColor: "#DCEAE9" } : ""),
}));

const Image = muiStyled("img")({
  width: "100%",
  height: "100%",
  textAlign: "center",
  objectFit: "cover",
});

const LockImage = muiStyled("img")(({ theme }) => ({
  width: "70px",
  height: "70px",
  textAlign: "center",
  objectFit: "cover",

  [theme.breakpoints.down("md")]: {
    width: "60px",
    height: "60px",
  },
}));

const FileIconContainer = muiStyled("div")(({ theme }) => ({
  width: "50px",
  height: "60px",
  borderRadius: "4px",
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
}));

const ItemTitle = muiStyled("div")(({ ...props }: any) => ({
  ...(props.folder === "true"
    ? {
        backgroundColor: "#F3F3F3",
      }
    : {
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;",
        backgroundColor: "white",
      }),
  position: "absolute",
  bottom: 0,
  left: "50%",
  transform: "translate(-50%,-50%)",
  padding: "8px 20px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  zIndex: 1,
}));

const Pin = muiStyled("div")({
  position: "absolute",
  bottom: "8px",
  left: "8px",
  color: "#3C384A",
  fontSize: "18px",
  zIndex: 1,
});

const GridItem = styled("div")(() => ({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  backgroundColor: "unset",
  borderRadius: "4px",
  transition: "200ms ease-in-out",
}));

const GridItemWrapper = styled("div")(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const Download = muiStyled("div")({
  position: "absolute",
  bottom: "2px",
  right: "2px",
  color: "#3C384A",
  fontSize: "18px",
  zIndex: 1,
  svg: {
    color: "#817E8D",
    width: "20px",
    height: "20px",
  },
});

const MenuButtonContainer = muiStyled("div")({
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 2,
  margin: "5px",
});

const FileCardItem: React.FC<any> = ({
  item,
  imagePath,
  user,
  isContainFiles,
  cardProps,
  onOuterClick,
  styleSelectedCard,
  fileType,
  ...props
}) => {
  const resizeImage = useResizeImage({
    imagePath,
    fileType,
    user,
    isPublic: props?.isPublic ? true : false,
    height: 200,
    width: 200,
  });

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemRef = useRef(null);
  const isFileCardItemHover = useHover(itemRef);
  const isFileCardOuterClicked = useOuterClick(itemRef);
  const {
    isNormalCard,
    sx,
    onDoubleClick: onCardDoubleClick,
    ...cardDataProps
  } = cardProps || {};

  const dataSelector = useSelector(
    selectorAction.checkboxFileAndFolderSelector,
  );
  const dispatch = useDispatch();

  const handleSelect = () => {
    const name = fileType === "folder" ? item?.folder_name : item?.filename;
    const newFilename =
      fileType === "folder" ? item?.newFolder_name : item?.newFilename;
    const checkType = fileType === "folder" ? "folder" : "file";

    const value = {
      id: item?._id,
      name,
      newPath: item?.newPath || "",
      newFilename,
      checkType,
      dataPassword: item?.filePassword || item?.access_password,
      shortLink: item?.shortUrl,
      createdBy: {
        _id: item?.createdBy?._id,
        newName: item?.createdBy?.newName,
      },
    };

    dispatch(
      selectorAction.setFileAndFolderData({
        data: value,
      }),
    );
  };

  const handleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  const handleItemClick = () => {
    if (props?.isCheckbox) {
      handleSelect();
    }
  };

  useEffect(() => {
    setIsOpenMenu(isFileCardItemHover);
  }, [isFileCardItemHover]);

  useEffect(() => {
    onOuterClick?.();
  }, [isFileCardOuterClicked]);

  return (
    <Grid
      item
      xs={6}
      sm={6}
      md={4}
      lg={3}
      sx={{
        width: "100%",
        height: "100%",
        display: "initial",
        "&:hover": {
          ".favorite-empty": {
            // display: "block !important",
          },
        },
      }}
    >
      <Item
        ref={itemRef}
        className="card-item"
        onClick={handleItemClick}
        {...{
          ...(styleSelectedCard && {
            isstyledselectedcard: styleSelectedCard,
          }),
          ...(props.disableOnHoverEffect && {
            isdisableonhovereffect: "true",
          }),
          ...cardDataProps,
          ...(!isDropdownOpen && {
            onDoubleClick: onCardDoubleClick,
          }),
          ischecked: cardDataProps?.ischecked?.toString(),
          sx: {
            ...(!isNormalCard && {
              ":hover": {
                ":after": {
                  opacity: 0.1,
                },
              },
              cursor: "pointer",
            }),
            ...sx,
          },
        }}
      >
        {props?.isCheckbox && (
          <SelectionContainer>
            <CustomCheckbox
              sx={{
                display:
                  !!dataSelector?.selectionFileAndFolderData?.find(
                    (el) => el?.id === props?.id,
                  ) && true
                    ? "block"
                    : "none",
              }}
              className="checkbox-selected"
              checked={
                !!dataSelector?.selectionFileAndFolderData?.find(
                  (el) => el?.id === props?.id,
                ) && true
              }
              icon={
                <CheckBoxOutlineBlankRoundedIcon
                  sx={{ borderRadius: "30px !important" }}
                />
              }
              aria-label={"checkbox" + props?.id}
            />
          </SelectionContainer>
        )}

        {props?.menuItems && isOpenMenu && (
          <MenuButtonContainer>
            <MenuDropdown
              customButton={props?.customButton}
              onOpenChange={handleDropdownOpen}
            >
              {props.menuItems}
            </MenuDropdown>
          </MenuButtonContainer>
        )}
        <GridItem className="file-card-item">
          <GridItemWrapper>
            {fileType === "image" ? (
              <React.Fragment>
                {props?.filePassword ? (
                  <LockImage
                    className="lock-icon-preview"
                    src={lockIcon}
                    alt={props.name}
                  />
                ) : (
                  <Fragment>
                    {resizeImage.imageFound === null && <Loader />}
                    {resizeImage.imageFound === true && (
                      <>
                        {resizeImage.imageSrc && (
                          <Image
                            src={resizeImage.imageSrc}
                            alt={props.name}
                            className="file-card-image"
                          />
                        )}
                      </>
                    )}

                    {resizeImage.imageFound === false && (
                      <MdIcon.MdOutlineImageNotSupported
                        style={{
                          fontSize: "3rem",
                        }}
                      />
                    )}
                  </Fragment>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {fileType === "folder" && (
                  <Box
                    sx={{
                      display: "flex",
                      marginBottom: "30px",
                    }}
                  >
                    {isContainFiles ? (
                      <FolderNotEmptyIcon
                        style={{
                          width: "150px",
                        }}
                      />
                    ) : (
                      <FolderEmptyIcon
                        style={{
                          width: "150px",
                        }}
                      />
                    )}
                  </Box>
                )}
                {fileType !== "folder" && (
                  <FileIconContainer>
                    <FileIcon
                      extension={getFileType(props.name)}
                      {...{
                        ...defaultStyles[getFileType(props.name) as string],
                      }}
                    />
                  </FileIconContainer>
                )}
              </React.Fragment>
            )}
            {!props.disableName && (
              <React.Fragment>
                {props.name?.length > 15 ? (
                  <Tooltip title={props.name} placement="bottom">
                    <ItemTitle
                      {...{
                        ...(fileType === "folder" && {
                          folder: "true",
                        }),
                      }}
                    >
                      {cutStringWithEllipsis(props.name, 15)}
                    </ItemTitle>
                  </Tooltip>
                ) : (
                  <ItemTitle
                    {...{
                      ...(fileType === "folder" && {
                        folder: "true",
                      }),
                    }}
                  >
                    {cutStringWithEllipsis(props.name, 15)}
                  </ItemTitle>
                )}
              </React.Fragment>
            )}

            {props.isPinned && (
              <Pin>
                <BsPinAngleFill style={{ color: "#17766B" }} />
              </Pin>
            )}

            {props.downloadIcon?.isShow && (
              <Download>
                <IconButton
                  onClick={props.downloadIcon.handleOnClick}
                  sx={{
                    padding: "5px",
                  }}
                >
                  <FiDownload color="black" />
                </IconButton>
              </Download>
            )}
          </GridItemWrapper>
        </GridItem>
      </Item>
    </Grid>
  );
};

export default FileCardItem;
