import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from './layouts/Auth';
import AdminLayout from './layouts/Admin';

import "../src/assets/scss/material-dashboard-pro-react.scss";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/auth" component={AuthLayout} />
      <Route path="/admin" component={AdminLayout} />
      <Redirect from="/" to="/auth/login-page" />
    </Switch>
  </Router>,
  document.getElementById('root')
);

