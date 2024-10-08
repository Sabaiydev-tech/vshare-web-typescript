import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FileBoxDownload } from "app/pages/file-uploader/styles/fileUploader.style";
import NormalButton from "components/NormalButton";
import { Fragment, useEffect, useMemo, useState } from "react";

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
import { FileIcon, FileIconProps } from "react-file-icon";
import {
  BoxAdsAction,
  BoxAdsContainer,
  BoxBottomDownload,
} from "styles/presentation/presentation.style";
import { cutFileName, getFileType } from "utils/file.util";

const IconFolderContainer = styled("div")({
  width: "28px",
});

type Props = {
  _description?: string;
  dataLinks: any[];
  multipleIds?: any[];
  countAction: number;
  isFile?: boolean;
  linkExpired?: string;
  toggle?: string;
  total?: number;
  selectionFileAndFolderData: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (index) => void;
  };

  handleSelection: (val: string, fileType?: string) => void;
  setToggle?: () => void;
  setMultipleIds?: (value: any[]) => void;
  handleQRGeneration?: (e: any, file: any, longUrl: string) => void;
  handleDownloadAsZip?: () => void;

  handleDownloadFolderAsZip?: () => void;
  handleDownloadFolder?: () => void;
  handleDoubleClick?: (data: any) => void;

  handleClearGridSelection?: () => void;
  handleClearFileSelection?: () => void;
};

