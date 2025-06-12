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
                    "name": input,
                    "number":1,
                    "user": "Test",
                    "location": "Test"
                })
            })
            .then(response => response.json())
            .then(data => {
                    addItem(data)
                    setInput("")
            })
        }
    }

    function setAllData() {
        fetch("http://127.0.0.1:8000/items")
        .then(response => response.json())
        .then(data => addItem(data))
    }

    function deleteLastItem() {
        fetch("http://127.0.0.1:8000/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => addItem(data))
    }

    function deleteItem(item) {
        fetch("http://127.0.0.1:8000/delete_item", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": item
            })
        })
        .then(response => response.json())
        .then(data => addItem(data))
    }

    function deleteAllData() {
        fetch("http://127.0.0.1:8000/delete_all", {
            method: "DELETE",
        })
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
            <div className="col-12 d-flex justify-content-center flex-column align-items-center">
                    {items.map((item,index) => (
                        <ul className='list-group-flush list-group list-group-horizontal'>
                            <li key={index} className='list-group-item d-flex align-items-center'>{item.name}</li>
                            <li className='list-group-item'>
                                <button className='btn btn-danger' onClick={() => deleteItem(item.name)} >Delete</button>
                            </li>
                        </ul>
                    ))
                    }
            </div>
            <div className="col-12">
                <button className='btn btn-primary'onClick={() =>addItemToList()} >Item hinzufügen</button>
            </div>
            <div className="col-12">
                <button className='btn btn-warning' onClick={() =>deleteLastItem()}>
                    letztes Item entfernen
                </button>
            </div>
            <div className="col-12">
                <button className='btn btn-danger' onClick={() => deleteAllData()}>Alles löschen</button>
            </div>
            <div className="col-12">
                <input type='text' className='form-control' id='input' placeholder='Item hinzufügen' value={input} onChange={(event) =>setInput(event.target.value)}></input>
            </div>
        </div>
    )
}

export default List