import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import Frontpage from "./pages/FrontPage";
import RenderOnAuthenticated from "./services/RenderOnAuthenticated";
import RenderOnAnonymous from "./services/RenderOnAnonymous";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MetricsProvider } from "./contexts/MatricsContext";
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () =>
  root.render(
    <>
      <Provider store={store}>
        <MetricsProvider>
          <ReactNotifications className="custom-react-notification" />
          <RenderOnAuthenticated>
            <App />
          </RenderOnAuthenticated>
          <RenderOnAnonymous>
            <Frontpage />
          </RenderOnAnonymous>
        </MetricsProvider>
      </Provider>
    </>
  );

// If you’re NOT using Keycloak right now:
renderApp();

// If you want to re-enable Keycloak auth later:
// import UserService from "./services/UserService";
// import HttpService from "./services/HttpService";
// UserService.initKeycloak(renderApp);
// HttpService.configure();