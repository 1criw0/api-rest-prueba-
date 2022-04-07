import Layout from "../components/Layout";
import styles from "../styles/tablas.module.css";
import "./api/services/auth.service";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert2";
import PostService from "./api/services/post.service";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
export default function Usuario() {
  /******************hooks de estado***********************/

  const [privatePosts, setPrivate] = useState(
    []
  ); /*objeto con todos los usuarios */
  const [wordEntered, setWordEntered] =
    useState(""); /*almacenamiento del dato de busqueda*/
  const [search, setSearch] = useState([
    "",
  ]); /*objeto con los usuarios que corresponden a la busqueda*/
  const [datainsertar, setDatainsertar] = useState({
    /*se almacenan los datos del formulario de insertar*/ name: "",
    password: "",
    repit_password: "",
  });
  const [privateeditPosts, setPrivateeditPosts] = useState(
    {}
  ); /**Se almacenan los datos del formulario de editar */
  const [insertarmodal, insertarsermodal] =
    useState(false); /**modal insertar esta cerrado por defecto */
  const [modalActualizar, setmodalActualizar] =
    useState(false); /**modal Ediatr esta cerrado por defecto */

  /*****************************hooks**********************************/
  useEffect(() => {
    PostService.getAllusers().then(
      (response) => {
        setPrivate(response.data.data);
      },
      (error) => {
      }
    );
  }, []);

  /***********************busqueda y filtro de busqueda***********************************/
  const handleFilter = (e) => {
    /*se obtiene el dato abuscar */
    setWordEntered(e.target.value);
    filtrar(e.target.value);
  };
  const filtrar = (terminoBusqueda) => {
    /*se filtra los datos de busqueda */
    var resultadosBusqueda = privatePosts.filter((elemento) => {
      if (
        elemento.name_user
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    let busquedas;
    busquedas = "none";
    if (resultadosBusqueda.length === 0) {
      setSearch(busquedas);
    } else {
      setSearch(resultadosBusqueda);
    }
  };

  /****************************insertar nuevo usuario***************************************/
  const insertarModalCambio = () => {
    /**cambio de estado para aparicion de modal de insercion de datos */
    insertarsermodal(true);
  };

  const handleChangeintser = (e) => {
    /**se reciven los datos del formulario de insertar usuario */
    setDatainsertar({
      ...datainsertar,
      [e.target.name]: e.target.value,
    });
  };
  const insertarr = () => {
    if (
      datainsertar.name === "" ||
      datainsertar.password === "" ||
      datainsertar.repit_password === ""
    ) {
      swal.fire({
        title: "oops..!",
        text: "por favor rellene todos los campos!",
        icon: "warning",
        timer: "2000",
      });
    } else {
      if (datainsertar.password !== datainsertar.repit_password) {
        swal.fire({
          title: "oops..!",
          text: "Las contraseñas no coinciden",
          icon: "warning",
          timer: "2000",
        });
      } else {
        const user = {
          name: datainsertar.name,
          password: datainsertar.password,
          confirmPassword: datainsertar.repit_password,
        };
        PostService.insertuser(user).then(
          (response) => {
            swal.fire({
              title: "Bien..!",
              text: response.data.mmessage,
              icon: "success",
              timer: "9000",
            });
            borrarinsert();
            insertarsermodal(false);
            PostService.getAllusers().then(
              (response) => {
                setPrivate(response.data.data);
              },
              (error) => {
                swal.fire({
                  title: "error..!",
                  text: error.response.data.message,
                  icon: "error",
                  timer: "2000",
                });
              }
            );
          },
          (error) => {
            swal.fire({
              title: "error..!",
              text: error.response.data.message,
              icon: "error",
              timer: "2000",
            });
          }
        );
      }
    }
  };
  const insertarModalCerrar = () => {
    insertarsermodal(false);
    borrarinsert();
  };
  const borrarinsert = () => {
    setDatainsertar({
      ...datainsertar,
      name: "",
      password: "",
      repit_password: "",
    });
  };

  /**Actualizacion de usuario */
  const editarModalCerrar = () => {
    setmodalActualizar(false);
  };

  const handleChangeactu = (e) => {
    /**se reciven los datos del formulario de actualizar usuario */
    setPrivateeditPosts({
      ...privateeditPosts,
      [e.target.name]: e.target.value,
    });
  };

  const mostrarModalActualizar = (dato) => {
    setPrivateeditPosts(dato);
    setmodalActualizar(true);
  };
  const cerrarModalActualizar = () => {
    setmodalActualizar(false);
  };
  const actualizar = () => {
    if (privateeditPosts.state === "") {
      swal.fire({
        title: "oops..!",
        text: "por favor escoga un estado valido!",
        icon: "warning",
        timer: "2000",
      });
    } else {
      const user = {
        id_user: privateeditPosts.id_user,
        state: privateeditPosts.state,
      };
      PostService.Edituser(user).then(
        (response) => {
          swal.fire({
            title: "Bien..!",
            text: response.data.message,
            icon: "success",
            timer: "2000",
          });
          cerrarModalActualizar();
          PostService.getAllusers().then(
            (response) => {
              setPrivate(response.data.data);
              setWordEntered("");
              setSearch("");
            },
            (error) => {
              swal.fire({
                title: "error..!",
                text: error.response.data.message,
                icon: "error",
                timer: "2000",
              });
            }
          );
        },
        (error) => {
          swal.fire({
            title: "error..!",
            text: error.response.data.message,
            icon: "error",
            timer: "2000",
          });
        }
      );
    }
  };

  /**elimisar usuario */
  const deleteusu = (DElet) => {
    swal
      .fire({
        title: "Desea eliminar este usuario?",
        icon: "info",
        showDenyButton: true,
        confirmButtonText: "eliminar",
        denyButtonText: `cancelar`,
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const data = { id_user: DElet };
          PostService.Deleteuser(data).then(
            (response) => {
              swal.fire({
                title: "El Uusuario fue eliminado..!",
                text: response.data.mmessage,
                icon: "success",
                timer: "2000",
              });
              PostService.getAllusers().then(
                (response) => {
                  setPrivate(response.data.data);
                  setWordEntered("");
                  setSearch("");
                },
                (error) => {
                  swal.fire({
                    title: "error..!",
                    text: error.response.data.mmessage,
                    icon: "error",
                    timer: "2000",
                  });
                }
              );
            },
            (error) => {
              swal.fire({
                title: "error..!",
                text: error.response.data.mmessage,
                icon: "error",
                timer: "2000",
              });
            }
          );
        }
      });
  };
  return (
    <Layout>
      <div className={styles.conten_table}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <br />
              <button
                className={styles.butonr}
                onClick={() => insertarModalCambio()}
              >
                Registar
              </button>
              <br></br>
              <br></br>
              <div className="card card-2" id="tablaa">
                <div className="content">
                  <div className="fresh-datatables">
                    <div
                      id="datatables_wrapper"
                      className="dataTables_wrapper form-inline dt-bootstrap"
                    >
                      <div className="row">
                        <div className="col-sm-6">
                          <div
                            className="dataTables_length"
                            id="datatables_length"
                          >
                            <label>Datos de Usuarios</label>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div
                            id="datatables_filter"
                            className="dataTables_filter"
                          >
                            <label>
                              <input
                                type="search"
                                className="input-sm in_ser"
                                placeholder="Search records"
                                aria-controls="datatables"
                                value={wordEntered}
                                onChange={handleFilter}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <table
                            className="table table-no-bordered table-hover dataTable  "
                            id="datatables"
                            width="100%"
                            role="grid"
                            aria-describedby="datatables_info"
                          >
                            <thead>
                              <tr role="row">
                                <th className="sorting_asc">Nombre</th>
                                <th className="sorting_asc">Estado</th>
                                <th className="sorting_asc">
                                  Fecha de Actualizacion
                                </th>
                                <th
                                  className="disabled-sorting text-right sorting"
                                  aria-controls="datatables"
                                  aria-label="Actions: activate to sort column ascending"
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tfoot></tfoot>
                            <tbody>
                              {privatePosts && wordEntered == ""
                                ? privatePosts.map((dato) => (
                                    <tr
                                      role="row"
                                      className="even"
                                      key={dato.id_user}
                                    >
                                      <td>{dato.name_user}</td>
                                      <td>
                                        {dato.state === "true"
                                          ? "usuario Activado"
                                          : "usuario Desactivado"}
                                      </td>
                                      <td>{dato.updated_at}</td>
                                      <td className="text-right">
                                        <a
                                          className="btnn btnn-simple btnn-warning btnn-icon edit"
                                          onClick={() =>
                                            mostrarModalActualizar(dato)
                                          }
                                        >
                                          <i className="fa fa-edit">
                                            <p className="opcionn ff">Edit</p>
                                          </i>
                                        </a>
                                        <a
                                          className="btnn btnn-simple btnn-danger btnn-icon remove"
                                          onClick={() =>
                                            deleteusu(dato.id_user)
                                          }
                                        >
                                          <i className="fa fa-times">
                                            <p className="opcionn ff">Del</p>
                                          </i>
                                        </a>
                                      </td>
                                    </tr>
                                  ))
                                : null}
                              {search === "none" || privatePosts === "" ? (
                                <tr role="row">
                                  <td>NO hay datos</td>
                                  <td>NO hay datos</td>
                                  <td>NO hay datos</td>
                                  <td>NO hay datos</td>
                                </tr>
                              ) : wordEntered !== "" ? (
                                search.map((dato) => (
                                  <tr
                                    role="row"
                                    className="even"
                                    key={dato.id_user}
                                  >
                                    <td>{dato.name_user} </td>
                                    <td>
                                      {" "}
                                      {dato.state === "true"
                                        ? "usuario Activado"
                                        : "usuario Desactivado"}
                                    </td>
                                    <td>{dato.updated_at}</td>
                                    <td className="text-right">
                                      <a
                                        className="btnn btnn-simple btnn-warning btnn-icon edit"
                                        onClick={() =>
                                          mostrarModalActualizar(dato)
                                        }
                                      >
                                        <i className="fa fa-edit">
                                          <p className="opcionn ff">Edit</p>
                                        </i>
                                      </a>
                                      <a
                                        className="btnn btnn-simple btnn-danger btnn-icon remove"
                                        onClick={() => deleteusu(dato.id_user)}
                                      >
                                        <i className="fa fa-times">
                                          <p className="opcionn ff">Del</p>
                                        </i>
                                      </a>
                                    </td>
                                  </tr>
                                ))
                              ) : null}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal isOpen={insertarmodal}>
            <ModalHeader>
              <div>
                <h3>Insertar Nuevo Usuario</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <label>Nombre:</label>
                <input
                  className="form-control"
                  name="name"
                  placeholder="nombre de usuario"
                  type="text"
                  onChange={handleChangeintser}
                  value={datainsertar.name}
                />
                <br></br>
                <label>contraseña:</label>
                <input
                  className="form-control"
                  name="password"
                  placeholder="password"
                  type="password"
                  maxLength="8"
                  onChange={handleChangeintser}
                  value={datainsertar.password}
                />
                <br></br>
                <label>Repetir Contraseña:</label>
                <input
                  className="form-control"
                  name="repit_password"
                  placeholder="password"
                  type="password"
                  maxLength="8"
                  onChange={handleChangeintser}
                  value={datainsertar.repit_password}
                />
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" onClick={() => insertarr()}>
                Crear
              </Button>
              <Button color="danger" onClick={() => insertarModalCerrar()}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={modalActualizar}>
            <ModalHeader>
              <div>
                <h3>Actualizar usuario</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <label>Id:</label>

                <input
                  className="form-control"
                  readOnly
                  type="text"
                  value={privateeditPosts.id_user}
                  onChange={handleChangeactu}
                />
                <br></br>
                <label>Nombre:</label>
                <input
                  readOnly
                  className="form-control"
                  name="name_user"
                  placeholder="nombre de usuario"
                  type="text"
                  value={privateeditPosts.name_user}
                />
                <br></br>
                <label>Estado de usuario:</label>
                <select
                  className="form-control"
                  name="state"
                  onChange={handleChangeactu}
                  value={privateeditPosts.state}
                >
                  <option value="" default>
                    Estado
                  </option>
                  <option value="true">Activado</option>
                  <option value="false">Desactivado</option>
                </select>
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" onClick={() => actualizar()}>
                Actualizar
              </Button>
              <Button color="danger" onClick={() => editarModalCerrar()}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}
