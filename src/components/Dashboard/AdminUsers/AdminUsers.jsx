import React, {useEffect, useState} from 'react'
import Users from './Users'
import UsersHeading from './UsersHeading'
import '../styles/users.css'
import {useDispatch, useSelector} from 'react-redux';
import {GET_USER} from '../../../redux/actionTypes/actionTypes'
import {FaCheck, FaTrash, FaPen, FaTimes} from "react-icons/fa";
import {Table} from "reactstrap";
import Form from "./Form";
import {Link, useHistory} from "react-router-dom";
import {connect} from "react-redux";
import {getUser, updateState, deleteUser, getUserList} from "../../../redux/actions/userAction";
import {Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {Pagination} from "@material-ui/lab";
import usePagination from "../Pagination";
import {confirmAlert} from "react-confirm-alert";
import {wrapMapToPropsConstant} from "react-redux/lib/connect/wrapMapToProps";
import {ADMIN, ENTITY, FOREIGNER, INDIVIDUAL} from "../../../utils/contants";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";
import {SELECTED_ITEM} from "../../../redux/actionTypes/UsersActionTypes";
import {useTranslation} from "react-i18next";


function AdminUsers(props) {

    const {t} = useTranslation();

    const style ={
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '20% !important',
    };
    const size = 6;
    const reducers = useSelector(state => state);
    const usersArray = reducers.users;
    const payload = reducers.user.totalCountUser;
    const [page, setPage] = useState(1);
    const count = Math.ceil(payload && payload / size);
    const startIndex = (page - 1) * size;
    const lastIndex = parseInt(startIndex ) + parseInt(size && size);
    console.log(page)
    console.log("page")
    const _DATA = usePagination(usersArray && usersArray, size);
    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props.getUserList(1,6);
        dispatch(updateState({page: page}));
        // console.log("props.page");
        // console.log(props.page);
        // console.log("props.page");
        const GetUsers = () => {
            if (!name) {
                dispatch({type: GET_USER});
                setLoading(false);
                setUsers(usersArray);
            } else {
                const newUsers = usersArray.filter(user => user.name.includes(name.trim()));
                setUsers(newUsers);
            }
        };
        GetUsers();
        // setTotalPages(Math.ceil(users.length / USER_PER_PAGE));

        if (!name) {
            props.getUserList(page, size);
        }
    }, [name, usersArray, page]);
    localStorage.setItem(SELECTED_ITEM, JSON.stringify({}));

    const del = () => {

        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить пользователя?',
            buttons: [
                {
                    label: 'Да',
                    onClick: props.deleteUser
                },
                {
                    label: 'Нет',
                    // onClick: () => props.updateState({deleteModal : true})
                    // onClick : () => props.deleteModal
                }
            ]
        });
    }

    return (
        <div className="dashboard p-3">
            <div className="container-fluid">
                <div className="users">
                    <UsersHeading/>
                    <div className="minWidth d-flex justify-content-center align-items-center">
                        <div className="list_wrapper">
                            <Table className="usersList" hover>
                                <thead>
                                <tr>

                                    <th style={{width: '0'}} className='text-center '> </th>
                                    <th style={{width: '170px'}} className='text-center '>{t('AdminUser.fullName')}</th>
                                    <th style={{width: '140px'}} className='text-center '>{t('AdminUser.email')}</th>
                                    <th style={{width: '135px'}} className='text-center '>{t('AdminUser.number')}</th>
                                    <th style={{width: '123px'}} className='text-center '>{t('AdminUser.group')}</th>
                                    <th style={{width: '135px'}} className='text-center  '>{t('AdminUser.pnfl')}</th>
                                    <th style={{width: '0'}} className='text-center '>

                                    </th>
                                    <th style={{width: '0'}} className="text-center">

                                    </th>
                                </tr>
                                </thead>

                                <tbody>

                                <Form/>

                                {props.user.map((item, index) => {
                                    if (item.authorities[0] === "ROLE_USER" || item.authorities[0] === "ROLE_MODERATOR"){
                                        return (
                                            <tr className='' key={index}>
                                                <th scope="row" className=' text-center'>
                                                    <Link className='text-warning' to={'/admin/users/' + item.id}>
                                                        <FaPen onClick={() => {
                                                            // console.log("props.selectedItem.authorities");
                                                            // console.log(props.selectedItem.authorities);
                                                            props.updateState({selectedItem: item});
                                                            const select = JSON.stringify(item);
                                                            localStorage.setItem(SELECTED_ITEM, select)
                                                        }}/>
                                                    </Link>
                                                </th>
                                                <td className='text-center style' style={style}>{
                                                    item.fullName?.length >=20 ? item.fullName.split(" ")[0] + " " + item.fullName.split(" ")[1] + " ..." : item.fullName
                                                }</td>
                                                <td className='text-center style' style={style}>{
                                                    item.email?.length >=25 ? item.email.split("@")[0] + " " + " ..." : item.email
                                                }</td>
                                                <td className='text-center style' style={style}>{item.phoneNumber}</td>
                                                <td className='text-center style' style={style}>{
                                                    item.groupEnum === ENTITY ? "Юридическое лицо" :
                                                        item.groupEnum === ADMIN ? "Админстратор" :
                                                            item.groupEnum === FOREIGNER ? "Иностранец" :
                                                                "Физическое лицо"
                                                }</td>
                                                <td className='text-center style' style={style}>{item.pinfl}</td>
                                                <td className='text-center'>
                                                    {/*{console.log(item.activated)}*/}
                                                    {item.activated ? <span className="text-success">
                                                     <FaCheck/>
                                                </span> : <span className="text-danger">
                                                    <FaTimes/>
                                                </span>}
                                                </td>
                                                <td className='text-center'>
                                                    <button className="btn text-danger"
                                                            onClick={() => props.updateState({
                                                                    // deleteModal: true,
                                                                    selectedIndex: item.id
                                                                }, del()
                                                            )}
                                                    >
                                                        <FaTrash/>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center position-fixed"
                         style={{width: '96%', bottom: '4px'}}>
                        <Pagination
                            count={count}
                            size="large"
                            page={page}
                            color="primary"
                            variant="outlined"
                            shape="rounded"
                            onChange={handleChange}
                            className="bg-white"
                            showFirstButton showLastButton
                        />
                        <p className="d-none d-lg-flex align-items-center justify-content-end users_count">
                            Учётний запись {startIndex + 1} - {
                            lastIndex > payload ? payload : lastIndex
                        } из {payload}
                        </p>
                    </div>
                </div>
            </div>

            <Modal isOpen={props.deleteModal} toggle={() => props.updateState({deleteModal: false})}>
                <ModalHeader>
                    <span>Rostdan xam o'chirasizmi ?</span>
                </ModalHeader>
                <ModalFooter>
                    <button type="button" className="btn btn-danger" onClick={props.deleteUser}>Xa</button>
                    <button type="button" className="btn btn-secondary"
                            onClick={() => props.updateState({deleteModal: false})}>Yo'q
                    </button>
                </ModalFooter>
            </Modal>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        deleteModal: state.user.deleteModal,
        selectedIndex: state.user.selectedIndex,
        selectedItem: state.user.selectedItem,
        page: state.user.page
    }
};
export default connect(mapStateToProps, {getUser, getUserList , updateState, deleteUser})(AdminUsers);
