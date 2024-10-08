import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, createTheme } from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import he from "he";
import * as React from "react";
import * as MUI from "styles/presentation/faqAccordion.style";

type ControlledAccordionsProps = {
  question: string;
  answer: string;
};

export default function ControlledAccordions(props: ControlledAccordionsProps) {
  const theme = createTheme();
  const { question, answer } = props;
  const [expanded, setExpanded] = React.useState(false);

  /* const handleChange = (panel: boolean) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }; */

  return (
    <>
      <MUI.MUIAccordion
        /* expanded={expanded === "panel1"}
        onChange={handleChange("panel1")} */
        sx={{ padding: "0 0.6rem" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.8rem",
                fontWeight: 500,
                textAlign: "start !important",
              },
            }}
          >
            {he.decode(question)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              fontSize: "0.9rem",
              fontWeight: 400,
              textAlign: "justify",
              textJustify: "distribute",
              hyphens: "auto",
              textAlignLast: "left",
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.8rem",
                fontWeight: 400,
                textAlign: "justify",
                textJustify: "distribute",
                hyphens: "auto",
                textAlignLast: "left",
              },
            }}
          >
            <Typography>{he.decode(answer)}</Typography>
          </Box>
        </AccordionDetails>
      </MUI.MUIAccordion>
    </>
  );
}
