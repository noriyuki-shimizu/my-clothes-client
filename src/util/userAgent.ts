export const isMobile = (ua: string) => {
    return (
        ua.indexOf('iPhone') > 0 ||
        ua.indexOf('iPod') > 0 ||
        (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) ||
        ua.indexOf('Windows Phone') > 0
    );
};

export default {};
