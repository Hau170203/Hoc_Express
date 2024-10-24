module.exports = (req, res, next) => {
    if(!req.body.fullName){
        res.json({
            message: 'Vui lòng nhập họ tên!'
        });
        return;
    };
    if(!req.body.email){
        res.json({
            message: 'Vui lòng nhập email!'
        });
        return;
    };
    if(!req.body.password){
        res.json({
            message: 'Vui lòng nhập password!'
        });
        return;
    };

    next();
}