import Layout from "../components/Layout";
import Link from "next/link";
import "./api/services/auth.service";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Inicio() {
  return (
    <Layout>
      <div className="titulo-inicio-k">konecta gestion</div>
      <section className="cards-wrapper">
        <Link href="/asesor">
          <div className="card-grid-space">
            <a
              className="carddd"
              style={{
                backgroundImage:
                  " url('https://cdn.pixabay.com/photo/2018/07/25/08/59/business-3560933_960_720.jpg')",
              }}
            >
              <div className="container-info-oppp"></div>
              <div className="conteee-infooooo">
                <h1>Asesores</h1>
                <p>Observa,crea,edita y/o elimina a los asesores de konecta</p>
              </div>
            </a>
          </div>
        </Link>
        <Link href="/users">
        <div className="card-grid-space">
          <a
            className="carddd"
            style={{
              backgroundImage:
                " url('https://cdn.pixabay.com/photo/2020/03/18/08/01/christmas-4943133_960_720.jpg')",
            }}
          >
            <div className="container-info-oppp"></div>
            <div className="conteee-infooooo">
              <h1>Usuarios</h1>
              <p>
                Ve y gestian los usuarios que tienen acceso a la informacion de
                los asesores
              </p>
            </div>
          </a>
        </div>
        </Link>
      </section>
    </Layout>
  );
}
