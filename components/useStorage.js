function useStorage(){
    let isBrowser = typeof window !== 'undefined';

    const funcs = {};

    funcs.get = (key) => {
        if(isBrowser){
            return window.localStorage.getItem(key);
        }
    }

    funcs.set = (key, value) => {
        if(isBrowser){
            if(typeof value === 'object'){
                window.localStorage.setItem(key, JSON.stringify(value));
            }
            else{
                window.localStorage.setItem(key, value);
            }
        }
    }

    funcs.remove = (key) => {
        if(isBrowser){
            window.localStorage.removeItem(key);
        }
    }

    return funcs;

}

export default useStorage;