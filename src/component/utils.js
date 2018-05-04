

export function proxy(object, model, callback) {
    for(let item in model) {

        Object.defineProperty(object, item, {
            enumerable: true,
            get(){return model[item]},
            set(val){
                model[item] = val;
                callback();
            }
        })
    }
}