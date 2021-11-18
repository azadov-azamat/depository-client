import React, {useRef} from 'react';
import SockJsClient from 'react-stomp';
import {BASE_URL} from "../../../utils/config";

export default function Socket({onMessage, url, topics, onConnect, onDisconnect
}){

    let clientRef = useRef(null);

    return (
        <SockJsClient url={"https://depositary.herokuapp.com:443" + url}
                      topics={topics}
                      onConnect={onConnect}
                      onDisconnect={onDisconnect}
                      onMessage={onMessage}
                      ref={(client) => {
                          clientRef = client
                      }}

        />
    )
}
