export const setToLS = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
};

export const getFromLS = (key: string): string | undefined => {
    const value = window.localStorage.getItem(key);

    if (value) {
        return value;
    }
};
