import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

// firebase components
import FService from '../../services/FirebaseService.js';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import Call from "@material-ui/icons/PhonelinkRing";

// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from '../../components/Grid/GridItem.js';
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import Button from "../../components/CustomButtons/Button.js";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import SweetAlert from "react-bootstrap-sweetalert";


import stylesTables from "../../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import {
    cardTitle,
    roseColor
} from "../../assets/jss/material-dashboard-pro-react.js";

const styles = {
    cardTitle,
    cardTitleWhite: {
      ...cardTitle,
      color: "#FFFFFF",
      marginTop: "0"
    },
    cardCategoryWhite: {
      margin: "0",
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: ".875rem"
    },
    cardCategory: {
      color: "#999999",
      marginTop: "10px"
    },
    icon: {
      color: "#333333",
      margin: "10px auto 0",
      width: "130px",
      height: "130px",
      border: "1px solid #E5E5E5",
      borderRadius: "50%",
      lineHeight: "174px",
      "& svg": {
        width: "55px",
        height: "55px"
      },
      "& .fab,& .fas,& .far,& .fal,& .material-icons": {
        width: "55px",
        fontSize: "55px"
      }
    },
    iconRose: {
      color: roseColor
    },
    marginTop30: {
      marginTop: "30px"
    },
    testimonialIcon: {
      marginTop: "30px",
      "& svg": {
        width: "40px",
        height: "40px"
      }
    },
    cardTestimonialDescription: {
      fontStyle: "italic",
      color: "#999999"
    }
  };

const useStyles = makeStyles(styles);
const useStylesTables = makeStyles(stylesTables);
const useStylesAlert = makeStyles(stylesAlert); 


export default function CallDashboard (){
  const classes = useStyles();
  const classesT = useStylesTables();
  const classesA = useStylesAlert();
    
  //alerta
  const [alert, setAlert] = useState(null);

  //firebase
  const [call, setCall] = useState([]);
  const onDataChange = (items) => {
    let us = [];

    items.docs.forEach(function (item, keyX) {
        let id = item.id;
        let data = item.data();
        us.push({
            key: keyX,
            id: id,
            callid: data.callid,
            title: data.calltitle,
            datepublish: data.calldatepublish,
            dateexp: data.calldateexp,
            actions: (
              // we've added some custom button actions
              <div className="actions-right">
                {/* use this button to remove the data row */}
                <Button
                  justIcon
                  round
                  simple
                  size="lg"
                  onClick={() =>{
                    warningWithConfirmAndCancelMessage(id, data.calltitle);
                  }}
                  color="danger"
                  className="remove"
                >
                  <Close />
                </Button>{" "}
              </div>
            )
        });
    });
    setCall(us);
};

useEffect(() => {
    const unsubscribe = FService.getAllCalls().onSnapshot(onDataChange);
    return () => unsubscribe();
}, []);

function warningWithConfirmAndCancelMessage(a,b){
  setAlert(
    <SweetAlert
      warning
      style={{ display: "block", marginTop: "-100px" }}
      title={"¿Desea eliminar la convocatoria " + b + " ?"}
      onConfirm={() => successDelete(a)}
      onCancel={() => cancelDetele()}
      confirmBtnCssClass={classesA.button + " " + classesA.success}
      cancelBtnCssClass={classesA.button + " " + classesA.danger}
      confirmBtnText="Si"
      cancelBtnText="No"
      showCancel
    >
    </SweetAlert>
  );
};

const successDelete = (p) => {
  //console.log(p);
  //Eliminacion por tabla e id
  FService.removeEnterprise(p).then(() =>{
    console.log("Eliminado");
  }).catch((e) => {
    console.log(e);
  });
  
  setAlert(
    <SweetAlert
      success
      style={{ display: "block", marginTop: "-100px" }}
      title="Empresa Eliminada!"
      onConfirm={() => hideAlert()}
      onCancel={() => hideAlert()}
      confirmBtnCssClass={classesA.button + " " + classesA.success}
    >
    </SweetAlert>
  );
};

const cancelDetele = () => {
  setAlert(
    <SweetAlert
      danger
      style={{ display: "block", marginTop: "-100px" }}
      title="Eliminación Cancelada"
      onConfirm={() => hideAlert()}
      onCancel={() => hideAlert()}
      confirmBtnCssClass={classesA.button + " " + classesA.success}
    >
    </SweetAlert>
  );
};
const hideAlert = () => {
  setAlert(null);
};


  return (
    <div>
      <GridContainer spacing={3}>
          <GridItem xs>
                <GridContainer justify='center' direction='column'>
                    <GridItem>
                        <Card pricing>
                            <CardBody pricing>
                                <div className={classes.icon}> 
                                    <Add className={classes.iconRose} />
                                </div>
                                <h4 className={`${classes.cardTitle} ${classes.marginTop30}`}>
                                    Crear una Convocatoria
                                </h4>
                                <Button round color="success" component={Link} to="/admin/call-add">
                                    Agregar
                                </Button>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem xs={9}>
                <Card>
                <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                    <Assignment />
                    </CardIcon>
                    <h4 className={classesT.cardIconTitle}>Convocatoria</h4>
                </CardHeader>
                <CardBody>
                    <ReactTable
                        columns={[
                            {
                            Header: "ID",
                            accessor: "callid"
                            },
                            {
                            Header: "Titulo",
                            accessor: "title"
                            },
                            {
                            Header: "Fecha de Publicación",
                            accessor: "datepublish"
                            },
                            {
                            Header: "Fecha de Expiración",
                            accessor: "dateexp"
                            },
                            {
                            Header: "Acciones",
                            accessor: "actions"
                            }
                        ]}
                        data ={call}
                    />
                </CardBody>
                </Card>
            </GridItem>
              {alert}
      </GridContainer>
  </div>
  );
}