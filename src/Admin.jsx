import BlogMaker from "./Screens/BlogStuff/BlogMaker.jsx";
import Unauth from "./Unauth.jsx";

function Admin(){

    if(JSON.parse(sessionStorage.getItem('role')) != 'admin'){
        return (
            <Unauth></Unauth>
        )
    }
    else{
        return (
            <>
                <>
                <BlogMaker></BlogMaker>
            </>
            </>
        )
    }

}

export default Admin;