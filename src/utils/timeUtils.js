const timeUtils = {
    getOnlyTime: (time) => {
        return time.toLocaleDateString();
    }
}
const parseToDate = (time) => {
    return new Date(time).toLocaleDateString();
}

const parseToTime = (time) => {
    return new Date(time).toLocaleTimeString();
}

const parseToTimestamp = (time) => {
    return new Date(time).toLocaleString();
}
export default timeUtils;