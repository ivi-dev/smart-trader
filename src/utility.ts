const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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