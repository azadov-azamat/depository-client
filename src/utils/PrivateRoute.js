import React, {useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {Redirect, Route, withRouter} from 'react-router-dom';
import {DEPOSITORY_ROLE, TOKEN} from "./contants";
import {networkAction, userMe} from "../redux/actions/AuthActions";
import {toast} from "react-toastify";


const PrivateRoute = ({dispatch, auth, path, history, setNav, location, component: Component, ...rest}) => {

    // useEffect(()=>{
        dispatch(userMe())
    // },[location.pathname])

    // const reducers = useSelector(state => state)
    // const {networkState} = reducers.auth

    useEffect(() => {
        setNav(false)
        // window.addEventListener('online', () => dispatch(networkAction({success: true})));
        // window.addEventListener('offline', () => dispatch(networkAction({success: false})));
    }, [])

    // if (!networkState) {
    //     toast.error('Интернет не работает!')
    //     history.push('/')
    // }

    const filterRole = (props) => {
        const role = localStorage.getItem(DEPOSITORY_ROLE);
        if (role === 'admin' || role === 'moder') {
            if (path.includes('/admin') || path.includes('/supervisory')) {
                return <Component {...props} />
            } else return <Redirect to={'/badRequest'}/>
        } else if (role === 'user') {
            if (path.includes('/issuerLegal') || path.includes('/supervisory')) {
                return <Component {...props} />
            } else return <Redirect to={'/badRequest'}/>
        }
    }

    return (
        <Route
            path={path}
            {...rest}
            render={(props) =>
                localStorage.getItem(TOKEN) != null ? (
                    filterRole(props)
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    )
}
export default connect(({privateRoute, auth}) => ({privateRoute, auth}))(
    withRouter(PrivateRoute)
);
