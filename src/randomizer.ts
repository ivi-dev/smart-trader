export const number = (min: number, max: number) => {
    return Math.floor(Math.random() * ((max - min) + min + 1));
}