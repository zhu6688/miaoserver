

var { Email,userImg} = require('../untils/config.js');
var UserModel = require('../models/users.js');
var { setCrypto , CreateVerify } = require('../untils/base.js');
var fs = require('fs');
var url = require('url');

var login = async(req,res,next)=>{
    var {username,password,verifyImg} = req.body;

    if(verifyImg!==req.session.verifyImg){
        res.send({
            msg:'验证码不正确',
            status:-1
        })
        return;
    }

    var result = await UserModel.findLogin({
        username,
        password:setCrypto(password),
    });

    if(result){
        req.session.username = username;
        req.session.isAdmin = result.isAdmin;
        req.session.userImg = result.userImg;
        if(result.isFreeze){
            res.send({
                msg:'账号已冻结',
                status:-2
            })
        }else{
            res.send({
                msg:'登录成功',
                status:0
            })
        }
    }else{
        res.send({
            msg:'用户名或密码不正确',
            status:2
        })
    }


}

var register = async(req,res,next)=>{
    var { username,password,email,verify } = req.body;
    if(email!==req.session.email||verify!==req.session.verify){
        res.send({
            msg:'验证码错误',
            status:-1
        })
        return;
    }

    if( (Email.time-req.session.time)/1000 > 60 ){
        res.send({
            msg:'验证码已过期',
            status:-3
        })
        return
    }

    var result = await UserModel.save({
        username,
        password:setCrypto(password),
        email
    })
    if(result){
        res.send({
            msg:'注册成功',
            status:0
        })
    }else{
        res.send({
            msg:'注册失败',
            status:2
        })
    }
}

// 发送邮箱验证码
var verify = async(req,res,next)=>{
    var email = req.query.email;
    var verify = Email.verify;
    req.session.verify = verify;
    req.session.email = email;
    req.session.time = Email.time;
    let mailOptions = {
        from: '330750224@qq.com', // sender address
        to: email, // list of receivers
        subject: "自己的测试邮箱", // Subject line
        text: "验证码"+verify, // plain text body
    }
    Email.transporter.sendMail(mailOptions,(err)=>{
        if(err){
            res.send({
                msg:'验证码发送失败',
                status:-1
            })
        }else{
            res.send({
                msg:'验证码发送成功',
                status:0
            })
        }
    });
}

var logout = async(req,res,next)=>{
    req.session.username = '';
    res.send({
        msg:'退出成功',
        status:0
    })
}

var getUser = async(req,res,next)=>{
    if(req.session.username){
        res.send({
            msg:'获取用户信息成功',
            status:0,
            data:{
                username:req.session.username,
                isAdmin:req.session.isAdmin,
                userImg:req.session.userImg
            }
        })
    }else{
        res.send({
            msg:'获取用户信息失败',
            status:-1,
        })
    }
}

var findPassword = async(req,res,next)=>{
    var { email,password,verify } = req.body;
    if(email===req.session.email&&verify===req.session.verify){
        var result = await UserModel.UpdatePassword(email,setCrypto(password));
        if(result){
            res.send({
                msg:'修改密码成功',
                status:0
            })
        }else{
            res.send({
                msg:'修改密码失败',
                status:-1
            })
        }
    }else{
        res.send({
            msg:'验证码失败',
            status:-1
        })
    }
}


var verifyImg = async (req,res,next)=>{
    var result = await CreateVerify(req,res);
    if(result){
        res.send(result);
    }
}



var updateUserHead = async (req,res,next)=>{
    console.log(req.file);
    await fs.rename( 'public/upload/'+ req.file.filename ,'public/upload/'+req.session.username+'.jpg',()=>{

    } );

    var result = await UserModel.updateUserImg(req.session.username,url.resolve(userImg.baseUrl,req.session.username+'.jpg'))
    if(result){
        res.send({
            msg:'头像修改成功',
            status:0,
            data:{
                userImg:url.resolve(userImg.baseUrl,req.session.username+'.jpg')
            }
        })
    }else{
        res.send({
            msg:'头像上传失败',
            status:-1,
        })
    }
}



module.exports = {
    login,
    register,
    verify,
    logout,
    getUser,
    findPassword,
    verifyImg,
    updateUserHead
}
