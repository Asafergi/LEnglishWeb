function ValidatePass(input) {  
    let validRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,15}$/;
    return input.match(validRegex);
}

const isValidForm = (user,pass1,pass2) => {
    const ret = {
        euser: null,
        epass1: null,
        epass2: null,
        success: true
    };
    if(user.length < 3 || user.length > 9){
        ret.euser = "User name must between 3-9 characters";
        ret.success = false;
    }
    if(!ValidatePass(pass1)){
        ret.epass1 = "Password not valid";
        ret.success = false;
    }
    if(!ValidatePass(pass2) || pass2 != pass1){
        ret.epass2 = "Validation password not valid";
        ret.success = false;
    }
    return ret;
};
const secret = "speedtech";
module.exports = {
    ValidatePass,
    isValidForm,
    secret
};