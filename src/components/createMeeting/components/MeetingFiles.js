import React, {useEffect, useState} from "react";
import {Button, Col, Label, Row, Table} from "reactstrap";
import {AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import {FaDownload, FaEye, FiDownload} from "react-icons/all";
import {FaCheck, FaTimes, FaTrash} from "react-icons/fa";
import {useHistory, useLocation} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {Select} from "antd";
import {confirmAlert} from "react-confirm-alert";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";

const {Option} = Select;

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}


export default function MeetingFiles({currentMeeting, lang}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {agendaState, meetingFile} = reducers.meeting

    const [addFile, setAddFile] = useState({fileName: "", file: []});
    const [selectAgenda, setSelectAgenda] = useState(null);

    const hiddenFileInput = React.useRef(null);

    let query = useQuery();
    const meetingId = query.get("meeting_id")

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    console.log(selectAgenda)

    useEffect(() => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: parseInt(meetingId)}))
        dispatch(meetingActions.getMeetingFilesByMeetingIdAction({meetingId: parseInt(meetingId)}))
        dispatch({
            type: "REQUEST_GET_AGENDA_BY_ID_SUCCESS",
            payload: []
        })
    }, [currentMeeting])


    function downloadSetFile() {

        const data = new FormData();
        data.append('agendaId', selectAgenda ? parseInt(selectAgenda) : null);
        data.append('file', addFile.file);
        data.append('meetingId', meetingId);
        dispatch(meetingActions.addAgendaAndMeetingFile({data, history}))
    }

    const deleteUser = (id) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(meetingActions.deleteMeetingFileAction({id: id, meetingId: currentMeeting?.id}))
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    const style = {
        // background: "#FFFFFF",
        cursor: 'pointer',
        zIndex: '1000'
    }

    return (
        <>
            <AvForm onValidSubmit={downloadSetFile}>
                <Row>
                    <Col md={6}>
                        <div className="form-group">
                            <Label for="companySecretary">Связанные голосование</Label>
                            <Select
                                className="setting_input w-100"
                                showSearch
                                allowClear={true}
                                placeholder="Выберите голосование"
                                optionFilterProp="children"
                                onChange={(value) => setSelectAgenda(value)}
                                value={selectAgenda}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {agendaState && agendaState.map((agenda =>
                                        <Option
                                            value={agenda.id}>{agenda.subject}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="app-required-select d-inline">
                            <AvGroup>
                                <Label for={"fileInput"}>Загрузить файлы заседание</Label>
                                <AvInput id={"fileInput"}
                                         type="text" value={addFile.fileName}
                                         name={"fileName"}
                                         onClick={handleClick}
                                         className=""
                                         onChange={handleClick}
                                         placeholder={"Select file"}
                                         required
                                />
                                <div className="custom-file float-end">
                                    <Button color={"link"} onClick={handleClick}
                                            className=" float-end">
                                        <FaDownload/>
                                    </Button>
                                    <input type="file" className="custom-file-input d-none"
                                           onChange={(e) => {
                                               const file = e.target.files[0];
                                               setAddFile({
                                                   ...addFile,
                                                   fileName: e.target.files[0].name,
                                                   file: e.target.files[0]
                                               })
                                           }}
                                           id="inputGroupFile04"
                                           ref={hiddenFileInput}
                                           name="meetingFile"
                                    />
                                </div>
                            </AvGroup>
                            <div
                                className={"d-flex justify-content-md-end justify-content-center"}>
                                <button type={"submit"} className={"btn create mt-2"}>Загрузить</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </AvForm>
            <Row>
                <Col md={12} sm={12}>
                    <div className="d-flex justify-content-center ">
                        <Table hover className="table-bordered">
                            <>
                                <thead className="navUsers">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Имя файля</th>
                                    <th scope="col">Связанное голосование</th>
                                    <th scope="col"><FaEye fontSize={20}/></th>
                                    <th scope="col"><FaTimes/></th>
                                </tr>
                                </thead>
                                <tbody>
                                {meetingFile && meetingFile.length !== 0 ?
                                    meetingFile && meetingFile.map((element, index) =>
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{element.originalFileName}</td>
                                            <td>{element.agendaSubject}</td>
                                            <td style={{width: '0'}}>
                                                <a href={BASE_URL + api.downloadFile + element.id} download
                                                   className='text-dark'><FiDownload fontSize={20}/></a>
                                            </td>
                                            <td style={{width: '0'}}>
                                                <text style={style} onClick={() => deleteUser(element.id)}>
                                                    <FaTrash className='text-danger'/>
                                                </text>
                                            </td>
                                        </tr>) :
                                    <tr className='text-center'>
                                        <th colSpan="5">Ничего не найдена</th>
                                    </tr>
                                }
                                </tbody>
                            </>
                        </Table>
                    </div>
                </Col>
            </Row>
        </>
    )
}
