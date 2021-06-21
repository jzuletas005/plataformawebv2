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

export default function CourseAsign () {
    const classesA = useStylesAlert();
    const classes = useStyles();
    const classesT = useStylesTables();

    //alerta
    const [alert, setAlert] = useState(null);

    //variable
    const [listProject, setListProject] = useState([]);
    const [listEnterprise, setListEnterprise] = useState([]);
    const [listCourse, setListCourse] = useState([]);
    const [checked, setChecked] = React.useState([]);

    const [enterprise, setEnterprise] = useState("");
    const [idEnterprise, setIdEnterprise] = useState("");
    const [project, setProject] = useState("");
    const [idProject, setIdProject] = useState("");

    //State
    const [enterpriseState, setEnterpriseState] = useState("");
    const [projectState, setProjectState] = useState("");

    const onDataChange = (items) => {
        let us = [];
        //console.log(items);
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                name: data.name,
                filetype: data.filetype,
                fileB64: data.fileB64,
                alternatives: data.alternatives,
                questions: data.questions,
                answers: data.answers,
                date: data.date
            });
        });
        setListCourse(us);
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
            });
        });
        setListEnterprise(us);
    };

    const onDataProject = (items) => {
        let us = [];
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                projectid: data.id,
                name: data.name,
            });
        });
        setListProject(us);
    };

    //Get all Course
    useEffect(() => {
        const unsubscribe = FService.getAllCourse().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    //Get all Enterprise
    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataEnterprise);
        return () => unsubscribe();
    }, []);

    const handleToggle = value => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleSimple = event => {
        if (verifyLength(event.target.value, 0)) {
            setEnterpriseState("success");
            setIdEnterprise(event.target.value);
            FService.getOneEnterprise(event.target.value).then((en) =>{
                FService.getAllProjectWEnterprise(en.data().enterprisename).onSnapshot(onDataProject);
                setEnterprise(en.data().enterprisename);
            }).catch(err =>{
                console.log("Error: " +err);
            });
        } else {
            setEnterpriseState("error");
        }
    };

    const handleSimpleProject = event => {
        if (verifyLength(event.target.value, 0)) {
            setProjectState("success");
            setIdProject(event.target.value);
            FService.getOneProject(event.target.value).then(p =>{
                setProject(p.data().name);
            }).catch(err =>{
                console.log("Error :" +err);
            });
        } else {
            setProjectState("error");
        }
    };

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const typeClick = () =>{
        if(enterpriseState === ""){
            setEnterpriseState("error");
        }
        if(projectState === ""){
            setProjectState("error");
        }

        if(enterpriseState != "error" && enterprise != ""){
            if(projectState != "error" && project != ""){
                if(checked.length > 0 ){
                    //console.log(checked.length);
                    //console.log(checked);;
                    working();
                }else{
                    errorAlert("Seleccione al menos un curso");
                }
            }else{
                errorAlert("Seleccione un proyecto");
            }
        }else{
            errorAlert("Seleccione una empresa");
        }
    }

    console.log(checked);

    const working = async () =>{
        waitAlert();
        await saveCourseWorker();
        setTimeout(successAlert, 1000);
    }

    const saveCourseWorker = () =>{
        return new Promise((resolve) =>{
            var date = dateNow();

            try{
                checked.map( c =>{
                    var data ={
                        idDocEnterprise: idEnterprise,
                        idDocProject: idProject,
                        enterprise: enterprise,
                        project: project,
                        datepublish: date,
                        idDocCourse: c.id,
                        course: c,
                        coursename: c.name
                    }
        
                    FService.createCourseWorker(data).then(() =>{
                        console.log("Done");
                    }).catch(err =>{    
                        console.log("Error: " +err);
                    });
                });
                resolve();
            }catch (err){
                resolve();
                errorAlert("Ha sucedido un error al crear las relaciones");
                console.log("error: " +err);
            }
        }).catch(err =>{    
            console.log("Error: " +err);
        });
    }

    const dateNow = () =>{
        var registro = Date.now();
        const unixtimestamp = registro; 
        const dateobj = new Date(unixtimestamp );
        const date = dateobj.toLocaleDateString();
        return date;
    }

    const successAlert = () => {
        setAlert(
            <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Curso Asignado"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/coursesasign-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/coursesasign-dashboard";
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

    return(
        <GridContainer >
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Asignar Curso</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                        <GridContainer>
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
                                            {listEnterprise.map((option, index) =>(
                                                <MenuItem
                                                    key={index}
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
                                <GridContainer>
                                    <GridItem xs={12} sm={2}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            Proyecto
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
                                            value={idProject}
                                            onChange={handleSimpleProject}
                                            inputProps={{
                                                name: "simpleSelect",
                                                id: "simple-select"
                                            }}
                                        >
                                            {listProject.map((option, index) =>(
                                                <MenuItem
                                                    key={index}
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
                            </GridContainer>
                            <br/>
                            <Divider />
                            <GridContainer>
                                <GridItem xs={12}>
                                    <Card plain >
                                        <CardBody>
                                            <Table 
                                                stripped
                                                tableHead={["#","","Curso", "Tipo de Archivo", "Fecha de Creación"]}
                                                tableData={listCourse.map((p, index) => [
                                                    index +1,
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
                                                    p.name, 
                                                    p.filetype,
                                                    p.date
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
                            Asignación de Curso
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}