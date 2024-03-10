
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
