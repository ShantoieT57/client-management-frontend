export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateSouthAfricanPhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    // South African phone number formats: +27XXXXXXXXX, 0XXXXXXXXX, XXXXXXXXX
    const phoneRegex = /^(\+27|0)?[1-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateSouthAfricanID = (id: string): boolean => {
    if (!id) return false;
    // South African ID format: YYMMDDGGGGSAZ (13 digits)
    const idRegex = /^\d{13}$/;
    if (!idRegex.test(id)) return false;
    
    // Basic checksum validation (Luhn algorithm)
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        let digit = parseInt(id[i]);
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(id[12]);
};

export const validatePostalCode = (code: string): boolean => {
    if (!code) return false;
    return code.length >= 4 && code.length <= 10;
};

export const validateDateOfBirth = (date: string): boolean => {
    if (!date) return false;
    const today = new Date();
    const birthDate = new Date(date);
    return birthDate <= today;
};

// Comprehensive client validation function
export const validateClient = (client: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    idNumber: string;
    postalCode: string;
    dateOfBirth: string;
    city: string;
}): { isValid: boolean; error: string } => {
    // Required field validation
    if (!client.firstName || !client.lastName || !client.email || !client.idNumber || !client.postalCode || !client.dateOfBirth || !client.city) {
        return { isValid: false, error: 'All required fields must be filled' };
    }

    // Email validation
    if (!validateEmail(client.email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Phone validation (optional)
    if (client.phoneNumber && !validateSouthAfricanPhone(client.phoneNumber)) {
        return { isValid: false, error: 'Please enter a valid South African phone number (e.g., +27XXXXXXXXX or 0XXXXXXXXX)' };
    }

    // ID number validation
    if (!validateSouthAfricanID(client.idNumber)) {
        return { isValid: false, error: 'Please enter a valid South African ID number (13 digits)' };
    }

    // Postal code validation
    if (!validatePostalCode(client.postalCode)) {
        return { isValid: false, error: 'Postal code must be between 4 and 10 characters' };
    }

    // Date of birth validation
    if (!validateDateOfBirth(client.dateOfBirth)) {
        return { isValid: false, error: 'Date of birth cannot be in the future' };
    }

    return { isValid: true, error: '' };
};