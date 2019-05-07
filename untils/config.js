const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
let Mongoose = {
    url:'mongodb://localhost:27017/miao',
    connect(){
        mongoose.connect(this.url,{useNewUrlParser:true},(err)=>{
            if(err){
                console.log('数据库连接失败');
                return;
            }
            console.log('数据库连接成功');
        })
    }
}

var Email = {
    config:{
        host: "smtp.qq.com",
        port: 587,
        auth: {
            user: '750224@qq.com', 
            pass: 'utaamsyeitfebjcf' 
        }
    },
    get transporter (){
        return nodemailer.createTransport(this.config);
    },
    get verify(){
        return Math.random().toString().substring(2,6);
    },
    get time(){
        return Date.now();
    }
}

var userImg = {
    baseUrl :'http://localhost:3000/upload/default.jpg'
}

module.exports = {
    Mongoose,
    Email,
    userImg
}



