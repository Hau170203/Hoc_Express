const User = require("../api/v1/model/user.model");

module.exports.requireAuth = async (req, res, next) => {
    try {
        if(req.headers.authorization){
            const token = req.headers.authorization.split(" ")[1];
            // console.log(token);
            const user = await User.findOne({
                token: token,
                deleted: false
            }).select(' -password -token');
    
    
            if(!user) {
                res.json({
                    code: 400,
                    message: "Tài khoản không hợp lệ!"
                });
                return;
            }
    
            req.user = user;
            next();
        } else{
            res.json({
                code: 400,
                message: "Vui lòng chuyền theo token"
            })
        }
       
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        })
    }
}