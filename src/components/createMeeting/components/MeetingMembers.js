import React, {useEffect, useState} from "react";
import {Col, Label, Row, Table} from "reactstrap";
import {AvForm} from "availity-reactstrap-validation";
import {BiCheckDouble, RiDeleteBinLine} from "react-icons/all";
import {useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Select} from 'antd';
import 'antd/dist/antd.css';
import * as adminUsersAction from "../../../redux/actions/UsersAction";
import * as meetingActions from '../../../redux/actions/MeetingAction';
import {toast} from "react-toastify";
import {CHAIRMAN, SECRETARY, SPEAKER, WATCHER} from "../../../utils/contants";
import usePagination from "../../Dashboard/Pagination";
import {Pagination} from "@material-ui/lab";
import {confirmAlert} from "react-confirm-alert";

const {Option} = Select;

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function MeetingMembers({currentMeetingId, lang}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {users} = reducers.users
    const {memberManagerState} = reducers.meeting
    const {payload} = reducers.auth.totalCount

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const [page, setPage] = useState(1);
    const size = 7;

    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(memberManagerState && memberManagerState, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    let query = useQuery();
    const meetingId = query.get("meeting_id");

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({
            meetingId: parseInt(meetingId),
            page: page,
            size,
            fromReestr: false
        }))

        return () => {
            dispatch({
                type: 'REQUEST_GET_MEMBER_LIST_SUCCESS',
                payload: []
            })
        }
    }, [page])

    const submit = (currentMemberId) => {
        confirmAlert({
            title: lang("alert.delete"),
            message: lang("alert.deleteMsg"),
            buttons: [
                {
                    label: lang("alert.yes"),
                    onClick: () => {
                        dispatch(meetingActions.deleteMemberById({
                            currentMemberId: currentMemberId,
                            currentMeetingId: currentMeetingId,
                            toast
                        }))
                    }

                },
                {
                    label: lang("alert.no"),
                }
            ]
        });
    };

    const roleUser = [
        {value: SECRETARY, text: lang("meetingCreated.roles.secretary")},
        {value: SPEAKER, text: lang("meetingCreated.roles.speaker")},
        {value: WATCHER, text: lang("meetingCreated.roles.watcher")},
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

    function addedUsers() {
        if (!selectedUser && !selectedRole) {
            toast.error(lang("toast.warning"))
        } else {
            const data = {
                meetingId: parseInt(meetingId),
                memberTypeEnum: selectedRole,
                userId: selectedUser
            }
            dispatch(meetingActions.addMemberManagers({
                data,
                history,
                toast,
                setSelectedRole,
                setSelectedUser
            })).then(res => {
                setSelectedRole(null);
                setSelectedUser(null)
            });
        }
    }

    const style = {
        cursor: 'pointer',
        zIndex: '1000'
    }

    const styleTable = {
        whiteSpace: 'nowrap',
        width: '13em',
        height: '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '0',
        margin: '0'
    }


    return (
        <Row>
            <Col md={3} className="">
                <AvForm onValidSubmit={addedUsers}>
                    <div className="form-group mt-2">
                        <Label for="companySecretary"
                               className='required_fields'>{lang("companiesList.accountCount")}</Label>
                        <Select
                            className="setting_input w-100"
                            showSearch
                            placeholder={lang("meetingCreated.placeholders.selectUser")}
                            optionFilterProp="children"
                            onChange={(value) => setSelectedUser(value)}
                            value={selectedUser}
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
                        <Label>{lang("meetingCreated.roles.addRole")}</Label>
                        <Select
                            className="setting_input w-100"
                            placeholder={lang("meetingCreated.placeholders.selectRole")}
                            optionFilterProp="children"
                            onChange={(value) => setSelectedRole(value)}
                            value={selectedRole}
                        >
                            {roleUser && roleUser.map((role, index) =>
                                <Option value={role.value}>{role.text}</Option>
                            )}
                        </Select>
                    </div>
                    <div className="d-flex justify-content-center mt-4 mb-md-0 mb-3">
                        <button className="btn py-3 px-4 mx-2 create "
                                type="submit">{lang("meetingCreated.roles.addMember")}</button>
                    </div>
                </AvForm>
            </Col>
            <Col md={9} sm={9}>
                <div className="d-flex justify-content-center">
                    <Table className="usersList" hover>
                        <thead className="navUsers">
                        <tr>
                            <th scope="col" style={{width: '0'}}>#</th>
                            <th scope="col" className='w-25'>{lang("AdminUser.fullName")}</th>
                            <th scope="col" className='w-25'>{lang("AdminUser.pinfl")}</th>
                            <th scope="col" className='w-25'>{lang("AdminUser.role")}</th>
                            <th scope="col" style={{width: '0'}}>
                                <BiCheckDouble fontSize={25} color={"green"}/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {memberManagerState.length !== 0
                            ? memberManagerState.map((role, index) =>
                                <tr className="text-center" key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <p style={styleTable}>{role.user.fullName}</p>
                                    </td>
                                    <td>{role.user.pinfl} </td>
                                    <td>{
                                        role.memberTypeEnum === SPEAKER ? lang("meetingCreated.roles.speaker") : '' ||
                                        role.memberTypeEnum === WATCHER ? lang("meetingCreated.roles.watcher") : '' ||
                                        role.memberTypeEnum === SECRETARY ? lang("meetingCreated.roles.secretary") : '' ||
                                        role.memberTypeEnum === CHAIRMAN ? lang("meetingCreated.roles.chairman") : ''
                                    }</td>
                                    <td className="text-center">
                                        <text style={style} onClick={() => submit(role.id)}>
                                            <RiDeleteBinLine color={"red"} fontSize={20}/>
                                        </text>
                                    </td>
                                </tr>
                            ) :
                            <tr className='text-center'>
                                <th colSpan="5">{lang("meetingCreated.emptyList")}</th>
                            </tr>
                        }
                        </tbody>
                    </Table>
                </div>
                <div className="d-none d-md-flex justify-content-md-between position-fixed align-items-center"
                     style={{width: '60%', bottom: '4px'}}>
                    <p className="d-md-flex align-items-center mt-2" style={{fontWeight: 'bold'}}>
                        {(payload && payload[0]) === 0 ?
                            (lang("companiesList.accountCount") + " - 0") :
                            lang("companiesList.accountCount") + " " + (startIndex + 1) + " - " + lastIndex + " " + (lang("companiesList.from")) + " " + ((payload && payload[0]))
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
                        {(payload && payload[0]) === 0 ?
                            (lang("companiesList.accountCount") + " - 0") :
                            lang("companiesList.accountCount") + " " + (startIndex + 1) + " - " + lastIndex + " " + (lang("companiesList.from")) + " " + ((payload && payload[0]))
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
