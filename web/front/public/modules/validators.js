export function validateFIO(fio) {
    return fio !== '';
}

export function matchPasswords(password, repeatPassword) {
    return password === repeatPassword;
}

export function validateEmail(email) {
    return email.includes('@');
}