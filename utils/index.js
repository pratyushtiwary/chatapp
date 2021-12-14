const exists = function(listOfElems, fromElem){
    let count = 0;
    for(let i=0; i<listOfElems.length; i++){
        for(elem in fromElem){
            if(elem===listOfElems[i]){
                count = count + 1;
            }
        }
    }

    if(count === listOfElems.length){
        return true;
    }
    return false;
}

module.exports = {
    exists
}