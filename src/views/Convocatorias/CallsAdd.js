import React, { useState } from 'react';

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


//@material-ui/icon components
import Close from "@material-ui/icons/Close";

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);

export default function CallsAdd () {
    const classes = useStyles();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);

    // call form
    const [titulo, setTitulo] = useState("");
    const [descripción, setDescripción] =  useState("");
    const [imagen, setImagen] = useState("");
    const [fechapublicación, setFechaPublicación] = useState("");
    const [fechaexpiración, setFechaExpiración] =  useState("");

    // type validation
    const [tituloState, settituloState] = useState("");
    const [descripcionState, setdescripcionState] = useState("");
    const [imagenState, setimagenState] = useState("");
    const [fechapublState, setfechapublState] = useState("");
    const [fechaexpState, setfechaexpState] = useState("");

    
    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const idCall = () => {
        var date = fechapublicación.split("-");
        var id = date[0] + date[1] + date[2];
        return id;
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

    const saveCall = () =>{

        return new Promise ((resolve) => {
            //create a id
            var id = idCall();
            var initial = iniciales(titulo);

            var data = {
                callid: initial + "-" + id,
                calltitle: titulo,
                calldetail: descripción,
                callimage: imagen,
                calldatepublish: fechapublicación,
                calldateexp: fechaexpiración
            }

            FService.createCall(data).then(() =>{
                console.log("Done");
                resolve();
            }).catch(e =>{
                console.log("Error: " + e);
            });
        }).catch(err => {console.log("Error: " +err)})
    }

    const callbackFunction = (childData) => {
        if(childData == ""){
            setimagenState("error");
        }else{
            setimagenState("success");
            setImagen(childData);
        }
    }
    
    const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Convocatoria Creada"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/call-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => hideAlert()}
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

    const typeClick = () => {
        if (tituloState === "") {
            settituloState("error");
        }
        if (descripcionState === "") {
            setdescripcionState("error");
        }
        if (imagenState === "") {
            setimagenState("error");
        }
        if (fechapublState === "") {
            setfechapublState("error");
        }
        if (fechaexpState === "") {
            setfechaexpState("error");
        }

        if(titulo != "" && descripción != "" && imagen != "" && fechapublicación != "" && fechaexpiración != ""){
            if(tituloState != "error" && descripcionState != "error" && imagenState != "error" 
             && fechapublState != "error" && fechaexpState != "error"){
                waiting();
            }else{
                errorAlert("Hay campos invalidos");
            }
        }else{
            errorAlert("Hay campos vacios");
        }
    };

    const waiting = async () => {
        waitAlert();
        await saveCall();
        hideAlert();
        successAlert();
    }

    
    return(
        <GridContainer >
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Agregar Convocatoria</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Titulo
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={tituloState === "success"}
                                        error={tituloState === "error"}
                                        id="titulorequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                settituloState("success");
                                            } else {
                                                settituloState("error");
                                            }
                                            setTitulo(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Convocatoria de SQM Mantención",
                                            endAdornment:
                                            tituloState === "error" ? (
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
                                        success={descripcionState === "success"}
                                        error={descripcionState === "error"}
                                        id="descripciónrequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setdescripcionState("success");
                                            } else {
                                                setdescripcionState("error");
                                            }
                                            setDescripción(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Descripción de la convocatoria",
                                            endAdornment:
                                            descripcionState === "error" ? (
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
                                        Fecha de Publicación
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={3}>
                                <CustomInput
                                    success={fechapublState === "success"}
                                    error={fechapublState === "error"}
                                    id="fechapublish"
                                    formControlProps={{
                                    fullWidth: true
                                    }}
                                    inputProps={{
                                    onChange: event => {
                                        if (verifyLength(event.target.value, 0)) {
                                            setfechapublState("success");
                                        } else {
                                            setfechapublState("error");
                                        }
                                        setFechaPublicación(event.target.value);
                                        
                                    },
                                    type: "date",
                                    endAdornment:
                                    fechapublState === "error" ? (
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
                                        Fecha de Expiración
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={3}>
                                <CustomInput
                                    success={fechaexpState === "success"}
                                    error={fechaexpState === "error"}
                                    id="fechaexp"
                                    formControlProps={{
                                    fullWidth: true
                                    }}
                                    inputProps={{
                                    onChange: event => {
                                        if (verifyLength(event.target.value, 0)) {
                                            setfechaexpState("success");
                                        } else {
                                            setfechaexpState("error");
                                        }
                                        setFechaExpiración(event.target.value);
                                    },
                                    type: "date",
                                    endAdornment:
                                    fechaexpState === "error" ? (
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
                            <GridContainer >
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Imagen de Referencia
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={4} md={2}>
                                    <ImageUpload
                                        addButtonProps={{
                                        color: "rose",
                                        round: true
                                        }}
                                        changeButtonProps={{
                                        color: "rose",
                                        round: true
                                        }}
                                        removeButtonProps={{
                                        color: "danger",
                                        round: true
                                        }}
                                        parentCallback = {callbackFunction}
                                    />
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