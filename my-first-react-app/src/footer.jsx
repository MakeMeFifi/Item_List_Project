import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
    return(
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <p className="col-md-4 mb-0 text-muted">{new Date().getFullYear()}</p>
        </footer>
    )
}

export default Footer