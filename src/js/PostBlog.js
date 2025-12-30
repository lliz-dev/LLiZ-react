async function postBlog(blogData){


   try{
      const url =`${import.meta.env.VITE_API_URL}/api/blogs`;
      const response = await fetch(url,{
         method: "POST",
         headers:{
            "Content-Type": "application/json",
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
         },
         body: JSON.stringify({
            title: blogData.title,
            content: blogData.content,
            author:blogData.author,
            authorId:blogData.authorid,
            tags:blogData.tags
         })
      });

      if(!response.ok){
         throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log('Success:', data);
      alert('Success: Blog Posted')
      return data;
   }
   catch(error){
      console.error(error);
   }
}

export default postBlog;