export const isMobile = () => {
    const { userAgent } = navigator;
    return (
        userAgent.indexOf('iPhone') > 0 ||
        userAgent.indexOf('iPod') > 0 ||
        (userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0) ||
        userAgent.indexOf('Windows Phone') > 0
    );
};

export default {};
