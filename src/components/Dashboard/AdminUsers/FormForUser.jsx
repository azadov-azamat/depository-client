import React from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {Input} from "reactstrap";
import {FaCheck, FaTrash} from "react-icons/fa";
import {Select} from "antd";
import {ENTITY, FOREIGNER, INDIVIDUAL} from "../../../utils/contants";

const {Option} = Select;

export default function FormForUser({getName, t}) {

    return (
            <tr>
                <th scope="row" className=""><RiUserSearchLine className='mt-2'/></th>
                <td><Input className="input input-group-sm" type="text" name="fullName" id="full_name"
                           autocomplete="off"
                           onChange={e => getName(e.target.value, "fullName")}/></td>
                <td><Input className="input input-group-sm" type="text" name="emailUser" id="email" autocomplete="off"
                           onChange={e => getName(e.target.value, "email")}/></td>
                <td><Input className="input input-group-sm" type="text" name="phoneNumberUser" id="phoneNumber"
                           autocomplete="off"
                           onChange={e => getName(e.target.value, "phoneNumber")}/></td>
                <td>
                    <div className="form-group">
                        <Select
                            className="setting_input w-100"
                            allowClear={true}
                            optionFilterProp="children"
                            onChange={(value) => getName(value, "groupEnum")}
                        >
                            <Option value={INDIVIDUAL}>{t("user.jismoniy")}</Option>
                            <Option value={ENTITY}>{t("user.yuridik")}</Option>
                            <Option value={FOREIGNER}>{t("user.chetel")}</Option>
                        </Select>
                    </div>
                </td>
                <td><Input className="input input-group-sm" type="text" name="pinflUser" id="pinfl" autocomplete="off"
                           onChange={e => getName(e.target.value, "pinfl")}/></td>
                <td><FaCheck className="mt-2" style={{color: '#132E85'}}/></td>
                <td><FaTrash className='mt-2 m-lg-2' style={{color: '#132E85'}}/></td>
            </tr>
    )
}
