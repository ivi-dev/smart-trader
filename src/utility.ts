const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
export const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const vowels = ['a', 'e', 'i', 'o', 'u'];

export const capitalize = (word: string) => {
    const split = word.split('');
    split[0] = split[0].toUpperCase();
    return split.join('');
}

export const dateTime = (date: Date, separators: {date: string, time: string}) => {
    return `${date.getFullYear()}${separators.date}${months[date.getMonth()]}${separators.date}${date.getDate()} ${time(date, separators.time)}`;
}

export const date = (date: Date, separator: string = '/') => {
    return `${date.getFullYear()}${separator}${months[date.getMonth()]}${separator}${date.getDate()}`;
}

export const time = (date: Date, separator: string = ':') => {
    const hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();
    const hours_ = hours < 10 ? `0${hours}` : hours, minutes_ = minutes < 10 ? `0${minutes}` : minutes, seconds_ = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours_}${separator}${minutes_}${separator}${seconds_}`;
}

export const isVowel = (letter: string) => {
    return vowels.includes(letter.toLowerCase());
}