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
import { withStyles,makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography, Zoom } from '@material-ui/core';
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
import Help from '@material-ui/icons/Help';

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import stylesTables from "../../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);
const useStylesTables = makeStyles(stylesTables);

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
}))(Tooltip);

export default function UserAssign () {

    const classesA = useStylesAlert();
    const classes = useStyles();
    const classesT = useStylesTables();

    //alerta
    const [alert, setAlert] = useState(null);

    //variable
    const [listProject, setListProject] = useState([]);
    const [listEnterprise, setListEnterprise] = useState([]);
    const [listWorkers, setListWorkers] = useState([]);
    const [checked, setChecked] = React.useState([]);
    const [enterprise, setEnterprise] = useState("");
    const [idEnterprise, setIdEnterprise] = useState("");
    const [project, setProject] = useState("");
    const [idProject, setIdProject] = useState("");
    const [logo, setLogo] = useState();

    //State
    const [enterpriseState, setEnterpriseState] = useState("");
    const [projectState, setProjectState] = useState("");

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

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
                displayLogo(en);
                FService.getAllProjectWEnterprise(en.data().enterprisename).onSnapshot(onDataChange);
                FService.getAllWorkersWEnterprise(en.data().enterprisename).onSnapshot(onDataWorkers);
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

    //display image
    const displayLogo = (e) =>{
        let dato =  verifyExist(e, listEnterprise);
        setLogo(dato);
        //console.log(img);
    }

    // validation function
    function verifyExist(a, value){
        //console.log("Hola", a, b);
        var largo = value.length;
        var dato = "";

        for (let index = 0; index < largo; index++) {
            const element = value[index];
            if(element.name == a){
                dato = element.logo;
                break;
            }
        }
        return dato;
    };
    const onDataChange = (items) => {
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

    const onDataWorkers = (items) => {
        let us = [];
        //console.log(items);
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                name: data.name,
                rut: data.rut,
                enterprise: data.enterprise,
                status: data.status,
                project: data.project

            });
        });
        setListWorkers(us);
    };

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataEnterprise);
        return () => unsubscribe();
    }, []);

    function urltoFile(url, filename, mimeType){
        return (fetch(url)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], filename,{type:mimeType});})
        );
    }

    const typeClick = () =>{
        if(enterpriseState === ""){
            setEnterpriseState("error");
        }
        if(projectState === ""){
            setProjectState("error");
        }

        if(enterpriseState != "error" && enterprise != ""){
            if(projectState != "error" && project != ""){
                warningWithConfirmAndCancelMessage(project);
            }else{
                errorAlert("Seleccione un Proyecto");
            }
        }else{
            errorAlert("Seleccione una Empresa");
        }
    }

    const saveWorker = () =>{
        checked.map((c, index) =>{
            FService.updateWorker(c, {project:project, idDocProject: idProject ,status:"En Proyecto"}).then(() =>{
                console.log("Done");
            }).catch(e =>{
                console.log("Error: " +e);
            });
        })
    }

    function warningWithConfirmAndCancelMessage(b){
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title={"¿Desea asignarlos al proyecto " + b + " ?"}
            onConfirm={() => successAssig()}
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
  
    const successAssig = () => {
        saveWorker();
        setAlert(
            <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Usuarios Asignados!"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/userassig-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/userassig-dashboard";
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
    const infoAlert = () => {
        setAlert(
          <SweetAlert
            info
            style={{ display: "block", marginTop: "-100px" }}
            title= "Ayuda"
            onConfirm={hideAlert}
            confirmBtnCssClass={classesA.button + " " + classesA.success}
          >
            <h4>Si la empresa no tiene proyecto no podrás asignar usuarios</h4>
          </SweetAlert>
        );
      };

    const hideAlert = () => {
        setAlert(null);
    };
    //console.log(checked);
    console.log(listProject, enterprise, listWorkers, listEnterprise, checked);
    return (
        <GridContainer >
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Asignar Proyecto</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={2}>
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Seleccionar Empresa</Typography>
                                                {"Empresa a la cual pertenecen los usuarios"} 
                                            </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <FormLabel className={classes.labelHorizontal}>
                                            Empresa
                                        </FormLabel>
                                    </HtmlTooltip>
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
                                            <MenuItem
                                                disabled
                                                classes={{
                                                root: classes.selectMenuItem
                                                }}
                                            >
                                                Elije la Empresa
                                            </MenuItem>
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
                                        <HtmlTooltip
                                            title={
                                                <React.Fragment>
                                                    <Typography color="inherit">Seleccionar Proyecto</Typography>
                                                    {"Proyecto al que serán asignados los usuarios"} 
                                                </React.Fragment>
                                            }
                                            TransitionComponent={Zoom}
                                        >
                                            <FormLabel className={classes.labelHorizontal}>
                                                Proyecto
                                            </FormLabel>
                                        </HtmlTooltip>
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
                                                tableHead={["#","","Nombre", "Rut", "Estado"]}
                                                tableData={listWorkers.map((p, index) => [
                                                    index +1,
                                                    <Checkbox
                                                        key="key"
                                                        className={classesT.positionAbsolute}
                                                        tabIndex={-1}
                                                        onClick={() => handleToggle(p.id)}
                                                        checkedIcon={<Check className={classesT.checkedIcon} />}
                                                        icon={<Check className={classesT.uncheckedIcon} />}
                                                        classes={{
                                                        checked: classesT.checked,
                                                        root: classesT.checkRoot
                                                        }}
                                                    />,
                                                    p.name, 
                                                    p.rut, 
                                                    p.status
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
                            Asignación a Proyecto
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}