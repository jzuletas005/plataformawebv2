import React, {useState, useEffect} from 'react';
import { Link, Switch, Route, Redirect } from "react-router-dom";

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
import People from '@material-ui/icons/PersonAdd';

// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from '../../components/Grid/GridItem.js';
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
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

export default function UserDashboard (){
    const classes = useStyles();
    const classesT = useStylesTables();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);


    //firebase 
    const [users, setUser] = useState([]);
    const onDataChange = (items) => {
        let us = [];

        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                key: keyX,
                id: id,
                name: data.name,
                rut: data.rut,
                age: data.age,
                email: data.email,
                phone: data.phone,
                profesion1: data.profesion1,
                profesion2: data.profesion2,
                profesion3: data.profesion3,
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
                      size="lg"
                      onClick={() =>{
                        //warningWithConfirmAndCancelMessage(id);
                        showUser(data.name, data.rut, data.age, data.email, data.phone, data.profesion1);
                      }}
                      color="primary"
                      className="show"
                    >
                      <Person />
                    </Button>{" "}
                  </div>
                )
            });
            findWorker(data.rut, id);
        });
        setUser(us);
    };

    const [change, setChange] = useState([]);
    const onDataWorker = (items) =>{
      let ar = [];
      items.docs.forEach(function (i, index){
        let id = i.id;
        let data = i.data();
        ar.push({
          idDoc: id,
          rut: data.rut
        });
      })
      setChange(ar);
    }

    const findWorker = (rut, id) =>{
      FService.getAllWorkersWRut(rut).get().then(items =>{
        let ar = [];
        items.docs.forEach(function (i, index){
          let id = i.id;
          let data = i.data();
          ar.push({
            idDoc: id,
            rut: data.rut
          });
        })
        updateWorker(ar, id);
      }).catch(err =>{
        console.log("Error: " +err);
      });
    }

    const updateWorker = (array, iddoc) =>{
      //console.log(array, iddoc);
      array.map((c, index) =>{
        FService.updateWorker(c.idDoc, {idDocUser: iddoc}).then( () =>{
          console.log("Done");
        }).catch(err => {
          console.log("Error: "+ err);
        })
      });
    }

    useEffect(() => {
        const unsubscribe = FService.getAllUser().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    function showUser (name, rut, age, email, phone, profesion){
      setAlert(
        <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Usuario"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classesA.button + " " + classesA.info}
        >
          <h5> Nombre: {name} </h5>
          <h5> Rut: {rut} </h5>
          <h5> Edad: {age} </h5>
          <h5> Email: {email} </h5>
          <h5> Telefono: {phone} </h5>
          <h5> Profesión: {profesion} </h5>
        </SweetAlert>
      )
    }

    function warningWithConfirmAndCancelMessage(props){
      setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="¿Desea eliminar al usuario?"
          onConfirm={() => deletion(props)}
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

    const  deletion = async (props) => {
      //await delUser(props);
      //var uid = getOneWorker(props)
      //await delWorker(uid[0]);
      successDelete();
    }

    const getOneWorker = (ui) =>{
      return new Promise((resolve) =>{
        //Eliminacion por tabla e id
        FService.getOneWoker(ui).get().then((u) =>{
          let us = [];
          u.docs.forEach(function (i, index){
            us.push({
              uid: i.data().idDocUser
            })
          })
          resolve(us);
        }).catch((e) => {
          resolve("");
          console.log(e);
        });
      }).catch(err => {console.log("Error: " +err);})
    }

    const delUser = (props) =>{
      return new Promise((resolve) =>{
        //Eliminacion por tabla e id
        FService.removeUser(props).then(() =>{
          console.log("Eliminado");
          resolve();
        }).catch((e) => {
          console.log(e);
        });
      }).catch(err => {console.log("Error: " +err);})
    }

    const delWorker = (props) =>{
      return new Promise((resolve) =>{
        //Elimicación de losworkers
        FService.removeWorker(props).then(() =>{
          console.log("Eliminado");
          resolve();
        }).catch(err => {console.log("Error: " +err);})
      }).catch(err => {console.log("Error: " +err);})
    }

    const successDelete = () => {      
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Usuario Eliminado!"
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
    console.log(users);
    return (  
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
                                        Inscribe un usuario
                                    </h4>
                                    <Button round color="success" component={Link} to="/admin/user-add">
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
                        <h4 className={classesT.cardIconTitle}>Usuarios</h4>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            columns={[
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
                                Header: "Fono",
                                accessor: "phone"
                                },
                                {
                                  Header: "Oficio",
                                  accessor: "profesion1"
                                },
                                {
                                Header: "Acciones",
                                accessor: "actions"
                                }
                            ]}
                            data ={users}
                        />
                        
                    </CardBody>
                    </Card>
                </GridItem>
                {alert}
          </GridContainer>
   
    );
}
