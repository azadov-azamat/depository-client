import React, {useEffect, useState} from "react";
import {Button, Col, Label, Row, Table} from "reactstrap";
import {AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import {FaDownload} from "react-icons/all";
import {FaCheck} from "react-icons/fa";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import {CHAIRMAN} from "../../../utils/contants";
import Loader from "react-loader-spinner";
import {confirmAlert} from "react-confirm-alert";

export default function MeetingReestr({currentMeeting, lang}) {

    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
        const {loadingReestr, currentReestr, memberManagerState} = reducers.meeting
    const [fromReestr, setFromReestr] = useState([])
    const [excelFile, setExcelFile] = useState({
        fileName: "",
        excelFiles: [0],
        fileForMap: [],
        chairMan: "",
    });

    useEffect(() => {
        dispatch({
            type: "REQUEST_GET_AGENDA_BY_ID_SUCCESS",
            payload: []
        })
        dispatch(meetingActions.getMemberByMeetingId({meetingId: currentMeeting?.id, fromReestr: true}))
    }, [currentMeeting?.id])

    const hiddenFileInput1 = React.useRef(null);

    const handleClick1 = event => {
        hiddenFileInput1.current.click();
    };


    function downloadSetFile(v) {
        if (excelFile.fileName === "") {
            toast.dark("Iltimos faylni tanlang")
        } else {
            const data = new FormData();
            data.append('file', v);
            data.append('meetingId', currentMeeting.id);
            dispatch(meetingActions.addReestrByMeetingAction({data, toast}))
        }
    }

    function responseReestr() {
        if (loadingReestr === 'loading') {
            return (<p>Yuklanmoqda...</p>)
        } else if (loadingReestr === 'download') {
            return (<a href={BASE_URL + api.getReestrByMeetingUrl + '?meetingId=' + currentMeeting.id}>file yuklang</a>)
        } else if (loadingReestr === 'error') {
            return (<p>xatolik yuz berdi, Iltimos tekshiring</p>)
        } else if (!currentReestr) {
            return (<p>file yuklang</p>)
        }
    }

    useEffect(() => {
        setMyBoolean(memberManagerState?.some(element => element.memberTypeEnum === CHAIRMAN));
    }, [memberManagerState])

    const [myBoolean, setMyBoolean] = useState(false)


    function electChairmanForMeeting(chairmanId) {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        setMyBoolean(true)
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    }

    return (
        <>
            <AvForm onValidSubmit={() => downloadSetFile(excelFile.excelFiles)}>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={4} sm={6}>
                        <AvGroup>
                            <Label for={"fileInput"} className='required_fields'>Загрузить cписок членов наб.
                                совета</Label>
                            <AvInput id={"fileInput"}
                                     type="text" value={excelFile.fileName}
                                     name={"fileName1"}
                                     onClick={handleClick1}
                                     style={{backgroundColor: '#FFFFFF'}}
                                     onChange={handleClick1}
                                     placeholder={"Select file"}
                            />
                            <div className="custom-file">
                                <Button color={"link"} onClick={handleClick1}
                                        className=" float-end">
                                    <FaDownload/>
                                </Button>
                                <input type="file" className="custom-file-input file-chosen"
                                       onChange={(e) => {
                                           const file = e.target.files[0];
                                           setExcelFile({...excelFile, fileName: file.name, excelFiles: file});
                                       }}
                                       id="inputGroupFile04"
                                       ref={hiddenFileInput1}
                                       name="file"
                                       accept=".xltx, .xlsb, .xlsm, .xlsx"
                                />
                            </div>
                        </AvGroup>
                    </Col>
                    <Col md={3} sm={6}>
                        {loadingReestr === "loading" ?
                            <div className="d-flex align-items-center justify-content-center" style={{
                                width: '8em', height: '44px', background: '#133B88', borderRadius: '6px',
                                marginTop: '5vh'
                            }}>
                                <Loader
                                    type="ThreeDots"
                                    color="white"
                                    height={30}
                                    width={30}
                                />
                            </div> :
                            <button className={"btn create mt-4 px-3 py-2"}>Загрузить</button>
                        }
                    </Col>
                </Row>
                <div className="">
                    {responseReestr()}
                </div>
            </AvForm>
            <Row>
                <Col md={12} sm={12}>
                    {/*<h3 className="">Список членов наб совета</h3>*/}
                    <div className="d-flex justify-content-center mb-5">
                        <Table hover>
                            <thead className="navUsers">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Ф.И.О</th>
                                <th scope="col">ПНФЛ</th>
                                <th scope="col">Тип документ</th>
                                <th scope="col">Номер документ</th>
                                <th scope="col">Телефон</th>
                                <th scope="col">E-mail</th>
                                <th scope="col">Позиция</th>
                                <th scope="col">Председатель</th>
                            </tr>
                            </thead>
                            <tbody className="navUsers border">
                            {memberManagerState.length !== 0 ?
                                memberManagerState.map((element, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{element.user.fullName}</td>
                                        <td>{element.user.pinfl}</td>
                                        <td>{element.hldIt}</td>
                                        <td>{element.user.passport}</td>
                                        <td>{element.user.phoneNumber}</td>
                                        <td>{element.user.email}</td>
                                        <td>{element.position}</td>
                                        <td>
                                            {element.memberTypeEnum === CHAIRMAN ?
                                                <FaCheck/>
                                                :
                                                <form>
                                                    <input
                                                        id={"chairman" + index}
                                                        className={myBoolean ? "d-none" : ""}
                                                        type="radio"
                                                        onClick={() => electChairmanForMeeting(element.id)}
                                                    />
                                                </form>

                                            }
                                        </td>
                                    </tr>
                                ) :
                                <tr className='text-center'>
                                    <th colSpan="9">Ничего не найдена</th>
                                </tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </>
    )
}