function ListDataItem(props: Props) {
  const [expireDate, setExpireDate] = useState("");
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const [styles] = useState<Record<string, Partial<FileIconProps>>>({});

  const columns = useMemo(() => {
    const data: any = [
      {
        field: "checkboxAction",
        headerName: "",
        editable: false,
        sortable: false,
        maxWidth: isMobile ? 40 : 70,
        flex: 1,
        renderCell: (params: { row: any }) => {
          const { _id, status, isFile } = params?.row || {};

          if (status !== "active") {
            return <Fragment></Fragment>;
          }

          const fileType = isFile ? "file" : "folder";
          const isChecked = !!props?.selectionFileAndFolderData?.find(
            (el) => el?.id === _id && el.checkType === fileType,
          );

          return (
            <div>
              <Checkbox
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
                checked={isChecked}
                aria-label={"checkbox" + _id}
                onClick={() => props?.handleSelection(_id, fileType)}
              />
            </div>
          );
        },
      },
      {
        field: "",
        headerName: "Name",
        flex: 1,
        headerAlign: "left",
        renderCell: (params) => {
          const dataFile = params?.row;
          const size = dataFile?.isFile
            ? params?.row?.size
            : params?.row?.total_size;

          const filename = dataFile?.isFile
            ? dataFile?.filename
            : dataFile?.folder_name;

          const password = dataFile?.isFile
            ? dataFile?.filePassword
            : dataFile?.access_password;
          return (
            <Fragment>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {password && (
                  <LockIcon sx={{ color: "#666", fontSize: "1.2rem" }} />
                )}
                {!dataFile?.isFile && (
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

                {dataFile?.isFile && (
                  <Box
                    sx={{
                      maxWidth: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                    mt={2}
                    mr={1.5}
                  >
                    <FileIcon
                      color="white"
                      extension={getFileType(params.row.filename) ?? ""}
                      {...{
                        ...styles[getFileType(params.row.filename) as string],
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    title={dataFile?.filename}
                    component={"span"}
                    sx={{ fontSize: isMobile ? 12 : 14 }}
                  >
                    {cutFileName(filename || "", isMobile ? 8 : 12)}
                  </Typography>
                  {isMobile && dataFile?.isFile && (
                    <Typography
                      title={dataFile?.filename}
                      component={"span"}
                      sx={{ fontSize: isMobile ? 10 : 12 }}
                    >
                      {convertBytetoMBandGB(size || 0)}
                    </Typography>
                  )}
                </Box>
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
          const dataFile = params?.row;
          const size = dataFile?.isFile
            ? params?.row?.size
            : params?.row?.total_size;

          return <span>{convertBytetoMBandGB(size || 0)}</span>;
        },
      },
      {
        field: "status",
        headerName: "Status",
        headerAlign: "center",
        width: 120,
        align: "center",
        renderCell: (params) => {
          const status = params?.row?.status || "Inactive";
          return (
            <Chip
              sx={{
                backgroundColor:
                  status?.toLowerCase() === "active" ? "#DCF6E8" : "#F8E7E8",
                color:
                  status?.toLowerCase() === "active" ? "#4BD087" : "#EA5455",
                fontWeight: "bold",
              }}
              label={
                status?.toLowerCase() === "active" ? "" + "Active" : "Deleted"
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
          if (dataFile.status !== "active") {
            return null;
          }

          return (
            <IconButton
              onClick={(e: any) => {
                const url = dataFile?.longUrl || "";
                props.handleQRGeneration?.(e, dataFile, url);
              }}
            >
              <QrCodeIcon />
            </IconButton>
          );
        },
      },
    ];

    return data;
  }, [props.selectionFileAndFolderData]);

  const columnData = useMemo(() => {
    if (isMobile) {
      const newColumns = columns.filter((data) => data.field !== "size");
      return newColumns || [];
    }
    return columns;
  }, [isMobile, columns]);

  function handleClearSelection() {
    props.handleClearFileSelection?.();
  }

  useEffect(() => {
    if (props?.linkExpired) {
      setExpireDate(props?.linkExpired || "");
    }
  }, [props]);

  return (
    <FileBoxDownload className="box-download">
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
            {cutFileName(
              props?.dataLinks?.[0]?.filename ||
                props?.dataLinks?.[0]?.folder_name ||
                "",
              20,
            )}
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

              "& .MuiDataGrid-columnHeader--moving": {
                backgroundColor: "transparent",
              },
            }}
            onCellDoubleClick={(value) => {
              if (!value.row.isFile) {
                if (value.row.status === "active") {
                  props.handleDoubleClick?.(value.row || {});
                }
              }
            }}
            autoHeight
            getRowId={(row) => row?._id}
            rows={props?.dataLinks || []}
            columns={columnData || []}
            disableSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            hideFooter
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
          {props.dataLinks?.length > 0 && (
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
                )}
              </Box>

              <BoxBottomDownload>
                <Box sx={{ position: "relative" }}>
                  {props?.selectionFileAndFolderData.length > 0 && (
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
                      props.handleDownloadAsZip?.();
                    }}
                    disabled={
                      props?.selectionFileAndFolderData.length > 0
                        ? false
                        : true
                    }
                    sx={{
                      padding: (theme) =>
                        `${theme.spacing(1.6)} ${theme.spacing(5)}`,
                      borderRadius: (theme) => theme.spacing(1.5),
                      color:
                        props?.selectionFileAndFolderData.length > 0
                          ? "#fff"
                          : "#828282 !important",
                      fontWeight: "bold",
                      border: "1px solid",
                      backgroundColor:
                        props?.selectionFileAndFolderData.length > 0
                          ? "#17766B"
                          : "#fff",
                      borderColor:
                        props?.selectionFileAndFolderData.length > 0
                          ? "#17766B"
                          : "#ddd",
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
                  onClick={handleClearSelection}
                  sx={{
                    padding: (theme) =>
                      `${theme.spacing(1.6)} ${theme.spacing(5)}`,
                    borderRadius: (theme) => theme.spacing(1.5),
                    color:
                      props?.selectionFileAndFolderData.length > 0
                        ? "#fff"
                        : "#828282 !important",
                    fontWeight: "bold",
                    border: "1px solid",
                    backgroundColor:
                      props?.selectionFileAndFolderData.length > 0
                        ? "#17766B"
                        : "#fff",
                    borderColor:
                      props?.selectionFileAndFolderData.length > 0
                        ? "#17766B"
                        : "#ddd",
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
  );
}

export default ListDataItem;
