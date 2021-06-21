import React from "react";
import { Switch, Route} from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "../assets/jss/material-dashboard-pro-react/layouts/authStyle.js";

import login from "../assets/img/login.jpeg";
import error from "../assets/img/clint-mckoy.jpg";

// views
import LoginUser from '../views/Paginas/Login';

const useStyles = makeStyles(styles);

export default function Pages(props) {
  const { ...rest } = props;
  // ref for the wrapper div
  const wrapper = React.createRef();
  // styles
  const classes = useStyles();
  React.useEffect(() => {
    document.body.style.overflow = "unset";
    // Specify how to clean up after this effect:
    return function cleanup() {};
  });
  const getBgImage = () => {
    if (window.location.pathname.indexOf("/auth/login-page") !== -1) {
        return login;
    } else if (window.location.pathname.indexOf("/auth/error-page") !== -1) {
      return error;
    }
  };
  return (
    <div>
      <div className={classes.wrapper} ref={wrapper}>
        <div
          className={classes.fullPage}
          style={{ backgroundImage: "url(" + getBgImage() + ")" }}
        >
          <Switch>
            <Route path="/auth/login-page" name="Login" render={props => <LoginUser {...props}/>} />
          </Switch>
        </div>
      </div>
    </div>
  );
}
