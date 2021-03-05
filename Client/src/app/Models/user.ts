export interface Account {
    id?: string;
    email?: string;
}

export interface Details {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    photourl?: string;
    phone?: string
    statusId?: number;
}

export interface Address {
    userId?: string;
    isDefault?: boolean;
    address1?: string;
    address2?: string;
    provinceId?: number;
    city?: string;
    postalCode?: string;
}

export interface UserInfo{
    account: Account;
    details: Details;
    address: Address;
}

