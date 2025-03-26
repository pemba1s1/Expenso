export function getMonthIndex(monthName: string): number {
    if (!monthName || typeof monthName !== 'string') {
        throw new Error('Month name must be a non-empty string');
    }

    const months = ['january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'];
    const normalizedMonth = monthName.trim().toLowerCase();

    if (normalizedMonth === '') {
        throw new Error('Month name cannot be empty');
    }

    const monthIndex = months.indexOf(normalizedMonth);

    if (monthIndex === -1) {
        throw new Error(`Invalid month name: "${monthName}". Must be a valid month name.`);
    }

    return monthIndex;
}

// takes year and month as arguments, both are on string atm
// then returns start date as frist day of that month and end date as last day of that month
export function getMonthStartEndDates(year: string, month: string): { startDate: Date, endDate: Date } {
    const monthIndex = getMonthIndex(month);
    const startDate = new Date(Number(year), monthIndex, 1);
    const endDate = new Date(Number(year), monthIndex + 1, 0);
    return { startDate, endDate };
}