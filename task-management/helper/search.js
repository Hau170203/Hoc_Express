module.exports = (query) => {
    // console.log(query);
    const objectSearch = {
        keyword : '',
        regex: '',
    };

    if(query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch.keyword, 'i');
        objectSearch.regex = regex;
    }

    return objectSearch;
}