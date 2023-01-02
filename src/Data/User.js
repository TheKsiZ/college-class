const User = class {
    constructor(options){        
        this.email = options.email;
        this.firstName = options.firstName;
        this.lastName = options.lastName;
    }
    set email(value){
        this.email = value;
    }
    get email() {
        return this.email;
    }
    set firstName(value){
        this.firstName = value;
    }
    get firstName(){
        return this.firstName;
    }
    set lastName(value){
        this.lastName = value;
    }
    get lastName(){
        return this.lastName;
    }
}

export default User;