function userSession(username,userid,role,email,token,refreshtoken) {
    sessionStorage.setItem('username', JSON.stringify(username));
    sessionStorage.setItem('userid', JSON.stringify(userid));
    sessionStorage.setItem('role', JSON.stringify(role));
    sessionStorage.setItem('email', JSON.stringify(email));
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('refreshtoken', refreshtoken);
}

export default userSession;