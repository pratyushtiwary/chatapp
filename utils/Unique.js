const Unique = {}
Unique.init = (...initialValues)=>{
    let vals = [];
    vals = [...initialValues];
    const l = {};
    l.add = (newValue)=>{
        let temp = vals;
        if(temp.length > 0){
            let duplicFound = false;
            temp = temp.map((e,i)=>{
                if(
                    (e[0] === newValue[0] || e[0] === newValue[1]) &&
                    (e[1] === newValue[0] || e[1] === newValue[1])
                ){
                    duplicFound = true;
                    if(e[2] > newValue[2]){
                        return e
                    }
                    else{
                        return newValue;
                    }
                }
                else{
                    return e;
                }
            });
            if(!duplicFound){
                temp.push(newValue);
            }
            vals = temp;
        }
        else{
            vals.push(newValue);
        }
       
    }
    l.fetchVals = ()=>{
        return vals
    }
    l.whereNot = (val)=>{
        let k = vals.map((e,i)=>{
            if(e[0] !== val){
                return e[0];
            }
            return e[1];
        })
        return k;
    }
    return l;
}

module.exports = Unique;