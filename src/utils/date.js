export function formatFrenchDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long", day: "2-digit", month: "long" };
    let formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(date);
    let [weekday, day, month] = formattedDate.split(" ");
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
}

