import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FileBoxDownload } from "app/pages/file-uploader/styles/fileUploader.style";
import NormalButton from "components/NormalButton";
import { Fragment, useEffect, useState } from "react";

import ResponsivePagination from "react-responsive-pagination";
import "styles/pagination.style.css";

// Icons
import InfoIcon from "@mui/icons-material/Info";

import LockIcon from "@mui/icons-material/Lock";
import QrCodeIcon from "@mui/icons-material/QrCodeOutlined";
import { convertBytetoMBandGB } from "utils/storage.util";

import { styled } from "@mui/system";
import FolderEmptyIcon from "assets/images/folder-empty.svg?react";
import FolderNotEmptyIcon from "assets/images/folder-not-empty.svg?react";
import {
  BoxAdsAction,
  BoxAdsContainer,
  BoxBottomDownload,
} from "styles/presentation/presentation.style";
import { cutFileName } from "utils/file.util";
import moment from "moment";

const IconFolderContainer = styled("div")({
  width: "28px",
});

type Props = {
  _description?: string;
  dataLinks?: any[];
  multipleIds: any[];
  countAction: number;
  isFile?: boolean;
  toggle?: string;
  total?: number;
  linkExpired?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (index) => void;
  };

  setToggle?: () => void;
  setMultipleIds?: (value: any[]) => void;
  handleQRGeneration?: (e: any, file: any, longUrl: string) => void;
  handleDownloadFileGetLink?: () => void;
  handleClearGridSelection?: () => void;
  handleDownloadAsZip?: () => void;

  handleDownloadFolderAsZip?: () => void;
  handleDownloadFolder?: () => void;
  handleDoubleClick?: (data: any) => void;
};

function ListFolderData(props: Props) {
  const [expireDate, setExpireDate] = useState("");

  const columns: any = [
    {
      field: "filename",
      headerName: "Name",
      flex: 1,
      headerAlign: "left",
      renderCell: (params) => {
        const dataFile = params?.row;
        const filename = dataFile?.folder_name;

        const password = dataFile?.access_password;
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
        const size = params?.row?.total_size;
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
              props.handleQRGeneration?.(e, dataFile, dataFile?.longUrl || "");
            }}
          >
            <QrCodeIcon />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    if (props?.linkExpired || props?.dataLinks?.[0]?.expired) {
      setExpireDate(
        props?.linkExpired ||
          moment(props?.dataLinks?.[0]?.expired).format("DD/MM/YYYY HH:MM A") ||
          "",
      );
    }
  }, [props]);

  return (
    <FileBoxDownload className="box-download" sx={{ mb: 2 }}>
      <Card
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ textAlign: "start", padding: "1rem .5rem" }}
          >
            Application apply (
            {cutFileName(props?.dataLinks?.[0]?.folder_name || "", 20)})
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
              " .css-cemoa4-MuiButtonBase-root-MuiCheckbox-root": {
                color: "rgba(0, 0, 0, 0.3)",
              },
            }}
            selectionModel={props?.multipleIds}
            onCellDoubleClick={(value) => {
              props.handleDoubleClick?.(value.row || {});
            }}
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

          {props.total! > 10 && (
            <Box
              sx={{ my: 2, mx: 4, display: "flex", justifyContent: "flex-end" }}
            >
              <ResponsivePagination
                current={props.pagination?.currentPage || 1}
                total={props.pagination?.totalPages || 10}
                onPageChange={(index) => {
                  props.pagination?.setCurrentPage?.(index);
                }}
              />
            </Box>
          )}

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
                    label={expireDate ? expireDate : "Never"}
                    size="small"
                    sx={{ padding: "0 1rem" }}
                  />
                </Box>
                {expireDate && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#FF9F43",
                      }}
                    >
                      <InfoIcon sx={{ fontSize: "0.9rem", mr: 1 }} />
                      <Typography variant="h4" sx={{ fontSize: "0.8rem" }}>
                        This link is expired. Please access the document before
                        this date
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              <BoxBottomDownload>
                <Box sx={{ position: "relative" }}>
                  {props.multipleIds?.length > 0 && (
                    <Fragment>
                      {props.countAction > 0 && (
                        <BoxAdsContainer sx={{ top: "-8px", right: "-1.6rem" }}>
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
                      borderRadius: (theme) => theme.spacing(1.5),
                      color:
                        props?.multipleIds?.length > 0
                          ? "#fff"
                          : "#828282 !important",
                      fontWeight: "bold",
                      backgroundColor:
                        props?.multipleIds?.length > 0 ? "#17766B" : "#fff",
                      border: "1px solid",
                      borderColor:
                        props?.multipleIds?.length > 0 ? "#17766B" : "#ddd",
                      width: "inherit",
                      outline: "none",

                      ":disabled": {
                        cursor: "context-menu",
                      },
                    }}
                  >
                    Download
                  </NormalButton>
                </Box>
                <NormalButton
                  onClick={props?.handleClearGridSelection}
                  disabled={props?.multipleIds?.length > 0 ? false : true}
                  sx={{
                    padding: (theme) =>
                      `${theme.spacing(1.6)} ${theme.spacing(5)}`,
                    borderRadius: (theme) => theme.spacing(1.5),
                    color:
                      props?.multipleIds?.length > 0
                        ? "#fff"
                        : "#828282 !important",
                    fontWeight: "bold",
                    backgroundColor:
                      props?.multipleIds?.length > 0 ? "#17766B" : "#fff",
                    border: "1px solid",
                    borderColor:
                      props?.multipleIds?.length > 0 ? "#17766B" : "#ddd",
                    width: "inherit",
                    outline: "none",

                    ":disabled": {
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
  );
}

export default ListFolderData;
