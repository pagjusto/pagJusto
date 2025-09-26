export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2).replace('.', ',')}% a.m.`;
};

/**
 * Formats a string of digits into a Brazilian phone number format.
 * e.g., "11999998888" -> "(11) 99999-8888"
 * @param value The string to format.
 * @returns The formatted phone number string.
 */
export const formatPhoneNumber = (value: string): string => {
    if (!value) return value;

    // Remove all non-digit characters and limit to 11 digits
    const phoneNumber = value.replace(/\D/g, '').slice(0, 11);
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength <= 2) {
        return `(${phoneNumber}`;
    }
    
    if (phoneNumberLength <= 6) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    
    if (phoneNumberLength <= 10) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`;
    }
    
    // For 11-digit mobile numbers (DDD + 9 digits)
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};