var filetypes = {
    "txt": "text/plain",
    "html": "text/html",
    "js": "text/plain",
    "css": "text/plain",
    "png": "image/png",
    "jpg": "image/jpg",
    "jepg": "image/jpg",
    "ico": "image/x-icon",
    "gif": "image/gif"
 };

exports.ext = function(filePath){
    var extention = filePath.match(/\.[a-zA-Z]{2,4}$/);
    if (extention === null){
        console.log("ext is non-match");
        return "text/plain";
    } else {
        extention = extention[0].substr(1);
        console.log("ext " + extention);
        var result =  filetypes[extention];
        if(result !== null){
            return(result);
        } else {
            return "text/plain";
        }
    }
}