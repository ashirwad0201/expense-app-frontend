var list=document.getElementById('list-items');
list.addEventListener('click' ,removeElement);

function getExpense(){
    list.innerHTML = "";
    axios.get('http://localhost:5000/get-expense')
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

window.addEventListener('DOMContentLoaded',getExpense)

function tracker(){
    var expAmount_=document.getElementById('idk1').value;
    var desc_=document.getElementById('idk2').value;
    var categ_=document.getElementById('idk3').value;
    

    let myObj={
        price: expAmount_,
        description: desc_,
        category: categ_
    };
    axios.post('http://localhost:5000/insert-expense',myObj)
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
    // var EditButton=document.createElement('button');
    // EditButton.className='btn btn-primary edit btn-sm';
    // EditButton.appendChild(document.createTextNode('Edit'));
    // newList.appendChild(EditButton);

    list.appendChild(newList);
}


function removeElement(e){
    if(e.target.classList.contains('delete')){
        if(confirm('Are you sure to delete ?')){
            var li=e.target.parentElement;
            const id=li.getAttribute('item-id')
            axios.delete(`http://localhost:5000/delete-expense/${id}`)
            .then(res=>console.log(res))
            .catch(err=>console.log(err))
            list.removeChild(li);
        }
    }
    // else if(e.target.classList.contains('edit')){
    //     var li=e.target.parentElement;
    //     const arr=li.textContent.split(" - " );
    //     var description=arr[1];
    //     localStorage.removeItem(description);
    //     document.getElementById('idk1').value=arr[0];
    //     document.getElementById('idk2').value=arr[1];
    //     document.getElementById('idk3').value=arr[2];
    //     list.removeChild(li);
    // }
}