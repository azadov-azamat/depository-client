import React from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {Input} from "reactstrap";
import {FaCheck, FaTrash} from "react-icons/fa";

export default function FormForCompany({getName}) {

    return (
        <tr>
            <th scope="row" className="text-center"><RiUserSearchLine className='mt-2' style={{color: '#132E85'}}/>
            </th>
            <td><Input className="input input-group-sm" type="text" name="companyName" autocomplete="off"
                       onChange={e => getName(e.target.value, "name")}/></td>
            <td><Input className="input input-group-sm" type="text" name="companyEmail" autocomplete="off"
                       onChange={e => getName(e.target.value, "email")}/></td>
            <td><Input className="input input-group-sm" type="text" name="phoneNumber" autocomplete="off"
                       onChange={e => getName(e.target.value, e.target.name)}/></td>
            <td><Input className="input input-group-sm" type="text" name="webPage" autocomplete="off"
                       onChange={e => getName(e.target.value, e.target.name)}/></td>
            <td><Input className="input input-group-sm" type="text" name="inn" autocomplete="off"
                       onChange={e => getName(e.target.value, e.target.name)}/></td>
            <td className="text-center"><FaCheck className="mt-2" style={{color: '#132E85'}}/></td>
            <td className="text-center"><FaTrash className="mt-2" style={{color: '#132E85'}}/></td>
        </tr>
    )
}
