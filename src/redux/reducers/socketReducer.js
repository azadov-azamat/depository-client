import {createReducer} from "../../utils/StoreUtils";

const initialState = {
    topics: [],
    client: null,
}

const reducers = {
    ["SOCKET_TOPIC_SUBSCRIBE"](state, action) {
        state.topics = [...state.topics, action.payload];
    },
    ["SOCKET_TOPIC_UNSUBSCRIBE"](state, action) {
        const idx = state.topics.indexOf(action.payload);
        if (idx !== -1) {
            state.topics = [...state.topics.slice(0, idx), ...state.topics.slice(idx + 1)];
        }
    },
    ["SOCKET_CLIENT_SET"](state, action) {
        state.client = action.payload;
    },
    ["SOCKET_CLIENT_UNSET"](state, action) {
        state.client = null;
    },

    updateState(state, {payload}) {
        return {
            ...state,
            ...payload
        }
    }
}

export default createReducer(initialState, reducers);
