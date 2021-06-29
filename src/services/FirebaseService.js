import firebase from '../util/firebase.js';
import 'firebase/firebase';
import 'firebase/storage';

//Collections
const dbUsers = firebase.firestore().collection("/users");
const dbEnterprise = firebase.firestore().collection("/enterprise");
const dbCalls = firebase.firestore().collection("/calls");
const dbFiles = firebase.firestore().collection("/files");
const dbArticles =  firebase.firestore().collection("/articles");
const dbProjects =  firebase.firestore().collection("/projects");
const dbWorkers = firebase.firestore().collection("/workers");
const dbFileEnterprise = firebase.firestore().collection("/fileenterprise");
const dbNewsPublish = firebase.firestore().collection("/newspublish");
const dbCallsUser = firebase.firestore().collection("/callsuser");
const dbCourse = firebase.firestore().collection("/courses");
const dbCourseWorker = firebase.firestore().collection("/courseworkers");

//Test
const dbTest = firebase.firestore().collection("/test");

/**
 * Queries login
 * @returns 
 */
//create auth
const createAuth = (username, pass) =>{
    return firebase.auth().createUserWithEmailAndPassword(username, pass);
};
//sign in 
const signIn = (email, pass) =>{
    return firebase.auth().signInWithEmailAndPassword(email, pass);
}
//sign out
const signOut = () => {
    return firebase.auth().signOut();
}


/**
 * Queries User
 */
// get All User
const getAllUser = () => {
    return dbUsers;
};
// create User
const createUser = (id,data) => {
    return dbUsers.doc(id).set(data);
};

const updateUser = (id, value) => {
    return dbUsers.doc(id).update(value);
};

const removeUser = (id) => {
    return dbUsers.doc(id).delete();
};

/**
 * Queries Enterprise
 */
// create Enterprise
const createEnterprise = (data) => {
    return dbEnterprise.add(data);
};
// remove enterprise
const removeEnterprise = (id) => {
    return dbEnterprise.doc(id).delete();
};
// update enterprise
const updateEnterprise = (id, value) => {
    return dbEnterprise.doc(id).update(value);
};
//get all enterprise
const getAllEnterprise  = () => {
    return dbEnterprise;
};
//get ONE enterprise
const getOneEnterprise = (id) =>{
    return dbEnterprise.doc(id).get();
}

/**
 * Queries Call
 */
// get all calls
const getAllCalls = () => {
    return dbCalls;
};
// create Calls
const createCall = (data) => {
    return dbCalls.add(data);
};
// remove call
const removeCall = (id) => {
    return dbCalls.doc(id).delete();
};
//get One Call 
const getOneCallUser = (id) =>{
    return dbCalls.doc(id).get();
};

/**
 * Queries File
 */
// queries File
const createFile = (data) => {
    return firebase.storage().ref(`files/${data.name}`).put(data);
};
// delete file
const deleteFile = (data) => {
    return firebase.storage().ref(`files/${data}`).delete();
};
//get Download URL
const getDownloadURL = (data) =>{
    return firebase.storage().ref(`files/${data}`).getDownloadURL();
}

/**
 * Queries from Files user
 */
//add file profile User
const createProfileUser = (user) => {
    return firebase.storage().ref().child(`users/${user}/profile`);
}

const createDocUser = (user) => {
    return firebase.storage().ref().child(`users/${user}/doc`);
} 

// add file data
const addFile = (data) => {
    return dbFiles.add(data);
}
//delete file data
const removeFile = (id) => {
    return dbFiles.doc(id).delete();
};
//update file data
const updateFile = (id, data) =>{
    return dbFiles.doc(id).update(data);
};
//Get All Files
const getAllFiles = () =>{
    return dbFiles;
};
//get one File
const getOneFile = (id) =>{
    return dbFiles.doc(id).get();
};

/**
 * Queries Articles
 */
//create article or news
const createNews = (data) => {
    return dbArticles.add(data);
};
//remove article or news
const removeNews = (id) => {
    return dbArticles.doc(id).delete();
};
//get all
const getAllNews = () => {
    return dbArticles;
};
//get one
const getOneNews = (id) =>{
    return dbArticles.doc(id).get();
}

/**
 * Queries Projects
 */
//Create project
const createProject = (data) =>{
    return dbProjects.add(data);
};
//remove project
const removeProject = (id) =>{
    return dbProjects.doc(id).delete();
};
//getAll Project
const getAllProject = () => {
    return dbProjects;
};
//getAll Project where enterprise is
const getAllProjectWEnterprise = (data) =>{
    return dbProjects.where("enterprise", "==", data);
}
//getAll Project where enterprise is
const getAllProjectWEnterpriseID = (data) =>{
    return dbProjects.where("idDocEnterprise", "==", data);
}
//get One Project
const getOneProject = (id) =>{
    return dbProjects.doc(id).get();
};
   
/**
 * Queries Workers
 */
