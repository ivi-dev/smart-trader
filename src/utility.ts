const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const vowels = ['a', 'e', 'i', 'o', 'u'];

export const capitalize = (word: string) => {
    const split = word.split('');
    split[0] = split[0].toUpperCase();
    return split.join('');
}

export const formatDate = (date: Date) => {
    const year = date.getFullYear(), month = date.getMonth(), 
        date_ = date.getDate(), hour = date.getHours(), 
        minute = date.getMinutes();
    return `${year} ${months[month]} ${date_} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
}

export const fullDate = (date: Date, separator: string = '/') => {
    const hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getMinutes();
    const hours_ = hours < 10 ? `0${hours}` : hours, minutes_ = minutes < 10 ? `0${minutes}` : minutes, seconds_ = seconds < 10 ? `0${seconds}` : seconds;
    return `${date.getFullYear()}${separator}${months[date.getMonth()]}${separator}${date.getDate()} ${hours_}:${minutes_}:${seconds_}`;
}

export const shortDate = (date: Date, separator: string = '/') => {
    return `${date.getFullYear()}${separator}${months[date.getMonth()]}${separator}${date.getDate()}`;
}

export const time = (date: Date, separator: string = ':') => {
    const hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getMinutes();
    const hours_ = hours < 10 ? `0${hours}` : hours, minutes_ = minutes < 10 ? `0${minutes}` : minutes, seconds_ = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours_}${separator}${minutes_}${separator}${seconds_}`;
}

export const isVowel = (letter: string) => {
    return vowels.includes(letter.toLowerCase());
}