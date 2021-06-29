
//Login
import LoginPage from './views/Paginas/Login.js';

//dashboard views
import Dashboard from './views/Dashboard/Dashboard.js';
import UserDashboard from './views/Usuarios/UserDashboard.js';
import EnterpriseDashboard from './views/Empresas/EnterpriseDashboard.js';
import CallDashboard from './views/Convocatorias/CallsDashboard.js';
import FileDashboard from './views/Archivos/FilesDashboard.js';
import ArticlesDashboard from './views/Articulos/ArticlesDashboard.js';
import CoursesDashboard from './views/Cursos/CourseDashboard.js';
import ProjectDashboard from './views/Proyectos/ProjectDashboard.js';

//crud views
import UserAdd from './views/Usuarios/UserAdd.js';
import EnterpriseAdd from './views/Empresas/EnterpriseAdd.js';
import ProjectAdd from './views/Proyectos/ProjectAdd.js';
import CallsAdd from './views/Convocatorias/CallsAdd.js';
import FilesAdd from './views/Archivos/FilesAdd.js';
import ArticlesAdd from './views/Articulos/ArticlesAdd.js';
import CourseAdd from './views/Cursos/CourseAdd.js';

//Assign views
import UserAssign from './views/Usuarios/UserAssign.js';
import UserAssignDashboard from './views/Usuarios/UserAssignDashboard.js';
import CallPublishDashboard from './views/Convocatorias/CallPublishDashboard.js';
import CallAssign from './views/Convocatorias/CallPublish.js';
import FilePublishDashboard from './views/Archivos/FilePublishDashboard.js';
import FilePublish from './views/Archivos/FilePublish.js';
import ArticlesPublishDashboard from './views/Articulos/ArticlePublishDashboard.js';
import ArticlesPublish from './views/Articulos/ArticlePublish.js';
import CourseAsignDashboard from './views/Cursos/CourseAsignDashboard.js';
import CourseAsign from './views/Cursos/CourseAsign.js';

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import People from '@material-ui/icons/People';
import Enterprise from '@material-ui/icons/Domain';
import Call from '@material-ui/icons/PhonelinkRing';
import File from '@material-ui/icons/FileCopy';
import Articles from '@material-ui/icons/NewReleases';
import Courses from '@material-ui/icons/CheckCircle';
import Project from '@material-ui/icons/Assignment';


var dashRoutes = [
    {
        path: "/dashboard",
        name: "Inicio",
        component: Dashboard,
        icon: DashboardIcon,
        layout: "/admin",
        hide: false,
    },
    {
        
        path: "/enterprise-dashboard",
        name: "Empresas",
        icon: Enterprise,
        component: EnterpriseDashboard,
        layout: "/admin",
        hide: false
    },
    {
        
        path: "/project-dashboard",
        name: "Proyectos",
        icon: Project,
        component: ProjectDashboard,
        layout: "/admin",
        hide: false
    },
    {
        collapse: true,
        name: "Usuarios",
        icon: People,
        state: "userCollapse",
        hide: false,
        views: [
            {
                path: "/user-dashboard",
                name: "Administrar",
                component: UserDashboard,
                layout: "/admin",
                hide: false,
            },
            {
                path:"/user-add",
                name:"Agregar Usuario",
                component: UserAdd,
                layout:"/admin",
                hide: true
            },
            {
                path: "/userassig-dashboard",
                name: "Asignar Usuario",
                component: UserAssignDashboard,
                layout: "/admin",
                hide: false,
            }
        ]
    },
    {
        collapse: true,
        name: "Convocatorias",
        state: "callCollapse",
        icon: Call,
        hide: false,
        views:[
            {
                path: "/call-dashboard",
                name: "Administrar",
                component: CallDashboard,
                hide: false,
                layout: "/admin"
            },
            {
                path: "/call-add",
                name: "Crear Convocatoria",
                component: CallsAdd,
                layout: "/admin",
                hide: true
            },
            {
                path: "/call-publishdashboard",
                name: "Publicar Convocatoria",
                component: CallPublishDashboard,
                layout: "/admin",
                hide: false
            },
            {
                path: "/call-publish",
                name: "Publicar Convocatoria",
                component: CallAssign,
                hide: true,
                layout: "/admin"
            }
        ]
    },
    {
        collapse: true,
        name: "Archivos",
        state: "fileCollapse",
        icon: File,
        hide: false,
        views:[
            {
                path:"/file-dashboard",
                name:"Administrar",
                component: FileDashboard,
                layout: "/admin",
                hide: false,
            },
            {
                path: "/file-add",
                name: "Cargar Archivo",
                component: FilesAdd,
                layout: "/admin",
                hide: true
            },
            {
                path:"/filepublish-dashboard",
                name:"Publicar Archivo",
                component: FilePublishDashboard,
                layout: "/admin",
                hide: false,
            },
            {
                path: "/file-publish",
                name: "Asignar Archivo",
                component: FilePublish,
                layout: "/admin",
                hide: true
            }
        ]
    },
    {
        collapse: true,
        name: "Noticias",
        state: "articlesCollapse",
        icon: Articles,
        hide: false,
        views:[
            {
                path:"/articles-dashboard",
                name:"Administrar",
                component: ArticlesDashboard,
                hide: false,
                layout: "/admin"
            },
            {
                path:"/articlespublish-dashboard",
                name:"Publicar Noticias",
                component: ArticlesPublishDashboard,
                hide: false,
                layout: "/admin"
            } 
        ]
    },
    {
        collapse: true,
        name: "Cursos",
        state: "courseCollapse",
        icon: Courses,
        hide: false,
        views:[
            {
                path:"/courses-dashboard",
                name:"Administrar",
                component: CoursesDashboard,
                hide: false,
                layout: "/admin"
            },
            {
                path:"/coursesasign-dashboard",
                name:"Asignar Cursos",
                component: CourseAsignDashboard,
                hide: false,
                layout: "/admin"
            },
            {
                path:"/courses-add",
                name:"Crear Cursos",
                component: CourseAdd,
                hide: true,
                layout: "/admin"
            },
            {
                path:"/courses-asign",
                name:"Asignar Cursos",
                component: CourseAsign,
                hide: true,
                layout: "/admin"
            }
        ]
    },
    {
        collapse: true,
        name:"Crud",
        hide: true,
        views:[
            {
                path:"/enterprise-add",
                name:"Agregar Empresa",
                component: EnterpriseAdd,
                layout:"/admin",
                hide: true
            },
            {
                path:"/project-add",
                name:"Agregar Proyecto",
                component: ProjectAdd,
                layout:"/admin",
                hide: true
            },
            {
                path:"/user-assign",
                name:"Asignar Usuarios",
                component: UserAssign,
                layout:"/admin",
                hide: true
            },
            {
                path:"/articles-add",
                name:"Agregar Artículo",
                component: ArticlesAdd,
                layout:"/admin",
                hide: true
            },
            {
                path:"/articles-publish",
                name:"Publicar Noticia",
                component: ArticlesPublish,
                layout:"/admin",
                hide: true
            },
            {
                path:"/login",
                name:"Login",
                component: LoginPage,
                layout:"/auth",
                hide: true
            }
        ]
    }
   
]

export default dashRoutes;