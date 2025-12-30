function timestampConverter(stamp){
    const utcDate = new Date(stamp);
    const localDate = utcDate.toLocaleString(); // Converts to local time
    return localDate;
}

export default timestampConverter;