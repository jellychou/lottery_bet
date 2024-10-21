import moment from 'moment';

const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVjvAmfCvuPNgoDFkWK4M3tBga
t6t5X7nqh4nxdJD/mde3hGLG4baiYcn1E2GVVm9Q+nuU/O+dqCYJfLNNybjcEM+R
bHQNMD2vGou4dXKcvhRxBEZGsjL3WhLsjxYTVuyBSOE8r5CSzzn0rN2CfXLO6E6U
zMpiMBE3IdlGZ5BwWwIDAQAB`;

const priKey = ``;

/*
 *@{word}: 加密文本;
 *
 */
export const enCode = word => {
    var encrytor = new JSEncrypt();
    encrytor.setPublicKey(publicKey);
    return encrytor.encryptLong(word) || {};
};

export const deCode = word => {
    var decrytor = new JSEncrypt();
    decrytor.setPrivateKey(priKey);
    return decrytor.decryptLong(word);
};

export const getBeiJinTimeTamp = () => {
    let localTime = moment();
    let beiJinTime = moment
        .utc(localTime)
        .utcOffset(parseInt(new Date().getTimezoneOffset() / 60) + 8)
        .valueOf();
    return beiJinTime;
};
