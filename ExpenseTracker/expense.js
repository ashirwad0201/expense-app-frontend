var list=document.getElementById('list-items');
var incomelist=document.getElementById('list-income-items');
var downloadlist=document.getElementById('list-downloads');
var leaderboardList=document.getElementById('list-items2');
var pagination=document.getElementById('paginate-expense');
list.addEventListener('click' ,removeElement);
incomelist.addEventListener('click' ,removeElement);
const token=localStorage.getItem('token');
var isPremium=false;

function itemsPerPage(){
    console.log("hi")
    const noOfItems=document.getElementById('idk11').value;
    console.log(noOfItems)
    localStorage.setItem('itemsPerPage',noOfItems)
    getExpense(1)
}
function getExpense(page){
    console.log("hi i am token")
    console.log(token)
    list.innerHTML = "";
    axios.get(`http://localhost:5000/get-expense/?page=${page}&itemsPerPage=${localStorage.getItem('itemsPerPage')}`,{headers:{"authorization": token}})
    .then(
        (response)=>{
            for(var i=0;i<response.data.expenses.length;i++){
                showData(response.data.expenses[i]);
            }
            console.log(response.data)
            showPagination(response.data)
        }
    )
    .catch(
        (err)=>console.log(err)
    )
}
function getSalary(){
    const page=1;
    incomelist.innerHTML = "";
    axios.get(`http://localhost:5000/get-income/?page=${page}`,{headers:{"authorization": token}})
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
function getDownload(){
    console.log("hi i am token")
    console.log(token)
    axios.get('http://localhost:5000/premium/getdownload',{headers:{"authorization": token}})
    .then(
        (response)=>{
            for(var i=0;i<response.data.length;i++){
                showDownload(response.data[i]);
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
    document.getElementById('idk11').value=localStorage.getItem('itemsPerPage')||2;
    getExpense(1);
    getSalary();
    getDownload();
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
    if(categ_=="salary"){
        axios.post('http://localhost:5000/insert-income',myObj,{headers:{"authorization": token}})
        .then((res)=>{
            console.log("about to print salary")
            getSalary();
        })
        .catch((err)=>console.log(err));
    }
    else{
        axios.post('http://localhost:5000/insert-expense',myObj,{headers:{"authorization": token}})
        .then((res)=>getExpense())
        .catch((err)=>console.log(err));
    }
} 
function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
}){
    pagination.innerHTML='';
    if(hasPreviousPage){
        const btn2=document.createElement('button')
        btn2.innerHTML=previousPage;
        btn2.addEventListener('click',()=>getExpense(previousPage))
        pagination.appendChild(btn2)
    }
    const btn1=document.createElement('button')
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener('click',()=>getExpense(currentPage))
    pagination.appendChild(btn1)
    console.log(hasNextPage);
    console.log(hasPreviousPage)
    if(hasNextPage){
        console.log("i am in")
        const btn3=document.createElement('button')
        btn3.innerHTML=nextPage;
        btn3.addEventListener('click',()=>getExpense(nextPage))
        pagination.appendChild(btn3)
    }
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
    newList.setAttribute('item-price',myObj.price);
    newList.setAttribute('item-category',myObj.category);
    if(myObj.category=="salary"){
        incomelist.appendChild(newList);
    }
    else{
        list.appendChild(newList);
    }
}

function showDownload(myObj){
    console.log(myObj)
    var newList=document.createElement('li');
    newList.className="list-group-item"
    var a=document.createElement("a");
    a.href=myObj.url;
    a.appendChild(document.createTextNode(myObj.url));
    var text=myObj.name+" : "
    newList.appendChild(document.createTextNode(text));
    newList.appendChild(a)
    downloadlist.appendChild(newList);
}



function removeElement(e){
    if(e.target.classList.contains('delete')){
        if(confirm('Are you sure to delete ?')){
            var li=e.target.parentElement;
            const id=li.getAttribute('item-id')
            const amount=li.getAttribute('item-price')
            const categ=li.getAttribute('item-category')
            console.log("amount-"+amount)
            if(categ=="salary"){
                axios.delete(`http://localhost:5000/delete-income/${id}`,{params: {amount : amount},headers:{"authorization": token}})
                .then(res=>console.log(res))
                .catch(err=>console.log(err))
                incomelist.removeChild(li);
            }
            else{
                axios.delete(`http://localhost:5000/delete-expense/${id}`,{params: {amount : amount},headers:{"authorization": token}})
                .then(res=>console.log(res))
                .catch(err=>console.log(err))
                list.removeChild(li);
            }
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
        var text='Name- '+user.username+' Total Expense- '+(user.totalexpense || 0);
        newList.appendChild(document.createTextNode(text));
        leaderboardList.appendChild(newList);       
    });
    document.getElementById('idk10').style.display='block';
    console.log(leaderboard)
}

async function report(){
    const input=document.getElementById('idk8').value;
    const year=input.substring(0,4);
    const month=input.substring(5,7);
    const url=`../Premium/premium.html?year=${year}&month=${month}`;
    window.location.href=url;
}