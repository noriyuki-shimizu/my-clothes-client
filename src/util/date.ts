export const dateFormat = 'YYYY-MM-DD';

export const timeFormat = 'HH:mm';

export const getSeason = (date: Date): string => {
    const month = date.getMonth() + 1;

    switch (month) {
        case 3:
        case 4:
        case 5:
            return 'dictionary.season.spring';
        case 6:
        case 7:
        case 8:
            return 'dictionary.season.summer';
        case 9:
        case 10:
        case 11:
            return 'dictionary.season.autumn';
        case 12:
        case 1:
        case 2:
            return 'dictionary.season.winter';
        default:
            return 'default';
    }
};
