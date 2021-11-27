import React, {useState} from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {Input} from "reactstrap";
import {FaCheck, FaTrash} from "react-icons/fa";

export default function FormForCompany({getName}) {

    const Name = (name, index) => {
        getName(name, index)
    }

    return (
        <>
            <tr>
                <th scope="row" className="text-center"><RiUserSearchLine className='mt-2' style={{color: '#132E85'}}/></th>
                <td><Input className="input input-group-sm" type="text" name="name"
                           onChange={e => Name(e.target.value, 0)}/></td>
                <td><Input className="input input-group-sm" type="text" name="email"
                           onChange={e => Name(e.target.value, 1)}/></td>
                <td><Input className="input input-group-sm" type="text" name="phoneNumber"
                           onChange={e => Name(e.target.value, 2)}/></td>
                <td><Input className="input input-group-sm" type="text" name="webPage"
                           onChange={e => Name(e.target.value, 3)}/></td>
                <td><Input className="input input-group-sm" type="text" name="inn"
                           onChange={e => Name(e.target.value, 4)}/></td>
                <td className="text-center"><FaCheck className="mt-2" style={{color: '#132E85'}}/></td>
                <td className="text-center"><FaTrash className="mt-2" style={{color: '#132E85'}}/></td>
            </tr>
        </>
    )
}
