const makeUniqueIds = (arr) => {
    const seen = new Set();

    return arr.map((num) => {
        while (seen.has(num)) {
            num++;
        }
        seen.add(num);
        return num;
    });
};

export default makeUniqueIds;
