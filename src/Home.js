import React, {useEffect} from 'react'
import Header from './components/Header'
import SectionOne from './components/SectionOne'
import SectionTwo from './components/SectionTwo'
import SectionThree from './components/SectionThree'
import SectionFour from './components/SectionFour'
import Footer from './components/Footer'


export default function Home({setNav, lang}) {
    useEffect(() => {
        setNav(true);
    }, [])

    return (
        <div>
            <Header lang={lang}/>
            <SectionOne lang={lang}/>
            <SectionTwo lang={lang}/>
            <SectionThree lang={lang}/>
            <SectionFour lang={lang}/>
            <Footer lang={lang}/>
        </div>
    )
}
