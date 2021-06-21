import React, { useEffect, useState } from "react";
// react plugin for creating charts
import {Line, Pie} from "react-chartjs-2";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import User from "@material-ui/icons/Person";
import Enterprise from "@material-ui/icons/Domain";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Timeline from "@material-ui/icons/Timeline";

// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";

// firebase components
import FService from '../../services/FirebaseService.js';

import styles from "../../assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();

  //Datas arrays
  const [listWElabels, setListWElabels] = useState([]);
  const [listWEdata, setListWEdata] = useState([]);
  const [listPElabels, setListPElabels] = useState([]);
  const [listPEdata, setListPEdata] = useState([]);
  const [listWDlabels, setListWDlabels] = useState([]);
  const [listWDdata, setListWDdata] = useState([]);
  const [listWPlabels, setListWPlabels] = useState([]);
  const [listWPdata, setListWPdata] = useState([]);

  //get data
  const [listEnterprise, setListEnterprise] = useState([]);
  const [listProject, setListProject] = useState([]);
  const [listWorkers, setListWorkers] = useState([]);
  const [listUsers, setListUsers] = useState([]);

  //variable
  const [render, setRender] = useState(false);
  
  useEffect(() =>{
      const un =  FService.getAllEnterprise().onSnapshot(getEnterprise);
      setRender(false);
      return () => un();
  },[]);
  
  useEffect(() =>{
    const a = FService.getAllUser().onSnapshot(getUsers);
    setRender(false);
    return () => a();
  }, []);

  useEffect(() =>{
    const b = FService.getAllProject().onSnapshot(getProject);
    setRender(false);
    return () => b();
  }, []);

  useEffect(() =>{
    const c = FService.getAllWorkers().onSnapshot(getWorker);
    setRender(false);
    return () => c();
  }, []);

  const getWorker = (items) =>{
    let us = [];
    items.docs.forEach(function (i) {
      let id = i.id;
      let data = i.data();
      us.push({
        id:id,
        idUser: data.idDocUser,
        idEnterprise: data.idDocEnterprise,
        status: data.status
      })
    })
    setListWorkers(us);
  }

  const getProject = (items) =>{
    let us = [];
    items.docs.forEach(function (i) {
      let id = i.id;
      let data = i.data();
      us.push({
        id: id,
        idEnterprise: data.idDocEnterprise,
        nameEnterprise: data.enterprise,
        name: data.name
      })
    });
    setListProject(us);
  }

  const getUsers = (items) =>{
    let us = [];
    items.docs.forEach(function (i, index) {
      let id = i.id;
      let data = i.data();
      us.push({
        id: id,
        name: data.name,
        age: data.age
      });
      //console.log(us); 
    });
    setListUsers(us);
  }

  const getEnterprise = (items) =>{
    let us = [];
    items.docs.forEach(function (i, index){
      let id = i.id;
      let data = i.data();
      //console.log(data);
      us.push({
        id: id,
        name: data.enterprisename
      })
    });
    setListEnterprise(us);
  }

  const generateWxK = () => {
    return new Promise((resolve) =>{
      let labels = [];
      let series = [];
      listEnterprise.forEach(function (i){
        var count = 0;
        var name = i.name;
        listWorkers.forEach(function (a){
          if(i.id === a.idEnterprise){
            count ++ ;
          }
        });
        labels.push(name);
        series.push(count);
      });
      resolve(setListWElabels(labels), setListWEdata(series));
    }).catch(err => {console.log("Error: " +err)});
  }

  const generatePxE = () => {
    return new Promise((resolve) =>{
      let labels = [];
      let series = [];
      listEnterprise.forEach(function (i){
        var count = 0;
        var name = i.name;
        listProject.forEach(function (a){
          if(i.id === a.idEnterprise){
            count ++ ;
          }
        });
        labels.push(name);
        series.push(count);
      });
      resolve(setListPElabels(labels), setListPEdata(series));
    }).catch(err => {console.log("Error: " +err)});
  }

  const generateWD = () => {
    return new Promise((resolve) =>{
      let labels = [];
      let series = [];
      listEnterprise.forEach(function (i){
        var count = 0;
        var name = i.name;
        listWorkers.forEach(function (a){
          if(a.status === "Disponible" && a.idEnterprise === i.id){
            count ++ ;
          }
        });
        labels.push(name);
        series.push(count);
      });
      resolve(setListWDlabels(labels), setListWDdata(series));
    }).catch(err => {console.log("Error: " +err)});
  }

  const generateWP = () => {
    return new Promise((resolve) =>{
      let labels = [];
      let series = [];
      listEnterprise.forEach(function (i){
        var count = 0;
        var name = i.name;
        listWorkers.forEach(function (a){
          if(a.status === "En Proyecto" && a.idEnterprise === i.id){
            count ++ ;
          }
        });
        labels.push(name);
        series.push(count);
      });
      resolve(setListWPlabels(labels), setListWPdata(series));
    }).catch(err => {console.log("Error: " +err)});
  }

  const start = async () =>{
    if(render === false){
      //console.log("Hola");
      setRender(true);
      await generateWxK();
      await generatePxE();
      await generateWD();
      await generateWP();
    }
  }

  setTimeout(start, 2000);
  return (
    <div>
      <GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="warning" icon>
                <CardIcon color="warning" >
                  <User />
                </CardIcon>
                <p className={classes.cardCategory}>Total de Usuarios</p>
                <h3 className={classes.cardTitle}>
                  {listUsers.length}
                </h3>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success" >
                  <Enterprise />
                </CardIcon>
                <p className={classes.cardCategory}>Total de Empresas</p>
                <h3 className={classes.cardTitle}>
                  {listEnterprise.length}
                </h3>
              </CardHeader>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <Timeline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Trabajadores disponibles por Empresa
                </h4>
              </CardHeader>
              <CardBody>
                <Line 
                  data={{
                    labels: listWDlabels,
                    datasets: [
                      {
                        label: "Trabajadores disponibles",
                        data: listWDdata,
                        backgroundColor:['rgba(255,31,7,0.6)'],
                        borderColor: ['rgba(70,215,88,0.6)'],
                        borderWidth: 5,
                        fill: false,
                        pointStyle: 'circle',
                        radius: '8'
                      }
                    ]
                  }}
                  options={{
                    legend:{
                      display: false
                    },
                    scales: {
                      y:{
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Timeline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Trabajadores en Proyecto por Empresa 
                </h4>
              </CardHeader>
              <CardBody>
                <Line 
                  data={{
                    labels: listWPlabels,
                    datasets: [
                      {
                        label: "Trabajadores en Proyecto",
                        data: listWPdata,
                        backgroundColor:['rgba(255,31,7,0.6)'],
                        borderColor: ['rgba(70,215,88,0.6)'],
                        borderWidth: 5,
                        fill: false,
                        pointStyle: 'circle',
                        radius: '8'
                      }
                    ]
                  }}
                  options={{
                    legend:{
                      display: false
                    },
                    scales: {
                      y:{
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <Timeline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Trabajadores por Empresa
                </h4>
              </CardHeader>
              <CardBody>
                <Line 
                  data={{
                    labels: listWElabels,
                    datasets: [
                      {
                        label: "Cantidad de trabajadores",
                        data: listWEdata,
                        backgroundColor:['rgba(255,31,7,0.6)'],
                        borderColor: ['rgba(70,215,88,0.6)'],
                        borderWidth: 5,
                        fill: false,
                        pointStyle: 'circle',
                        radius: '8'
                      }
                    ]
                  }}
                  options={{
                    legend:{
                      display: false
                    },
                    scales: {
                      y:{
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning" icon>
                <CardIcon color="warning">
                  <Timeline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Projectos por Empresa 
                </h4>
              </CardHeader>
              <CardBody>
                <Line 
                  data={{
                    labels: listPElabels,
                    datasets: [
                      {
                        label: "Cantidad de projectos",
                        data: listPEdata,
                        backgroundColor:['rgba(255,31,7,0.6)'],
                        borderColor: ['rgba(70,215,88,0.6)'],
                        borderWidth: 5,
                        fill: false,
                        pointStyle: 'circle',
                        radius: '8'
                      }
                    ]
                  }}
                  options={{
                    legend:{
                      display: false
                    },
                    scales: {
                      y:{
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </GridContainer>
    </div>
  );
}
