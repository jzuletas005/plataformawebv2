import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";

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

const useStyles = makeStyles(styles);
const useStylesTables = makeStyles(stylesTables);
const useStylesAlert = makeStyles(stylesAlert); 

export default function EnterpriseDashboard () {
    const classes = useStyles();
    const classesT = useStylesTables();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);

    //firebase 
    const [enterprises, setEnterprises] = useState([]);
    const onDataChange = (items) => {
        let us = [];

        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                key: keyX,
                id: id,
                enterpriseid: data.enterpriseid,
                name: data.enterprisename,
                rut: data.enterpriserut,
                email: data.enterpriseemail,
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
                        warningWithConfirmAndCancelMessage(id, data.enterprisename);
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
        setEnterprises(us);
    };

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    function warningWithConfirmAndCancelMessage(a,b){
      setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title={"¿Desea eliminar a la empresa " + b + " ?. Esta acción eliminará en cascada todos los elementos que contengan a dicha empresa"}
          onConfirm={() =>  deletion(a)}
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

    const deletion = async (props) =>{
      waitAlert();
      var d1 =  deleteWorker(props);
      await delete1(d1);
      var d2 = deleteFileEnterprise(props);
      await delete3(d2);
      var d3 = deleteCourseW(props);
      await delete2(d3);
      var d4 =  deleteNewsPublish(props);
      await delete4(d4);
      var d5 = deleteProject(props);
      await delete5(d5);
      var d6 = deleteCallWorker(props);
      await delete6(d6);
      await deleteEnterprise(props);
      hideAlert();
      successDelete();
    }

    const delete1 = (props) =>{
      return new Promise ((resolve) =>{
        props.then(p =>{
          if(p.length != 0 ){
            p.map(i =>{
              console.log(i.id);
              FService.removeWorker(i.id).then(() =>{
                console.log("Done");
              }).catch(err =>{
                console.log("Error: " +err);
              });
            });
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
    }

    const delete2 = (props) =>{
      return new Promise ((resolve) =>{
        props.then(p =>{
          if(p.length != 0){
            p.map(i =>{
              console.log(i.id);
              FService.removeCourseWorker(i.id).then(() =>{
                console.log("Done");
              }).catch(err =>{
                resolve(console.log("No Existe la relación"))
                console.log("Error: " +err);
              });
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
    }

    const delete3 = (props) =>{
      return new Promise ((resolve) =>{
        props.then(p =>{
          if(p.length != 0){
            p.map(i =>{
              console.log(i.id);
              FService.removeFileEnterprise(i.id).then(() =>{
                console.log("Done");
              }).catch(err =>{
                console.log("Error: " +err);
              });
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
     
    }

    const delete4 = (props) =>{
      return new Promise ((resolve) =>{
        props.then(p =>{
          if(p.length != 0){
            p.map(i =>{
              console.log(i.id);
              FService.removeNewsPublish(i.id).then(() =>{
                console.log("Done");
              }).catch(err =>{
                console.log("Error: " +err);
              });
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
      
    }

    const delete5 = (props) =>{
      return new Promise ((resolve) =>{
        props.then(p =>{
          if(p.length != 0){
            p.map(i =>{
              console.log(i.id);
              FService.removeProject(i.id).then(() =>{
                console.log("Done");
              }).catch(err =>{
                console.log("Error: " +err);
              });
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
    }

    const delete6 = (props) =>{
      return new Promise ((resolve) =>{
        props.then(p =>{
          if(p.length != 0){
            p.map(i =>{
              console.log(i.id);
              FService.removeCallsUser(i.id).then(() =>{
                console.log("Done");
              }).catch(err =>{
                console.log("Error: " +err);
              });
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
    }

    const deleteWorker =  (props) =>{
      return new Promise((resolve) =>{
        FService.getAllWorkersWEnterpriseID(props).get().then(w =>{
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
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const deleteCourseW = (props) =>{
      return new Promise((resolve) =>{
        FService.getCourseEnterprise(props).get().then(w =>{
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
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const deleteFileEnterprise = (props) =>{
      return new Promise((resolve) =>{
        FService.getallFileWorkerWEnterpriseID(props).get().then(w =>{
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
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const deleteNewsPublish = (props) =>{
      return new Promise((resolve) =>{
        FService.getOneNewsEnterprise(props).get().then(w =>{
          //console.log(props);
          let arr = [];
          w.docs.forEach(function (i, index){
            arr.push({
              id: i.id
            })
          });
          //console.log(arr);
          resolve(arr);
        }).catch(err =>{
          console.log("Error: " +err);
        });
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const deleteProject = (props) =>{
      return new Promise((resolve) =>{
        FService.getAllProjectWEnterpriseID(props).get().then(w =>{
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
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const deleteCallWorker = (props) =>{
      return new Promise((resolve) =>{
        FService.getAllCallEnterprise(props).get().then(w =>{
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
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const deleteEnterprise = (props) =>{
      return new Promise ((resolve) =>{
        FService.removeEnterprise(props).then(() =>{
          console.log("Eliminado");
          resolve();
        }).catch((e) => {
          console.log(e);
        });
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const successDelete = () => {  
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
                                        Inscribe una empresa
                                    </h4>
                                    <Button round color="success" component={Link} to="/admin/enterprise-add">
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
                        <h4 className={classesT.cardIconTitle}>Empresa</h4>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            columns={[
                                {
                                Header: "ID",
                                accessor: "enterpriseid"
                                },
                                {
                                Header: "Nombre",
                                accessor: "name"
                                },
                                {
                                Header: "Rut",
                                accessor: "rut"
                                },
                                {
                                Header: "Email",
                                accessor: "email"
                                },
                                {
                                Header: "Acciones",
                                accessor: "actions"
                                }
                            ]}
                            data ={enterprises}
                        />
                    </CardBody>
                    </Card>
                </GridItem>
                {alert}          
          </GridContainer>
        </div>
    )           
}