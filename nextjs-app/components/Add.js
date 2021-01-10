import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import { useMemo, useState, useCallback } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useAuth0 } from "@auth0/auth0-react";

const Add = ({ forceRefresh }) => {
  const { getAccessTokenSilently } = useAuth0();

  const [titleError, setTitleError] = useState(false);
  const [title, setTitle] = useState("");
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const [bodyError, setBodyError] = useState(false);
  const [body, setBody] = useState("");
  const handleChangeBody = (event) => {
    setBody(event.target.value);
  };

  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => {
    setOpen(false);

    setTitle("");
    setBody("");

    setTitleError(false);
    setBodyError(false);
  }, []);
  const handleSubmit = useCallback(() => {
    (async () => {
      setTitleError(!title);
      setBodyError(!body);

      if (!title && !body) {
        return;
      }

      const accessToken = await getAccessTokenSilently();
      const res = await fetch("http://localhost:8080/article", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({ title, body }),
        data: { enforce_policies: "true", token_dialect: "TOKEN_DIALECT" },
      });

      const data = await res.json();
      handleClose();
      forceRefresh();
      console.log(data);
    })();
  }, [title, body]);

  return (
    <Grid item>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        add article
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A user with a "writer" role can add an article.
          </DialogContentText>
          <TextField
            fullWidth
            autoFocus
            required
            error={titleError}
            margin="dense"
            id="title"
            label="Title"
            value={title}
            onChange={handleChangeTitle}
          />
          <TextField
            fullWidth
            required
            error={bodyError}
            margin="dense"
            id="body"
            label="Body"
            value={body}
            onChange={handleChangeBody}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Add;
