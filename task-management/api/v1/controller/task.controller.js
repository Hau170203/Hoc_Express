const Task = require('../model/task.model');
const helperPagination = require('../../../helper/pagination');
const searchHelper = require('../../../helper/search');

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {

    const find = {
        deleted: false,
        $or: [
            {createBy: req.user.id},
            {listUser: req.user.id}
        ]
    };
    // console.log(req.query);

    // find keyword
    const search = searchHelper(req.query);

    // console.log(search);

    if (search.regex) {
        find.title = search.regex;
    }

    // end find keyword


    // find status
    if (req.query.status) {
        find.status = req.query.status;
    }
    // end find status

    // sort
    const sort = {

    }
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // end sort

    // Phân trang
    const pagination = {
        limitPage: 2,
        CurrentPage: 1
    };

    // -- số lượng bản ghi
    const count = await Task.countDocuments();
    // console.log(count);

    const paginationPage = helperPagination(pagination, count, req.query)


    // end Phân trang

    const tasks = await Task.find(find).sort(sort).limit(paginationPage.limitPage).skip(paginationPage.skipRecord);
    // console.log(tasks)
    res.json(tasks);
}



// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false
        })
        // console.log(tasks)
        res.json(task)
    } catch (error) {
        res.json("K có data");
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id

        await Task.updateOne({ _id: id }, { status: req.body.status })

        res.json({
            code: 200,
            messager: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
        res.json({
            code: 404,
            messager: "Cập nhật trạng thái không thành công"
        });
    }
};

module.exports.changeMulti = async (req, res) => {
    // console.log(req.body);
    const {ids, key, value} = req.body;

    switch (key) {
        case 'status':
            await Task.updateMany({
                _id: {$in: ids},
            },{
                status: value
            })
            res.json({
                code:200,
                messager: 'Cập nhật thành công'
            })
            break;
        
        case 'delete':
            await Task.updateMany({
                _id: {$in: ids}
            },{
                deleted: true,
                deletedAt: new Date()
            });
            res.json({
                code:200,
                messager: 'Xóa thành công thành công'
            })
            break;
        default:
            res.json({
                code:404,
                messager: 'Cập nhật không thành công'
            })
            break;
    }

    
}

module.exports.create = async  (req, res) => {
    try {
        // console.log(req.user.id);
        req.body.createBy = req.user.id;
        // console.log(req.body);
        if(req.body){
            const record = new Task(req.body);
            const data = await record.save();
            res.json({
                code: 200,
                messager: "Tạo thành công",
                data: data
            })
        }
    } catch (error) {
        res.json({
            code: 404,
            messager: "Tạo không thành công"
        })
    }
}

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        if(req.body) {
            await Task.updateOne({_id:id},req.body)
            res.json({
                code: 200,
                messager: "Cập nhật thành công"
            })
        }
    } catch (error) {
        res.json({
            code:400,
            messager: "Cập nhật không thành công"
        })
    }
}

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({_id: id},{deleted: true, deletedAt: new Date()});
        res.json({
            code: 200,
            messager: "Xóa thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            messager: "Xóa không thành công"
        })
    }
}