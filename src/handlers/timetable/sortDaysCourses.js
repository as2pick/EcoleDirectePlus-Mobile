export default function (rawArray) {
    const dates = [];
    const times = [];
    for (let i = 0; i < rawArray.length; i++) {
        const [date, time] = rawArray[i].start_date.split(" ");
        dates.push(date);

        // console.log(date);
        // console.log(rawArray[i].start_date);
    }

    const chronologicSortedDates = dates.sort((a, b) => a - b);
    // console.log(chronologicSortedDates);
    times.sort((a, b) => {
        let [hoursA, minutesA] = a.split(":").map(Number);
        let [hoursB, minutesB] = b.split(":").map(Number);
        return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
    });
}

/*



{

    id,
    text,
    start_date,
    end_date,
    prof,
    salle,
    classe,
    groupe,
    isModifie,
    isAnnule

}




*/

