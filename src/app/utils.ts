/**
 * Formats the duration in seconds into a string representation of hours, minutes, and seconds.
 * @param durationInSeconds - The duration in seconds.
 * @returns The formatted duration string.
 */
export const formatDuration = (durationInSeconds: number) => {
    const nonPaddedIntl = Intl.NumberFormat('en', { minimumIntegerDigits: 1 });
    const paddedIntl = Intl.NumberFormat('en', { minimumIntegerDigits: 2 });

    const [delimiter] = new Date()
        .toLocaleTimeString('en-us')
        .match(/\b[:.]\b/) || [':'];
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor(durationInSeconds / 60) % 60;
    const seconds = durationInSeconds % 60;
    const indexToPad = hours ? 0 : 1;

    const timeFormat: string = [hours, minutes, seconds]
        .map((val, i) => {
            return val < 10 && i > indexToPad
                ? paddedIntl.format(val)
                : nonPaddedIntl.format(val);
        })
        .filter((val, i) => {
            if (i === 0) {
                return !(val === '00' || val === '0');
            }

            return true;
        })
        .join(delimiter); // 4:32

    return timeFormat;
};

/**
 * Converts a weight from pounds to pounds.
 * @param lb - The weight in pounds.
 * @returns The weight in kilograms.
 */
export const convertLbToKg = (lb: number): number => {
    return lb * 0.4535923;
};

/**
 * Converts a weight from kilograms to pounds.
 * @param kg - The weight in kilograms.
 * @returns The weight in pounds.
 */
export const convertKgToLb = (kg: number): number => {
    return kg * 2.2046226218;
};

/**
 * Rounds a number to two decimal places.
 * @param value - The number to be rounded.
 * @returns The rounded number.
 */
export const roundTwoDecimals = (value: number): number => {
    // Roundoff to the nearest 0.25
    const inv = 1.0 / 0.25;

    return Math.round(value * inv) / inv;
};

/**
 * Formats a date to a readable string representation.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDateToReadable = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
