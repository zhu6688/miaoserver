
var mongoose = require('mongoose');
var { userImg } = require('../untils/config.js');
var url = require('url');

mongoose.set('useCreateIndex',true);


var UserSchema = new mongoose.Schema({
    username : {type:String,required:true,index:{unique:true}},
    password : {type:String,required:true},
    email : {type:String,required:true,index:{unique:true}},
    date:{ type:Date,default:Date.now()},
    isAdmin:{ type:Boolean,default:false }, // 是否是管理员
    isFreeze:{ type:Boolean,default:false }, // 冻结账号
    userImg:{ type:String,default:url.resolve(userImg.baseUrl,'default.jpg') }
})

var UserModel = mongoose.model('user',UserSchema);
UserModel.createIndexes();

var save = (data)=>{
    var user = new UserModel(data);
    return user.save().then(()=>{
        return true;
    }).catch(()=>{
        return false;
    })
};

var findLogin = (data)=>{
    return UserModel.findOne(data);
}

var UpdatePassword = (email,password)=>{
    return UserModel.update({email},{$set:{password}}).then(()=>{
        return true;
    }).catch(()=>{
        return false;
    })
}

var usersList = ()=>{
    return UserModel.find();
}

// 更新冻结账户
var updateFreeze = (email,isFreeze)=>{
    return UserModel.update({email},{$set:{isFreeze}}).then(()=>{
        return true;
    }).catch(()=>{
        return false;
    })
}


var deleteUser = (email)=>{ 
    return UserModel.deleteOne({email});
}

var updateUserImg = (username,userImg)=>{
    return UserModel.update({username},{$set:{userImg}}).then(()=>{
        return true;
    }).catch(()=>{
        return false;
    })
}


module.exports = {
    save,
    findLogin,
    UpdatePassword,
    usersList,
    updateFreeze,
    deleteUser,
    updateUserImg
};






