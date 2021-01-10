import { useAuth0 } from "@auth0/auth0-react";

const Auth = () => {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  if (isLoading) {
    return null;
  }

  return (
    <>
      {" "}
      /{" "}
      {isAuthenticated ? (
        <a
          href="#"
          className="App-link"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout {user.email}
        </a>
      ) : (
        <a href="#" className="App-link" onClick={loginWithRedirect}>
          Login
        </a>
      )}
    </>
  );
};

export default Auth;
