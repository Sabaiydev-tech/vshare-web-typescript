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

import { IFile } from "models/file.model";
import {
  BoxAdsAction,
  BoxAdsContainer,
  BoxBottomDownload,
} from "styles/presentation/presentation.style";
import { formatDateTime } from "utils/date.util";
import { cutFileName } from "utils/file.util";
import { encryptDataLink } from "utils/secure.util";

type Props = {
  _description?: string;
  dataLinks?: any[];
  multipleIds?: any[];
  manageLinkId?: string;
  countAction: number;
  isFile?: boolean;
  toggle?: string;
  total?: number;
  selectionFileAndFolderData?: any[];

  pagination?: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (index) => void;
  };

  setToggle?: () => void;
  setMultipleIds?: (value: any[]) => void;
  handleQRGeneration?: (e: any, file: any, longUrl: string) => void;
  handleDownloadFileGetLink?: () => void;
  handleDownloadAsZip?: () => void;

  handleDownloadFolderAsZip?: () => void;
  handleDownloadFolder?: () => void;
  handleDoubleClick?: (data: any) => void;

  handleClearGridSelection?: () => void;
  handleClearFileSelection?: () => void;
  handleSelection?: (id: string) => void;
};

function ListFileData(props: Props) {
  const [expireDate, setExpireDate] = useState("");
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const columns = useMemo(() => {
    const data: any = [
      {
        field: "checkboxAction",
        headerName: "",
        editable: false,
        sortable: false,
        maxWidth: isMobile ? 40 : 50,
        flex: 1,
        renderCell: (params: { row: any }) => {
          const { _id, status } = params?.row || {};

          if (status !== "active") {
            return <Fragment></Fragment>;
          }

          const isChecked = !!props?.selectionFileAndFolderData?.find(
            (el) => el?.id === _id,
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
                onClick={() => props?.handleSelection?.(_id)}
              />
            </div>
          );
        },
      },
      {
        field: "filename",
        headerName: "Name",
        flex: 1,
        headerAlign: "left",
        renderCell: (params) => {
          const dataFile = params?.row;
          const size = props?.isFile
            ? params?.row?.size
            : params?.row?.total_size;

          const filename = props.isFile
            ? dataFile?.filename
            : dataFile?.folder_name;

          const password = props.isFile
            ? dataFile?.filePassword
            : dataFile?.access_password;

          return (
            <Fragment>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {password && (
                  <LockIcon sx={{ color: "#666", fontSize: "1.2rem" }} />
                )}

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    title={dataFile?.filename}
                    component={"span"}
                    sx={{ fontSize: isMobile ? 12 : 14 }}
                  >
                    {cutFileName(filename || "", isMobile ? 8 : 20)}
                  </Typography>
                  {isMobile && (
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
                color:
                  status?.toLowerCase() === "active" ? "#4BD087" : "#29c770",
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
                handleOpenQRCode(e, dataFile);
              }}
            >
              <QrCodeIcon />
            </IconButton>
          );
        },
      },
    ];

    return data || [];
  }, [isMobile, props.selectionFileAndFolderData]);

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

  function handleOpenQRCode(event: HTMLFormElement, data: IFile) {
    // const url = data?.longUrl || "";
    // props.handleQRGeneration?.(event, data, url);

    const dataPrepared = {
      _id: data._id,
      type: "file",
      manageLinkId: props.manageLinkId,
    };

    const url = `${window.location.origin}/df?lc=`;
    const encodeData = encryptDataLink(dataPrepared);

    const longUrl = url + encodeData;
    props.handleQRGeneration?.(event, data, longUrl);
  }

  useEffect(() => {
    if (props?.dataLinks?.[0]?.expired) {
      const dateTime = formatDateTime(props?.dataLinks?.[0]?.expired);
      setExpireDate(dateTime);
    }
  }, [props.dataLinks]);

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
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "scroll",
              },
              " .css-cemoa4-MuiButtonBase-root-MuiCheckbox-root": {
                color: "rgba(0, 0, 0, 0.3)",
              },
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
                        This link will be expired. Please access the document
                        before this date
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              <BoxBottomDownload>
                <Box sx={{ position: "relative" }}>
                  {props.selectionFileAndFolderData!.length > 0 && (
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
                    disabled={
                      props.selectionFileAndFolderData!.length > 0
                        ? false
                        : true
                    }
                    sx={{
                      padding: (theme) =>
                        `${theme.spacing(1.6)} ${theme.spacing(5)}`,
                      borderRadius: (theme) => theme.spacing(1.5),
                      color:
                        props.selectionFileAndFolderData!.length > 0
                          ? "#fff"
                          : "#828282 !important",
                      fontWeight: "bold",
                      border: "1px solid",
                      backgroundColor:
                        props.selectionFileAndFolderData!.length > 0
                          ? "#17766B"
                          : "#fff",
                      borderColor:
                        props.selectionFileAndFolderData!.length > 0
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
                      props.selectionFileAndFolderData!.length > 0
                        ? "#fff"
                        : "#828282 !important",
                    fontWeight: "bold",
                    border: "1px solid",
                    backgroundColor:
                      props.selectionFileAndFolderData!.length > 0
                        ? "#17766B"
                        : "#fff",
                    borderColor:
                      props.selectionFileAndFolderData!.length > 0
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

export default ListFileData;
