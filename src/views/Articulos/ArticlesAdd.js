import React, { useState } from 'react';

//Alert
import SweetAlert from "react-bootstrap-sweetalert";

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
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import ImageUpload from "../../components/CustomUpload/ImageUpload.js";
import Table from "../../components/Table/Table.js";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";


//@material-ui/icon components
import People from '@material-ui/icons/PersonAdd';
import MailOutline from "@material-ui/icons/MailOutline";
import Contacts from "@material-ui/icons/Contacts";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);

export default function ArticlesAdd () {

    const classesA = useStylesAlert();
    const classes = useStyles();

    //alerta
    const [alert, setAlert] = useState(null);

    //variables
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cuerpo, setCuerpo] = useState("");
    const [fecha, setFecha] = useState("");
    const [imagen1, setImagen1] = useState("");
    const [imagen2, setImagen2] = useState("");
    const [imagen3, setImagen3] = useState("");

    //State
    const [tituloState, setTituloState] = useState("");
    const [subtituloState, setSubtituloState] = useState("");
    const [descripcionState, setDescripcionState] = useState("");
    const [cuerpoState, setCuerpoState] = useState("");
    const [fechaState, setFechaState] = useState("");
    const [imagen1State, setImagen1State] = useState("");
    const [imagen2State, setImagen2State] = useState("");
    const [imagen3State, setImagen3State] = useState("");

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const callbackFunction1 = (childData) => {
        if(childData == ""){
            setImagen1State("error");
        }else{
            setImagen1State("success");
            setImagen1(childData);
        }
    }

    const callbackFunction2 = (childData) => {
        if(childData == ""){
            setImagen2State("error");
        }else{
            setImagen2State("success");
            setImagen2(childData);
        }
    }

    const callbackFunction3 = (childData) => {
        if(childData == ""){
            setImagen3State("error");
        }else{
            setImagen3State("success");
            setImagen3(childData);
        }
    }

    const idCall = () => {
        var date = fecha.split("-");
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
    
    //Firebase post
    const saveNews = () =>{
        //create a id
        var id = idCall();
        var initial = iniciales(titulo);

        var data = {
            newsid: initial + "-" + id,
            title: titulo,
            subtitle: subtitulo,
            description: descripcion,
            body: cuerpo,
            datepublish: fecha,
            image1: imagen1,
            image2: imagen2,
            image3: imagen3
        };

        FService.createNews(data).then(() =>{
            console.log("Done");
            successAlert();
        }).catch(e =>{
            console.log("Error: " +e);
        });
    };

    const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Noticia Creada"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/articles-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/articles-dashboard";
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
    const typeClick = () => {
        if (tituloState === "") {
            setTituloState("error");
        }
        if (subtituloState === "") {
            setSubtituloState("error");
        }
        if (descripcionState === "") {
            setDescripcionState("error");
        }
        if (cuerpoState === "") {
            setCuerpoState("error");
        }
        if (fechaState === ""){
            setFechaState("error");
        }

        if(titulo != "" && subtitulo != "" && descripcion != "" && cuerpo != "" && fecha != ""){
            if(imagen1 != "" || imagen2 != "" || imagen3 != ""){
                if(tituloState != "error" && subtituloState != "error" && descripcionState != "error" 
                && cuerpoState != "error" && fechaState != "error"){
                    saveNews();
                }else{
                    errorAlert("Hay campos invalidos");
                }
            }else{
                errorAlert("Coloque por lo menos una imagen");
            }
        }else{
            errorAlert("Hay campos vacios");
        }
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
                            <h4 className={classes.cardTitle}>Agregar Artículo</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Título
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
                                                setTituloState("success");
                                            } else {
                                                setTituloState("error");
                                            }
                                            setTitulo(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Titulo del Artículo",
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
                                        Subtítulo
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={subtituloState === "success"}
                                        error={subtituloState === "error"}
                                        id="subrequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setSubtituloState("success");
                                            } else {
                                                setSubtituloState("error");
                                            }
                                            setSubtitulo(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Subtítulo del artículo",
                                            endAdornment:
                                            subtituloState === "error" ? (
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
                                                setDescripcionState("success");
                                            } else {
                                                setDescripcionState("error");
                                            }
                                            setDescripcion(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Descripción del artículo",
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
                                        Cuerpo
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={cuerpoState === "success"}
                                        error={cuerpoState === "error"}
                                        id="cuerporequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setCuerpoState("success");
                                            } else {
                                                setCuerpoState("error");
                                            }
                                            setCuerpo(event.target.value);
                                            },
                                            type: "text",
                                            placeholder: "Cuerpo del artículo",
                                            endAdornment:
                                            cuerpoState === "error" ? (
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
                                        Fecha de publicación
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={fechaState === "success"}
                                        error={fechaState === "error"}
                                        id="fecharequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setFechaState("success");
                                            } else {
                                                setFechaState("error");
                                            }
                                            setFecha(event.target.value);
                                            },
                                            type: "date",
                                            placeholder: "Fecha de publicación del artículo",
                                            endAdornment:
                                            fechaState === "error" ? (
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
                                        Imagenes
                                    </FormLabel>
                                </GridItem>
                                <GridItem>
                                    <GridContainer justify="flex-start" alignItems="center" spacing={3}>
                                    <GridItem xs={3} >
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
                                            parentCallback = {callbackFunction1}
                                        />
                                    </GridItem>
                                    <br/><br/>
                                    <GridItem xs={3}>
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
                                            parentCallback = {callbackFunction2}
                                        />
                                    </GridItem>
                                    <br/><br/>
                                    <GridItem xs={3}>
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
                                            parentCallback = {callbackFunction3}
                                        />
                                    </GridItem>
                                    </GridContainer>
                                </GridItem>
                            </GridContainer>
                        </form>
                        {alert}
                    </CardBody>
                    <CardFooter className={classes.justifyContentCenter}>
                        <Button color="rose" onClick={typeClick}>
                            Crear Usuario
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}
