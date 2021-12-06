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

export default function FormForMeeting({getName}) {

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
    };

    function getStatus() {
        if (language === "uz"){
            return(
                <Input className="input text-center input-group-sm" type="select" name="status" id="name">
                    <option value={'ALL'}>Hammasi</option>
                    <option value={PENDING}>Ishga tushirish kutilmoqda</option>
                    <option value={ACTIVE}>Jadval bo'yicha faol</option>
                    <option value={FINISH}>Tugallangan (arxivlangan)</option>
                    <option value={CANCELED}>Bekor qilingan (arxivlangan)</option>
                    <option value={DISABLED}>Faol emas</option>
                </Input>
            )
        }else if (language === "ru"){
            return (
                <Input className="input text-center input-group-sm" type="select" name="status" id="name">
                    <option value={'ALL'}>Всё</option>
                    <option value={PENDING}>Ожидает запуска</option>
                    <option value={ACTIVE}>Активно по расписанию</option>
                    <option value={FINISH}>Завершено (в архиве)</option>
                    <option value={CANCELED}>Отменено (в архиве)</option>
                    <option value={DISABLED}>Неактивно</option>
                </Input>
            )
        }else if (language === "en"){
            return (
                <Input className="input text-center input-group-sm" type="select" name="status" id="name">
                    <option value={'ALL'}>All</option>
                    <option value={PENDING}>Awaiting launch</option>
                    <option value={ACTIVE}>Active on schedule</option>
                    <option value={FINISH}>Completed (archived)</option>
                    <option value={CANCELED}>Canceled (archived)</option>
                    <option value={DISABLED}>Not active</option>
                </Input>
            )
        }
    }

    return (
        <>
            <tr>
                <th scope="row" className="text-center"><RiUserSearchLine className='mt-2'
                                                                          style={{width: '15px', color: '#132E85'}}/>
                </th>
                <td style={{width: '170px'}}><Input className="input input-group-sm" type="text" name="company"
                                                    onChange={e => Name(e.target.value, 0)}/></td>
                <td style={{width: '140px'}}>
                    {getStatus()}
                </td>
                <td style={{width: '135px'}}>
                    <Datetime/>
                </td>
                <td style={{width: '123px'}}>
                    <Datetime/>
                </td>
                <td style={{width: '135px'}}>
                    <Input className="input text-center input-group-sm" type="select" name="status" id="name">
                        <option value={'ALL'}>{
                            language === 'uz' ? "Hammasi" : ""
                            || language === 'en' ? "All" : ""
                            || language === "ru" ? "Всё" : ""
                        }</option>
                        {country && country.map((value, index) =>
                            <option key={index} value={value.id}>{
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
