var list=document.getElementById('list-items');
var leaderboardList=document.getElementById('list-items2');
list.addEventListener('click' ,removeElement);
const token=localStorage.getItem('token');
var isPremium=false;

function getExpense(){
    console.log("hi i am token")
    console.log(token)
    list.innerHTML = "";
    axios.get('http://localhost:5000/get-expense',{headers:{"authorization": token}})
    .then(
        (response)=>{
            for(var i=0;i<response.data.length;i++){
                showData(response.data[i]);
            }
        }
    )
    .catch(
        (err)=>console.log(err)
    )
}

window.addEventListener('DOMContentLoaded',()=>{
    axios.post('http://localhost:5000/ispremium',{},{headers:{"authorization": token}})
    .then((res)=>{
        if(res.data.isPremium===true){
            document.getElementById('idk5').style.display='none';
            document.getElementById('idk6').style.display='block';
        }
    })
    .catch((err)=>console.log(err));    
    getExpense();
    })

function tracker(){
    var expAmount_=document.getElementById('idk1').value;
    var desc_=document.getElementById('idk2').value;
    var categ_=document.getElementById('idk3').value;
    

    let myObj={
        price: expAmount_,
        description: desc_,
        category: categ_
    };
    console.log("hi i am post token")
    console.log(token)
    axios.post('http://localhost:5000/insert-expense',myObj,{headers:{"authorization": token}})
    .then((res)=>getExpense())
    .catch((err)=>console.log(err));
} 

function showData(myObj){
    console.log(myObj)
    var newList=document.createElement('li');
    newList.className="list-group-item"
    var text=myObj.price+" - "+myObj.description+" - "+myObj.category+" - ";
    newList.appendChild(document.createTextNode(text));
    var delButton=document.createElement('button');
    delButton.className="btn btn-danger btn-sm delete";
    delButton.appendChild(document.createTextNode('Delete'));
    newList.appendChild(delButton);
    newList.setAttribute('item-id',myObj.id);

    list.appendChild(newList);
}


function removeElement(e){
    if(e.target.classList.contains('delete')){
        if(confirm('Are you sure to delete ?')){
            var li=e.target.parentElement;
            const id=li.getAttribute('item-id')
            axios.delete(`http://localhost:5000/delete-expense/${id}`,{headers:{"authorization": token}})
            .then(res=>console.log(res))
            .catch(err=>console.log(err))
            list.removeChild(li);
        }
    }
}

document.getElementById('idk5').onclick = async function(e){
    const token=localStorage.getItem('token');
    const response= await axios.get('http://localhost:5000/premiummembership',{headers:{"authorization": token}});
    console.log(response);
    var options=
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response){
            await axios.post('http://localhost:5000/updatetransactionstatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            },{headers:{"authorization": token}})
            alert("You are a premium user now")
            document.getElementById('idk5').style.display='none';
            document.getElementById('idk6').style.display='block';
        }
    };
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment failed',function(response){
        console.log(repsonse)
        alert('Something went wrong')
    });
}

document.getElementById('idk7').onclick = async function(e){
    console.log("I am in")
    const leaderboard=await axios.get('http://localhost:5000/premium/get-leaderboard')
    leaderboard.data.forEach(user => {
        var newList=document.createElement('li');
        newList.className="list-group-item"
        var text='Name- '+user.name+' Total Expense- '+user.amount;
        newList.appendChild(document.createTextNode(text));
        leaderboardList.appendChild(newList);       
    });
    document.getElementById('idk8').style.display='block';
    console.log(leaderboard)
}



// Function to open the popup
function openPopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'block';
}

// Function to close the popup
function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
}