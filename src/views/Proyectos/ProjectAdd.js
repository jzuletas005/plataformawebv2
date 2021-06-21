import React, { useState, useEffect } from 'react';

// firebase connection
import FService from '../../services/FirebaseService.js';

//Alert
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardText from "../../components/Card/CardText.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import ImageUpload from "../../components/CustomUpload/ImageUpload.js";
import { CircularProgress } from '@material-ui/core';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


//@material-ui/icon components
import Close from "@material-ui/icons/Close";

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import moment from 'moment';

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);

export default function ProjectAdd (){
    const classes = useStyles();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);

    //variables
    const [nameP, setNameP] = useState("");
    const [description, setDescription] =  useState("");
    const [enterprise, setEnterprise] = useState("");
    const [idEnterprise, setIdEnterprise] = useState("");
    const [datestart, setDatestart] = useState("");
    const [dateend, setDateend] = useState("");

    //type validation
    const [namePState, setNamePState] = useState("");
    const [descriptionState, setDescriptionState] =  useState("");
    const [enterpriseState, setEnterpriseState] = useState("");
    const [datestartState, setDatestartState] = useState("");
    const [dateendState, setDateendState] = useState("");

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const handleSimple = event => {
        if (verifyLength(event.target.value, 0)) {
            setIdEnterprise(event.target.value);
            setEnterpriseState("success");
            FService.getOneEnterprise(event.target.value).then((e) =>{
                setEnterprise(e.data().enterprisename)
            }).catch(err =>{
                console.log("Error: " +err);
            });
        } else {
            setEnterpriseState("error");
        }
    };

    const idCall = () => {
        var dateS = moment(datestart).unix();
        var dateE = moment(dateend).unix();
        return Math.abs(Math.floor(Math.random() * (dateS - dateE)));
    };

    const iniciales = (dato) =>{
        var arraydato = dato.split(" ");
        var initial="";
        for(var i=0; i<arraydato.length; i++){
            var d = arraydato[i];
            for(var x=0; x<d.length; x++){
                if(d[x] == d[x].toUpperCase()){
                    initial=initial + d[x];
                }
            }
        }
        return initial;
    }

    const saveProject = () =>{
        return new Promise ((resolve) =>{
            var id = idCall();
            var initial = iniciales(nameP);

            var data = {
                id: initial + "-" + id,
                name: nameP,
                description: description,
                enterprise: enterprise,
                idDocEnterprise: idEnterprise,
                dateStart: datestart,
                dateEnd: dateend
            };
            //console.log(data);
            FService.createProject(data).then(() =>{
                console.log("Done");
            }).catch( e =>{
                console.log("Error: " + e);
            });
            resolve();
        }).catch(err =>{console.log("Error: " +err)})
    };

    //get all Enterprise
    const [list, setList] = useState([]);
    const onDataChange = (items) =>{
        let us = [];

        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                name: data.enterprisename,
            });
        });
        setList(us);
    };

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    const typeClick = () => {
        if (namePState === "") {
            setNamePState("error");
        }
        if (descriptionState === "") {
            setDescriptionState("error");
        }
        if (enterpriseState === "") {
            setEnterpriseState("error");
        }
        if (datestartState === "") {
            setDatestartState("error");
        }
        if (dateendState === "") {
            setDateendState("error");
        }

        if(nameP != "" && description != "" && enterprise != "" && datestart != "" && dateend != ""){
            if(namePState != "error" && descriptionState != "error" && enterpriseState != "error" 
             && datestartState != "error" && dateendState != "error"){
                check();
            }else{
                errorAlert("Hay campos invalidos");
            }
        }else{
            errorAlert("Hay campos vacios");
        }
    };

    const check = async() =>{
        waitAlert();
        await saveProject();
        hideAlert();
        successAlert();
    }
    const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Proyecto Creado"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/project-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {hideAlert();
                window.location.href="/admin/project-dashboard";
            }}
            confirmBtnCssClass={classesA.button + " " + classesA.success}
          >
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

    console.log(enterprise);
    return(
        <GridContainer >
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Agregar Proyecto</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Nombre
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={namePState === "success"}
                                        error={namePState === "error"}
                                        id="namePrequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setNamePState("success");
                                            } else {
                                                setNamePState("error");
                                            }
                                            setNameP(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Proyecto para SQM Mantención",
                                            endAdornment:
                                            namePState === "error" ? (
                                                <InputAdornment position="end">
                                                <Close className={classes.danger} />
                                                </InputAdornment>
                                            ) : (
                                                undefined
                                            )
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Descripción
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={descriptionState === "success"}
                                        error={descriptionState === "error"}
                                        id="descripciónrequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setDescriptionState("success");
                                            } else {
                                                setDescriptionState("error");
                                            }
                                            setDescription(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Descripción del proyecto",
                                            endAdornment:
                                            descriptionState === "error" ? (
                                                <InputAdornment position="end">
                                                <Close className={classes.danger} />
                                                </InputAdornment>
                                            ) : (
                                                undefined
                                            )
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Fecha de Inicio
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={3}>
                                <CustomInput
                                    success={datestartState === "success"}
                                    error={datestartState === "error"}
                                    id="fechapublish"
                                    formControlProps={{
                                    fullWidth: true
                                    }}
                                    inputProps={{
                                    onChange: event => {
                                        if (verifyLength(event.target.value, 0)) {
                                            setDatestartState("success");
                                        } else {
                                            setDatestartState("error");
                                        }
                                        setDatestart(event.target.value);
                                        
                                    },
                                    type: "date",
                                    endAdornment:
                                    datestartState === "error" ? (
                                        <InputAdornment position="end">
                                            <Close className={classes.danger} />
                                        </InputAdornment>
                                        ) : (
                                        undefined
                                        )
                                    }}
                                />
                                </GridItem>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Fecha de Termino
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={3}>
                                <CustomInput
                                    success={dateendState === "success"}
                                    error={dateendState === "error"}
                                    id="fechaexp"
                                    formControlProps={{
                                    fullWidth: true
                                    }}
                                    inputProps={{
                                    onChange: event => {
                                        if (verifyLength(event.target.value, 0)) {
                                            setDateendState("success");
                                        } else {
                                            setDateendState("error");
                                        }
                                        setDateend(event.target.value);
                                    },
                                    type: "date",
                                    endAdornment:
                                    dateendState === "error" ? (
                                        <InputAdornment position="end">
                                            <Close className={classes.danger} />
                                        </InputAdornment>
                                        ) : (
                                        undefined
                                        )
                                    }}
                                />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Empresa
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
                                        value={idEnterprise}
                                        onChange={handleSimple}
                                        inputProps={{
                                            name: "simpleSelect",
                                            id: "simple-select"
                                        }}
                                    >
                                        {list.map((option) =>(
                                            <MenuItem
                                                classes={{
                                                    root: classes.selectMenuItem,
                                                    selected: classes.selectMenuItemSelected
                                                }}
                                                value = {option.id} 
                                            >
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </GridItem>
                            </GridContainer>
                        </form>
                        {alert}
                    </CardBody>
                    <CardFooter className={classes.justifyContentCenter}>
                        <Button color="rose" onClick={typeClick}>
                            Crear Convocatoria
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}