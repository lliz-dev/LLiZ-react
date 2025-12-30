function updatedUserSession(username,userid,email) {
    sessionStorage.setItem('username', JSON.stringify(username));
    sessionStorage.setItem('userid', JSON.stringify(userid));
    sessionStorage.setItem('email', JSON.stringify(email));
}

export default updatedUserSession;