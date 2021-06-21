import React, {useState, useEffect} from 'react';

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

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";


//@material-ui/icon components
import Close from "@material-ui/icons/Close";

// style for this view
import styles from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import stylesAlert from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const useStylesAlert = makeStyles(stylesAlert);

export default function EnterpriseAdd (){

    const classesA = useStylesAlert();

    //alerta
    const [alert, setAlert] = useState(null);

    // type validation
    const [requiredState, setrequiredState] = useState("");
    const [typeEmailState, settypeEmailState] = useState("");
    const [requiredrutState, setrequiredrutState] = useState("");
    const [logoState, setLogoState] = useState("");

    //list validation
    const [list, setList] = useState([]);
    const [exist, setExist] = useState(false);
    
    // firebase post
    const [enterprisename, setenterprisename] = useState("");
    const [enterpriserut, setenterpriserut] = useState("");
    const [enterpriseemail, setenterpriseemail] = useState("");
    const [enterpriselogo, setenterpriselogo] = useState("");
    
    const callbackFunction = (childData) => {
        if(childData == ""){
            setLogoState("error");
        }else{
            setLogoState("success");
            setenterpriselogo(childData);
        }
    }

    const saveEnterprise = () =>{
    
        var initial = iniciales(enterprisename);
        var id = enterpriserut.slice(-5);
        var data = {
            enterpriseid: initial + "-" + id,
            enterprisename: enterprisename,
            enterpriserut: enterpriserut,
            enterpriseemail: enterpriseemail,
            enterpriselogo: enterpriselogo
        };

        FService.createEnterprise(data).then(() =>{
            console.log("Done");
            successAlert();
        }).catch(e => {
            console.log(e);
        });
        
    };

    const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Empresa Creada"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/enterprise-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/enterprise-dashboard";
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

    // function that returns true if value is email, false otherwise
    const verifyEmail = value => {
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(value)) {
        return true;
        }
        return false;
    };
    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };
    // validation function
    const verifyExist = (a, b) =>{
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if(element.name == a && element.rut == b){
                setExist(true);
                break;
            }
        }
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

    const onDataChange = (items) => {
        let us = [];

        items.docs.forEach(function (item) {
            let data = item.data();
            us.push({
                name: data.enterprisename,
                rut: data.enterpriserut,
            });
        });
        setList(us);
    };

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    const typeClick = () => {
        if (requiredState === "") {
          setrequiredState("error");
        }
        if (typeEmailState === "") {
          settypeEmailState("error");
        }
        if (requiredrutState === "") {
            setrequiredState("error");
        }
        if (logoState === ""){
            setLogoState("error");
        }

        if(enterprisename != "" && enterpriserut != "" && enterpriseemail != "" && enterpriselogo != ""){
            if(requiredState != "error" && typeEmailState != "error" && requiredrutState != "error" && logoState != "error"){
                    verifyExist(enterprisename, enterpriserut);
                 if(exist === false){
                    saveEnterprise();
                 }else{
                     errorAlert("Empresa ya existe");
                 }
            }else{
                errorAlert("Hay campos invalidos");
            }
        }else{
            errorAlert("Hay campos vacios");
        }
    };

    const hideAlert = () => {
        setAlert(null);
    };

    const classes = useStyles();
    console.log(enterpriselogo);
    return(
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="rose" text>
                            <CardText color="rose">
                                <h4 className={classes.cardTitle}>Agregar Empresa</h4>
                            </CardText>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <GridContainer>
                                    <GridItem xs={12} sm={2}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            Nombre de la Empresa
                                        </FormLabel>
                                    </GridItem>
                                    <GridItem xs={12} sm={7}>
                                        <CustomInput 
                                            success={requiredState === "success"}
                                            error={requiredState === "error"}
                                            id="enterprisename"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => {
                                                if (verifyLength(event.target.value, 12)) {
                                                    setrequiredState("success");
                                                } else {
                                                    setrequiredState("error");
                                                }
                                                setenterprisename(event.target.value);
                                                },
                                                type: "text",
                                                placeholder: "BHP Minera Centinela LTDA.SA.",
                                                endAdornment:
                                                requiredState === "error" ? (
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
                                            RUT
                                        </FormLabel>
                                    </GridItem>
                                    <GridItem xs={12} sm={7}>
                                        <CustomInput 
                                            success={requiredrutState === "success"}
                                            error={requiredrutState === "error"}
                                            id="enterpriserut"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => {
                                                if (verifyLength(event.target.value, 9)) {
                                                    setrequiredrutState("success");
                                                } else {
                                                    setrequiredrutState("error");
                                                }
                                                setenterpriserut(event.target.value);
                                                },
                                                name:"enterpriserut",
                                                type: "text",
                                                placeholder: "Sin punto y sin guión",
                                                endAdornment:
                                                requiredrutState === "error" ? (
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
                                            Email
                                        </FormLabel>
                                    </GridItem>
                                    <GridItem xs={12} sm={7}>
                                    <CustomInput
                                        success={typeEmailState === "success"}
                                        error={typeEmailState === "error"}
                                        id="enterpriseemail"
                                        formControlProps={{
                                        fullWidth: true
                                        }}
                                        inputProps={{
                                        onChange: event => {
                                            if (verifyEmail(event.target.value)) {
                                            settypeEmailState("success");
                                            } else {
                                            settypeEmailState("error");
                                            }
                                            setenterpriseemail(event.target.value);
                                        },
                                        name: "enterpriseemail",
                                        type: "email",
                                        placeholder: "algo@correo.com",
                                        endAdornment:
                                            typeEmailState === "error" ? (
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
                                            Logo de la Empresa
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
                                Crear Empresa
                            </Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    )
}