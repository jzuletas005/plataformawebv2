import React, {useState, useEffect, useCallback, Component} from 'react';

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
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import { CircularProgress } from '@material-ui/core';
import Help from '@material-ui/icons/Help';

// @material-ui/core components
import { withStyles,makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography, Zoom } from '@material-ui/core';
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Divider } from '@material-ui/core';

//@material-ui/icon components
import Close from "@material-ui/icons/Close";

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { Widgets } from '@material-ui/icons';
import { transition } from '../../assets/jss/material-dashboard-pro-react.js';

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

export default function UserAdd () {

    const classesA = useStylesAlert();
    const classes = useStyles();

    //ValidaRUT
    const { validate, clean, format, getCheckDigit } = require('rut.js')

    //alerta
    const [alert, setAlert] = useState(null);

    //variables
    const [file, setFile] = useState("");
    const [fileState, setFileState] = useState("");

    //loading
    const [isLoading, setIsLoading] = useState(false);

    //Plataforma
    const [pNorte, setPNorte] = useState("");
    const [idPNorte, setIdPNorte] = useState("");

    //data variables
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [enterprise, setEnterprise] = useState("");
    const [idEnterprise, setIdEnterprise] = useState("");
    const [headers, setHeaders] = useState(["Nombre", "Rut", "Edad", "Email", "Telefono", "Oficio"]);

    //states
    const [enterpriseState, setEnterpriseState] = useState("");

    const saveUser = async (value) =>{
        for (let index = 0; index < value.length; index++) {
            let element = value[index];
            let pass = makePassword(12);
            let run = formatAndValidate(element.Rut);
            let a = verifyExist(element.Nombre, run, users);

            //console.log(a);
       
            if(a == false){
                //console.log(a);
                console.log("No existe");
                if(run != 0 ){
                    console.log("Rut Válido");

                    var data = {
                        name: element.Nombre,
                        rut: run,
                        age: element.Edad,
                        email: element.Email,
                        phone: element.Telefono,
                        username: clean(run) + "@" + "plataformanorte.com",
                        pass: pass,
                        passconfirm: pass,
                        profesion1: element.Oficio,
                        profesion2: "",
                        profesion3: ""
                    }

                   var uid = await getUID(data.username, data.pass);

                   console.log(uid);

                   if(uid != "Error"){
                        await createNewUser(uid, data);  
                        //await createFolderUser(clean(run));
                   }else{
                       console.log("Datos Errones");
                   }
                }else{
                    console.log("Rut No Válido");
                }
            }else{
                console.log("Usuario Existe");
               
            }
        }
        //successAlert();
        await saveWorker(value);
        successAlert();
    };

    //Get uid after create authentication
    const getUID = (username, pass) =>{
        return new Promise((resolve) =>{
            FService.createAuth(username, pass).then((auth) =>{
                resolve(auth.user.uid);
            }).catch(err =>{
                resolve("Error");
                console.log("error: " +err);
            });
        })
    }

    //create folder user
    const createFolderUser = (folder) => {
        console.log("Here");
        return new Promise ((resolve) => {
            FService.createProfileUser(folder);
            FService.createDocUser(folder);
            resolve();
        }).catch(err => {
            console.log("Error");
        })
    }

    const createNewUser = (uid,data) =>{
        return new Promise((resolve) =>{
            FService.createUser(uid, data).then((a) =>{
                console.log("Create User " + data.name);
                resolve();
            }).catch(e =>{
                console.log("Error:" + e);
            });
        });
    }

    const saveWorker = (work) =>{

        return new Promise((resolve, reject)=>{
            for (let index = 0; index < work.length; index++) {
                const element = work[index];
                let run = formatAndValidate(element.Rut);
                let w = verifyExistW(run, enterprise, worker);
    
                if(w == false){
                    if(run != 0 ){
                        console.log("Rut Válido");
    
                        var data = {
                            idDocUser: "",
                            name: element.Nombre,
                            rut: run,
                            enterprise: enterprise,
                            idDocEnterprise: idEnterprise,
                            project: "No Asignado",
                            idDocProject:"",
                            status: "Disponible"
                        }
        
                        FService.createWorker(data).then(() =>{
                            console.log("Done");
                        }).catch(e =>{
                            console.log("Error:" +e);
                        });
                        //saveFileWorker(data);
                    }else{
                        console.log("Rut No Válido");
                    }
                }else{
                    errorAlert("Usuario(s) ya existen es esta empresa"); //TODO REvisar urgente esta posibilidad
                    console.log("Trabajador Existe");
                }
    
            }
            hideAlert();
            resolve();
        }).catch(err =>{
            console.log("Error: " +err);
        });
    };

    // validation function
    function verifyExist(a, b, value){
        //console.log("Hola", a, b);
        var largo = value.length;
        var dato = false;

        for (let index = 0; index < largo; index++) {
            const element = value[index];
            if(element.name == a && element.rut == b){
                dato = true;
                break;
            }
        }
        return dato;
    };
    // validation function worker
    function verifyExistW(a, b, value){
        console.log("Hola", a, b);
        var largo = value.length;
        var dato = false;

        for (let index = 0; index < largo; index++) {
            const element = value[index];
            if(element.workerrut == a && element.workerenterprise == b){
                dato = true;
                break;
            }
        }
        return dato;
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

    //make a password
    function makePassword(maxLengthPass) {
        var collectionOfLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var generatedPassword = "";
        var size = collectionOfLetters.length;
        for (var i = 0; i < maxLengthPass; ++i) {
           generatedPassword = generatedPassword + collectionOfLetters.charAt(Math.floor(Math.random() * size));
        }
        return generatedPassword;
    }
    //read a csv or xlxs
    const processData = dataString => {
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
     
        setData(list);
        setColumns(columns);
    }
    //get a file uploaded
    const handleFileUpload = e => {
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
          processData(data);
        };
        reader.readAsBinaryString(file);
    }

    const handleSimple = event => {
        if (verifyLength(event.target.value, 0)) {
            setEnterpriseState("success");
            setIdEnterprise(event.target.value);
            FService.getOneEnterprise(event.target.value).then(e =>{
                setEnterprise(e.data().enterprisename);
            }).catch(err =>{
                console.log("Error: "+err );
            });
        } else {
            setEnterpriseState("error");
        }
    };

    //Format And Validate RUT
    function formatAndValidate(params) {
        
        if(validate(clean(params))){
            return format(params);
        }else{
            //console.log(params);
            return 0;
        }
    }

    //get al workers
    const [worker, setWorker] = useState([]);
    const getAllWorkers = (items) =>{
        let work = [];
        items.docs.forEach(function (i, key) {
            let data = i.data();
            work.push({
                workerrut: data.rut,
                workerenterprise: data.enterprise
            });
        });
        setWorker(work);
    };

    //get all users
    const [users, setUsers] = useState([]);
    const getAllUser = (items) =>{
        let user = [];
        items.docs.forEach(function (i, key) {
            let data = i.data();
            user.push({
                name: data.name,
                rut: data.rut
            });
        });
        setUsers(user);
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

            if(data.enterprisename === "Plataforma Norte"){
                setPNorte(data.enterprisename);
                setIdPNorte(data.id);
            }
        });
        setList(us);
    };

    //useEffect's
    useEffect(() => {
        const subscribe = FService.getAllWorkers().onSnapshot(getAllWorkers);
        return () => subscribe();
    }, []);

    useEffect(() => {
        const subscribe = FService.getAllUser().onSnapshot(getAllUser);
        return () => subscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Usuarios Creados"
            onConfirm={() => {
                hideAlert();
                console.log("Hola");
                window.location.href="/admin/user-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/user-dashboard";
            }}
            confirmBtnCssClass={classesA.button + " " + classesA.success}
          >
            Si algún usuario no fue creado, favor revisar el documento e importar denuevo.
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

      const infoAlert = () => {
        setAlert(
          <SweetAlert
            info
            style={{ display: "block", marginTop: "-100px" }}
            title= "Ayuda"
            onConfirm={hideAlert}
            confirmBtnCssClass={classesA.button + " " + classesA.success}
          >
            <h4>El orden de los cabezales del archivo a subir son: </h4>
            <h5>Nombre</h5><h5>Rut</h5>
            <h5>Edad</h5><h5>Email</h5>
            <h5>Telefono</h5><h5>Oficio</h5>
          </SweetAlert>
        );
      };
   
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

    const typeClick = () =>{
        if (fileState === "") {
            setFileState("error");
        }
        if (enterpriseState === "") {
            setEnterpriseState("error");
        }

        let h = verifyHeader(columns, headers);

        if(fileState != "error" && file != ""){
            if(h == false){
                if(enterpriseState != "error" && enterprise !=""){
                    waitAlert();
                    saveUser(data);
                    //testprogress();
                }else{
                    errorAlert("Seleccione la empresa a la pertenecen los usuarios");
                }
            }else{
                errorAlert("El Nombre de las Columnas está erroneo o fue modificado, favor de verificar el documento");
            }
        }else{
            errorAlert("Seleccione el documento para cargar a los usuarios");
        }
    };

    return(
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Agregar Usuarios</h4>
                        </CardText>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <HtmlTooltip
                                        title={
                                        <React.Fragment>
                                            <Typography color="inherit">Cargar Archivos</Typography>
                                            {"El archivo debe ser .CSV (con cabezales) ó .EXCEL"} 
                                        </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <FormLabel className={classes.labelHorizontal}>
                                            Cargar Usuarios
                                        </FormLabel>
                                    </HtmlTooltip>
                                </GridItem>
                                <GridItem xs={12} sm={3}>
                                    <CustomInput 
                                        success={fileState === "success"}
                                        error={fileState === "error"}
                                        id="filerequired"
                                        formControlProps={{
                                            fullWidth: false
                                        }}
                                        multiple
                                        inputProps={{
                                            onChange: event => {
                                            if (verifyLength(event.target.value, 1)) {
                                                setFileState("success");
                                                handleFileUpload(event.target.files[0]);
                                            } else {
                                                setFileState("error");
                                            }
                                            setFile(event.target.files[0]);
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
                                <br />
                                <GridItem xs={12} sm={3}>
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
                                <GridItem>
                                    <HtmlTooltip
                                        title={
                                        <React.Fragment>
                                            <Typography color="inherit">Ayuda</Typography>
                                        </React.Fragment>
                                        }
                                        TransitionComponent={Zoom}
                                    >
                                        <Button 
                                            justIcon
                                            round
                                            simple
                                            size="lg"
                                            onClick={infoAlert}
                                            color="primary"
                                            className="help"
                                        >
                                        <Help />             
                                        </Button>
                                    </HtmlTooltip>
                                </GridItem>
                            </GridContainer> 
                            <Divider />
                            <GridContainer>
                                <GridItem xs={12}>
                                    <Card plain>
                                    <CardBody >
                                    <DataTable
                                        title="Usuarios"
                                        pagination
                                        highlightOnHover
                                        columns={columns}
                                        data={data}
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