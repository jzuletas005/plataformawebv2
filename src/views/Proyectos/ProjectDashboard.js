import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";

// firebase components
import FService from '../../services/FirebaseService.js';

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

export default function ProjectDashboard () {
    const classes = useStyles();
    const classesT = useStylesTables();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);

    //firebase 
    const [project, setProject] = useState([]);
    const onDataChange = (items) => {
        let us = [];

        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                projectid: data.id,
                name: data.name,
                enterprise: data.enterprise,
                dateStart: data.dateStart,
                dateEnd: data.dateEnd,
                actions: (
                  // we've added some custom button actions
                  <div className="actions-right">
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
                          warningWithConfirmAndCancelMessage(id, data.name);
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
        setProject(us);
    };

    useEffect(() => {
        const unsubscribe = FService.getAllProject().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    function warningWithConfirmAndCancelMessage(a,b){
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title={"¿Desea eliminar al proyecto " + b + " ?"}
            onConfirm={() => waiting(a)}
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

      const waiting = async (a) =>{
        waitAlert();
        await deleteProject(a);
        var data =  await getWorker(a);
        await updateWorker(data);
        var data2 = await getFileEnterprise(a);
        await deleteFileEnterprise(data2);
        var data3 = await getCourseP(a);
        await deleteProjectCourse(data3);
        hideAlert();
        successDelete();
      }

      const deleteProjectCourse = (props) => {
        return new Promise ((resolve) => {
          props.forEach(function (p) {
            FService.removeCourseWorker(p.id).then(() =>{
              console.log("Done");
            }).catch(err =>{
              console.log("Error: " +err);
            });
          });
          resolve();
        }).catch(err => {console.log("Error: " +err)})
      }

      const getCourseP = (props) =>{
        return new Promise ((resolve) => {
          FService.getCourseProject(props).get().then((w) =>{
            let arr = [];
            w.docs.forEach(function (a){
              arr.push({
                id: a.id
              })
            })
            resolve(arr);
          }).catch(err => {console.log("Error: " +err )})
        }).catch(err => {console.log("Error: " +err)})
      }

      const getFileEnterprise = (props) =>{
        return new Promise ((resolve) => {
          FService.getFileWP(props).get().then((w) =>{
            let arr = [];
            w.docs.forEach(function (a){
              arr.push({
                id: a.id
              })
            })
            resolve(arr);
          }).catch(err => {console.log("Error: " +err)})
        }).catch(err => {console.log("Error: " +err)})
      }

      const deleteFileEnterprise = (props) =>{
        return new Promise ((resolve) => {
          props.forEach(function (f){
            FService.removeFileEnterprise(f.id).then(() =>{
              console.log("Done");
            }).catch(err => {console.log("Error: " +err)})
          });
          resolve();
        }).catch (err => {console.log("Error: " + err)})
      }

      const updateWorker = (props) =>{
        return new Promise((resolve) =>{
          props.forEach(function (p) {
            FService.updateWorker(p.id, {idDocProject: "", project: "No Asignado", status: "Disponible"}).then(()=>{
              console.log("Updated");
            }).catch(err => {console.log("Error: " +err)})
          });
          resolve();
        }).catch(err =>{console.log("Error: " +err)})
      }

      const getWorker = (props) =>{
        return new Promise ((resolve) =>{
          FService.getWorkerWProject(props).get().then((w) =>{
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

      const deleteProject = (p) =>{
        return new Promise ((resolve) =>{
          FService.removeProject(p).then(() =>{
            console.log("Eliminado");
            resolve();
          }).catch((e) => {
            console.log(e);
          });
        }).catch(err => {console.log("Error: " +err)})
      }
  
      const successDelete = (p) => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Proyecto Eliminado!"
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
                                        Inscribe un proyecto
                                    </h4>
                                    <HtmlTooltip
                                      title={
                                        <React.Fragment>
                                          <Typography color="inherit">Agregar</Typography>
                                          {"Botón que permite crear proyectos para empresas"} 
                                        </React.Fragment>
                                      }
                                      TransitionComponent={Zoom}
                                    >
                                      <Button round color="success" component={Link} to="/admin/project-add">
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
                        <h4 className={classesT.cardIconTitle}>Proyectos</h4>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            columns={[
                                {
                                Header: "ID",
                                accessor: "projectid"
                                },
                                {
                                Header: "Nombre",
                                accessor: "name"
                                },
                                {
                                Header: "Empresa",
                                accessor: "enterprise"
                                },
                                {
                                Header: "Fecha Inicio",
                                accessor: "dateStart"
                                },
                                {
                                Header: "Fecha Termino",
                                accessor: "dateEnd"
                                },
                                {
                                Header: "Acciones",
                                accessor: "actions"
                                }
                            ]}
                            data ={project}
                        />
                    </CardBody>
                    </Card>
                </GridItem>
                {alert}          
          </GridContainer>
        </div>
      )           
}