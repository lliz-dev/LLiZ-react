async function sendEmail(emailData){
   try{
      const url =`${import.meta.env.VITE_API_URL}/api/users/edit/forgotemail`;
      const response = await fetch(url,{
         method: "POST",
         headers:{
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${sessionStorage.getItem('token')}`
         },
         body: JSON.stringify({
            email: emailData,
         })
      });

      if(!response.ok){
         throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log('Success:', data);
      alert('Email Sent. Please check your inbox.')
      return data;
   }
   catch(error){
      console.error(error);
   }
}

async function alterEmail(emailData){
   try{
      const url =`${import.meta.env.VITE_API_URL}/api/users/edit/resetemail`;
      const response = await fetch(url,{
         method: "POST",
         headers:{
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${sessionStorage.getItem('token')}`
         },
         body: JSON.stringify({
                resetCode:emailData.code,
                newEmail: emailData.newEmail,
                userId:emailData.userId
         })
      });
      console.log(response);

      if(!response.ok){
         throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      alert('Your email has been changed successfully.')
      return data;
   }
   catch(error){
      console.error(error);
      alert('Error changing email. Please try again.')
   }
}

export {sendEmail, alterEmail};