/**
 * スリープします.
 * 引数を指定しない場合は１秒スリープします.
 * @param waitMsec 遅延秒数
 */
export const sleep = (waitMsec: number = 1000) => {
    const startMsec = new Date().getTime();
    while (new Date().getTime() - startMsec < waitMsec);
};