//create worker
const createWorker = (data) =>{
    return dbWorkers.add(data);
}
//remove Worker
const removeWorker = (id) =>{
    return dbWorkers.doc(id).delete();
};
//update Worker
const updateWorker = (id, data) =>{
    return dbWorkers.doc(id).update(data);
};
//get all Workers
const getAllWorkers = () =>{
    return dbWorkers;
};
//get all Workers with Enterprise
const getAllWorkersWEnterprise = (data) =>{
    return dbWorkers.where("enterprise", "==", data);
};
//get all Workers with Enterprise
const getAllWorkersWEnterpriseID = (id) =>{
    return dbWorkers.where("idDocEnterprise", "==", id);
};
//get all workers with rut
const getAllWorkersWRut = (data) =>{
    return dbWorkers.where("rut", '==', data );
};
//get one worker
const getOneWoker = (data) =>{
    return dbWorkers.where("idDocUser", '==', data);
};
//get woerkerwProject
const getWorkerWProject = (data) =>{
    return dbWorkers.where("idDocProject", "==", data);
};


/**
 * Queries Files - Workers
 */
//create relation
const createFileEnterprise = (data) =>{
    return dbFileEnterprise.add(data);
}
//delete relation
const removeFileEnterprise = (id) =>{
    return dbFileEnterprise.doc(id).delete();
}
//get all realtion
const getallFileEnterprise = () =>{
    return dbFileEnterprise;
}
//get all relation when enterprise
const getallFileWorkerWEnterprise = (data) =>{
    return dbFileEnterprise.where("enterprise","==",data);
}
//get all relation when enterprise
const getallFileWorkerWEnterpriseID = (id) =>{
    return dbFileEnterprise.where("idDocEnterprise","==",id);
}
//get All relation when project
const getallFileWorkerWProject = (data) =>{
    return dbFileEnterprise.where("project", "==", data);
}
//get file w id
const getFileWID = (id) =>{
    return dbFileEnterprise.where("idfile", "==", id);
}
//get file w project
const getFileWP = (id) =>{
    return dbFileEnterprise.where("idDocProject", "==", id);
}

/**
 * Queries news publish
 */
//create news publish
const createNewsPublish = (data) =>{
    return dbNewsPublish.add(data);
};
//remove new publish
const removeNewsPublish = (id) =>{
    return dbNewsPublish.doc(id).delete();
};
//getAll new Publish
const getAllNewsPublish = () =>{
    return dbNewsPublish;
};
//get one with enterprise
const getOneNewsEnterprise = (id) =>{
    return dbNewsPublish.where("idDocEnterprise", "==", id);
}

/**
 * Queries calls users
 */
//create calls user
const createCallsUser = (data) =>{
    return dbCallsUser.add(data);
};
//remove calls user
const removeCallsUser = (id) =>{
    return dbCallsUser.doc(id).delete();
};
// getAll Calls User
const getAllCallsUser = () =>{
    return dbCallsUser;
};
//get all with enterprise
const getAllCallEnterprise = (id) =>{
    return dbCallsUser.where("idDocEnterprise", "==", id);
}

/**
 * Queries Course
 */
//create course
const createCourse = (data) =>{
    return dbCourse.add(data);
};
//remove course
const removeCourse = (id) =>{
    return dbCourse.doc(id).delete();
};
//getAll Course
const getAllCourse = () =>{
    return dbCourse;
};

/**
 * Queries Courses Workers
 */
//create relation beetwen Course Worker
const createCourseWorker = (data) =>{
    return dbCourseWorker.add(data);
}
//remove relation beetwen Coruse Worker
const removeCourseWorker = (id) =>{
    return dbCourseWorker.doc(id).delete();
}
//getAll relation CourseWorker
const getAllCourseWork = () =>{
    return dbCourseWorker;
}
//get One course  w enterprise
const getCourseEnterprise = (id) =>{
    return dbCourseWorker.where("idDocEnterprise", '==', id);
}
//get course w project
const getCourseProject = (id) =>{
    return dbCourseWorker.where("idDocProject", "==", id);
}
//get course by id
const getCourseWbyID = (id) => {
    return dbCourseWorker.where("idDocCourse", "==", id);
}

const FService = {
    //crud system
    getAllUser,
    createUser,
    updateUser,
    removeUser,
    getAllEnterprise,
    getOneEnterprise,
    createEnterprise,
    removeEnterprise,
    updateEnterprise,
    createCall,
    getAllCalls,
    createNews,
    removeNews,
    getAllNews,
    getOneNews,
    getOneNewsEnterprise,
    createProject,
    removeProject,
    getAllProject,
    getOneProject,
    getAllProjectWEnterprise,
    getAllProjectWEnterpriseID,
    createWorker,
    removeWorker,
    updateWorker,
    getAllWorkers,
    getAllWorkersWEnterprise,
    getAllWorkersWEnterpriseID,
    getAllWorkersWRut,
    getOneWoker,
    getWorkerWProject,
    createFileEnterprise,
    removeFileEnterprise,
    getallFileEnterprise,
    getallFileWorkerWEnterprise,
    getallFileWorkerWEnterpriseID,
    getallFileWorkerWProject,
    getFileWID,
    getFileWP,
    createNewsPublish,
    removeNewsPublish,
    getAllNewsPublish,
    createCallsUser,
    removeCallsUser,
    getAllCallsUser,
    getAllCallEnterprise,
    getOneCallUser,
    createCourse,
    removeCourse,
    getAllCourse,
    createCourseWorker,
    removeCourseWorker,
    getAllCourseWork,
    getCourseEnterprise,
    getCourseProject,
    getCourseWbyID,

    //file system
    createFile,
    deleteFile,
    updateFile,
    getAllFiles,
    getOneFile,
    addFile,
    removeFile,
    getDownloadURL,
    createProfileUser,
    createDocUser,

    //Auth
    createAuth,
    signIn,
    signOut,
};

export default FService;