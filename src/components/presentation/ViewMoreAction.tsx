import { Box, Button } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

type Prop = {
  handleViewMore?: () => void;
};

function ViewMoreAction(props: Prop) {
  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          position: "relative",
        }}
      >
        <Button
          endIcon={<ExpandMore />}
          size="small"
          variant="outlined"
          onClick={props.handleViewMore}
        >
          View more
        </Button>
      </Box>
    </Box>
  );
}

export default ViewMoreAction;
