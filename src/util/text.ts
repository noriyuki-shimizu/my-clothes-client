export const textIncludes = (text: string, value: string) => {
    return text
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
};

export default {};
