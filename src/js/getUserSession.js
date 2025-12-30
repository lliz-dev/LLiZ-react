function getUserSession() {
    const user ={
        username: sessionStorage.getItem('username'),
        userid:sessionStorage.getItem('userid'),
        role:sessionStorage.getItem('role')
    }

    return user;
}

export default getUserSession;