/**
 * Parses a date string and constructs a Date object based on the provided format.
 *
 * WARNING: The created Date object is in the local time zone.
 *
 * @param {string} date - The input date string to be parsed.
 * @param {string} [format="dd/MM/yyyy hh:mm:ss"] - The format string indicating the order of date and time components.
 *   Valid placeholders: "dd", "MM", "yyyy", "hh", "mm", "ss". Other separators like "/", ":", and " " are also supported.
 *
 *   - dd: day
 *   - MM: month
 *   - yyyy: year
 *   - hh: hour
 *   - mm: minute
 *   - ss: second.
 *
 *   The order of the placeholders must match the order of the date components in the input string.
 *
 *   The default format is "dd/MM/yyyy hh:mm:ss".
 *
 * @returns {Date | null} A Date object representing the parsed date and time, or null if the input is invalid.
 *
 * @example
 * // Valid usage:
 * const myDate = toDate("15/01/2022 12:30:45");
 * if (myDate !== null) {
 *   // WARNING: The created Date object is in the local time zone.
 *   // Output if timezone is UTC: Sat Jan 15 2022 12:30:45 GMT+0000 (Coordinated Universal Time)
 *   // Output if timezone is GMT-0300: Sat Jan 15 2022 12:30:45 GMT-0300 (Horário Padrão de Brasília)
 *   console.log(myDate.toString());
 * } else {
 *   console.log("Invalid date format or components");
 * }
 *
 * // Invalid usage:
 * const invalidDate = toDate("2022-01-15", "yyyy-mm-dd");
 * if (invalidDate !== null) {
 *   // This block will not be executed
 *   // mm placeholder is used for minute, not month
 *   // a valid placeholder would be "yyyy-MM-dd"
 *   console.log(invalidDate);
 * } else {
 *   console.log("Invalid date format or components"); // Output: Invalid date format or components
 * }
 */
export const toDate = (
    date: string,
    format: string = "dd/MM/yyyy hh:mm:ss"
): Date | null => {
    const formatParts = format.split(/[/ :]/);
    const dateParts = date.split(/[/ :]/);

    if (formatParts.length !== dateParts.length) {
        return null;
    }

    const dayIndex = formatParts.indexOf("dd");
    const monthIndex = formatParts.indexOf("MM");
    const yearIndex = formatParts.indexOf("yyyy");
    const hourIndex = formatParts.indexOf("hh");
    const minuteIndex = formatParts.indexOf("mm");
    const secondIndex = formatParts.indexOf("ss");

    const components = {
        day: dayIndex !== -1 ? parseInt(dateParts[dayIndex]) : 1,
        month: monthIndex !== -1 ? parseInt(dateParts[monthIndex]) - 1 : 0, // Month is 0-indexed
        year: yearIndex !== -1 ? parseInt(dateParts[yearIndex]) : 1970,
        hour: hourIndex !== -1 ? parseInt(dateParts[hourIndex]) : 0,
        minute: minuteIndex !== -1 ? parseInt(dateParts[minuteIndex]) : 0,
        second: secondIndex !== -1 ? parseInt(dateParts[secondIndex]) : 0,
    };

    if (Object.values(components).some(isNaN)) {
        return null;
    }

    const constructedDate = new Date(
        components.year,
        components.month,
        components.day,
        components.hour,
        components.minute,
        components.second
    );

    console.log(components);
    console.log(constructedDate);

    // Assert that the date components match the input
    if (
        constructedDate.getDate() !== components.day ||
        constructedDate.getMonth() !== components.month ||
        constructedDate.getFullYear() !== components.year ||
        constructedDate.getHours() !== components.hour ||
        constructedDate.getMinutes() !== components.minute ||
        constructedDate.getSeconds() !== components.second
    ) {
        return null;
    }

    return constructedDate;
};

/**
 * Formats a Date object into a localized date string with optional time components.
 *
 * @param {Date} date - The Date object to be formatted.
 * @param {boolean} [showTime=false] - If true, includes the time components in the formatted string (hour, minute, and second).
 * @param {string} [locale="pt-BR"] - A string with a BCP 47 language tag representing the locale.
 * @returns {string} A localized date string based on the provided Date object and formatting options.
 *
 * @example
 * // Format date without time components
 * const formattedDate = strfDate(new Date(2022, 0, 15), "pt-BR");
 * console.log(formattedDate); // Output: 15/01/2022
 *
 * // Format date with time components
 * const formattedDateTime = strfDate(new Date(2022, 0, 15, 12, 30, 45), "pt-BR", true);
 * console.log(formattedDateTime); // Output: 15/01/2022 12:30:45
 */
export const strfDate = (
    date: Date,
    showTime: boolean = false,
    locale: string = "pt-BR"
): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: showTime ? "2-digit" : undefined,
        minute: showTime ? "2-digit" : undefined,
        second: showTime ? "2-digit" : undefined,
    };
    return date.toLocaleDateString(locale, options);
};
