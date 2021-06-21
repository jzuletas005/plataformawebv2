import React, { useState } from 'react';

//Alert
import SweetAlert from "react-bootstrap-sweetalert";

//Firebase
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

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import { CircularProgress } from '@material-ui/core';


//@material-ui/icon components
import Close from "@material-ui/icons/Close";

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);


export default function FilesAdd () {
    const classes = useStyles();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);
    
    //variables
    const [file, setFile] = useState("");
    const [fileState, setFileState] = useState("");
    const [fileB64, setFileB64] = useState("");

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const typeClick = () => {
        if (fileState === "") {
          setFileState("error");
        }
        if(file != "" && fileState != "error" && fileB64 != ""){
            upLoadAll();
        }else{
            errorAlert("Seleccione un archivo")
        }
    };

    const upLoadAll = async() =>{
        waitAlert();
        await uploadFile();
        await AddFileList(fileB64);
        hideAlert();
        successAlert();
    }

    const uploadFile = () => {

        return new Promise ((resolve) =>{
            FService.createFile(file).then(() =>{
                console.log("Done");
                resolve();
            }).catch(e =>{
                console.log("Error: "+ e);
            });

        }).catch(err =>{console.log("Error: " +err)})
        
    };

    const AddFileList = (b64) =>{

        return new Promise((resolve) =>{
            const unixtimestamp = file.lastModified; 
            const dateobj = new Date(unixtimestamp );
            const date = dateobj.toLocaleDateString();

            const fileB = fileB64.split(",");

            var val = file.name.split(".");
            var size = bytesToSize(file.size);

            var data ={
                name: val[0],
                type: val[1].toUpperCase(),
                size: size,
                time: date,
                url: "",
                b64: fileB[1]
            };

            var data2 ={
                name: val[0],
                type: val[1].toUpperCase(),
                size: size,
                time: date,
                url: "",
                b64: ""
            };

            FService.addFile(data).then(() =>{
                console.log("Done");
                resolve();
            }).catch(e =>{
                FService.addFile(data2).then(() =>{
                    console.log("Done without fb64");
                    resolve();
                }).catch(err => {console.log("Error: " +err)})
            });

        }).catch(err => {console.log("Error: " +err)})
    };

    function bytesToSize(bytes){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if(bytes == 0) return '0 Bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}//TODO agregar un Progresive bar
            title="Archivo Cargado"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/file-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
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
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Agregar Archivo</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Cargar Archivo
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={fileState === "success"}
                                        error={fileState === "error"}
                                        id="filerequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        multiple
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setFileState("success");
                                            } else {
                                                setFileState("error");
                                            }
                                            let reader = new FileReader();
                                            let file = event.target.files[0];
                                            reader.onloadend = () => {
                                            setFile(file);
                                            //setImagePreviewUrl(reader.result);
                                            //sendData(reader.result);
                                            setFileB64(reader.result);
                                            };
                                            if (file) {
                                                reader.readAsDataURL(file);
                                            }
                                            //setFile(event.target.files[0]);
                                            },
                                            type: "file",
                                            endAdornment:
                                            fileState === "error" ? (
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
                        </form>
                        {alert}
                    </CardBody>
                    <CardFooter className={classes.justifyContentCenter}>
                        <Button color="rose" onClick={typeClick}>
                            Subir
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}