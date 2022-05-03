export interface Custumer {
    id?: number;
    uuid: string;
    storeName: string;
    name: string;
    email: string;
    accessDate: Date;
    submitDate: Date;
    sessionTime: number;
    city: string;
    state: string;
    ip: string;
    os: string;
    navigator: string;
    browser: string;
    numberOfCores: number;
    accessedPage: string;
}