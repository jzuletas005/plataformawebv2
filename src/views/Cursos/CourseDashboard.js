import React, { useState, useEffect } from 'react';

// firebase components
import FService from '../../services/FirebaseService.js';


import { Link, Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import { withStyles,makeStyles } from "@material-ui/core/styles";
import { Divider, Tooltip, Typography, Zoom } from '@material-ui/core';
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import People from '@material-ui/icons/PersonAdd';
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
import { CircularProgress } from '@material-ui/core';

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

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

const useStyles = makeStyles(styles);
const useStylesTables = makeStyles(stylesTables);
const useStylesAlert = makeStyles(stylesAlert);


export default function CourseDashboard () {

    const classes = useStyles();
    const classesT = useStylesTables();
    const classesA = useStylesAlert();
    
    //alerta
    const [alert, setAlert] = useState(null);
    //Variable
    const [listCourse, setListCourse] = useState([]);

    const onDataChange = (items) => {
        let us = [];
  
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            var type = data.filetype.toUpperCase();
            us.push({
                key: keyX,
                id: id,
                name: data.name,
                type: type,
                questions: data.questions.length,
                date: data.date,
                actions: (
                  // we've added some custom button actions
                  <div className="actions-right">
                    {/* use this button to add a edit kind of action */}
                    {/* View user data */}
                    {/* use this button to remove the data row */}
                    <HtmlTooltip 
                      title={
                        <React.Fragment>
                          <Typography color="inherit">{"Eliminar"} </Typography>
                          {/*"Eliminar  asignación de " + data.news + " a " + data.enterprise*/} 
                        </React.Fragment>
                      }
                    >
                      <Button
                        justIcon
                        round
                        simple
                        size="lg"
                        onClick={() =>{
                          warningWithConfirmAndCancelMessage(id);
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
        setListCourse(us);
    };
  
      useEffect(() => {
        const unsubscribe = FService.getAllCourse().onSnapshot(onDataChange);
        return () => unsubscribe();
      }, []);

      function warningWithConfirmAndCancelMessage(props){
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title="¿Desea eliminar el curso?"
            onConfirm={() => waiting(props)}
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

      const waiting = async (props) =>{
        waitAlert();
        await deleteCourse(props);
        var data = await getAsingCourse (props);
        await deleteAsingCourse(data);
        hideAlert();
        successDelete();
      }

      const deleteAsingCourse = (props  ) =>{
        return new Promise ((resolve) => {
          props.forEach(function (a){
            FService.removeCourseWorker(a.id).then(() => {
              console.log("Done")
            }).catch(err => {console.log("Error: " +err)})
          })
          resolve();
        }).catch(err => {console.log("Error: " +err)})
      }

      const deleteCourse = (props) =>{
        return new Promise ((resolve) =>{
          FService.removeCourse(props).then(() =>{
            console.log("Done");
            resolve();
          }).catch(err => {console.log("Error: " +err)})
        }).catch(err => {console.log("Error: " +err)})
      }

      const getAsingCourse = (props) =>{
        return new Promise ((resolve) =>{
          FService.getCourseWbyID(props).get().then((w) =>{
            let arr = [];
            w.docs.forEach(function (f){
              arr.push({
                id:f.id
              })
            })
            resolve(arr);
          }).catch(err => {console.log("Error: " +err)})
        }).catch(err => {console.log("Error: " +err)})
      }

      const waitAlert = () => {
        setAlert(
          <SweetAlert
            info
            style={{ display: "block", marginTop: "-100px" }}
            title= {"Cargando datos"}
            onConfirm={hideAlert}
            showConfirm={false}
          >
          <CircularProgress />
          </SweetAlert>
        );
      };
  
      const successDelete = () => {        
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Curso Eliminado!"
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
                                        <People className={classes.iconRose} />
                                    </div>
                                    <h4 className={`${classes.cardTitle} ${classes.marginTop30}`}>
                                        Crear Curso
                                    </h4>
                                    <HtmlTooltip
                                      title={
                                        <React.Fragment>
                                          <Typography color="inherit">Agregar</Typography>
                                          {"Botón que permite agregar cursos al sistema"} 
                                        </React.Fragment>
                                      }
                                      TransitionComponent={Zoom}
                                    >
                                      <Button round color="success" component={Link} to="/admin/courses-add">
                                          Agregar
                                      </Button>
                                    </HtmlTooltip>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer> <GridContainer>
                      <GridItem xs>
                        <Card profile>
                          <CardBody>
                            Formato archivo Preguntas
                            <Button
                              justIcon
                              round
                              simple
                              size="lg"
                              onClick={() =>{
                                  //console.log(data.url);
                                  window.location="https://firebasestorage.googleapis.com/v0/b/plataforma-dev-34ce8.appspot.com/o/template%2FpreguntasTemplate.xlsx?alt=media&token=94d5b835-c494-49a4-b171-3bc912ba4b11";
                              }}
                              color="primary"
                              className="download"
                            >
                              <Download />
                            </Button>
                            <Divider />
                            
                            Formato archivo Respuestas
                            <Button
                              justIcon
                              round
                              simple
                              size="lg"
                              onClick={() =>{
                                  //console.log(data.url);
                                  window.location="https://firebasestorage.googleapis.com/v0/b/plataforma-dev-34ce8.appspot.com/o/template%2FrespuestasTemplate.xlsx?alt=media&token=42b14e35-b60c-43f7-9957-7688d3c485da";
                              }}
                              color="primary"
                              className="download"
                            >
                              <Download />
                            </Button>
                            <Divider />

                            Formato archivo Alternativas
                            <Button
                              justIcon
                              round
                              simple
                              size="lg"
                              onClick={() =>{
                                  //console.log(data.url);
                                  window.location="https://firebasestorage.googleapis.com/v0/b/plataforma-dev-34ce8.appspot.com/o/template%2FalternativasTemplate.xlsx?alt=media&token=3a896470-75b0-4557-9c17-d5bf18516d3e";
                              }}
                              color="primary"
                              className="download"
                            >
                              <Download />
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
                        <h4 className={classesT.cardIconTitle}>Cursos</h4>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            columns={[
                                {
                                Header: "Curso",
                                accessor: "name"
                                },
                                {
                                Header: "Tipo de Archivo",
                                accessor: "type"
                                },
                                {
                                Header: "N° de Preguntas",
                                accessor: "questions"
                                },
                                {
                                Header: "Fecha Creación",
                                accessor: "date"
                                },
                                {
                                Header: "Acciones",
                                accessor: "actions"
                                }
                            ]}
                            data ={listCourse}
                        />
                        
                    </CardBody>
                    </Card>
                </GridItem>
                {alert}
          </GridContainer>
    )

}