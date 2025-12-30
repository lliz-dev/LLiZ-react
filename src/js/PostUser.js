async function postUser(userData){
    try{
        const url = `${import.meta.env.VITE_API_URL}/api/users/signup`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_name: userData.userName,  // map userName from the userData object
                user_email: userData.userEmail, // map userEmail
                user_password: userData.userPassword, // map userPassword
            })
        });

        // if(!response.ok){
        //     throw new Error("Network response was not ok.");
        //     //alert("Net Res not ok!");
        // }

        const data = await response.json();
        return data
    }
    catch(error){
        console.error(error);
    }
}

export default postUser