async function getBlogs(){
    try{
        const url = `${import.meta.env.VITE_API_URL}/api/blogs`;
        const response = await fetch(url,{
            method: "GET",
            mode:"cors",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(response.ok){
            return await response.json();
        }
            return null;
    }
    catch(error){
        console.error(error);
        return null;
    }
}

export default getBlogs;