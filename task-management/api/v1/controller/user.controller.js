const Random = require("../../../helper/Random");
const sendMail = require("../../../helper/sendMail");
const forgotPassword = require("../model/forgotPassword.model");
const User = require("../model/user.model");
const md5 = require('md5');


module.exports.register = async (req, res) => {
    try {
        // console.log(req.body);

        const data = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        // console.log(data);
        if (data) {
            res.json({
                code: 400,
                message: "Email đã tồn tại"
            });
        } else {
            req.body.password = md5(req.body.password);
            req.body.token = Random.string(20);
            const user = new User(req.body);
            await user.save();

            const token = user.token;

            res.cookie('token', token);

            res.json({
                code: 200,
                message: "Tạo tài khoản thành công",
                token: token
            })
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "error"
        })
    }
}

module.exports.login = async (req, res) => {
    try {
        // console.log(req.body);
        const email = req.body.email;
        const password = md5(req.body.password);

        const user = await User.findOne({
            email: email,
            deleted: false
        });

        if (user) {
            if (user.password === password) {
                const token = user.token;
                res.cookie('token', token)
                res.json({
                    code: 200,
                    message: "Đăng nhập thành công",
                    token: token
                })
            } else {
                res.json({
                    code: 400,
                    message: "Mật khẩu sai!",
                });
                return;
            }
        } else {
            res.json({
                code: 400,
                message: "Email không đúng!",
            });
            return;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
}

module.exports.forgot = async (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const user = await User.findOne({
            email: email,
            deleted: false
        });

        console.log(user);
        if (!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại"
            });
            return;
        }

        const otp = Random.number(8);
        // console.log(otp)

        const timeExpire = 5;

        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now() + timeExpire * 60
        }

        console.log(objectForgotPassword);

        const object = new forgotPassword(objectForgotPassword);
        await object.save();

        console.log(object);

        const subject = "Mã OTP xác minh để lấy lại mật khẩu";
        let html = `
        Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Chỉ có hiệu lực trong vòng ${timeExpire}). 
        Vui lòng không chia sẻ mã cho bất kỳ ai.`;

        sendMail(email, subject, html);


        res.json({
            code: 200,
            message: "Ok"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "error"
        })
    }
}

module.exports.checkOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const result = await forgotPassword.findOne({
            email: email,
            otp: otp
        });

        if (!result) {
            res.json({
                code: 400,
                message: "OTP không chính xác!"
            });
            return;
        }

        const user = await User.findOne({
            email: email,
            deleted: false
        });

        const token = user.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Xác thực OTP thành công",
            token: token
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "lỗi"
        })
    }
}

module.exports.resetPassword = async (req, res) => {
    try {
        const token = req.cookies.token;
        const password = req.body.password;

        const result = await User.findOne({
            token: token
        })

        if (md5(password) === result.password) {
            res.json({
                code: 400,
                message: "Vui lòng nhập mật khẩu khác với mật khẩu cũ"
            });
            return
        };

        await User.updateOne({
            token: token
        }, {
            password: md5(password)
        })
        res.json({
            code: 200,
            message: 'Cập nhật mật khẩu mới thành công'
        })
    } catch (error) {
        res.json({
            code: 400,
            message: 'lỗi'
        })
    }
};


module.exports.detail = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            code: 200,
            message: "Ok",
            user: user
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        })
    }
};

module.exports.list = async (req, res) => {
    try {
        const listUser = await User.find({
            deleted: false
        }).select(" fullName email");
        if(!listUser){
            res.json({
                code: 400,
                message: "Không tìm thấy bản ghi nào "
            });
            return
        };

        res.json({
            code: 200,
            message: "Thành công",
            list: listUser
        })
    } catch (error) {
        res.json({
            code:200,
            message: "Lỗi"
        })
    }
}