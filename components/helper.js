export function unique(data,newdata,commonAttr){
    let temp = data.map((e,i)=>{
        if(e[commonAttr]===newdata[commonAttr]){
            return newdata
        }
        return e;
    })
    return temp;
}

export function search(data,searchVal,attr){
    let found = 0;
    let item = {};
    for(let i = 0; i < data.length; i++){
        if(data[i][attr] === searchVal){
            found = 1;
            item = data[i];
            break;
        }
    }
    if(found){
        return item;
    }
    else{
        return false;
    }
}