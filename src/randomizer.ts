export const number = (min: number, max: number) => {
    return Math.floor(Math.random() * ((max - min) + min + 1));
}

export const sign = () => {
    const signs = ['+', '-'];
    return signs[number(0, signs.length - 1)];
}