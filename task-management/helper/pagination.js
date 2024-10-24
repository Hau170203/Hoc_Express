module.exports = (pagination,count, query) => {
    // console.log(query);
    if(query.page ) {
        pagination.currentPage = parseInt(query.page);
    };

    if(query.limit){
        pagination.limitPage = parseInt(query.limit);
    };

    pagination.skipRecord = (pagination.currentPage - 1) * pagination.limitPage;
    // số lượng trang
    pagination.countPage = Math.ceil(count / pagination.limit);

    return pagination;
}