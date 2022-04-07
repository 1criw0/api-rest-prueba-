import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import AuthService from "../pages/api/services/auth.service";
import swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/router";
const Navbar = () => {
  const [abrir, setAbrir] = useState(false);
  const router=useRouter();
  const cambio1=()=>{
    setAbrir(false)
  }
  const cambio2=()=>{
    setAbrir(true) 
  }
  if (typeof window !== "undefined") {
  const name_user= JSON.parse(localStorage.getItem("user"));
  if (name_user !==null && name_user !==''){
    var name_use=name_user.name_user;
  }else{
    var name_use=""
  }

  }else{
    var name_use=""
  }
  async function logaout(){
try {
  await AuthService.logout().then(
    () => {
      new swal({
        title: "sesion finalizada!",
        text: "Hasta pronto!",
        icon: "success",
        timer:"1200"
      });
      const timer = setTimeout(() => {
        router.push("/inicio");
      }, 100);
      return () => clearTimeout(timer);
      
    },
    (error) => {
     new swal({
        title: "error!",
        text: "No se pudo ceerrar sesion,por favor vuelva  a intentarlo!",
        icon: "error",
        timer:"2000"
      });
    }
  );
} catch (err) {
  new swal({
    title: "error!",
    text: "No se pudo ceerrar sesion,por favor vuelva  a intentarlo!",
    icon: "error",
    timer:"2000"
  });
}
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link href="/inicio">
          <a className="navbar-brand">Inicio</a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link href="/asesor">
                <a className="nav-link active" aria-current="page">
                  Aseores
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/users">
                <a className="nav-link">Usuarios</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="cont-logoout" onClick={abrir==true?() =>cambio1():() =>cambio2()}>
          <div className="icnono">{name_use !==''?name_use.substring(0, 1):null}</div>
          {abrir==true?
          <div className="mostarr-log">
            <div className="mostarr-options">{name_use}</div>
            <div className="mostarr-options ccvcc" onClick={logaout}>Cerrar Session</div>
          </div>
          :null}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
