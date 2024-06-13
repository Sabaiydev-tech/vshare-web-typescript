import Landing from "components/presentation/Landing";
import PresentationLayout from "components/presentation/PresentationLayout";
import { RouteObject } from "react-router-dom";
import ContactUs from "./pages/contact-us/ContactUs";
import Feedback from "./pages/feedback/FeedBack";
import FileDrop from "./pages/file-drop/FileDrop";
import FileDropDownloader from "./pages/file-drop/FileDropDownloader";
import FileUploader from "./pages/file-uploader/FileUploader";
import Home from "./pages/home/Home";
import PricingPlan from "./pages/pricing-plan/PricingPlan";
import PrivacyPolicy from "./pages/privacy-and-policy/PrivacyPolicy";
import TermCondition from "./pages/term-and-condition/TermCondition";

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
            <FileUploader />
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
    ],
  },
];

export default routes;
