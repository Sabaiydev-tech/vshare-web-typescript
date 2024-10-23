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
import { useCallback, useEffect } from "react";
import { errorMessage } from "utils/alert.util";
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

  const handleEnterKey = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        if (!props.password) {
          errorMessage('Please, input the password');
          return;
        }
        props?._confirmPasword?.(props.password);
      }
    },
    [props.password, props?._confirmPasword]
  );
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handleEnterKey(event);

    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleEnterKey]);

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
            fontSize: props.isMobile ? "0.9rem" : "1.2rem"
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
            // padding: "20px 30px !important",
            pb: '20p',
            px: '30px',
            pt:'5px',
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
            <Typography variant="h6" sx={{ mb: 7 }}>
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
          sx={{ background: "#17766B", px: 7, mb: 3, mx: 'auto'}}
          size="small"
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogConfirmPassword;
