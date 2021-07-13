import React, { useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutlined";

// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardFooter from "../../components/Card/CardFooter.js";

//Alert
import SweetAlert from "react-bootstrap-sweetalert";

import styles from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

import avatar from '../../assets/img/plataformalogo.png';

//firebase
import FService from "../../services/FirebaseService.js";


// style for this view
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);

export default function LoginPage() {
  const classesA = useStylesAlert();
  const classes = useStyles();

  //variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //alerta
  const [alert, setAlert] = useState(null);

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  React.useEffect(() => {
    let id = setTimeout(function() {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  // function that returns true if value is email, false otherwise
  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  const typeClick = () =>{
    FService.signIn(email, password).then(u => {window.location.href="/admin/dashboard";}).catch(err => {errorAlert("Sus credenciales nos válidas"); console.log("Error: " +err);});
    //console.log(email, password);
  }

  const errorAlert = (text) => {
    setAlert(
        <SweetAlert
        error
        style={{ display: "block", marginTop: "-100px" }}
        title= {text}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classesA.button + " " + classesA.success}
        >
        Por favor, verifique el formulario.
        </SweetAlert>
    );
};

const hideAlert = () => {
  setAlert(null);
};

  return (
    <div className={classes.container}>
      <GridContainer justify="center" direction="row"  alignItems ="center">
        <GridItem  >
          <img src={avatar} style={{width: "105%"}}/>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="primary"
              >
                <h4 className={classes.cardTitle}>Autentificación</h4>
              </CardHeader>
              <CardBody>
                <CustomInput
                  labelText="Email..."
                  id="email"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      if(verifyLength(event.target.value, 0)){
                        if(verifyEmail){
                          setEmail(event.target.value);
                        }else{
                          errorAlert("El email no es válido")
                        }
                      }else{
                        errorAlert("Por favor ingrese el correo")
                      }
                    },
                    type: "email",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      if(verifyLength(event.target.value, 0)){
                        setPassword(event.target.value);
                      }else{
                        errorAlert("Por favor escriba la contraseña")
                      }
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockOutline className={classes.inputAdornmentIcon}/>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off"
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="primary" simple size="lg" block onClick={typeClick}>
                  Ingresar
                </Button>
              </CardFooter>
            </Card>
          </form>
          {alert}
        </GridItem>
      </GridContainer>
    </div>
  );
}
