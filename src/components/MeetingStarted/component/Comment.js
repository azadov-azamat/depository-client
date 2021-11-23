import React, {useRef} from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation'
import Loader from "react-loader-spinner";
import {DEPOSITORY_CURRENT_MEETING, DEPOSITORY_USER, TOKEN} from "../../../utils/contants";
import Socket from "../socket.io/Socket";
import {useDispatch} from "react-redux";
import SockJsClient from "react-stomp";

export default function Comment({comment, loading}) {

    const dispatch = useDispatch();
    let clientRef = useRef(null);

    let url = 'https://depositary.herokuapp.com:443/websocket/logger/';
    // const authToken = localStorage.getItem(TOKEN)
    // const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1ei01MjIwODAyNzMxMDAyNiIsImF1dGgiOiJST0xFX1VTRVIiLCJleHAiOjE2Mzc2ODgxMDB9.nFmDb1xMw3JZJOUy47yyU2raBTQCwjxLt7Cxcs44yQSYa_O4paBAyyO4izeUhJvQthM8f_H90LCh6wUb0LGzOg"
    const authToken = localStorage.getItem(TOKEN)

    if (authToken) {
        url += '?access_token=' + authToken;
    }

    const commentLogging = (e, v) => {
        const data = {
            userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
            meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING)),
            ...v
        }
        clientRef.sendMessage('/topic/user-all', JSON.stringify(data));
    };

    return (
        <>
            <AvForm onValidSubmit={commentLogging} style={{height: '57vh'}}>
                <AvField
                    type="textarea"
                    name="loggingText"
                    label="Комментирование"
                    className="border"
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

            <SockJsClient
                url={url}
                topics={['/topic/user']}
                onConnect={() => console.log("Connected")}
                onDisconnect={() => console.log("Disconnected")}
                onMessage={(msg) => {
                    console.log(msg)
                    dispatch({
                        type: 'REQUEST_SUCCESS_LOGGING_LIST',
                        payload: msg
                    })
                }}
                ref={(client) => {
                    clientRef = client
                }}

            />
        </>
    )
}
