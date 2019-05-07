const crypto = require('crypto');
const captcha = require('trek-captcha');



var setCrypto = (info)=>{
    return crypto.createHmac('sha256', '#$%$%$%')
                    .update(info)
                    .digest('hex');
}

var CreateVerify = (req,res)=>{
    return captcha().then((info)=>{
        req.session.verifyImg = info.token;
        return info.buffer;
    }).catch(()=>{
        return false;
    })
}



module.exports = {
    setCrypto,
    CreateVerify
}
