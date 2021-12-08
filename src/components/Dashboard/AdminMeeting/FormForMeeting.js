import React, {useEffect, useState} from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {Input} from "reactstrap";
import {FaCheck, FaTrash} from "react-icons/fa";
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import Datetime from "react-datetime";
import axios from "axios";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import "react-datetime/css/react-datetime.css";

export default function FormForMeeting({getName, lang}) {

    const [country, setCountry] = useState([]);
    const language = localStorage.getItem('i18nextLng');

    useEffect(() => {
        axios.get(BASE_URL + api.getCountry)
            .then(res => {
                setCountry(res.data)
            })
            .catch(err => {
            })
    }, []);

    const Name = (name, index) => {
        getName(name, index)
       // if (index === 2){
       //     let date = new Date(name);
       //     console.log(date)
       // }
    };

    return (
        <>
            <tr>
                <th scope="row" className="text-center"><RiUserSearchLine className='mt-2'
                                                                          style={{width: '15px', color: '#132E85'}}/>
                </th>
                <td style={{width: '170px'}}>
                    <Input className="input input-group-sm" type="text" name="company"
                           onChange={e => Name(e.target.value, 0)}/>
                </td>
                <td style={{width: '140px'}}>
                    <Input className="input text-center input-group-sm" type="select" name="status" id="name"
                           onChange={e => Name(e.target.value, 1)}
                    >
                        <option value={'ALL'}>{
                            language === 'uz' ? "Hammasi" : ""
                            || language === 'en' ? "All" : ""
                            || language === "ru" ? "Всё" : ""
                        }</option>
                        <option value={PENDING}>{lang("meetingCreated.meetingStatus.pending")}</option>
                        <option value={ACTIVE}>{lang("meetingCreated.meetingStatus.active")}</option>
                        <option value={FINISH}>{lang("meetingCreated.meetingStatus.finish")}</option>
                        <option value={CANCELED}>{lang("meetingCreated.meetingStatus.canceled")}</option>
                        <option value={DISABLED}>{lang("meetingCreated.meetingStatus.disabled")}</option>
                    </Input>
                </td>
                <td style={{width: '135px'}}>
                    <Datetime onChange={(e) => Name(e["_d"], 2)}/>
                </td>
                <td style={{width: '123px'}}>
                    <Datetime onChange={(e) => Name(e["_d"], 3)}/>
                </td>
                <td style={{width: '135px'}}>
                    <Input className="input text-center input-group-sm" type="select" name="status" id="name"
                           onChange={(e) => Name(e.target.value, 4)}
                    >
                        <option value={'ALL'}>{
                            language === 'uz' ? "Hammasi" : ""
                            || language === 'en' ? "All" : ""
                            || language === "ru" ? "Всё" : ""
                        }</option>
                        {country && country.map(value =>
                            <option value={value.id}>{
                                language === 'uz' ? value.nameUz : ""
                                || language === 'en' ? value.nameEn : ""
                                || language === "ru" ? value.nameRu : ""
                            }</option>
                        )}
                    </Input>
                </td>
                <td className="text-center"><FaCheck className="mt-2" style={{width: '15px', color: '#132E85'}}/></td>
                <td className="text-center"><FaTrash className="mt-2" style={{width: '15px', color: '#132E85'}}/></td>
            </tr>
        </>
    )
}
