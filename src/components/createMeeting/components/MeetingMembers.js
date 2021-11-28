import React, {useEffect, useState} from "react";
import {Col, Label, Row, Table} from "reactstrap";
import {AvForm} from "availity-reactstrap-validation";
import {BiCheckDouble, RiDeleteBinLine} from "react-icons/all";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Select} from 'antd';
import 'antd/dist/antd.css';
import * as adminUsersAction from "../../../redux/actions/UsersAction";
import * as meetingActions from '../../../redux/actions/MeetingAction';
import {toast} from "react-toastify";
import {DEPOSITORY_CURRENT_MEETING, SECRETARY, SPEAKER, WATCHER} from "../../../utils/contants";
import usePagination from "../../Dashboard/Pagination";
import {Pagination} from "@material-ui/lab";
import {confirmAlert} from "react-confirm-alert";

const {Option} = Select;

export default function MeetingMembers({currentMeeting}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {users} = reducers.users
    const {memberManagerState} = reducers.meeting
    const {payload} = reducers.auth.totalCount

    const [membersByMeeting] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const [selectedRole, setSelectedRole] = useState();

    const [page, setPage] = useState(1);
    const size = 6;

    const count = Math.ceil(membersByMeeting.length / size);
    const _DATA = usePagination(membersByMeeting && membersByMeeting, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (membersByMeeting.length);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({
            meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING)),
            page,
            size
        }))
        memberManagerState && memberManagerState.forEach((element, value) => {
            if (element.memberTypeEnum === SPEAKER || element.memberTypeEnum === WATCHER) {
                console.log(element);
                console.log(membersByMeeting)

                membersByMeeting.forEach(elementPushed => {
                        console.log(elementPushed)
                        if (elementPushed.id !== element.id) {
                            membersByMeeting.push(element)
                        }
                    }
                );
            }
        })
    }, [page])

    const submit = (currentMemberId) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в Пользователи?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(meetingActions.deleteMemberById({
                            currentMemberId: currentMemberId,
                            currentMeetingId: currentMeeting.id
                        }))
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    const roleUser = [
        {value: SPEAKER, text: 'Доклатчик'},
        {value: WATCHER, text: 'Приглашенный'},
        {value: SECRETARY, text: 'Секретарь'}
    ];

    function onSearch(val) {
        let field = '';
        if (parseInt(val)) {
            field = 'PINFL';
        } else {
            field = 'FULL_NAME'
        }
        if (val.length >= 3) {
            dispatch(adminUsersAction.getUserFilter({value: val, field: field}))
        }
    }

    function addedUsers(e, v) {
        if (!selectedUser && !selectedRole) {
            toast.error('Пожалуйста, Заполните все')
        } else {
            const data = {
                meetingId: currentMeeting?.id,
                memberTypeEnum: selectedRole,
                userId: selectedUser
            }
            dispatch(meetingActions.addMemberManagers({data, history}))
        }
    }

    function onChange(value) {
        setSelectedUser(value)
    }

    function onChange2(value) {
        setSelectedRole(value)
    }


    return (
        <Row>
            <Col md={3} className="">
                <AvForm onValidSubmit={addedUsers}>
                    <div className="form-group mt-2">
                        <Label for="companySecretary" className='required_fields'>Учетная запись</Label>
                        <Select
                            className="setting_input w-100"
                            showSearch
                            placeholder="Select a user"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {users && users.map((username =>
                                    <Option
                                        value={username.id}>{username.fullName + " - " + username.pinfl}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="form-group mt-2">
                        <Label>Добавите Роль</Label>
                        <Select
                            className="setting_input w-100"
                            placeholder="Select a role"
                            optionFilterProp="children"
                            onChange={onChange2}
                        >
                            {roleUser && roleUser.map((role, index) =>
                                <Option value={role.value}>{role.text}</Option>
                            )}
                        </Select>
                    </div>
                    <div className="d-flex justify-content-center mt-4 mb-md-0 mb-3">
                        <button className="btn py-3 px-4 mx-2 create " type="submit">Добавить пользователя
                        </button>
                    </div>
                </AvForm>
            </Col>
            <Col md={9} sm={9}>
                <div className="d-flex justify-content-center">
                    <Table className="usersList" hover>
                        <thead className="navUsers">
                        <tr>
                            <th scope="col" style={{width: '0'}}>#</th>
                            <th scope="col" className='w-25'>ФИО</th>
                            <th scope="col" className='w-25'>ПНФЛ</th>
                            <th scope="col" className='w-25'>Роль</th>
                            <th scope="col" style={{width: '0'}}>
                                <BiCheckDouble fontSize={25} color={"green"}/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {membersByMeeting.length !== 0
                            ? membersByMeeting.map((role, index) =>
                                <tr className="text-center">
                                    <td>{index + 1}</td>
                                    <td>{role.user.fullName}</td>
                                    <td>{role.user.pinfl} </td>
                                    <td>{
                                        role.memberTypeEnum === SPEAKER ? 'Доклатчик' : '' ||
                                        role.memberTypeEnum === WATCHER ? 'Приглашенный' : ''
                                    }</td>
                                    <td>
                                        <button className="btn btn-link"
                                                onClick={() => submit(role.id)}
                                        >
                                            <RiDeleteBinLine color={"red"}/>
                                        </button>
                                    </td>
                                </tr>
                            ) :
                            <tr className='text-center'>
                                <th colSpan="5">Ничего не найдена</th>
                            </tr>
                        }
                        </tbody>
                    </Table>
                </div>
                <div className="d-none d-md-flex justify-content-md-between position-fixed align-items-center"
                     style={{width: '60%', bottom: '4px'}}>
                    <p className="d-md-flex align-items-center mt-2" style={{fontWeight: 'bold'}}>
                        {membersByMeeting.length === 0 ?
                            "Учётний запись - 0" :
                            "Учётний запись " + (startIndex + 1) + " - " + lastIndex + " из " + (membersByMeeting.length)
                        }
                    </p>
                    <Pagination
                        className=""
                        count={count}
                        size="large"
                        page={page}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        onChange={handleChange}
                    />
                </div>
                <div className="d-md-none d-flex justify-content-between mb-3">
                    <p className="d-flex align-items-center mt-2" style={{fontWeight: 'bold'}}>
                        {membersByMeeting.length === 0 ?
                            "Учётний запись - 0" :
                            "Учётний запись " + (startIndex + 1) + " - " + lastIndex + " из " + (membersByMeeting.length)
                        }
                    </p>
                    <Pagination
                        count={count}
                        size="large"
                        page={page}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        onChange={handleChange}
                    />
                </div>
            </Col>
        </Row>
    )
}
