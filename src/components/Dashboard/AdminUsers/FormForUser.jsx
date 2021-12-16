import React from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {Input} from "reactstrap";
import {FaCheck, FaTrash} from "react-icons/fa";
import {Select} from "antd";
import {ENTITY, FOREIGNER, INDIVIDUAL} from "../../../utils/contants";

const {Option} = Select;

export default function FormForUser({getName, t}) {

    return (
        <>
            <tr className=''>
                <th scope="row" className=""><RiUserSearchLine className='mt-2'/></th>
                <td><Input className="input input-group-sm" type="text" name="fullName" id="full_name"
                           onChange={e => getName(e.target.value, "fullName")}/></td>
                <td><Input className="input input-group-sm" type="text" name="emailUser" id="email"
                           onChange={e => getName(e.target.value, "email")}/></td>
                <td><Input className="input input-group-sm" type="text" name="phoneNumberUser" id="phoneNumber"
                           onChange={e => getName(e.target.value, "phoneNumber")}/></td>
                <td>
                    <div className="form-group">
                        <Select
                            className="setting_input w-100"
                            allowClear={true}
                            optionFilterProp="children"
                            onChange={(value) => getName(value, "groupEnum")}
                            // onSearch={onSearchCompany}
                        >
                            <Option value={INDIVIDUAL}>{t("user.jismoniy")}</Option>
                            <Option value={ENTITY}>{t("user.yuridik")}</Option>
                            <Option value={FOREIGNER}>{t("user.chetel")}</Option>
                        </Select>
                    </div>
                    {/*    <Input className="input input-group-sm" type="select" name="groupEnum" id="group"*/}
                    {/*           onChange={e => getName(e.target.value, "groupEnum")}>*/}
                    {/*    <option onChange={() => getUserList(1, 6)} value="ALL">{t("user.all")}</option>*/}
                    {/*    <option value="INDIVIDUAL">{t("user.jismoniy")}</option>*/}
                    {/*    <option value="ENTITY">{t("user.yuridik")}</option>*/}
                    {/*    <option value="FOREIGNER">{t("user.chetel")}</option>*/}
                    {/*</Input>*/}
                </td>
                <td><Input className="input input-group-sm" type="text" name="pinflUser" id="pinfl"
                           onChange={e => getName(e.target.value, "pinfl")}/></td>
                <td><FaCheck className="mt-2" style={{color: '#132E85'}}/></td>
                <td><FaTrash className='mt-2 m-lg-2' style={{color: '#132E85'}}/></td>
            </tr>
        </>
    )
}
