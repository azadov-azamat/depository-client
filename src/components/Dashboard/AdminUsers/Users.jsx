import React from 'react'
import {USER_PER_PAGE} from "../../../utils/contants";
import TableUsers from "./TableUsers";

function Users({users, page}) {

    const startIndex = ( page - 1 ) * 7;
    const selectedUsers = users.slice(startIndex, startIndex + 7);
    return selectedUsers.map(user => (
        <TableUsers user={user} />
    ))
}

export default Users
