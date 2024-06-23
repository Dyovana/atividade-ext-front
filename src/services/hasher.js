import CryptoJS from 'crypto-js';
class Hasher{

    static encode(password){
        return CryptoJS.SHA256(password).toString();
    }

}

export default Hasher;


