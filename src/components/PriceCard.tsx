import * as MUI from "styles/presentation/pricingPlan.style";

// material ui components and icons
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Chip, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PACKAGE_TYPE,
  paymentState,
  setActivePaymentId,
  setActivePaymentType,
  setCalculatePrice,
} from "stores/features/paymentSlice";
import { prettyNumberFormat } from "utils/number.util";
import { encryptDataLink } from "utils/secure.util";
import { convertBytetoMBandGB } from "utils/storage.util";
import NormalButton from "./NormalButton";

function PriceCard(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ...paymentSelector } = useSelector(paymentState);
  const isCost = props.details._price > 0;
  const features = useMemo(
    () => [
      {
        title: "Storage:",
        context: `${convertBytetoMBandGB(props.details.storage)}`,
      },
      {
        title: "Uploads:",
        context: `${props.details.uploadPerDay} uploads`,
      },
      {
        title: "Uploads per day:",
        context: `${props.details.multipleUpload} uploads per day`,
      },
      /* {
        title: "Downloads:",
        context: `${props.downLoadPerDay} downloads per day`,
      }, */
      {
        title: "Max Download Size:",
        context: `${prettyNumberFormat(
          convertBytetoMBandGB(props.details.maxUploadSize),
        )}`,
      },
    ],
    [props.details],
  );

  return (
    <MUI.BoxShowPriceCard>
      {props.details.name?.toLowerCase() === "pro" && (
        <MUI.BoxShowChip
          sx={{
            position: "absolute",
            top: 0,
            mt: 6,
            mr: 15,
          }}
        >
          <Chip
            label="Popular"
            sx={{ color: "#17766B", background: "#DAE9E7", fontWeight: "700" }}
          />
        </MUI.BoxShowChip>
      )}

      <MUI.BoxShowPriceIcon>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5893/5893015.png"
          alt="currentPackagePrice icon"
        />
      </MUI.BoxShowPriceIcon>
      <Typography variant="h3">{props.details.name}</Typography>
      <Typography variant="h6">A simple start for everyone</Typography>
      <Typography
        variant="h6"
        sx={{
          position: "relative",
          p: 5,
        }}
      >
        <strong
          style={{ fontSize: "3rem", color: "#17766B", position: "relative" }}
        >
          <Typography
            component="span"
            className="currency"
            sx={{
              fontWeight: 600,
              position: "absolute",
              top: "40%",
              left: 0,
              transform: "translate(-10px, -50%)",
            }}
          >
            {isCost && paymentSelector.currencySymbol}
          </Typography>
          {isCost ? props.details._price?.toLocaleString() : "Free"}
        </strong>
        {isCost && (
          <>
            {paymentSelector.packageType === PACKAGE_TYPE.annual
              ? "/year"
              : "/month"}
          </>
        )}
      </Typography>
      <MUI.BoxShowFeatureList>
        {features.map((feature, index) => {
          return (
            <Typography
              component="div"
              key={index}
              sx={{
                display: "flex",
                justifyContent: "start",
                margin: "0.5rem 0",
                fontSize: "0.95rem",
              }}
            >
              <Typography
                component="span"
                sx={{
                  lineHeight: 1,
                  pt: 1,
                  pr: 1,
                }}
              >
                <CircleOutlinedIcon
                  sx={{ fontSize: "0.8rem" }}
                  className="circle"
                />
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  lineHeight: "1.25rem",
                  marginLeft: "5px",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    marginRight: 1,
                  }}
                >
                  {feature.title} {feature.context}
                </Typography>
              </Typography>
            </Typography>
          );
        })}
      </MUI.BoxShowFeatureList>

      <NormalButton
        {...(isCost && {
          onClick: () => {
            const encrpytedId = encryptDataLink(props.details._id);
            dispatch(setActivePaymentType(props.details._type));
            dispatch(setActivePaymentId(props.details._id));
            dispatch(setCalculatePrice());
            navigate(`/pricing/accounts/${encrpytedId}`);
          },
        })}
        sx={{
          marginTop: 3,
          height: "35px",
          borderRadius: 1,
          backgroundColor: "#DAE9E7",
          textAlign: "center",
          display: "block",
          color: "#17766B",
          ...(isCost
            ? {
                "&:hover": {
                  backgroundColor: theme.palette.primaryTheme!.main,
                  color: "white !important",
                },
              }
            : {
                cursor: "default",
              }),
        }}
      >
        {isCost ? "Choose Plan" : "Free"}
      </NormalButton>
    </MUI.BoxShowPriceCard>
  );
}

export default PriceCard;
