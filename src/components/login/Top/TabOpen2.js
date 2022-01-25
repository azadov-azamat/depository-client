import React from 'react';
import {useHistory} from 'react-router-dom';
import TabModal2 from "./TabModal2";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {useDispatch, useSelector} from 'react-redux';
import * as authActions from '../../../redux/actions/AuthActions'
import Loader from "react-loader-spinner";

export default function TabOpen2({lang}) {

    const history = useHistory();
    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
    const {loading, historyPushLogin} = reducers.auth;

    function login(e, v) {
        dispatch(authActions.login({data: v, history, historyPushLogin}))
    }

    const style = {
        backgroundColor: "#f6f6f6",
        marginTop: "35px"
    }

    return (
        <div className="TabOpen2">
            <AvForm onValidSubmit={login} style={{marginTop: "9em"}}>
                <h1>{lang("electronVoice")}</h1>
                <p>{lang("text.tabOpen2")}<br/>
                    <TabModal2 lang={lang}/>
                </p>
                <AvField
                    style={style}
                    className="border-0 text-center input_form_auth" type="text" name="username"
                    placeholder={lang("placeholderLogin")}
                    validate={{
                        required: {value: true, errorMessage: lang("errorLogin")}
                    }}
                    required/>
                <AvField
                    className="border-0 text-center input_form_auth" type="password"
                    name="password"
                    style={style}
                    placeholder={lang("placeholderPassword")}
                    validate={{
                        required: {value: true, errorMessage: lang("errorPassword")}
                    }}
                    required
                />
                {
                    loading ?
                        <div className="butdes2" style={{marginTop: "35px", borderRadius: '10px'}}>
                            <Loader
                                type="ThreeDots"
                                color="white"
                                height={25}
                                width={25}
                            />
                        </div>
                        :
                        <button type='submit' style={{marginTop: "35px", borderRadius: '10px'}} className="butdes2">
                            {lang('signIn')}
                        </button>
                }
            </AvForm>
        </div>
    );
}
