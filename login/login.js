function onLogin(){
    var email_=document.getElementById('idx1').value;
    var password_=document.getElementById('idx2').value;
    let myObj={
        email: email_,
        password: password_
    }
    if(email_!='' && password_!=''){
        axios.post('http://localhost:5000/login-user',myObj)
        .then((res)=>{
            console.log(res)
            alert(res.data)
            window.location.href="../ExpenseTracker/expense.html"
        })
        .catch(err=>{
            alert(err.response.data)
        }); 
    }
}