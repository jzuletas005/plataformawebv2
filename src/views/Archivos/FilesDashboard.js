import React, {useState, useEffect} from 'react';

// firebase components
import FService from '../../services/FirebaseService.js';

// @material-ui/core components
import { withStyles,makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography, Zoom } from '@material-ui/core';
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
import { CircularProgress } from '@material-ui/core';

import stylesTables from "../../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import {
    cardTitle,
    roseColor
} from "../../assets/jss/material-dashboard-pro-react.js";
import { Link } from 'react-router-dom';
import { getDefaultFormatCodeSettings, updateSourceFile } from 'typescript';

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

export default function FileDashboard () {
  const classes = useStyles();
  const classesT = useStylesTables();
  const classesA = useStylesAlert();

  //alerta
  const [alert, setAlert] = useState(null);
  //firebase 
  const [files, setFiles] = useState([]);
  const onDataChange = (items) => {
    let us = [];

    items.docs.forEach(function (item, keyX) {
        let id = item.id;
        let data = item.data();
        var n = data.name+ "." + data.type.toLowerCase();
        getURL(n,id);
        us.push({
            fileid: id,
            name: data.name,
            type: data.type,
            size: data.size,
            datecreate: data.time,
            url: data.url,
            b64: data.b64,
            actions: (
              // we've added some custom button actions
              <div className="actions-right">
                {/*use to download the file */}
                <HtmlTooltip 
                  title={
                    <React.Fragment>
                      <Typography color="inherit">{"Descargar"} </Typography>
                      {/*"Eliminar  asignación de " + data.calltitle + " a " + data.enterprise*/} 
                    </React.Fragment>
                  }
                >
                  <Button
                    justIcon
                    round
                    simple
                    size="lg"
                    onClick={() =>{
                        //console.log(data.url);
                        window.location=data.url;
                    }}
                    color="primary"
                    className="download"
                  >
                    <Download />
                  </Button>
                </HtmlTooltip>
                {" "}
                {/* use this button to remove the data row */}
                <HtmlTooltip 
                  title={
                    <React.Fragment>
                      <Typography color="inherit">{"Eliminar"} </Typography>
                      {"Eliminar  archivo " + data.name} 
                    </React.Fragment>
                  }
                >
                  <Button
                    justIcon
                    round
                    simple
                    size="lg"
                    onClick={() =>{
                      warningWithConfirmAndCancelMessage(id, n);
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
    setFiles(us);
};

useEffect(() => {
    const unsubscribe = FService.getAllFiles().onSnapshot(onDataChange);
    return () => unsubscribe();
}, []);

  function warningWithConfirmAndCancelMessage(a,b){
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title={"¿Desea eliminar el archivo " + b + "?. Esta acción eliminará en cascada todos los elementos que contengan a dicho archivo"}
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

  const deleteFile = (p) => {
    return new Promise ((resolve) => {
      FService.removeFile(p).then(() =>{
        console.log("Eliminado");
      }).catch((e) => {
        console.log(e);
      });
      resolve();
    }).catch(errr => { console.log("Error: " +errr)})
  }

  const getIDFile = (props) =>{
    return new Promise((resolve) =>{
      FService.getFileWID(props).get().then(w =>{
        let arr = [];
        w.docs.forEach(function (i, index){
          arr.push({
            id: i.id
          })
        });
        resolve(arr);
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }).catch(err => {console.log("Error: " +err)})
  }

  const waiting = async(p) =>{
    waitAlert();
    await deleteFile(p);
    var data = getIDFile(p);
    await deleteAll(data);
    hideAlert();
    successDelete();
  }

  const successDelete = () => {
    
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

  const deleteAll = (props) =>{
    return new Promise ((resolve) =>{
      props.then(p =>{
        //console.log(p);
        if(p.length != 0){
          p.map(i =>{
            console.log(i.id);
            FService.removeFileEnterprise(i.id).then(() =>{
              console.log("Eliminado");
            }).catch(e =>{
              console.log("Error:" +e);
            })
          }) 
          resolve();
        }else{
          resolve();
        }
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }).catch(err =>{
      console.log("Error: " +err);
    });
  };

  const getURL = (data, id) =>{
    FService.getDownloadURL(data).then((d) =>{
      updateSourceFile(d, id);
      console.log(d);
    }).catch(e =>{
      console.log("Error: " +e);
    });
  };
  const updateSourceFile = (a, b) =>{
    FService.updateFile(b, {url:a}).then(() =>{
      console.log("Updated");
    }).catch(e =>{
      console.log("Error: " +e);
    });
  };

  console.log(files);
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
                                  Agregar un archivo
                              </h4>
                              <HtmlTooltip
                                    title={
                                      <React.Fragment>
                                        <Typography color="inherit">Agregar</Typography>
                                        {"Botón que permite agregar archivos al sistema"} 
                                      </React.Fragment>
                                    }
                                    TransitionComponent={Zoom}
                                  >
                                    <Button round color="success" component={Link} to="/admin/file-add">
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
                  <h4 className={classesT.cardIconTitle}>Archivos</h4>
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
                          Header: "Tamaño",
                          accessor: "size"
                          },
                          {
                          Header: "F. de Creación",
                          accessor: "datecreate"
                          },
                          {
                          Header: "Acciones",
                          accessor: "actions"
                          }
                      ]}
                      data ={files}
                  />
              </CardBody>
              </Card>
          </GridItem>
            {alert}        
    </GridContainer>
  </div>
  );
}