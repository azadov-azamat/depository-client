import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {useDispatch} from "react-redux";
import {DELETE_USER} from "../../../redux/actionTypes/actionTypes";
import {Link} from "react-router-dom";
import {useHistory} from "react-router";
import {confirmAlert} from "react-confirm-alert";

export default function TableUsers({user}) {

    const dispatch = useDispatch()
    const history = useHistory();
    const deleteUser = (id) => {
        dispatch({type: DELETE_USER, payload: id})
    }
    const submit = (id) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить пользователя?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => deleteUser(id)
                },
                {
                    label: 'Нет',
                    // onClick: () => alert('Click No')
                }
            ]
        });
    };

    function editUser() {
        history.push(`/admin/users/${user.id}`)
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
