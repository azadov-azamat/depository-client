import React, {useEffect, useState} from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {FaCheck, FaTrash} from "react-icons/fa";
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import Datetime from "react-datetime";
import axios from "axios";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import "react-datetime/css/react-datetime.css";
import {Select} from "antd";
import '../../createMeeting/AzamatGlobal.scss'
import {useDispatch, useSelector} from "react-redux";
import * as adminCompanyAction from "../../../redux/actions/CompanyAction";

const {Option} = Select;

export default function FormForMeeting({getName, lang}) {

    const dispatch = useDispatch();
    const reducers = useSelector(state => state);

    const {searchNameCompany} = reducers.meeting

    const [country, setCountry] = useState([]);
    const language = localStorage.getItem('i18nextLng');

    useEffect(() => {
        axios.get(BASE_URL + api.getCountry)
            .then(res => {
                setCountry(res.data)
            })
    }, []);

    function onSearch(val) {
        console.log(val)
    }

    function onSearchCompany(val) {
        if (val.length >= 3)
            dispatch(adminCompanyAction.getCompanySearchNameAction({name: val}))
    }

    return (
        <>
            <tr>
                <th scope="row" className="text-center">
                    <RiUserSearchLine className='mt-2' style={{width: '15px', color: '#132E85'}}/>
                </th>
                <td style={{width: '170px'}}>
                    <div className="form-group">
                        <Select
                            className="setting_input w-100"
                            showSearch
                            allowClear={true}
                            optionFilterProp="children"
                            onChange={(value) => getName(value, "companyId")}
                            onSearch={onSearchCompany}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {searchNameCompany?.map(value =>
                                <Option value={value.id} key={value.companyId}>{value.name}</Option>
                            )}
                        </Select>
                    </div>
                </td>
                <td style={{width: '140px'}}>
                    <div className="form-group">
                        <Select
                            className="setting_input w-100"
                            allowClear={true}
                            optionFilterProp="children"
                            onChange={(value) => getName(value, "status")}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value={PENDING}>{lang("meetingCreated.meetingStatus.pending")}</Option>
                            <Option value={ACTIVE}>{lang("meetingCreated.meetingStatus.active")}</Option>
                            <Option value={FINISH}>{lang("meetingCreated.meetingStatus.finish")}</Option>
                            <Option value={CANCELED}>{lang("meetingCreated.meetingStatus.canceled")}</Option>
                            <Option value={DISABLED}>{lang("meetingCreated.meetingStatus.disabled")}</Option>
                        </Select>
                    </div>
                </td>
                <td style={{width: '135px'}}>
                    <Datetime
                        onChange={(e) => getName(e["_d"], "startRegistration")}
                    />
                </td>
                <td style={{width: '123px'}}>
                    <Datetime onChange={(e) => getName(e["_d"], "startDate")}/>
                </td>
                <td style={{width: '135px'}}>
                    <div className="form-group">
                        <Select
                            className="setting_input w-100"
                            showSearch
                            allowClear={true}
                            optionFilterProp="children"
                            onChange={(value) => getName(value, "cityId")}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {country?.map(value =>
                                <Option value={value.id} key={value.id}>
                                    {
                                        language === 'uz' ? value.nameUz : ""
                                        || language === 'en' ? value.nameEn : ""
                                        || language === "ru" ? value.nameRu : ""
                                    }
                                </Option>
                            )}
                        </Select>
                    </div>
                </td>
                <td className="text-center"><FaCheck className="mt-2" style={{width: '15px', color: '#132E85'}}/></td>
                <td className="text-center"><FaTrash className="mt-2" style={{width: '15px', color: '#132E85'}}/></td>
            </tr>
        </>
    )
}
