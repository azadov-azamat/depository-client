import React, {useRef, useState} from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation'
import Loader from "react-loader-spinner";
import {ACTIVE, CANCELED, DEPOSITORY_CURRENT_MEETING, DEPOSITORY_USER, FINISH, TOKEN} from "../../../utils/contants";
import {useDispatch} from "react-redux";
import SockJsClient from "react-stomp";
import {toast} from "react-toastify";

export default function Comment({loading, socketClient, meetingId, userId, currentMeeting}) {

    const [logging, setLogging] = useState();

    async function postComment() {
        if (currentMeeting?.status === FINISH) {
            return toast.error("Засидание в статусе - Заверщено!")
        }
        if (currentMeeting?.status === CANCELED) {
            return toast.error("Засидание в статусе - Отмена!")
        }
        if (currentMeeting?.status === ACTIVE) {
            return toast.error("Засидание в статусе - Активный!")
        }
        const data = {
            userId: userId,
            meetingId: meetingId,
            loggingText: logging
        }
        socketClient.sendMessage('/topic/user-all', JSON.stringify(data));
    }

    function commentLogging() {
        postComment().then(res =>
            setLogging("")
        )
    }

    return (
        <>
            <AvForm onValidSubmit={commentLogging} style={{height: '57vh'}}>
                <AvField
                    type="textarea"
                    name="loggingText"
                    label="Комментирование"
                    className="border"
                    value={logging}
                    onChange={(e) => setLogging(e.target.value)}
                    style={{backgroundColor: '#FFFFFF', resize: 'none', height: '30vh'}}
                />
                {loading ?
                    <div className="d-flex align-items-center justify-content-center" style={{
                        width: '8em', height: '44px', background: '#133B88', borderRadius: '6px',
                        marginTop: '4px'
                    }}>
                        <Loader
                            type="ThreeDots"
                            color="white"
                            height={30}
                            width={30}
                        />
                    </div>
                    :
                    <button className="btn create mt-2">Комментировать</button>
                }
            </AvForm>
        </>
    )
}
