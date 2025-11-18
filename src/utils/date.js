export function formatFrenchDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long", day: "2-digit", month: "long" };
    let formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(date);
    let [weekday, day, month] = formattedDate.split(" ");
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${day} ${month}`;
}

export function addDaysToDateString(dateString, days) {
    let date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
}

export function getPreviousMonday(dateString) {
    let date = new Date(dateString);
    let day = date.getDay();

    if (day !== 1) {
        date.setDate(date.getDate() - ((day + 6) % 7));
    }

    return date.toISOString().split("T")[0];
}

export function getTodayDateString() {
    const date = new Date();
    return date.toISOString().split("T")[0];
}

export const formatShortDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

