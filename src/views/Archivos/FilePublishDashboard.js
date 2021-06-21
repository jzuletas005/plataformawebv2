import React, {useState, useEffect} from 'react';

// firebase components
import FService from '../../services/FirebaseService.js';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Assignment from "@material-ui/icons/Assignment";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import Download from '@material-ui/icons/CloudDownload';

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
import { Link } from 'react-router-dom';

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


export default function FilePublishDashboard (){

    const classesA = useStylesAlert();
    const classes = useStyles();
    const classesT = useStylesTables();

    //alerta
    const [alert, setAlert] = useState(null);


    //variables
    const [listFileEnterprise, setListFileEnterprise] = useState([]);



    const onDataChange = (items) => {
        let us = [];
  
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                key: keyX,
                id: id,
                name: data.nameFile,
                type: data.typeFile,
                enterprise: data.nameEnterprise,
                project: data.nameProject,
                actions: (
                  // we've added some custom button actions
                  <div className="actions-right">
                    {/* use this button to add a edit kind of action */}
                    {/* View user data */}
                    {/* use this button to remove the data row */}
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() =>{
                        warningWithConfirmAndCancelMessage(id, data.nameFile, data.nameEnterprise);
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
        setListFileEnterprise(us);
    };

    
    useEffect(() => {
        const unsubscribe = FService.getallFileEnterprise().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);
    
    function warningWithConfirmAndCancelMessage(a,b,c){
      setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title={"¿Desea eliminar el archivo " + b + " asignado a " + c +" ?"}
          onConfirm={() => successDelete(a,b)}
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
  
    const successDelete = (p, b) => {
      //console.log(p);
      //Eliminacion por tabla e id
      FService.removeFileEnterprise(p).then(() =>{
        console.log("Eliminado");
        //deleteAll(b);
      }).catch((e) => {
        console.log(e);
      });
      
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Archivo Eliminada!"
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

    return(
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
                                  Asignación de Archivos
                              </h4>
                              <Button round color="success" component={Link} to="/admin/file-publish">
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
                  <h4 className={classesT.cardIconTitle}>Archivos Asignados</h4>
              </CardHeader>
              <CardBody>
                  <ReactTable
                      columns={[
                          {
                          Header: "Nombre",
                          accessor: "name"
                          },
                          {
                          Header: "Tipo",
                          accessor: "type"
                          },
                          {
                          Header: "Empresa",
                          accessor: "enterprise"
                          },
                          {
                            Header: "Proyecto",
                            accessor: "project"
                          },
                          {
                          Header: "Acciones",
                          accessor: "actions"
                          }
                      ]}
                      data ={listFileEnterprise}
                  />
              </CardBody>
              </Card>
          </GridItem>
            {alert}        
    </GridContainer>
    )
}