export class AppStorage {
    static readonly ApplicationPrefix = "ecommerce";

    static setItem(key: string, item: any): void {
        if (item == null) {
            localStorage.removeItem(`${AppStorage.ApplicationPrefix}.${key}`);
        } else {
            localStorage.setItem(`${AppStorage.ApplicationPrefix}.${key}`, JSON.stringify(item));
        }
    }

    static getItem<T = string>(key: string): T {
        const storedString = localStorage.getItem(`${AppStorage.ApplicationPrefix}.${key}`);

        if (storedString == null) return null as T;

        try {
            return JSON.parse(storedString) as T;
        } catch (error) {
            return null as T;
        }
    }
}
