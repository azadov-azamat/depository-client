import React, {Suspense} from "react";
import App from "./routes/App";
import Loader from "react-loader-spinner";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css';
import "react-datetime/css/react-datetime.css";
import './navbar.css'
import './global.scss'
import "./utils/i18n";
import {ToastContainer} from "react-toastify";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

const app = (
    <>
        <ToastContainer/>
        <BrowserRouter>
            <Suspense fallback={
                <div className="d-flex flex-column justify-content-center align-items-center"
                     style={{width: "100%", height: "100vh"}}>
                    <Loader
                        type="ThreeDots"
                        color="#132E85"
                        height={80}
                        width={80}
                        timeout={3000}
                    />
                </div>}>
                <App/>
            </Suspense>
        </BrowserRouter>
    </>
);
ReactDOM.render(app, document.getElementById('root'))