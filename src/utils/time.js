export const toMilliseconds = (hours, minutes) => {
    if (typeof hours === "string") [hours, minutes] = hours.split(":");
    return parseInt(hours) * 3600000 + parseInt(minutes) * 60000;
};

export const toHoursMinutes = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return [hours, minutes];
};

export const getTimeInterval = (
    textInitDate /* YYYY-MM-DDTHH:MM */,
    textDestDate /* YYYY-MM-DDTHH:MM */
) => {
    // CONVERT TO MINUTES !

    const [initDate, initTime] = textInitDate.split("T");
    const [destDate, destTime] = textDestDate.split("T");

    const [initYYYY, initMM, initDD] = initDate.split("-").map(Number);
    const [destYYYY, destMM, destDD] = destDate.split("-").map(Number);

    const [iDateYYYY, iDateMM, iDateDD] = [
        destYYYY - initYYYY,
        destMM - initMM,
        destDD - initDD,
    ];

    const dateInterval = (iDateYYYY + iDateMM + iDateDD) * 1440; // mn

    const [initHH, initMm] = initTime.split(":").map(Number);
    const [destHH, destMm] = destTime.split(":").map(Number);

    const [iTimeHH, iTimeMm] = [destHH - initHH, destMm - initMm];

    const timeInterval = iTimeHH * 60 + iTimeMm;
    const interval = dateInterval + timeInterval;

    let [intervalDays, intervalHours, intervalMinutes] = [
        0,
        Math.floor(interval / 60),
        interval % 60,
    ];

    if (Math.abs(intervalHours) >= 24) {
        let days = Math.round(intervalHours / 24);
        intervalDays = days;
    }

    return [intervalDays, intervalHours, intervalMinutes];
};

