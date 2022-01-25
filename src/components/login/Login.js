import React, {useEffect} from 'react';
import 'aos/dist/aos.css';
import "aos/dist/aos";
import AOS from "aos";
import Section from "./Top/Section";
import FooterImg from "./Bottom/FooterImg";
import './global.scss';
import {useSelector} from "react-redux";


export default function Login() {

    const reducers = useSelector(state => state)
    const {loading} = reducers.auth;

    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    }, [])

    const style = {
        cursor: 'wait',
        opacity: '0.2'
    }

    return (
        <div style={loading ? style : {}}>
            <div className="Login">
                <Section/>
                <FooterImg/>
            </div>
        </div>
    );
}
