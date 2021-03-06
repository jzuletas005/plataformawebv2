import React, {useState, useEffect} from 'react';

// firebase components
import FService from '../../services/FirebaseService.js';


import { Link, Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import { withStyles,makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography, Zoom } from '@material-ui/core';
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import People from '@material-ui/icons/PersonAdd';

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

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default function ArticlesPublishDashboard () {
    const classes = useStyles();
    const classesT = useStylesTables();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);

    //firebase post
    const [news, setNews] = useState([]);
    const onDataChange = (items) => {
        let us = [];

        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                idDocNews: data.idDocsNews,
                newsid: data.newsid,
                title: data.news,
                datepublish: data.date,
                sendto: data.enterprise,
                actions: (
                  // we've added some custom button actions
                  <div className="actions-right">
                    {/* use this button to remove the data row */}
                    <HtmlTooltip 
                      title={
                        <React.Fragment>
                          <Typography color="inherit">{"Eliminar"} </Typography>
                          {"Eliminar  asignaci??n de " + data.news + " a " + data.enterprise} 
                        </React.Fragment>
                      }
                    >
                      <Button
                        justIcon
                        round
                        simple
                        size="lg"
                        onClick={() =>{
                          warningWithConfirmAndCancelMessage(id, data.news, data.enterprise);
                        }}
                        color="danger"
                        className="remove"
                      >
                        <Close />
                      </Button>
                    </HtmlTooltip>
                    {" "}
                  </div>
                )
            });
        });
        setNews(us);
    };
    
    useEffect(() => {
        const unsubscribe = FService.getAllNewsPublish().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);
    
    function warningWithConfirmAndCancelMessage(a,b,c){
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title={"??Desea eliminar a la noticia " + b + " para "+ c +" ?"}
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
        FService.removeNewsPublish(p).then(() =>{
          console.log("Eliminado");
        }).catch((e) => {
          console.log(e);
        });
        
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Noticia Eliminada!"
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
            title="Eliminaci??n Cancelada"
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
                                      Publica una noticia
                                  </h4>
                                  <HtmlTooltip
                                    title={
                                      <React.Fragment>
                                        <Typography color="inherit">Agregar</Typography>
                                        {"Bot??n que permite asginar noticias a empresas"} 
                                      </React.Fragment>
                                    }
                                    TransitionComponent={Zoom}
                                  >
                                    <Button round color="success" component={Link} to="/admin/articles-publish">
                                        Agregar
                                    </Button>
                                  </HtmlTooltip>
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
                      <h4 className={classesT.cardIconTitle}>Noticias Asignadas</h4>
                  </CardHeader>
                  <CardBody>
                      <ReactTable
                          columns={[
                              {
                              Header: "Titulo",
                              accessor: "title"
                              },
                              {
                              Header: "Fecha",
                              accessor: "datepublish"
                              },
                              {
                              Header: "Dirigido",
                              accessor: "sendto"    
                              },
                              {
                              Header: "Acciones",
                              accessor: "actions"
                              }
                          ]}
                          data ={news}
                      />
                  </CardBody>
                  </Card>
              </GridItem>
              {alert}          
        </GridContainer>
      </div>
    )
}