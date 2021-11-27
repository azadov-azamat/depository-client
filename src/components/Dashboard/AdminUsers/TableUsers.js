import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {Link} from "react-router-dom";

export default function TableUsers({user}) {

    console.log(user)
    const editUser = () => {

    }

    const submit = () => {

    }
    return (
        <>
            <tr className=''>
                <th scope="row" className=' text-center'>
                    <Link to={`/admin/users/${user.id}`} className='text-warning'><FaPen/>

                    </Link>
                </th>
                <td onClick={editUser} className='text-center'>{user.fullName}</td>
                <td onClick={editUser} className='text-center'>{user.email}</td>
                <td onClick={editUser} className='text-center'>{user.phoneNumber}</td>
                <td onClick={editUser} className='text-center'>{user.groupEnum}</td>
                <td onClick={editUser} className='text-center'>{user.pinfl}</td>
                <td onClick={editUser} className='text-center'>
                    {user.activated ? <span className="text-success">
                                <FaCheck/></span> :
                        <span className="text-danger"><FaTimes/></span>}
                </td>
                <td className='text-center'>
                    <button className="btn text-danger d-flex"
                            onClick={() => submit(user.id)}><FaTrash/></button>
                </td>
            </tr>
        </>
    )
}
