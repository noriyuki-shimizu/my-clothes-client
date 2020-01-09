export const getBase64 = (
    img: File,
    callback: (imageURL: string | ArrayBuffer | null) => void
) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
