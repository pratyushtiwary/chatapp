const { encrypt, decrypt } = require("./cipher");

const generateToken = function(data){
    let finalData = data;
    const date = new Date();
    let expiry = new Date();
    expiry.setUTCDate(expiry.getUTCDate() + 7);
    finalData.generated_on = date.getTime();
    finalData.expires_on = expiry.getTime();
    finalData = JSON.stringify(finalData);
    finalData = encrypt(finalData);
    return finalData;
}

const verifyToken = function(token){
    try{
        let decryptedData = decrypt(token);
        if(decryptedData){
            const date = new Date();
            const time = date.getTime();
            const data = JSON.parse(decryptedData);
            if(data.expires_on >= time){
                return true;
            }
            return false;
        }
        return false;
    }
    catch(err){
        return false;
    }
}

const viewToken = function(token){
    let decryptedData = decrypt(token);
    if(verifyToken(token)){
        const data = JSON.parse(decryptedData);
        return data;
    }
    return null;
}

module.exports = {
    generateToken,
    viewToken,
    verifyToken
}