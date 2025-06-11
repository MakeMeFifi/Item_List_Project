import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';

function List() {
    const [items, addItem] = useState([])
    const [input, setInput] = useState("")

    function addItemToList() {
        if(input === ""){
            return
        }else {
            fetch("http://127.0.0.1:8000/put", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": input
                })
            })
            .then(response => response.json())
            .then(data => {
                    addItem(data)
            })
        }
    }

    function setAllData() {
        fetch("http://127.0.0.1:8000/items")
        .then(response => response.json())
        .then(data => addItem(data))
    }

    useEffect(() => {
        setAllData()
    }, [])
        

    return(
        <div className='container bg-light'>
            <h1 className='col-12 text-center'>
                Einkaufsliste
            </h1>
            <div className="col-12 d-flex justify-content-center">
                <ul className='list-group-flush list-group list-group-numbered'>
                    {items.map((item,index) => (
                        <li key={index} className='list-group-item'>{item}</li> //Adds every item in the list
                    ))
                    }
                </ul>
            </div>
            <div className="col-12">
                <p>{items}</p>
            </div>
            <div className="col-12">
                <button className='btn btn-primary'onClick={() =>addItemToList()} >Item hinzufügen</button>
            </div>
            <div className="col-12">
                <button className='btn btn-danger' onClick={() =>addItem(items.slice(0, items.length - 1))}>
                    Item entfernen
                </button>
            </div>
            <div className="col-12">
                <input type='text' className='form-control' id='input' placeholder='Item hinzufügen' value={input} onChange={(event) =>setInput(event.target.value)}></input>
            </div>
        </div>
    )
}

export default List