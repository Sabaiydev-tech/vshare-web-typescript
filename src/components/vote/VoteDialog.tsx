import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import UploadVote from "app/pages/vote/uploadVote";
import * as React from "react";

interface TypeProps {
  handleClose: () => void;
  isOpen: boolean;
}
export default function VoteDialog({ handleClose, isOpen }: TypeProps) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={isOpen}
        onClose={handleClose}
      >
        <DialogContent>
          <UploadVote handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
