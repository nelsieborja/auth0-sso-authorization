import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useApi } from "../hooks/use-api";

const useStyles = makeStyles((theme) => ({
  by: {
    marginBottom: theme.spacing(1),
  },
}));

const Articles = ({ isWriter }) => {
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
                {/* <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Articles;
