import React, { useState } from 'react';

//Alert
import SweetAlert from "react-bootstrap-sweetalert";

//file reader csv
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';

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

// @material-ui/core components
import { withStyles,makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography, Zoom } from '@material-ui/core';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Divider } from '@material-ui/core';
import Close from "@material-ui/icons/Close";
import { CircularProgress } from '@material-ui/core';

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
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

export default function CourseAdd () {
    const classes = useStyles();
    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);

    //Variable
    const [file, setFile] = useState("");
    const [fileB64, setFileB64] = useState("");
    const [courseName, setCourseName] = useState("");
    const [fileType, setFileType] = useState("");

    //State
    const [fileState, setFileState] = useState("");
    const [questionState, setQuestionState] = useState("");
    const [alternativesState, setAlternativesState] = useState("");
    const [answersState, setAnswersState] = useState("");
    const [nameCourseState, setNameCourseState] = useState("");

    //Display
    const [dataQuestion, setDataQuestions] = useState([]);
    const [headerQuestion, setHeaderQuestion] = useState([]);
    const [alternativesQuestion, setDataAlternatives] = useState([]);
    const [headerAlternatives, setHeaderAlternatives] = useState([]);
    const [dataAnswer, setDataAnswer] = useState([]);
    const [headerAnswer, setHeaderAnswer] = useState([]);

    //Headers
    const hQuestion = ["numero","pregunta"];
    const hAlternatives = ["pregunta", "alternativas"];
    const hAnswer = ["Pregunta", "Respuesta"];


    //read a csv or xlxs
    const processData = (dataString, foo) => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
     
        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
          const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
          if (headers && row.length == headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
              let d = row[j];
              if (d.length > 0) {
                if (d[0] == '"')
                  d = d.substring(1, d.length - 1);
                if (d[d.length - 1] == '"')
                  d = d.substring(d.length - 2, 1);
              }
              if (headers[j]) {
                obj[headers[j]] = d;
              }
            }
     
            // remove the blank rows
            if (Object.values(obj).filter(x => x).length > 0) {
              list.push(obj);
            }
          }
        }
     
        // prepare columns list from headers
        const columns = headers.map(c => ({
          name: c,
          selector: c,
        }));

        if(foo === "Question"){
            setDataQuestions(list);
            setHeaderQuestion(columns);
        }else{
            if(foo === "Answer"){
                setDataAnswer(list);
                setHeaderAnswer(columns);
            }else{
                setDataAlternatives(list);
                setHeaderAlternatives(columns);
            }
        }
     
    }
    //get a file uploaded
    const handleFileUpload = (e, archive) => {
        const file = e;
        const reader = new FileReader();
        reader.onload = (evt) => {
          /* Parse data */
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
          processData(data, archive);
        };
        reader.readAsBinaryString(file);
    }

    const saveCourse = () =>{
        return new Promise ((resolve) => {
            var registro = Date.now();
            const unixtimestamp = registro; 
            const dateobj = new Date(unixtimestamp );
            const date = dateobj.toLocaleDateString();

            var data = {
                name: courseName,
                date: date,
                filetype: fileType,
                fileB64: fileB64,
                questions: dataQuestion,
                alternatives: alternativesQuestion,
                answers: dataAnswer
            }
            //console.log(data);
            FService.createCourse(data).then(() =>{
                console.log("Done");
                resolve();
            }).catch(e =>{
                console.log("Error: " +e);
            });
        }).catch(err => {console.log("Error: " +err)})
    }

    const successAlert = () => {
        setAlert(
            <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Curso Creado"
            onConfirm={() => {
                hideAlert();
                console.log("Hola");
                window.location.href="/admin/courses-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/courses-dashboard";
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

    const errorAlertDone = (text) => {
        setAlert(
            <SweetAlert
            error
            style={{ display: "block", marginTop: "-100px" }}
            title= {text}
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/courses-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/courses-dashboard";
            }}
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

    //validation header
    function verifyHeader(a, b) {
        var largo = a.length;
        var dato = false;
        //console.log(a);
        for (let index = 0; index < largo; index++) {
            const element = a[index];
            if(element.name != b[index]){
                console.log("Cabezal incorrecto");
                dato = true;
                break;
            }
        }
        return dato;
    }

    const typeClick = () =>{
        if(fileState === ""){
            setFileState("error");
        }
        if(questionState === ""){
            setQuestionState("error");
        }
        if(answersState === ""){
            setAnswersState("error");
        }
        if(alternativesState === ""){
            setAlternativesState("error");
        }
        if(courseName === ""){
            setNameCourseState("error");
        }

        const hQ = verifyHeader(headerQuestion, hQuestion);
        const hAlt = verifyHeader(headerAlternatives, hAlternatives);
        const hA = verifyHeader(headerAnswer, hAnswer);

        if(courseName != "" && nameCourseState != "error"){
            if(file != "" && fileState != "error"){
                if(dataQuestion !="" && questionState != "error"){
                    if(hQ === false){
                        if(alternativesQuestion != "" && alternativesState != "error"){
                            if(hAlt === false){
                                if(dataAnswer != "" && answersState != "error"){
                                    if(hA === false){
                                        //console.log(dataQuestion, dataAnswer, alternativesQuestion);
                                        waiting();
                                    }else{
                                        errorAlert("El Nombre de las Columnas de las Respuestas está erroneo o fue modificado, favor de verificar el documento");
                                    }
                                }else{
                                    errorAlert("Por favor ingrese el archivo de respuestas");
                                }
                            }else{
                                errorAlert("El Nombre de las Columnas de las Alternativas está erroneo o fue modificado, favor de verificar el documento");
                            }
                        }else{
                            errorAlert("Por favor ingrese el archivo de alternativas");
                        }
                    }else{
                        errorAlert("El Nombre de las Columnas de las Preguntas está erroneo o fue modificado, favor de verificar el documento");
                    }
                }else{
                    errorAlert("Por favor ingrese el archivo de preguntas");
                }
            }else{
                errorAlert("Por favor ingrese un archivo válido");
            }
        }else{
            errorAlert("Por favor ingrese el Nombre del Curso");
        }
    }

    const waiting = async () =>{
        waitAlert();
        await saveCourse();
        hideAlert();
        successAlert();
    }

    const verifyType = (value, type) =>{
        var data = value.split(".");
        const l = data.length;
        console.log(l, data[l - 1]);
        if(data[l - 1] === type){
            return true;
        }
        return false;
    }
 
    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length > length) {
        return true;
        }
        return false;
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
                            <h4 className={classes.cardTitle}>Agregar Curso</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Nombre Curso</Typography>
                                                {"Nombre del curso a crear"} 
                                            </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <FormLabel className={classes.labelHorizontal}>
                                            Nombre del Curso
                                        </FormLabel>
                                    </HtmlTooltip>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={nameCourseState === "success"}
                                        error={nameCourseState === "error"}
                                        id="titulorequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 0)) {
                                                setNameCourseState("success");
                                                setCourseName(event.target.value);
                                            } else {
                                                setNameCourseState("error");
                                            }
                                            },
                                            type: "text",
                                            placeholder: "Nombre del Curso",
                                            endAdornment:
                                            nameCourseState === "error" ? (
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
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Cargar Archivo</Typography>
                                                {"El archivo debe ser de extensión .PDF ó .MP4"} 
                                            </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <FormLabel className={classes.labelHorizontal}>
                                            Cargar Archivo
                                        </FormLabel>
                                    </HtmlTooltip>
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
                                                if( verifyType(event.target.value, "pdf") || 
                                                verifyType(event.target.value, "mp4")){
                                                    let reader = new FileReader();
                                                    let file = event.target.files[0];
                                                    var type = event.target.value.split(".");
                                                    setFileType(type[type.length - 1]);
                                                    reader.onloadend = () => {
                                                        setFile(file);
                                                        //console.log(file);
                                                        setFileB64(reader.result);
                                                    };
                                                    if (file) {
                                                        reader.readAsDataURL(file);
                                                    }
                                                    setFileState("success");
                                                }else{
                                                    setFileState("error");
                                                }
                                            } else {
                                                setFileState("error");
                                            }
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
                            <Divider />
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Cargar Archivo</Typography>
                                                {"El archivo debe ser de extensión .CSV ó .EXCEL"} 
                                            </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <FormLabel className={classes.labelHorizontal}>
                                            Cargar Preguntas
                                        </FormLabel>
                                    </HtmlTooltip>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={questionState === "success"}
                                        error={questionState === "error"}
                                        id="questionrequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        multiple
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 1)) {
                                                if(verifyType(event.target.files[0].name, "xlsx") || verifyType(event.target.files[0].name, "csv")){
                                                    setQuestionState("success");
                                                    //console.log(event.target.files[0].name);
                                                    handleFileUpload(event.target.files[0], "Question");
                                                }else{
                                                    setQuestionState("error");
                                                }
                                            } else {
                                                setQuestionState("error");
                                            }
                                            },
                                            type: "file",
                                            endAdornment:
                                            questionState === "error" ? (
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
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Cargar Archivo</Typography>
                                                {"El archivo debe ser de extensión .CSV ó .EXCEL"} 
                                            </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <FormLabel className={classes.labelHorizontal}>
                                            Cargar Alternativas
                                        </FormLabel>
                                    </HtmlTooltip>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={alternativesState === "success"}
                                        error={alternativesState === "error"}
                                        id="alternativerequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        multiple
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 1)) {
                                                if(verifyType(event.target.files[0].name, "xlsx") || verifyType(event.target.files[0].name, "csv")){
                                                    setAlternativesState("success");
                                                    //console.log(event.target.files[0].name);
                                                    handleFileUpload(event.target.files[0]);
                                                }else{
                                                    setAlternativesState("error");
                                                }
                                            } else {
                                                setAlternativesState("error");
                                            }
                                            },
                                            type: "file",
                                            endAdornment:
                                            alternativesState === "error" ? (
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
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Cargar Archivo</Typography>
                                                {"El archivo debe ser de extensión .CSV ó .EXCEL"} 
                                            </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <FormLabel className={classes.labelHorizontal}>
                                            Cargar Respuestas
                                        </FormLabel>
                                    </HtmlTooltip>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                    <CustomInput 
                                        success={answersState === "success"}
                                        error={answersState === "error"}
                                        id="answerrequired"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        multiple
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 1)) {
                                                if(verifyType(event.target.files[0].name, "xlsx") || verifyType(event.target.files[0].name, "csv")){
                                                    setAnswersState("success");
                                                    //console.log(event.target.files[0].name);
                                                    handleFileUpload(event.target.files[0], "Answer");
                                                }else{
                                                    setAnswersState("error");
                                                }
                                            } else {
                                                setAnswersState("error");
                                            }
                                            },
                                            type: "file",
                                            endAdornment:
                                            answersState === "error" ? (
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
                            <Divider />
                            <GridContainer>
                                <GridItem xs={4}>
                                    <Card plain>
                                    <CardBody >
                                    <DataTable
                                        title="Preguntas"
                                        pagination
                                        highlightOnHover
                                        columns={headerQuestion}
                                        data={dataQuestion}
                                    />
                                    </CardBody>
                                    </Card>
                                </GridItem>
                                <GridItem xs={4}>
                                    <Card plain>
                                    <CardBody >
                                    <DataTable
                                        title="Alternativas"
                                        pagination
                                        highlightOnHover
                                        columns={headerAlternatives}
                                        data={alternativesQuestion}
                                    />
                                    </CardBody>
                                    </Card>
                                </GridItem>
                                <GridItem xs={4}>
                                    <Card plain>
                                    <CardBody >
                                    <DataTable
                                        title="Respuestas"
                                        pagination
                                        highlightOnHover
                                        columns={headerAnswer}
                                        data={dataAnswer}
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
                            Subir
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}