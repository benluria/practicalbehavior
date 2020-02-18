export class AppContent {
    id: number;
    page: string;
    description: string;
    content: string;
    imageUrl: string;
    sort: number;
    url: string;
    isCheckbox: boolean;
    isTile: boolean;
    checkboxDescription: string;

    constructor(data = null) {
        if (data) {
            Object.keys(data).forEach(key => {
                this[key] = data[key];
            });
        }
    }
}

export interface AppContentTable {
    [key: string]: string;
}