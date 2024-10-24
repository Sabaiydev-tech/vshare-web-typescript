import { Box, Grid, Paper, Typography } from "@mui/material";
import { ChangeEvent, Fragment, useEffect } from "react";
import PricePaymentForm from "./PricePaymentForm";
import PricePaymentSummary from "./PricePaymentSummary";
import {
  PricePaymentContainer,
  PricePaymentContainerBox,
} from "styles/priceCheckoutStyle";
import StepV1 from "components/StepV1";
import useManagePublicPackages from "hooks/useManagePublicPackage";
import usePackageFilter from "hooks/usePackageFilter";
import { useDispatch, useSelector } from "react-redux";
import {
  COUNTRIES,
  CURRENCIES,
  PAYMENT_METHOD,
  paymentState,
  setActivePaymentMethod,
  setCalculatePrice,
  setCountry,
  setCurencySymbol,
  setPackageData,
  setPackageIdData,
  setPaymentSelect,
} from "stores/features/paymentSlice";
import { useParams } from "react-router-dom";
import { decryptDataLink } from "utils/secure.util";
import * as MUI from "styles/priceCheckoutStyle";
import bcelIcon from "assets/images/bcel.jpg";
import visaIcon from "assets/images/Visa.png";

function PricePayment() {
  const paymentSelector = useSelector(paymentState);
  const filter = usePackageFilter();
  const managePackages = useManagePublicPackages({ filter: filter.data });

  const { id } = useParams();

  // redux
  const dispatch = useDispatch();

  const handlePaymentTab = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPaymentSelect(event.target.value));

    if (event?.target?.value.toLowerCase() === "bcel") {
      dispatch(setCountry(COUNTRIES.LAOS));
      dispatch(setCurencySymbol(CURRENCIES.KIP));
      dispatch(setActivePaymentMethod(PAYMENT_METHOD.bcelOne));
    } else {
      dispatch(setCountry(COUNTRIES.FOREIGN));
      dispatch(setCurencySymbol(CURRENCIES.DOLLAR));
      dispatch(setActivePaymentMethod(PAYMENT_METHOD.stripe));
    }
  };

  useEffect(() => {
    if (managePackages.data && managePackages.data?.length > 0) {
      const decodeParam = decryptDataLink(id);
      const result = managePackages.data?.find((el) => el._id === decodeParam);
      dispatch(setPackageIdData(result));
      dispatch(setPackageData(managePackages.data));
    }
  }, [managePackages.data, dispatch]);

  useEffect(() => {
    if (paymentSelector.packageData && paymentSelector.activePackageId) {
      dispatch(setCalculatePrice());
    }
  }, [paymentSelector.packageData, paymentSelector.activePackageId, dispatch]);

  return (
    <Fragment>
      <StepV1 active="payment" />
      <PricePaymentContainer sx={{ boxShadow: 3 }}>
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.primary,
            flex: "1 1 0%",
            padding: "1rem",
          }}
        >
          <Grid item container>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <MUI.PricePaymentHeader sx={{ textAlign: "center" }}>
                Select a payment method
              </MUI.PricePaymentHeader>
            </Grid>
            <MUI.PricePaymentSelector
              sx={{ width: "100%", marginX: "auto !important", mb: 3 }}
            >
              <input
                style={{ maxWidth: "auto" }}
                id="bcel-ref"
                type="radio"
                name="payment-selected"
                hidden={true}
                checked={paymentSelector.paymentSelect === "bcel"}
                onChange={handlePaymentTab}
                value="bcel"
              />
              <MUI.PricePaymentLabel
                className="payment-selector"
                htmlFor="bcel-ref"
              >
                <MUI.PricePaymentLabelCircle className="payment-circle" />
                <MUI.PricePaymentBox>
                  <img src={bcelIcon} alt="bcel-icon" loading="lazy" />
                  <Typography component={"p"}>BCEL One</Typography>
                </MUI.PricePaymentBox>
              </MUI.PricePaymentLabel>
              <input
                id="visa-ref"
                type="radio"
                name="payment-selected"
                hidden={true}
                checked={paymentSelector.paymentSelect === "visa"}
                onChange={handlePaymentTab}
                value="visa"
              />
              <MUI.PricePaymentLabel
                className="payment-selector"
                htmlFor="visa-ref"
              >
                <MUI.PricePaymentLabelCircle className="payment-circle" />

                <MUI.PricePaymentBox>
                  <img src={visaIcon} alt="visa-icon" loading="lazy" />
                  <Typography component={`p`}>Credit card</Typography>
                </MUI.PricePaymentBox>
              </MUI.PricePaymentLabel>
            </MUI.PricePaymentSelector>
          </Grid>
          <Grid item container>
            {paymentSelector.paymentSelect &&
              paymentSelector.paymentSelect === "bcel" && (
                <Grid item sm={12}>
                  <MUI.PricePaymentQRCode
                    sx={{ width: "100%", textAlign: "center" }}
                  >
                    <Typography variant="h3">Scan QR Code</Typography>
                  </MUI.PricePaymentQRCode>
                  <PricePaymentContainerBox>
                    <PricePaymentForm />
                  </PricePaymentContainerBox>
                </Grid>
              )}
            {paymentSelector.paymentSelect &&
              paymentSelector.paymentSelect === "visa" && (
                <Grid item sm={12}>
                  <PricePaymentSummary />
                </Grid>
              )}
          </Grid>
        </Paper>
      </PricePaymentContainer>
    </Fragment>
  );
}

export default PricePayment;
