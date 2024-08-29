import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { combineOldAndNewFileNames, cutFileName } from "utils/file.util";

type Props = {
  open: boolean;
  isMobile?: boolean;
  checkModal?: boolean;
  getFilenames: string;
  getNewFileName: string;
  password?: string;

  setPassword?: (str: string) => void;
  handleClose?: () => void;
  _confirmPasword?: (str: string) => void;
};

function DialogConfirmPassword(props: Props) {
  return (
    <Dialog open={props.open}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: props.isMobile ? "0.9rem" : "1.2rem",
          }}
        >
          Confirm password
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "20px 30px !important",
            maxWidth: "600px",
          }}
        >
          {props.checkModal ? (
            <Typography
              sx={{
                fontSize: props.isMobile ? "0.8rem" : "0.9rem",
                textAlign: "center",
              }}
            >
              Please enter your password for:
              <br />
              <span style={{ color: "#17766B" }}>
                {cutFileName(
                  combineOldAndNewFileNames(
                    props.getFilenames,
                    props.getNewFileName,
                  ) as string,
                  10,
                )}
              </span>
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ padding: "0", margin: "0" }}>
              Please enter your link password
            </Typography>
          )}
        </Box>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          value={props.password}
          onChange={(e) => props.setPassword?.(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        {props.checkModal ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => props.handleClose?.()}
            sx={{ background: "#EA5455" }}
            size="small"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          variant="contained"
          color="success"
          onClick={() => props._confirmPasword?.(props.password || "")}
          sx={{ background: "#17766B" }}
          size="small"
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogConfirmPassword;
