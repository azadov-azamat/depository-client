
export const subscribe = (topic) => {
    return {
        type: "SOCKET_TOPIC_SUBSCRIBE",
        payload: topic,
    };
};

export const unsubscribe = (topic) => {
    return {
        type: "SOCKET_TOPIC_UNSUBSCRIBE",
        payload: topic,
    };
};

export const setClient = (client) => {
    return {
        type: "SOCKET_CLIENT_SET",
        payload: client,
    };
};

export const unsetClient = () => {
    return {
        type: "SOCKET_CLIENT_UNSET",
    };
};
