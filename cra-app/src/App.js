import logo from "./logo.svg";
import "./App.css";
import { createBrowserHistory } from "history";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Auth from "./Auth";

const history = createBrowserHistory();
const onRedirectCallback = (appState) => {
  // If using a Hash Router, you need to use window.history.replaceState to
  // remove the `code` and `state` query parameters from the callback url.
  // window.history.replaceState({}, document.title, window.location.pathname);
  history.replace((appState && appState.returnTo) || window.location.pathname);
};

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>CRA Dashboard App</p>
          <div>
            <a
              className="App-link"
              href="http://localhost:3000/"
              // target="_blank"
              rel="noopener noreferrer"
            >
              Articles
            </a>
            <Auth />
          </div>
        </header>
      </div>
    </Auth0Provider>
  );
}

export default App;
