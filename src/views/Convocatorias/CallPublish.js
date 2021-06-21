import React, { useState, useEffect } from 'react';


// firebase connection
import FService from '../../services/FirebaseService.js';

// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardText from "../../components/Card/CardText.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import SweetAlert from "react-bootstrap-sweetalert";
import Table from "../../components/Table/Table.js";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Divider} from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import stylesTables from "../../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);
const useStylesTables = makeStyles(stylesTables);


export default function CallPublish (){

    const classesA = useStylesAlert();
    const classes = useStyles();
    const classesT = useStylesTables();

    //alerta
    const [alert, setAlert] = useState(null);

    //Variables
    
    const [listEnterprise, setListEnterprise] = useState([]);
    const [listCall, setListCall] = useState([]);
    const [enterprises, setEnterprises] = useState([]);
    const [idCall, setIdCall] = useState("");
    const [call, setCall] = useState("");

    const [callTitle, setCallTitle] = useState("");
    const [callDateExp, setCallDateExp] = useState("");
    const [callDatePublish, setCallDatePublish] = useState("");
    const [idCallTitle, setIdCallTitle] = useState("");

    //state
    const [enterpriseState, setEnterpriseState] = useState("");
    const [callState, setCallState] = useState("");


    const handleSimple = event => {
        console.log(event.target.value);
        setIdCall(event.target.value);
        if (verifyLength(event.target.value, 0)) {
            setCallState("success");
            setCall(event.target.value);
            FService.getOneCallUser(event.target.value).then(p =>{
                setCallTitle(p.data().calltitle);
                setCallDatePublish(p.data().calldatepublish);
                setCallDateExp(p.data().calldateexp);
                setIdCallTitle(p.data().callid);
            }).catch(e =>{
                console.log("error:" +e);
            })
        } else {
            setCallState("error");
        }
    };

    const handleToggle = value => {
        const currentIndex = enterprises.indexOf(value);
        const newChecked = [...enterprises];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setEnterprises(newChecked);
    };

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const saveCallPublish = () =>{
        return new Promise((resolve) =>{
            enterprises.map((en, index) =>{
                var data = {
                    idDocEnterprise: en.id,
                    enterprise: en.name,
                    idDocCall: idCall,
                    calltitle: callTitle,
                    calldatepublish: callDatePublish,
                    calldateexp: callDateExp,
                    callid: idCallTitle
                } 
                //console.log(data);
                FService.createCallsUser(data).then(() =>{
                    console.log("Done");
                }).catch(err =>{
                    console.log("Error: " +err);
                });
            });
            resolve();
        }).catch(err =>{
            console.log("Error: " +err);
        });
    };

    const onDataEnterprise = (items) => {
        let us = [];
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                enterpriseid: data.enterpriseid,
                name: data.enterprisename,
                rut: data.enterpriserut,
                email: data.enterpriseemail,
                logo: data.enterpriselogo
            });
        });
        setListEnterprise(us);
    };

    const onDataCall = (items) => {
        let us = [];
    
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                callid: data.callid,
                title: data.calltitle,
            });
        });
        setListCall(us);
    };

    function toCheck () {
        var dato = false;
        if(enterprises.length > 0){
            dato = true;
        }
        return dato;
    }

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataEnterprise);
        return () => unsubscribe();
    }, []);

    useEffect(() =>{
        const unsubscribe = FService.getAllCalls().onSnapshot(onDataCall);
        return () => unsubscribe();
    }, []);

    const typeClick = ()=>{
        if(enterpriseState === ""){
            setEnterpriseState("error");
        }
        if(callState === ""){
            setCallState("error");
        }
        if(toCheck){
            setEnterpriseState("success");
        }
        
        if(enterpriseState != "error" && enterprises.length > 0){
            if(callState != "error" && call != ""){
                warningWithConfirmAndCancelMessage(callTitle);
            }else{
                errorAlert("Seleccione una Noticia");
            }
        }else{
            errorAlert("Seleccione al menos una Empresa");
        }
    };

    function warningWithConfirmAndCancelMessage(b){
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title={"¿Desea asignarlos a la convocatoria " + b + " ?"}
            onConfirm={() => waiting()}
            onCancel={() => cancelAssig()}
            confirmBtnCssClass={classesA.button + " " + classesA.success}
            cancelBtnCssClass={classesA.button + " " + classesA.danger}
            confirmBtnText="Si"
            cancelBtnText="No"
            showCancel
          >
          </SweetAlert>
        );
      };

      const waiting = async() =>{
        waitAlert();
        await saveCallPublish();
        setTimeout(successAssig, 1000);
      }
  
    const successAssig = () => {
        setAlert(
            <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Convocatoria Asignada!"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/call-publishdashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/call-publishdashboard";
            }}
            confirmBtnCssClass={classesA.button + " " + classesA.success}
            >
            </SweetAlert>
        );
    };
  
    const cancelAssig = () => {
        setAlert(
            <SweetAlert
            danger
            style={{ display: "block", marginTop: "-100px" }}
            title="Asignación Cancelada"
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

    return(
        <GridContainer >
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Asignar Convocatoria</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={2}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            Noticias
                                        </FormLabel>
                                    </GridItem>
                                    <GridItem xs={12} sm={7}>
                                    <br />
                                        <Select 
                                            MenuProps={{
                                                className: classes.selectMenu
                                            }}
                                            classes={{
                                                select: classes.select
                                            }}
                                            value={idCall}
                                            onChange={handleSimple}
                                            inputProps={{
                                                name: "simpleSelect",
                                                id: "simple-select"
                                            }}
                                        >
                                            {listCall.map((option) =>(
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value = {option.id} 
                                                >
                                                    {option.callid +"  " +option.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </GridItem>
                                </GridContainer>
                            </GridContainer>
                            <br/>
                            <Divider />
                            <GridContainer>
                                <GridItem xs={12}>
                                    <Card plain >
                                        <CardBody>
                                            <Table 
                                                stripped
                                                tableHead={["#"," ","ID", "Empresa"]}
                                                tableData={listEnterprise.map((p, index) => [
                                                    index + 1,
                                                    <Checkbox
                                                        key="key"
                                                        className={classesT.positionAbsolute}
                                                        tabIndex={-1}
                                                        onClick={() => handleToggle(p)}
                                                        checkedIcon={<Check className={classesT.checkedIcon} />}
                                                        icon={<Check className={classesT.uncheckedIcon} />}
                                                        classes={{
                                                        checked: classesT.checked,
                                                        root: classesT.checkRoot
                                                        }}
                                                    />,
                                                    p.enterpriseid, 
                                                    p.name,
                                                ])}
                                            />
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </GridContainer>
                        </form>
                        {alert}
                    </CardBody>
                    <CardFooter className={classes.justifyContentCenter}>
                        <Button color="rose" onClick={typeClick}>
                            Asignar
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}