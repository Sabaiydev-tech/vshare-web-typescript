import Landing from "components/presentation/Landing";
import PresentationLayout from "components/presentation/PresentationLayout";
import { Navigate, RouteObject } from "react-router-dom";
import ContactUs from "./pages/contact-us/ContactUs";
import Feedback from "./pages/feedback/FeedBack";

import FileDrop from "./pages/file-drop/FileDrop";
import FileDropDownloader from "./pages/file-drop/FileDropDownloader";
import FileUploader from "./pages/file-uploader/FileUploader";
import Home from "./pages/home/Home";
import PricingPlan from "./pages/pricing-plan/PricingPlan";
import PrivacyPolicy from "./pages/privacy-and-policy/PrivacyPolicy";
import TermCondition from "./pages/term-and-condition/TermCondition";
import PricingCheckout from "./pages/pricing-checkout/PricingCheckout";
import PriceSignUp from "components/priceCheckout/PriceSignUp";
import PricePayment from "components/priceCheckout/PricePayment";
import ConfirmPayment from "./pages/confirm-payment/ConfirmPayment";
import { MenuDropdownProvider } from "contexts/MenuDropdownProvider";
import ExtendFolder from "./pages/extend-folder/ExtendFolder";

const routes: RouteObject[] = [
  {
    element: <PresentationLayout />,
    children: [
      {
        path: "/",
        element: (
          <Landing>
            <Home />
          </Landing>
        ),
      },

      {
        path: "df",
        element: (
          <Landing>
            <MenuDropdownProvider>
              <FileUploader />
            </MenuDropdownProvider>
          </Landing>
        ),
      },

      {
        path: "df/extend",
        element: (
          <Landing>
            <MenuDropdownProvider>
              <ExtendFolder />
            </MenuDropdownProvider>
          </Landing>
        ),
      },
      {
        path: "terms-conditions",
        element: (
          <Landing>
            <TermCondition />
          </Landing>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <Landing>
            <PrivacyPolicy />
          </Landing>
        ),
      },
      {
        path: "contact-us",
        element: (
          <Landing>
            <ContactUs />
          </Landing>
        ),
      },
      {
        path: "pricing-plans",
        element: (
          <Landing>
            <PricingPlan />
          </Landing>
        ),
      },
      {
        path: "pricing/checkout/:id",
        element: <PricingCheckout />,
      },
      {
        path: "pricing/accounts/:id",
        element: <PriceSignUp />,
      },
      {
        path: "pricing/payment/:id",
        element: <PricePayment />,
      },
      {
        path: "pricing/confirm-payment",
        element: <ConfirmPayment />,
      },
      {
        path: "pricing/confirm/:id",
        element: <PriceSignUp />,
      },
      {
        path: "feedback",
        element: (
          <Landing>
            <Feedback />
          </Landing>
        ),
      },
      {
        path: "filedrop",
        element: (
          <Landing>
            <FileDropDownloader />
          </Landing>
        ),
      },
      {
        path: "filedrops",
        element: (
          <Landing>
            <FileDrop />
          </Landing>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
];

export default routes;
