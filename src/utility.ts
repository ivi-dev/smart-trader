const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
export const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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
    seconds = date.getSeconds();
    const hours_ = hours < 10 ? `0${hours}` : hours, minutes_ = minutes < 10 ? `0${minutes}` : minutes, seconds_ = seconds < 10 ? `0${seconds}` : seconds;
    return `${date.getFullYear()}${separator}${months[date.getMonth()]}${separator}${date.getDate()} ${hours_}:${minutes_}:${seconds_}`;
}

export const shortDate = (date: Date, separator: string = '/') => {
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

export const formatMetricDataLabels = (label: string) => {
    let label_ = label.replace(/s&p500/gi, ' S&P 500 ');
    label_ = label_.replace(/13week/gi, ' 13 Week ');
    label_ = label_.replace(/26week/gi, ' 26 Week ');
    label_ = label_.replace(/52week/gi, ' 52 Week ');
    label_ = label_.replace(/3month/gi, ' 3 Month ');
    label_ = label_.replace(/5day/gi, ' 5 Day ');
    label_ = label_.replace(/10day/gi, ' 10 Day ');
    label_ = label_.replace(/ttm/gi, ' TTM ');
    return label_.replace(/\s{2,}/, ' ').trim();
}