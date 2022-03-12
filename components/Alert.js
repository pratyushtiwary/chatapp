import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export default function Alert({
  open,
  handleClose,
  title,
  children,
  onSuccess,
}) {
  const btnStyle = {
    backgroundColor: "white !important",
    color: "black !important",
    border: "none !important",
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="simple">
          Dismiss
        </Button>
        <Button onClick={onSuccess} autoFocus className="simple">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
