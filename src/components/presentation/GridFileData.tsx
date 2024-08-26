import { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  FileBoxDownload,
  FileBoxSocial,
  FileListContainer,
} from "app/pages/file-uploader/styles/fileUploader.style";
import NormalButton from "components/NormalButton";

// Icons
import facebookIcon from "assets/images/facebook-icon.png";
import messagerIcon from "assets/images/messager-icon.png";
import whatsappIcon from "assets/images/what-app-icon.png";
import twitterIcon from "assets/images/twitter-icon.png";
import InfoIcon from "@mui/icons-material/Info";
import dottIcon from "assets/images/dott-icon.png";
import QrCodeIcon from "@mui/icons-material/QrCodeOutlined";
import LockIcon from "@mui/icons-material/Lock";
import { convertBytetoMBandGB } from "utils/storage.util";
import QRCode from "react-qr-code";
import { formatDate } from "utils/date.util";
import {
  BoxAdsAction,
  BoxAdsContainer,
  BoxBottomDownload,
} from "styles/presentation/presentation.style";
import { cutFileName } from "utils/file.util";
import FolderNotEmptyIcon from "assets/images/folder-not-empty.svg?react";
import FolderEmptyIcon from "assets/images/folder-empty.svg?react";
import { styled } from "@mui/system";

const IconFolderContainer = styled("div")({
  width: "28px",
});

type Props = {
  _description?: string;
  dataLinks?: any[];
  multipleIds: any[];
  countAction: number;
  isFile?: boolean;

  setMultipleIds?: (value: any[]) => void;
  handleQRGeneration?: (e: any, file: any, longUrl: string) => void;
  handleDownloadFileGetLink?: () => void;
  handleClearGridSelection?: () => void;
  handleDownloadAsZip?: () => void;

  handleDownloadFolderAsZip?: () => void;
  handleDownloadFolder?: () => void;
};

