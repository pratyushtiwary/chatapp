const error = function(res,msg){
    res.status(400).json({
        "success": false,
        "message": msg
    });
}

const success = function(res,msg){
    res.status(200).json({
        "success": true,
        "message": msg
    });
}

module.exports = {
    success,
    error
}