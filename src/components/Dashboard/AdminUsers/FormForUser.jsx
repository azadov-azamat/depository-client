import React from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {Input} from "reactstrap";
import {getUserList} from "../../../redux/actions/userAction";
import {FaCheck, FaTrash} from "react-icons/fa";

export default function FormForUser({getName, t}) {

    const Name = (name, index) => {
        getName(name, index)
    }

    return (
        <>
            <tr className=''>
                <th scope="row" className=""><RiUserSearchLine className='mt-2'/></th>
                <td><Input className="input input-group-sm" type="text" name="name" id="full_name"
                           onChange={e => Name(e.target.value, 0)}/></td>
                <td><Input className="input input-group-sm" type="text" name="name" id="email"
                           onChange={e => Name(e.target.value, 1)}/></td>
                <td><Input className="input input-group-sm" type="text" name="name" id="phoneNumber"
                           onChange={e => Name(e.target.value, 2)}/></td>
                <td><Input className="input input-group-sm" type="select" name="name" id="group"
                           onChange={e => Name(e.target.value, 3)}>
                    <option onChange={() => getUserList(1, 6)} value="ALL">{t("user.all")}</option>
                    <option value="INDIVIDUAL">{t("user.jismoniy")}</option>
                    <option value="ENTITY">{t("user.yuridik")}</option>
                    <option value="FOREIGNER">{t("user.chetel")}</option>
                    {/*<option value="ADMIN">{t("user.admin")}</option>*/}
                </Input>
                </td>
                <td><Input className="input input-group-sm" type="text" name="name" id="pinfl"
                           onChange={e => Name(e.target.value, 4)}/></td>
                <td><FaCheck className="mt-2" style={{color: '#132E85'}}/></td>
                <td><FaTrash className='mt-2 m-lg-2' style={{color: '#132E85'}}/></td>
            </tr>
        </>
    )
}
