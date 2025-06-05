import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import logo from  './assets/react.svg'
import {useState} from 'react'

function Header () {
    const [count, updateCount] = useState(0)
    return(
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark"> 
            <div className='container-fluid'>
                <a className="navbar-brand" href="#">
                    <img src={logo} width="30" height="30" alt=""></img>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#lol" aria-controls="lol" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className='collapse navbar-collapse' id='lol'>
                    <div className='navbar-nav'>
                        <a className="nav-link nav-item active" aria-current="page" href="#">Übersicht</a>
                        <a className="nav-link nav-item" href="#">Listen</a>
                        <a className="nav-link nav-item" href="#">Hilfe</a>
                        <a className="nav-link nav-item" href="#">Einstellungen</a>
                        <a className="nav-link nav-item" href="#" onClick={() => updateCount(count + 1)}>{count}</a>
                    </div>
                </div>
            </div>
        </nav>   
    )
}

export default Header