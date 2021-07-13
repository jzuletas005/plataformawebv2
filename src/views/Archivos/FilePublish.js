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
import { CircularProgress } from '@material-ui/core';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Divider} from '@material-ui/core';

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


export default function FilePublish (){

    const classesA = useStylesAlert();
    const classes = useStyles();
    const classesT = useStylesTables();

    //alerta
    const [alert, setAlert] = useState(null);

    //Variables
    const [listFiles, setListFiles] = useState([]);
    const [listEnterprise, setListEnterprise] = useState([]);
    const [listProject, setListProject] = useState([]);
    const [enterprise, setEnterprise] = useState("");
    const [idEnterprise, setIdEnterprise] = useState("");
    const [project, setProject] = useState("");
    const [idProject, setIdProject] = useState("");
    const [files, setFiles] = useState([]);
    const [e, setE] = useState("");
    const [p,setP] = useState("");

    //state
    const [enterpriseState, setEnterpriseState] = useState("");
    const [projectState, setProjectState] = useState("");

    const handleSimple = event => {
        console.log(event.target.value);
        if (verifyLength(event.target.value, 0)) {
            setEnterpriseState("success");
            setIdEnterprise(event.target.value);
            FService.getOneEnterprise(event.target.value).then(p =>{
                setEnterprise(p.data().enterprisename);
                setE(p.data().enterpriseid);
                FService.getAllProjectWEnterprise(p.data().enterprisename).onSnapshot(onDataEnterpriseP);
            }).catch(e =>{
                console.log("error:" +e);
            })
        } else {
            setEnterpriseState("error");
        }
    };

    const handleSimpleProject = event => {
        console.log(event.target.value);
        if (verifyLength(event.target.value, 0)) {
            setProjectState("success");
            setIdProject(event.target.value);
            FService.getOneProject(event.target.value).then( p =>{
                setProject(p.data().name);
                setP(p.data().id);
            }).catch(e =>{
                console.log("Error: " +e);
            });
        } else {
            setProjectState("error");
        }
    };

    const handleToggle = value => {
        const currentIndex = files.indexOf(value);
        const newChecked = [...files];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setFiles(newChecked);
    };

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const saveFileEnterprise = () =>{
        return new Promise ((resolve) =>{
            files.map((f, index) =>{
                var data = {
                    nameEnterprise: enterprise,
                    nameProject: project,
                    idDocEnterprise: idEnterprise,
                    idDocProject: idProject,
                    idEnterprise: e,
                    idProject: p,
                    idfile: f.fileid,
                    nameFile: f.name,
                    typeFile: f.type,
                    urlFile: f.url
                }
                FService.createFileEnterprise(data).then(() =>{
                    console.log("Done");
                }).catch(e =>{
                    console.log("Error: " +e);
                });
            })
            resolve();
        }).catch(e =>{
            console.log("Error: " +e);
        });
    }

    const onDataChange = (items) => {
        let us = [];
    
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            var n = data.name+ "." + data.type.toLowerCase();
            us.push({
                fileid: id,
                name: data.name,
                type: data.type,
                time: data.time,
                url: data.url,
            });
        });
        setListFiles(us);
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

    const onDataEnterpriseP = (items) => {
        let us = [];
        //console.log(items);
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                projectid: data.id,
                name: data.name,
                enterprise: data.enterprise,
                dateStart: data.dateStart,
                dateEnd: data.dateEnd
            });
        });
        setListProject(us);
    };

    useEffect(() => {
        const unsubscribe = FService.getAllFiles().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataEnterprise);
        return () => unsubscribe();
    }, []);


    const hideAlert = () => {
        setAlert(null);
    };

    const typeClick = ()=>{
        if(enterpriseState === ""){
            setEnterpriseState("error");
        }
        if(projectState === ""){
            setProjectState("error");
        }

        if(enterpriseState != "error" && enterprise != ""){
            if(projectState != "error" && project != ""){
                warningWithConfirmAndCancelMessage(project, enterprise);
            }else{
                errorAlert("Seleccione un Proyecto");
            }
        }else{
            errorAlert("Seleccione una Empresa");
        }
    };

    function warningWithConfirmAndCancelMessage(a, b){
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title={"¿Desea asignarlos a la empresa " + b + " con el proyecto "+ a + " ?"}
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
        await saveFileEnterprise();
        setTimeout(successAssig, 1000);
      }
  
    const successAssig = () => {
        setAlert(
            <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Archivos Asignados!"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/filepublish-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/filepublish-dashboard";
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

    console.log(files);
    return(
        <GridContainer >
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Asignar Archivo</h4>
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
                                            {listEnterprise.map((option) =>(
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
                                            {listProject.map((option) =>(
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
                            </GridContainer>
                            <br/>
                            <Divider />
                            <GridContainer>
                                <GridItem xs={12}>
                                    <Card plain >
                                        <CardBody>
                                            <Table 
                                                stripped
                                                tableHead={["","Nombre", "Tipo", "Fecha de Creación"]}
                                                tableData={listFiles.map((p, index) => [
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
                                                    p.type, 
                                                    p.time
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
                            Asignar Archivo
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}