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
import Help from '@material-ui/icons/Help';

// @material-ui/core components
import { withStyles,makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography, Zoom } from '@material-ui/core';
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

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);


export default function ArticlePublish (){

    const classesA = useStylesAlert();
    const classes = useStyles();
    const classesT = useStylesTables();

    //alerta
    const [alert, setAlert] = useState(null);

    //Variables
    
    const [listEnterprise, setListEnterprise] = useState([]);
    const [listNews, setListNews] = useState([]);
    const [enterprises, setEnterprises] = useState([]);
    const [idNews, setIdNews] = useState("");
    const [news, setNews] = useState("");
    const [newsID, setNewsID] = useState("");
    const [newsDate, setNewsDate] = useState("");

    //state
    const [enterpriseState, setEnterpriseState] = useState("");
    const [newsState, setNewsState] = useState("");

    const handleSimple = event => {
        console.log(event.target.value);
        setIdNews(event.target.value);
        if (verifyLength(event.target.value, 0)) {
            setNewsState("success");
            setNews(event.target.value);
            FService.getOneNews(event.target.value).then(p =>{
                setNews(p.data().title);
                setNewsID(p.data().newsid);
                setNewsDate(p.data().datepublish);
            }).catch(e =>{
                console.log("error:" +e);
            })
        } else {
            setNewsState("error");
        }
    };

    const handleToggle = value => {
        const currentIndex = enterprises.indexOf(value);
        const newChecked = [...enterprises];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setEnterprises(newChecked);
    };

    // function that verifies if a string has a given length or not
    const verifyLength = (value, length) => {
        if (value.length >= length) {
        return true;
        }
        return false;
    };

    const saveNewsPublish = () =>{
        return new Promise((resolve) =>{
            enterprises.map((en, index) =>{
                var data = {
                    idDocEnterprise: en.id,
                    enterprise : en.name,
                    enterpriseid: en.enterpriseid,
                    idDocNews: idNews,
                    news: news,
                    newsID: newsID,
                    date: newsDate
                } 
    
                FService.createNewsPublish(data).then(() =>{
                    console.log("Done");
                }).catch(err =>{
                    console.log("Error: " +err);
                });
            });
            resolve();
        }).catch(err =>{
            console.log("Error: " +err);
        });
    };

    const onDataChange = (items) => {
        let us = [];
    
        items.docs.forEach(function (item, keyX) {
            let id = item.id;
            let data = item.data();
            us.push({
                id: id,
                newsid: data.newsid,
                title: data.title,
                description: data.description,
                date: data.datepublish
            });
        });
        setListNews(us);
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

    function toCheck () {
        var dato = false;
        if(enterprises.length > 0){
            dato = true;
        }
        return dato;
    }

    useEffect(() => {
        const unsubscribe = FService.getAllNews().onSnapshot(onDataChange);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = FService.getAllEnterprise().onSnapshot(onDataEnterprise);
        return () => unsubscribe();
    }, []);


    const typeClick = ()=>{
        if(enterpriseState === ""){
            setEnterpriseState("error");
        }
        if(newsState === ""){
            setNewsState("error");
        }
        if(toCheck){
            setEnterpriseState("success");
        }
        
        if(enterpriseState != "error" && enterprises.length > 0){
            if(newsState != "error" && news != ""){
                warningWithConfirmAndCancelMessage(news);
            }else{
                errorAlert("Seleccione una Noticia");
            }
        }else{
            errorAlert("Seleccione al menos una Empresa");
        }
    };

    function warningWithConfirmAndCancelMessage(b){
        setAlert(
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title={"¿Desea asignarlos a la noticia " + b + " ?"}
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
      const waiting = async() =>{
        waitAlert();
        await saveNewsPublish();
        setTimeout(successAssig, 1000);
      }

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
    const successAssig = () => {
        setAlert(
            <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Noticia Asignada!"
            onConfirm={() => {
                hideAlert();
                //console.log("Hola");
                window.location.href="/admin/articlespublish-dashboard"; //TODO Verificar si es la mejor opcion de redireccionamiento de acuerdo al metodo establecido
            }}
            onCancel={() => {
                hideAlert();
                window.location.href="/admin/articlespublish-dashboard";
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

    //console.log(enterprises, news);

    const hideAlert = () => {
        setAlert(null);
    };
    return(
        <GridContainer >
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="rose" text>
                        <CardText color="rose">
                            <h4 className={classes.cardTitle}>Asignar Noticia</h4>
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
                                                <Typography color="inherit">Seleccionar Noticia</Typography>
                                                {"Escoja la noticia que le asignará a la empresa"} 
                                            </React.Fragment>
                                            }
                                            TransitionComponent={Zoom}
                                        >
                                            <FormLabel className={classes.labelHorizontal}>
                                                Noticias
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
                                            value={idNews}
                                            onChange={handleSimple}
                                            inputProps={{
                                                name: "simpleSelect",
                                                id: "simple-select"
                                            }}
                                        >
                                            {listNews.map((option) =>(
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value = {option.id} 
                                                >
                                                    {option.newsid +"  " +option.title}
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
                                                tableHead={["#"," ","ID", "Empresa"]}
                                                tableData={listEnterprise.map((p, index) => [
                                                    index + 1,
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
                                                    p.enterpriseid, 
                                                    p.name,
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
                            Asignar Noticia
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}