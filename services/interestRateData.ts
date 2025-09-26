const interestRates: { [key: string]: number } = {
    '01/19': 1.7, '02/19': 1.67, '03/19': 1.63, '04/19': 1.62, '05/19': 1.61, '06/19': 1.59,
    '07/19': 1.55, '08/19': 1.54, '09/19': 1.52, '10/19': 1.51, '11/19': 1.48, '12/19': 1.47,
    '01/20': 1.51, '02/20': 1.49, '03/20': 1.51, '04/20': 1.56, '05/20': 1.49, '06/20': 1.46,
    '07/20': 1.45, '08/20': 1.45, '09/20': 1.43, '10/20': 1.45, '11/20': 1.46, '12/20': 1.47,
    '01/21': 1.55, '02/21': 1.53, '03/21': 1.58, '04/21': 1.62, '05/21': 1.62, '06/21': 1.64,
    '07/21': 1.67, '08/21': 1.72, '09/21': 1.8, '10/21': 1.86, '11/21': 2.04, '12/21': 2.0,
    '01/22': 2.0, '02/22': 1.98, '03/22': 2.02, '04/22': 2.03, '05/22': 2.02, '06/22': 2.04,
    '07/22': 2.05, '08/22': 2.04, '09/22': 2.02, '10/22': 2.03, '11/22': 2.06, '12/22': 2.12,
    '01/23': 2.15, '02/23': 2.14, '03/23': 2.12, '04/23': 2.11, '05/23': 2.08, '06/23': 2.0,
    '07/23': 1.95, '08/23': 1.96, '09/23': 1.94, '10/23': 1.96, '11/23': 1.94, '12/23': 1.91,
    '01/24': 1.95, '02/24': 1.93, '03/24': 1.91, '04/24': 1.91, '05/24': 1.91, '06/24': 1.91,
    '07/24': 1.91, '08/24': 1.93, '09/24': 1.91, '10/24': 1.94, '11/24': 1.97, '12/24': 2.05,
    '01/25': 2.18, '02/25': 2.15, '03/25': 2.12, '04/25': 2.08, '05/25': 2.05, '06/25': 2.05,
    '07/25': 2.03
};

/**
 * Gets the market interest rate for a given date.
 * @param dateString The date, can be in YYYY-MM-DD, YYYY-MM, or DD/MM/YYYY format.
 * @returns The interest rate as a percentage, or null if not found.
 */
export function getMarketRate(dateString: string): number | null {
    if (!dateString) return null;
    try {
        let month: string | undefined;
        let year: string | undefined;

        // Handles "YYYY-MM-DD" or "YYYY-MM" from date/month inputs
        if (dateString.includes('-')) {
            const parts = dateString.split('-');
            year = parts[0];
            month = parts[1];
        } 
        // Handles "DD/MM/YYYY" or "MM/YYYY" from manual input or locale-specific formats
        else if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) { // DD/MM/YYYY
                month = parts[1];
                year = parts[2];
            } else if (parts.length === 2) { // MM/YYYY
                month = parts[0];
                year = parts[1];
            }
        }

        if (!year || !month || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
            console.error("Could not parse date:", dateString);
            return null;
        }

        // Pad month with leading zero if necessary (e.g., '4' -> '04')
        const paddedMonth = month.padStart(2, '0');
        
        // Ensure year is 4 digits, then get the last two
        const fullYear = year.length === 2 ? `20${year}` : year;
        if (fullYear.length !== 4) {
            console.error("Could not determine full year from:", year);
            return null;
        }
        
        const shortYear = fullYear.slice(-2);
        const key = `${paddedMonth}/${shortYear}`;
        
        if (Object.prototype.hasOwnProperty.call(interestRates, key)) {
            return interestRates[key];
        }

        return null; // Return null if the key is not found in our data
    } catch (error) {
        console.error("Error parsing date for market rate lookup:", dateString, error);
        return null;
    }
}