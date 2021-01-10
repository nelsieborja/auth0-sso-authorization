import { useAuth0 } from "@auth0/auth0-react";
import Articles from "../components/Articles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import { makeStyles } from "@material-ui/core/styles";
import { useMemo } from "react";
import Add from "../components/Add";

const useStyles = makeStyles((theme) => ({
  wide: {
    flexGrow: 1,
  },
  container: {
    padding: theme.spacing(4),
  },
  auth: {
    minWidth: 150,
    textAlign: "right",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
  },
  profile: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  avatar: {
    height: 100,
    width: 100,
  },
}));

export default function Home() {
  const classes = useStyles();

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    // loginWithPopup,
    logout,
  } = useAuth0();

  const roles = useMemo(() => {
    if (!isAuthenticated) {
      return [];
    }

    return user[`${process.env.NEXT_PUBLIC_AUTH0_NAMESPACE}roles`] || [];
  }, [isAuthenticated, user]);

  console.log(isLoading, isAuthenticated, error, user, roles);

  const hasRoles = roles.length;

  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" className={classes.wide}>
            Articles App
          </Typography>

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Dashboard
            </Link>
            <Typography color="textPrimary">Articles</Typography>
          </Breadcrumbs>

          <div className={classes.auth}>
            {!isLoading &&
              (isAuthenticated ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={loginWithRedirect}
                >
                  Login
                </Button>
              ))}
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className={classes.container}>
        {isLoading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}

        {error && <Alert severity="error">Oops... {error.message}</Alert>}

        {isAuthenticated ? (
          <>
            <Grid
              container
              spacing={2}
              alignItems="center"
              className={classes.profile}
            >
              <Grid item>
                <Avatar
                  src={user.picture}
                  alt="avatar"
                  className={classes.avatar}
                />
              </Grid>
              <Grid item className={classes.wide}>
                <Typography variant="h5">{user.name}</Typography>
                <Typography variant="h7">
                  <strong>ROLE:</strong>{" "}
                  {hasRoles
                    ? roles.map((role) => (
                        <Chip
                          key={role}
                          variant="outlined"
                          color="secondary"
                          size="small"
                          label={role}
                        />
                      ))
                    : "Unassigned"}
                </Typography>
              </Grid>

              {hasRoles && roles[0] === "writer" && <Add />}
            </Grid>

            {hasRoles ? (
              <Articles isWriter={roles[0] === "writer"} />
            ) : (
              <Alert severity="info">
                We are reviewing your registration...
              </Alert>
            )}
          </>
        ) : (
          !isLoading &&
          !error && <Typography variant="h4">More info later...</Typography>
        )}
      </Container>
    </>
  );
}
