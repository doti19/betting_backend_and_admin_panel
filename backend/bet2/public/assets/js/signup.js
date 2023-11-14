const signup = async(name, email, password, passwordConfirm, role) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/geez/api/v1/users/signup',
            data: {
                role: role,
                name: name,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm,
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'signUp Successful');
            window.setTimeout(() => {
                location.assign('/geez/admin/login');
            }, 1000);
        }
    } catch (err) {
        showAlert('danger', err.response.data.message);
    }
}
document.querySelector('.userSignUp').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('inputNameSignUp').value;
    const email = document.getElementById('inputEmailSignUp').value;
    const password = document.getElementById('inputPasswordSignUp').value;
    const passwordConfirm = document.getElementById('inputPasswordConfirmSignUp').value;
    const role = document.getElementById('roleSelectSignUp').value;
    signup(name, email, password, passwordConfirm, role);
});