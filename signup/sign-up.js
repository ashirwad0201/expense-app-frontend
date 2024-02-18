function onSignUp(){
    var username_=document.getElementById('id1').value;
    var email_=document.getElementById('id2').value;
    var password_=document.getElementById('id3').value;

    let myObj={
        username: username_,
        email: email_,
        password: password_
    }
    console.log(myObj)
    if(username_!='' && email_!='' && password_!=''){
        axios.get(`http://localhost:5000/get-user/${email_}`)
        .then(result=>{
            console.log(result)
            if(result.data==""){
                axios.post('http://localhost:5000/insert-user',myObj)
                .then((res)=>{
                    console.log(res)
                    alert("Account created successfully")
                })
                .catch(err=>console.log(err));
            }
            else{
                alert("User already exists")
            }

        })
        .catch(err=>console.log(err))
    }
}