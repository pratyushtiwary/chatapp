import axios from "axios";

function useHit(base_url){
    return async function(suffix,data){
        return await new Promise((r,e)=>{
            const url = base_url+"/"+suffix;
            axios.post(url,data)
            .then((c)=>{
                r(c.data);
            })
            .catch((err)=>{
                if(err.response){
                    e(err.response.data)
                }
                else{
                    e(err);
                }
            })
        })
    }
}

export default useHit;