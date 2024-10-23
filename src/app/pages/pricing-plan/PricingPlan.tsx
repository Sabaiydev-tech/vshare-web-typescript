import {
  Container,
  Grid,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PriceCard from "components/PriceCard";
import useManagePublicPackages from "hooks/useManagePublicPackage";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PACKAGE_TYPE,
  paymentState,
  setPackageType,
  setPaymentType,
  setPaymentTypeSummary,
} from "stores/features/paymentSlice";
import * as MUI from "styles/presentation/pricingPlan.style";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#17766B",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const PricingPlansContainer = styled(Container)(({ theme }) => ({
  minHeight: "80vh",
  marginTop: "4rem",
  textAlign: "center",
  padding: "4rem 0",
  justifyContent: "space-between",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: "4rem 1rem",
    marginTop: "2rem",
  },
}));

const PricingPlan = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");
  const { packageType } = useSelector(paymentState);
  const packages = useManagePublicPackages({ filter: packageType });
  const memorizedPackages = useRef<any>({});
  const packageData =
    packageType === PACKAGE_TYPE.annual
      ? memorizedPackages.current.filteredAnnualData || packages.annualData
      : memorizedPackages.current.filteredMonthlyData || packages.monthlyData;

  useEffect(() => {
    memorizedPackages.current = packages;
  }, [packages]);

  return (
    <PricingPlansContainer>
      <MUI.BoxShowSection1
        sx={{
          padding: 0,
          color: "initial",
          h3: {
            color: "initial",
          },
          h6: {
            color: "initial",
          },
        }}
      >
        <Typography variant="h6">
          All plans include 40+ advanced tools and features to boost your
          product.
        </Typography>
        <Typography variant="h1">
          Choose the best plan to fit your needs
        </Typography>
        <MUI.BoxShowSwitchPlan>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Monthly</Typography>
            <AntSwitch
              checked={packageType === PACKAGE_TYPE.annual ? true : false}
              onChange={() => {
                dispatch(
                  setPackageType(
                    packageType !== PACKAGE_TYPE.annual
                      ? PACKAGE_TYPE.annual
                      : PACKAGE_TYPE.monthly,
                  ),
                );
                dispatch(
                  setPaymentTypeSummary(
                    packageType !== PACKAGE_TYPE.annual
                      ? PACKAGE_TYPE.annual
                      : PACKAGE_TYPE.monthly,
                  ),
                );
                dispatch(
                  setPaymentType(
                    packageType !== PACKAGE_TYPE.annual
                      ? PACKAGE_TYPE.annual
                      : PACKAGE_TYPE.monthly,
                  ),
                );
              }}
              inputProps={{ "aria-label": "ant design" }}
            />
            <Typography variant="h6" sx={{ marginLeft: "1rem !important" }}>
              Annual
            </Typography>
          </Stack>
        </MUI.BoxShowSwitchPlan>
      </MUI.BoxShowSection1>
      <MUI.BoxShowSection2>
        <Grid container spacing={isMobile ? 2 : 8}>
          {packageData?.map((data, index) => {
            return (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <PriceCard
                  details={data}
                  buttonProps={{
                    onClick: () => {},
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </MUI.BoxShowSection2>
    </PricingPlansContainer>
  );
};

export default PricingPlan;
