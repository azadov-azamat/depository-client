import React, {Component, useEffect} from 'react';
import 'aos/dist/aos.css';
import "aos/dist/aos";
import AOS from "aos";
import Section from "./Top/Section";
import FooterImg from "./Bottom/FooterImg";
import './global.scss';
import {useTranslation} from "react-i18next";


export default function Login() {

    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    }, [])

    const {t} = useTranslation();

    return (
        <div>
            <div className="Login ">
                <Section />
                <FooterImg/>
            </div>
        </div>
    );
}
