export const toMilliseconds = (hours, minutes) => {
    if (typeof hours === "string") [hours, minutes] = hours.split(":");
    return parseInt(hours) * 3600000 + parseInt(minutes) * 60000;
};

export const toHoursMinutes = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return [hours, minutes];
};