function GridFileData(props: Props) {
  const [expireDate, setExpireDate] = useState("");
  // const isMobile = useMediaQuery("(max-width: 768px)");

  const currentUrl = window.location.href;

  const arrayMedias = [
    {
      id: 1,
      title: "Facebook",
      link: "",
      icon: (
        <img
          src={facebookIcon}
          alt="facebook-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 2,
      title: "Messager",
      link: "",
      icon: (
        <img
          src={messagerIcon}
          alt="messager-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 3,
      title: "WhatsApp",
      link: "",
      icon: (
        <img
          src={whatsappIcon}
          alt="whatsapp-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 4,
      title: "Twitter",
      link: "",
      icon: (
        <img
          src={twitterIcon}
          alt="twitter-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 99,
      title: "...",
      link: "",
      icon: (
        <img
          src={dottIcon}
          alt="dott-icon"
          style={{
            objectFit: "cover",
          }}
        />
      ),
    },
  ];

  const columns: any = [
    {
      field: "filename",
      headerName: "Name",
      flex: 1,
      headerAlign: "left",
      renderCell: (params) => {
        const dataFile = params?.row;
        const filename = props.isFile
          ? dataFile?.filename
          : dataFile?.folder_name;

        const password = props.isFile
          ? dataFile?.filePassword
          : dataFile?.access_password;
        return (
          <Fragment>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!props.isFile && (
                <Fragment>
                  <IconFolderContainer>
                    {dataFile?.total_size && dataFile.total_size > 0 ? (
                      <FolderNotEmptyIcon />
                    ) : (
                      <FolderEmptyIcon />
                    )}
                  </IconFolderContainer>
                </Fragment>
              )}
              <Typography title={dataFile?.filename} component={"span"}>
                {cutFileName(filename || "", 20)}
              </Typography>
              {password && (
                <LockIcon sx={{ color: "#666", fontSize: "1.2rem" }} />
              )}
            </Box>
          </Fragment>
        );
      },
    },
    {
      field: "size",
      headerName: "Size",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const size = props?.isFile
          ? params?.row?.size
          : params?.row?.total_size;
        return <span>{convertBytetoMBandGB(size || 0)}</span>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      width: 70,
      align: "center",
      renderCell: (params) => {
        const status = params?.row?.status || "Inactive";
        return (
          <Chip
            sx={{
              backgroundColor:
                status?.toLowerCase() === "active" ? "#DCF6E8" : "#dcf6e8",
              color: status?.toLowerCase() === "active" ? "#4BD087" : "#29c770",
              fontWeight: "bold",
            }}
            label={
              status?.toLowerCase() === "active" ? "" + "Active" : "Inactive"
            }
            size="small"
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const dataFile = params.row;

        return (
          <IconButton
            onClick={(e: any) => {
              props.handleQRGeneration?.(e, dataFile, dataFile?.longUrl);
            }}
          >
            <QrCodeIcon />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    if (props?.dataLinks?.[0]?.expired) {
      setExpireDate(props?.dataLinks?.[0]?.expired || "");
    }
  }, [props]);

  return (
    <Fragment>
      <FileListContainer>
        <FileBoxDownload className="box-download">
          <Card
            sx={{
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="h4"
                sx={{ textAlign: "start", padding: "1rem .5rem" }}
              >
                Application apply (
                {cutFileName(
                  props?.dataLinks?.[0]?.filename ||
                    props?.dataLinks?.[0]?.folder_name ||
                    "",
                  20,
                )}
                )
              </Typography>
            </Box>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                paddingLeft: "0 !important",
                paddingRight: "0 !important",
                paddingBottom: "0 !important",
              }}
            >
              <DataGrid
                sx={{
                  borderRadius: 0,
                  height: "100% !important",
                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
                selectionModel={props?.multipleIds}
                checkboxSelection={true}
                autoHeight
                getRowId={(row) => row?._id}
                rows={props?.dataLinks || []}
                columns={columns}
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                hideFooter
                onSelectionModelChange={(ids) => {
                  props?.setMultipleIds?.(ids);
                }}
              />

              {props?.dataLinks!.length > 0 && (
                <Fragment>
                  <Box
                    sx={{
                      padding: "0.5rem 1rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.5rem",
                        mb: 2,
                      }}
                    >
                      <Typography component={"p"}>Expiration Date</Typography>
                      <Chip
                        label={expireDate ? formatDate(expireDate) : "Never"}
                        size="small"
                        sx={{ padding: "0 1rem" }}
                      />
                    </Box>
                    {expireDate && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#FF9F43",
                        }}
                      >
                        <InfoIcon sx={{ fontSize: "0.9rem", mr: 1 }} />
                        <Typography variant="h4" sx={{ fontSize: "0.8rem" }}>
                          This link is expired. Please access the document
                          before this date
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <BoxBottomDownload>
                    <Box sx={{ position: "relative" }}>
                      {props.multipleIds?.length > 0 && (
                        <Fragment>
                          {props.countAction > 0 && (
                            <BoxAdsContainer
                              sx={{ top: "-8px", right: "-1.6rem" }}
                            >
                              <BoxAdsAction
                                sx={{ padding: "2px 8px", fontSize: "0.66rem" }}
                              >
                                {props?.countAction} close ads
                              </BoxAdsAction>
                            </BoxAdsContainer>
                          )}
                        </Fragment>
                      )}
                      <NormalButton
                        onClick={() => {
                          if (props.isFile) {
                            props.handleDownloadFileGetLink?.();
                          } else {
                            props.handleDownloadFolder?.();
                          }
                        }}
                        disabled={props?.multipleIds?.length > 0 ? false : true}
                        sx={{
                          padding: (theme) =>
                            `${theme.spacing(1.6)} ${theme.spacing(5)}`,
                          borderRadius: (theme) => theme.spacing(2),
                          color: "#828282 !important",
                          fontWeight: "bold",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          width: "inherit",
                          outline: "none",

                          ":disabled": {
                            cursor: "context-menu",
                            backgroundColor: "#D6D6D6",
                            color: "#ddd",
                          },
                        }}
                      >
                        Download
                      </NormalButton>
                    </Box>
                    <NormalButton
                      onClick={props?.handleClearGridSelection}
                      sx={{
                        padding: (theme) =>
                          `${theme.spacing(1.6)} ${theme.spacing(5)}`,
                        borderRadius: (theme) => theme.spacing(2),
                        color: "#828282 !important",
                        fontWeight: "bold",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        width: "inherit",
                        outline: "none",

                        ":disabled": {
                          border: "2px solid #ddd",
                          cursor: "not-allowed",
                        },
                      }}
                    >
                      Cancel
                    </NormalButton>
                  </BoxBottomDownload>
                </Fragment>
              )}
            </CardContent>
          </Card>
        </FileBoxDownload>
        <FileBoxSocial className="box-social">
          <Box sx={{ padding: "1.5rem" }}>
            <Box
              className="button-ads"
              sx={{ display: "flex", position: "relative" }}
            >
              {props?.countAction > 0 && (
                <BoxAdsContainer>
                  <BoxAdsAction>{props?.countAction} close ads</BoxAdsAction>
                </BoxAdsContainer>
              )}
              <Button
                variant="contained"
                sx={{
                  width: { xs: "100%", md: "80%" },
                  mx: "auto !important",
                }}
                onClick={() => {
                  if (props?.isFile) {
                    props.handleDownloadAsZip?.();
                  } else {
                    props.handleDownloadFolderAsZip?.();
                  }
                }}
              >
                Download
              </Button>
            </Box>
            <Box sx={{ textAlign: "start", padding: "1rem 0" }}>
              <Typography variant="h5" sx={{ color: "rgb(0,0,0,0.9)" }}>
                Social Share
              </Typography>
              <Typography
                lineHeight={1}
                sx={{
                  mt: 2,
                  fontWeight: 500,
                  color: "rgb(0,0,0,0.7)",
                }}
              >
                Share this link via
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 3,
                mt: 7,
              }}
            >
              {arrayMedias.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  {item.icon}
                </Button>
              ))}
            </Box>
          </Box>
          <Box
            className="appbar appbar-bg-gradient-r"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "1.2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                color: "#fff",
                padding: ".8rem",
                textAlign: { xs: "center", md: "start" },
                ml: ".4rem",
              }}
            >
              <Typography variant={"h4"} sx={{ m: 0, p: 0 }}>
                View on mobile phone
              </Typography>
              <Typography variant={"h6"} sx={{ my: 4, fontWeight: 400 }}>
                Scan to view on your mobile
                <br />
                phone for faster download
              </Typography>
              <Typography variant={"h6"} sx={{ fontWeight: 400 }}>
                Android users cn scan with
                <br />a browser, and iOS users can
                <br /> scan with camera
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: ".9rem",
              }}
            >
              <QRCode
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid gray",
                  padding: "7px",
                  borderRadius: "7px",
                }}
                value={currentUrl}
                size={150}
                level="H"
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            </Box>
          </Box>
        </FileBoxSocial>
      </FileListContainer>
    </Fragment>
  );
}

export default GridFileData;
