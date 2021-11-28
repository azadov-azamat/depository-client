import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {Link} from "react-router-dom";
import {ENTITY, FOREIGNER, INDIVIDUAL} from "../../../utils/contants";

export default function TableUsers({user, t, updateUser, deleteById}) {

    const editUser = () => {

    }

    const submit = () => {

    }

    function status(status) {
        if (status === INDIVIDUAL) {
            return t("user.jismoniy")
        } else if (status === ENTITY) {
            return t("user.yuridik")
        } else if (status === FOREIGNER) {
            return t("user.chetel")
        }
    }

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '13em',
        height: '20px'
    }

    return (
        <>
            <tr className=''>
                <th scope="row" className=' text-center'>
                    <Link to={`/admin/users/${user.id}`} onClick={() => updateUser(user.id)}
                          className='text-warning'><FaPen/></Link>
                </th>
                <td onClick={editUser} className='text-center'>
                    <p style={style}>
                        {user.fullName}
                    </p></td>
                <td onClick={editUser} className='text-center'>
                    <p style={style}>
                        {user.email}
                    </p></td>
                <td onClick={editUser} className='text-center'>
                    <p style={style}>
                        {user.phoneNumber}
                    </p></td>
                <td onClick={editUser} className='text-center'>
                    <p style={style}>
                        {status(user.groupEnum)}
                    </p></td>
                <td onClick={editUser} className='text-center'>
                    <p style={style}>
                        {user.pinfl}
                    </p></td>
                <td onClick={editUser} className='text-center'>
                    {user.activated ? <span className="text-success">
                                <FaCheck/></span> :
                        <span className="text-danger"><FaTimes/></span>}
                </td>
                <td className='text-center'>
                    <button className="btn text-danger d-flex"
                            onClick={() => deleteById(user.id)}><FaTrash/></button>
                </td>
            </tr>
        </>
    )
}
