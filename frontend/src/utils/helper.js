import validator from 'email-validator';

export const validateEmail = (email) => {
    return validator.validate(email);
}



export const getInitials = (name)=>{
    const words = name.split(" ")
    let initials=""
    if(words.length === 0) return initials
    initials+=words[0][0]
    if(words.length > 1){
        initials += words[words.length-1][0]
    }

    return initials
}