/**
 * Calculates the monthly interest rate of a loan using a numerical method (binary search).
 * This is equivalent to finding the Internal Rate of Return (IRR).
 * @param principal The total loan amount.
 * @param monthlyPayment The fixed monthly payment.
 * @param installments The total number of installments.
 * @returns The monthly interest rate as a decimal (e.g., 0.02 for 2%).
 */
export function calculateMonthlyRate(principal: number, monthlyPayment: number, installments: number): number {
    const precision = 0.0000001;
    let low = 0;
    let high = 1; // Assume rate is between 0% and 100% monthly
    let mid = (low + high) / 2;

    // The function representing the Present Value of an annuity formula. We want to find the root of f(rate) = 0.
    const presentValue = (rate: number): number => {
        if (rate === 0) return principal - monthlyPayment * installments;
        return principal - monthlyPayment * (1 - Math.pow(1 + rate, -installments)) / rate;
    };
    
    // Safety break to prevent infinite loops with bad inputs
    for (let i = 0; i < 100; i++) {
        const pv = presentValue(mid);
        if (Math.abs(pv) < precision) {
            return mid;
        }

        // As the rate increases, the present value of the payments decreases.
        // So `presentValue(rate)` is an increasing function.
        // If pv > 0 (NPV > 0), our rate `mid` is too high, so we search the lower half.
        if (pv > 0) {
            high = mid;
        } else {
            // If pv < 0 (NPV < 0), our rate `mid` is too low, so we search the upper half.
            low = mid;
        }
        mid = (low + high) / 2;
    }

    // Return the best guess if it doesn't converge perfectly
    return mid;
}

/**
 * Calculates the fixed monthly payment for a loan (Price Table).
 * @param principal The total loan amount.
 * @param monthlyRate The monthly interest rate as a decimal (e.g., 0.02 for 2%).
 * @param installments The total number of installments.
 * @returns The calculated fixed monthly payment.
 */
export function calculateMonthlyPayment(principal: number, monthlyRate: number, installments: number): number {
    if (monthlyRate === 0) {
        return principal / installments;
    }
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, installments);
    const denominator = Math.pow(1 + monthlyRate, installments) - 1;
    return numerator / denominator;
}