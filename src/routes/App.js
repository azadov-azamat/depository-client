import React, {useState} from 'react';
import {Route, Switch} from "react-router-dom"
import Home from "../Home";
import Login from "../components/login/Login";
import FooterImg from "../components/Bottom/FooterImg";
import Dashboard from "../components/Dashboard/Dashboard";
import AddOrEditCompany from '../components/Dashboard/AdminCompany/AddOrEditCompany';
import AdminUsers from '../components/Dashboard/AdminUsers/AdminUsers';
import CompaniesPage from "../components/userPages/CompaniesPage";
import AdminCompany from '../components/Dashboard/AdminCompany/AdminCompany';
import AdminMeetings from '../components/Dashboard/AdminMeeting/AdminMeetings';
import NavbarIn from '../components/NavbarIn';
import NavbarOut from "../components/NavbarOut";
import {useTranslation} from "react-i18next";
import NotFound from "../components/NotFound";
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'antd/dist/antd.css';
import {Provider} from "react-redux";
import store from "../redux";
import PublicRoute from "../utils/PublicRoute";
import PrivateRoute from "../utils/PrivateRoute";
import ControllerMeeting from "../components/MeetingStarted/ControllerMeeting";
import Example from "./Example";
import AddOrEditMeeting from "../components/createMeeting/AddOrEditMeeting";
import MyProfile from "../components/ProfileSettings/MyProfile";
import AddOrEditUser from "../components/Dashboard/AdminUsers/AddOrEditUser";
import {MeetingLists} from "../components/userPages/MeetingLists";
import eimzo from "../eImzo/eimzoo";
import UserMaterialUI from "../components/Dashboard/AdminUsers/UserMaterialUI";
import userCreate from '../components/Dashboard/AdminUsers/AddOrEdit/index'
import StatisticAgenda from "../components/createMeeting/components/StatisticAgenda";

const App = () => {
    const [infoV, setInfoV] = useState(true)
    const {t} = useTranslation();

    return (
        <Provider store={store}>
            {infoV === true ? <NavbarOut setNav={setInfoV}/> : <NavbarIn setNav={setInfoV}/>}
            <Switch>

                <PublicRoute exact path="/"><Home setNav={setInfoV} lang={t}/></PublicRoute>

                <PublicRoute path="/site/login" component={Login}/>

                <PublicRoute exact path="/site/info" component={FooterImg}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin"><Dashboard lang={t}/></PrivateRoute>

                <PrivateRoute setNav={setInfoV} path="/supervisory/profile" component={MyProfile}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin/users" component={AdminUsers}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin/users/create" component={AddOrEditUser}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin/users/:id" component={AddOrEditUser}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin/company" component={AdminCompany}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin/company/create" component={AddOrEditCompany}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin/company/update/:id" component={AddOrEditCompany}/>

                <PrivateRoute setNav={setInfoV} exact path="/issuerLegal/companies" component={CompaniesPage}/>

                <PrivateRoute setNav={setInfoV} exact path="/admin/meetings" component={AdminMeetings}/>

                <PrivateRoute setNav={setInfoV} path="/issuerLegal/meetings" component={MeetingLists}/>

                <PrivateRoute setNav={setInfoV} path="/supervisory/addOrEditMeeting" component={AddOrEditMeeting}/>

                <PrivateRoute setNav={setInfoV} path='/issuerLegal/meeting/:id'
                              component={ControllerMeeting}/>

                <PrivateRoute setNav={setInfoV} path={"/supervisory/statistic_agenda"} component={StatisticAgenda}/>

                <Route path="/eimzo" exact component={eimzo}/>

                <Route path="/test" component={Example}/>

                <Route component={NotFound}/>

            </Switch>
        </Provider>
    );
}

export default App;
