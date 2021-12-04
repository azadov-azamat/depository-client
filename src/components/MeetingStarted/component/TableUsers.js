import React from "react";
import {Table} from "reactstrap";
import {AiOutlineSetting, BiCheckDouble} from "react-icons/all";
import {CHAIRMAN, SECRETARY, SIMPLE, SPEAKER, WATCHER} from "../../../utils/contants";

export default function TableUsers({members}) {

    return (
        <div className="d-flex justify-content-center" style={{overflowY: 'scroll', height: '57vh'}}>
            <div className="w-100">
                <Table className="usersList" hover>
                    <thead className="navUsers">
                    <tr>
                        <th scope="col" style={{width: '0'}}>#</th>
                        <th scope="col" className='w-25'>Ф.И.О.</th>
                        <th scope="col" className='w-25'>Телефон</th>
                        <th scope="col" className='w-25'>Онлайн</th>
                        <th scope="col" className='w-25'>Роль</th>
                        <th scope="col" style={{width: '0'}}>
                            <BiCheckDouble fontSize={25} color={"green"}/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {members.length !== 0
                        ? members.map((role, index) =>
                            <tr className="text-center">
                                <td>{index + 1}</td>
                                <td>{role.user.fullName}</td>
                                <td>{role.user.phoneNumber} </td>
                                <td style={role.isInvolved === true ? {backgroundColor: '#F1FFE3'} : {backgroundColor: '#FFECEE'}}>
                                    {
                                        role.isInvolved === true ? <text className="text-success">online</text> :
                                            <text className="text-danger">offline</text>
                                    }
                                </td>
                                <td>{
                                    role.memberTypeEnum === SPEAKER ? 'Доклатчик' : '' ||
                                    role.memberTypeEnum === WATCHER ? 'Приглашенный' : ''||
                                    role.memberTypeEnum === SECRETARY ? 'Секретар' : '' ||
                                    role.memberTypeEnum === CHAIRMAN ? 'Председатель' : '' ||
                                    role.memberTypeEnum === SIMPLE ? 'Обычный' : ''
                                }</td>
                                <td>
                                    <button className="btn btn-link">
                                        <AiOutlineSetting/>
                                    </button>
                                </td>
                            </tr>
                        ) :
                        <tr className='text-center'>
                            <th colSpan="6">Ничего не найдена</th>
                        </tr>
                    }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
