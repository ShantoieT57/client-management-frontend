export interface Client {
    id?: string;
    customerId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    nationalIdNumber: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
    customerType: string;
    isActive: boolean;
    loyaltyNumber: string;
    createdAt?: string;
    updatedAt?: string;
}