import * as util from '../utility';

test('return a date/time representation in yyyy/mm/dd hh:mm:ss format', () => {
    expect(util.dateTime(new Date('2020-2-22 10:00:00'), 
        {date: '/', time: ':'})).toBe('2020/Feb/22 10:00:00');
});

test('return a date/time representation in yyyy-mm-dd hh/mm/ss format', () => {
    expect(util.dateTime(new Date('2020-2-22 10:00:00'), 
        {date: '-', time: '/'})).toBe('2020-Feb-22 10/00/00');
});

test('return a date representation in yyyy/mm/dd format', () => {
    expect(util.date(new Date('2020-2-22'))).toBe('2020/Feb/22');
});

test('return a date representation in yyyy-mm-dd format', () => {
    expect(util.date(new Date('2020-2-22'), '-')).toBe('2020-Feb-22');
});

test('return a time representation in hh:mm:ss format', () => {
    expect(util.time(new Date('2020-2-22 10:20:10'))).toBe('10:20:10');
});

test('return a time representation in hh-mm-ss format', () => {
    expect(util.time(new Date('2020-2-22 10:00:00'), '-')).toBe('10-00-00');
});

test('return a time representation in hh:mm:ss format', () => {
    expect(util.time(new Date('2020-2-22 9:1:2'))).toBe('09:01:02');
});

test('recognizes a letter as a vowel', () => {
    expect(util.isVowel('a')).toBe(true);
});

test('recognizes a letter as a consonant', () => {
    expect(util.isVowel('b')).toBe(false);
});