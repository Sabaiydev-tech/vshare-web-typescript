import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import VerifyIcon from "assets/images/check-upload.png";
import CheckIcon from "assets/images/confirm-payment.png";
import StepV1 from "components/StepV1";
import { ENV_KEYS } from "constants/env.constant";
import { useSelector } from "react-redux";
import { paymentState } from "stores/features/paymentSlice";
import * as MUI from "styles/confirmPayment.style";

const ConfirmPayment = () => {
  const {
    recentPayment
  } = useSelector(paymentState);

  const paymentId = recentPayment?.transactionId ? recentPayment?.transactionId : '';
  
  return (
    <>
      <StepV1 active="confirm" />
      <MUI.ConfirmPaymentContainer>
        <MUI.HeaderContainer>
          <MUI.HeaderContainerWrapper>
            <MUI.HeaderCircleContainer>
              <MUI.ConfirmImage src={CheckIcon} />
            </MUI.HeaderCircleContainer>
          </MUI.HeaderContainerWrapper>
        </MUI.HeaderContainer>

        <MUI.BodyContainer>
          <MUI.BodyContainerWrap>
            <Typography variant="h2">Thank you !</Typography>

            <MUI.BodyInline>
              <img loading="lazy" src={VerifyIcon} alt="verify-icon" />
              <Typography component={`p`}>Payment Successfully</Typography>
            </MUI.BodyInline>

            <MUI.BodyBox>
              <Typography component={`span`}>
                Thank you for your subscription! Your reference{paymentId ? <Box component="em" fontWeight="bold" sx={{fontWeight: 700}}> #{paymentId} </Box> : ' '}has been successfully
                processed.
              </Typography>
            </MUI.BodyBox>

            <MUI.BodyAction>
              <MUI.ActionButton
                href={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}dashboard`}
              >
                Take me to vshare.net
              </MUI.ActionButton>
            </MUI.BodyAction>
          </MUI.BodyContainerWrap>
        </MUI.BodyContainer>
      </MUI.ConfirmPaymentContainer>
    </>
  );
};

export default ConfirmPayment;
