export const assignUnit = (size) => {
    const absNombre = Math.abs(size);
    if (absNombre >= 1_000_000) {
        return (size / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + " Mo";
    } else if (absNombre >= 1_000) {
        return (size / 1_000).toFixed(2).replace(/\.?0+$/, "") + " ko";
    } else {
        return nombre.toString();
    }
};

