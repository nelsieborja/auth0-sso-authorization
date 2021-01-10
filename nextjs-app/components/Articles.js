import { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { useApi } from "../hooks/use-api";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles((theme) => ({
  by: {
    marginBottom: theme.spacing(1),
  },
}));

const Articles = ({ isWriter }) => {
  const [open, setOpen] = useState("");
  const handleOpen = (id) => setOpen(`Delete article: ${id}`);
  const handleClose = () => setOpen("");

  const classes = useStyles();

  const { loading, error, data: articles = [] } = useApi(
    `http://localhost:8080/${isWriter ? "w-" : ""}articles`
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Oops... {error.message}</Alert>;
    // if (error.error === "consent_required") {
    //   return <div>Consent to reading articles</div>;
    // }
    // return <div>Oops {error.message}</div>;
  }

  return (
    <>
      {!articles.length && <Alert severity="info">No article available</Alert>}

      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid key={article.id} item xs={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  className={classes.by}
                >
                  by: {article.user_id}
                </Typography>

                <Typography variant="body2" component="p">
                  {article.body}
                </Typography>
              </CardContent>

              {isWriter && (
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleOpen(article.title)}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        TransitionComponent={SlideTransition}
        open={open !== ""}
        autoHideDuration={6000}
        onClose={handleClose}
        message={open}
        action={
          <>
            <Button color="secondary" size="small" onClick={handleClose}>
              DELETE
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
};

export default Articles;
