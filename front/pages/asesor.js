import Layout from "../components/Layout";
import styles from "../styles/tablas.module.css";
import "./api/services/auth.service";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import esLocale from "date-fns/locale/es";
import swal from "sweetalert2";
import { format } from "date-fns";
import PostService from "./api/services/post.service";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
export default function Asesor() {
  /******************hooks de estado***********************/

  const [privatePosts, setPrivate] = useState(
    []
  ); /*objeto con todos los asesores */
  const [wordEntered, setWordEntered] =
    useState(""); /*almacenamiento del dato de busqueda*/
  const [search, setSearch] = useState([
    "",
  ]); /*objeto con los asesores que corresponden a la busqueda*/
  const [datainsertar, setDatainsertar] = useState({
    /*se almacenan los datos del formulario de insertar*/ name: "",
    cedula: "",
    telefono: "",
    fecha_nacimineto: "",
    genero: "",
    cliente: "",
    sede_trabajo: "",
  });
  const [privateeditPosts, setPrivateeditPosts] = useState(
    {}
  ); /**Se almacenan los datos del formulario de editar */
  const [privatverPosts, setPrivateverPosts] = useState({});
  const [verrmodal, verrrsermodal] = useState(false);
  const [insertarmodal, insertarsermodal] =
    useState(false); /**modal insertar esta cerrado por defecto */
  const [modalActualizar, setmodalActualizar] =
    useState(false); /**modal Ediatr esta cerrado por defecto */
  const [selectedDate, handleDateChange] = useState(new Date()); /*fecha */
  const [selectedDateEDIT, handleDateChangeEDIT] = useState(new Date());

  /*****************************hooks**********************************/
  useEffect(() => {
    PostService.getAllasesores().then(
      (response) => {
        setPrivate(response.data.data);
      },
      (error) => {
      }
    );
  }, []);

  /*****************************************************/
  const datee = () => {
    /**validacion de fecha y formateo de fecha */
    /**fecha actual */
    const dateAc = new Date();
    const result = format(dateAc, "yyyy-MM-dd");

    /**fecha de nacimiento */
    const dateNA = selectedDate;
    const resultt = dateNA;
    if (result == resultt) {
      return false;
    } else {
      return resultt;
    }
  };
  const feecha = () => {
    let fech = new Date();
    handleDateChange(format(fech, "yyyy-MM-dd"));
  };

  const handleDateChangeEDITAR = (e) => {
    handleDateChangeEDIT(format(e, "yyyy-MM-dd"));
  };
  const handleDateChangeinserr = (e) => {
    handleDateChange(format(e, "yyyy-MM-dd"));
  };

  const dateEdit = () => {
    /**validacion de fecha y formateo de fecha */
    /**fecha actual */
    const dateAc = new Date();
    const result = format(dateAc, "yyyy-MM-dd");

    /**fecha de nacimiento */
    const dateNA = selectedDateEDIT;
    const resultt = dateNA;
    if (result == resultt) {
      return false;
    } else {
      return resultt;
    }
  };
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
        elemento.name_asesor
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase()) ||
        elemento.cedula
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

  /****************************ver asesor***************************************/
  const veraser = (dato) => {
    verrrsermodal(true);
    setPrivateverPosts(dato);
  };

  const cerrarveraser = () => {
    verrrsermodal(false);
  };
  /****************************insertar nuevo asesor***************************************/
  const insertarModalCambio = () => {
    /**cambio de estado para aparicion de modal de insercion de datos */
    insertarsermodal(true);
    feecha();
  };

  const handleChangeintser = (e) => {
    /**se reciven los datos del formulario de insertar asesor */
    setDatainsertar({
      ...datainsertar,
      [e.target.name]: e.target.value,
    });
  };
  const insertarr = () => {
    if (
      datainsertar.name === "" ||
      datainsertar.cedula === "" ||
      datainsertar.cedula === "" ||
      datainsertar.telefono === "" ||
      datee() === false ||
      datainsertar.genero === "" ||
      datainsertar.cliente === "" ||
      datainsertar.sede_trabajo === ""
    ) {
      swal.fire({
        title: "oops..!",
        text: "por favor rellene todos los campos!",
        icon: "warning",
        timer: "2000",
      });
    } else {
      if (
        datainsertar.cedula.length !== 10 ||
        datainsertar.telefono.length !== 10
      ) {
        swal.fire({
          title: "oops..!",
          text: "por favor digite 10 numeros en telefono y cedula ",
          icon: "warning",
          timer: "2000",
        });
      } else {
        const asesor = {
          name: datainsertar.name,
          cedula: datainsertar.cedula,
          telefono: datainsertar.telefono,
          fecha_nacimineto: datee(),
          genero: datainsertar.genero,
          cliente: datainsertar.cliente,
          sede_trabajo: datainsertar.sede_trabajo,
        };
        PostService.insertAsesores(asesor).then(
          (response) => {
            swal.fire({
              title: "Bien..!",
              text: response.data.mmessage,
              icon: "success",
              timer: "9000",
            });
            borrarinsert();
            handleDateChange(new Date());
            insertarsermodal(false);
            PostService.getAllasesores().then(
              (response) => {
                handleDateChange(new Date());
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
    handleDateChange(new Date());
  };
  const borrarinsert = () => {
    setDatainsertar({
      ...datainsertar,
      name: "",
      cedula: "",
      telefono: "",
      fecha_nacimineto: "",
      genero: "",
      cliente: "",
      sede_trabajo: "",
    });
  };

  /**Actualizacion de asesor */
  const editarModalCerrar = () => {
    setmodalActualizar(false);
    handleDateChange(new Date());
  };

  const handleChangeactu = (e) => {
    /**se reciven los datos del formulario de actualizar asesor */
    setPrivateeditPosts({
      ...privateeditPosts,
      [e.target.name]: e.target.value,
    });
  };

  const mostrarModalActualizar = (dato) => {
    setPrivateeditPosts(dato);
    handleDateChangeEDIT(dato.fecha_nacimineto);
    setmodalActualizar(true);
  };
  const cerrarModalActualizar = () => {
    setmodalActualizar(false);
    handleDateChangeEDIT(new Date());
  };
  const actualizar = () => {
    if (
      privateeditPosts.name === "" ||
      privateeditPosts.cedula === "" ||
      privateeditPosts.cedula === "" ||
      privateeditPosts.telefono === "" ||
      dateEdit() === false ||
      privateeditPosts.genero === "" ||
      privateeditPosts.cliente === "" ||
      privateeditPosts.sede_trabajo === ""
    ) {
      swal.fire({
        title: "oops..!",
        text: "por favor rellene todos los campos!",
        icon: "warning",
        timer: "2000",
      });
    } else {
      if (
        privateeditPosts.cedula.length == 10 ||
        privateeditPosts.telefono.length == 10
      ) {
        swal.fire({
          title: "oops..!",
          text: "por favor digite 10 numeros en telefono y cedula ",
          icon: "warning",
          timer: "2000",
        });
      } else {
        const asesor = {
          name: privateeditPosts.name_asesor,
          cedula: "" + privateeditPosts.cedula + "",
          telefono: "" + privateeditPosts.telefono + "",
          fecha_nacimineto: dateEdit(),
          genero: privateeditPosts.genero,
          cliente: privateeditPosts.cliente,
          sede_trabajo: privateeditPosts.sede_trabajo,
          id_user: privateeditPosts.id_user,
        };
        PostService.Editasesor(asesor).then(
          (response) => {
            swal.fire({
              title: "Bien..!",
              text: response.data.message,
              icon: "success",
              timer: "2000",
            });
            cerrarModalActualizar();
            setWordEntered("");
            setSearch("");
            PostService.getAllasesores().then(
              (response) => {
                setPrivate(response.data.data);
                handleDateChangeEDIT(new Date());
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

  /**elimisar asesor */
  const deleteasesor = (DElet) => {
    swal
      .fire({
        title: "Desea eliminar este Asesor?",
        icon: "info",
        showDenyButton: true,
        confirmButtonText: "eliminar",
        denyButtonText: `cancelar`,
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const data = { id_user: DElet };
          PostService.Deleteasesor(data).then(
            (response) => {
              swal.fire({
                title: "El Asesor fue eliminado..!",
                text: response.data.mmessage,
                icon: "success",
                timer: "2000",
              });
              setWordEntered("");
              setSearch("");
              PostService.getAllasesores().then(
                (response) => {
                  setPrivate(response.data.data);
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
              <buton
                className={styles.butonr}
                onClick={() => insertarModalCambio()}
              >
                Registar
              </buton>
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
                            <label>Datos de Asesores</label>
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
                                <th className="sorting_asc">Cedula</th>
                                <th className="sorting_asc">Telefono</th>
                                <th className="sorting_asc">
                                  Fecha de Nacimiento
                                </th>
                                <th className="sorting_asc">Edad</th>
                                <th className="sorting_asc">
                                  Usuario registro
                                </th>
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
                                      <td>
                                        {dato.name_asesor.substring(0, 10)}..
                                      </td>
                                      <td>{dato.cedula}</td>
                                      <td>{dato.telefono}</td>
                                      <td>{dato.fecha_nacimineto}</td>
                                      <td>{dato.edad}</td>
                                      <td>
                                        {dato.name_user == null ||
                                        dato.name_user == ""
                                          ? "usuario no registrado"
                                          : dato.name_user.substring(0, 10)}
                                        ..
                                      </td>
                                      <td>{dato.updated_at}</td>
                                      <td className="text-right">
                                        <a
                                          className="btnn btnn-simple btnn-info btnn-icon eye"
                                          onClick={() => veraser(dato)}
                                        >
                                          <i className="fa fa-eye"></i>
                                          <p className="opcionn">Ver</p>
                                        </a>
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
                                            deleteasesor(dato.id_user)
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
                              {search == "none" ||
                              (search == "" && privatePosts == "") ? (
                                <tr role="row">
                                  <td>NO hay datos</td>
                                  <td>NO hay datos</td>
                                  <td>NO hay datos</td>
                                  <td>NO hay datos</td>
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
                                    <td>
                                      {dato.name_asesor
                                        ? dato.name_asesor.substring(0, 10)
                                        : null}
                                    </td>
                                    <td>{dato.cedula}</td>
                                    <td>{dato.telefono}</td>
                                    <td>{dato.fecha_nacimineto}</td>
                                    <td>{dato.edad}</td>
                                    <td>
                                      {dato.name_user == null ||
                                      dato.name_user == ""
                                        ? "usuario no registrado"
                                        : dato.name_user
                                        ? dato.name_user.substring(0, 10)
                                        : null}
                                      ..
                                    </td>
                                    <td>{dato.updated_at}</td>
                                    <td className="text-right">
                                      <a
                                        className="btnn btnn-simple btnn-info btnn-icon eye"
                                        onClick={() => veraser(dato)}
                                      >
                                        <i className="fa fa-eye"></i>
                                        <p className="opcionn">Ver</p>
                                      </a>
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
                                          deleteasesor(dato.id_user)
                                        }
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
          <Modal
            className="modall"
            size="lg"
            style={{
              maxWidth: "1600px",
              width: "80%",
              maxHeight: "1600px",
              height: "90%",
            }}
            isOpen={verrmodal}
          >
            {privatverPosts.genero === "femenino" ? (
              <div
                className="modal-izq"
                style={{
                  backgroundImage:
                    'url("https://cdn.pixabay.com/photo/2020/06/20/10/05/girl-5320410_960_720.jpg")',
                }}
              ></div>
            ) : (
              <div
                className="modal-izq"
                style={{
                  backgroundImage:
                    'url("https://cdn.pixabay.com/photo/2020/10/04/05/51/man-5625314_960_720.png")',
                }}
              ></div>
            )}
            <div className="modal-dere">
              <div className="modal-tittle">Asesor</div>
              <div className="modal-tittlee">{privatverPosts.id_user}</div>
              <div className="modal-conteee">
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Nombre:</div>
                  <div className="modal-datomol">
                    {privatverPosts.name_asesor}
                  </div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Cedula:</div>
                  <div className="modal-datomol">{privatverPosts.cedula}</div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Telefono:</div>
                  <div className="modal-datomol">{privatverPosts.telefono}</div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Fecha de Nacimineto:</div>
                  <div className="modal-datomol">
                    {privatverPosts.fecha_nacimineto}
                  </div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Edad:</div>
                  <div className="modal-datomol">
                    {privatverPosts.edad} años
                  </div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Genero:</div>
                  <div className="modal-datomol">{privatverPosts.genero}</div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Cliente:</div>
                  <div className="modal-datomol">{privatverPosts.cliente}</div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Sede de Trabajo:</div>
                  <div className="modal-datomol">
                    {privatverPosts.sede_trabajo}
                  </div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Usuario registrador:</div>
                  <div className="modal-datomol">
                    {privatverPosts.name_user}
                  </div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">Fecha de creacion:</div>
                  <div className="modal-datomol">
                    {privatverPosts.created_at}
                  </div>
                </div>
                <div className="modal-conteedat">
                  <div className="modal-titulomol">
                    Fecha ultima actualizacion:
                  </div>
                  <div className="modal-datomol">
                    {privatverPosts.created_at}
                  </div>
                </div>
                <buton
                  className="modal-cerrver"
                  onClick={() => cerrarveraser()}
                >
                  cerrar
                </buton>
              </div>
            </div>
          </Modal>
          <Modal isOpen={insertarmodal}>
            <ModalHeader>
              <div>
                <h3>Insertar Nuevo Asesor</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <label>Nombre:</label>
                <input
                  className="form-control"
                  name="name"
                  placeholder="nombre del asesor"
                  type="text"
                  onChange={handleChangeintser}
                  value={datainsertar.name}
                />
                <br></br>
                <label>cedula:</label>
                <input
                  className="form-control"
                  name="cedula"
                  placeholder="cedula"
                  type="number"
                  maxLength="10"
                  onChange={handleChangeintser}
                  value={datainsertar.cedula}
                />
                <br></br>
                <label>telefono:</label>
                <input
                  className="form-control"
                  name="telefono"
                  placeholder="telefono"
                  type="number"
                  maxLength="10"
                  onChange={handleChangeintser}
                  value={datainsertar.telefono}
                />
                <br></br>
                <label>fecha de nacimineto:</label>
                <br></br>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                  <DatePicker
                    className="form-control"
                    format="yyyy/MM/dd"
                    value={selectedDate + "T00:00:00"}
                    onChange={handleDateChangeinserr}
                  />
                </MuiPickersUtilsProvider>
                <br></br>
                <br></br>
                <label>genero:</label>
                <select
                  className="form-control"
                  name="genero"
                  onChange={handleChangeintser}
                  value={datainsertar.genero}
                >
                  <option value="" default>
                    genero
                  </option>
                  <option value="masculino">masculino</option>
                  <option value="femenino">femenino</option>
                </select>
                <br></br>
                <label>cliente:</label>
                <input
                  className="form-control"
                  name="cliente"
                  placeholder="cliente"
                  type="text"
                  onChange={handleChangeintser}
                  value={datainsertar.cliente}
                />
                <br></br>
                <label>Sede de trabajo:</label>
                <input
                  className="form-control"
                  name="sede_trabajo"
                  placeholder="sede de trabajo"
                  type="text"
                  onChange={handleChangeintser}
                  value={datainsertar.sede_trabajo}
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
                <h3>Actualizar Asesor</h3>
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
                <label>Nombre:</label>
                <input
                  className="form-control"
                  name="name_asesor"
                  placeholder="nombre del asesor"
                  type="text"
                  onChange={handleChangeactu}
                  value={privateeditPosts.name_asesor}
                />
                <br></br>
                <label>cedula:</label>
                <input
                  className="form-control"
                  name="cedula"
                  placeholder="cedula"
                  type="number"
                  maxLength="10"
                  onChange={handleChangeactu}
                  value={privateeditPosts.cedula}
                />
                <br></br>
                <label>telefono:</label>
                <input
                  className="form-control"
                  name="telefono"
                  placeholder="telefono"
                  type="number"
                  maxLength="10"
                  onChange={handleChangeactu}
                  value={privateeditPosts.telefono}
                />
                <br></br>
                <label>fecha de nacimineto:</label>
                <br></br>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                  <DatePicker
                    className="form-control"
                    format="yyyy/MM/dd"
                    value={selectedDateEDIT + "T00:00:00"}
                    onChange={handleDateChangeEDITAR}
                  />
                </MuiPickersUtilsProvider>
                <br></br>
                <br></br>
                <label>genero:</label>
                <select
                  className="form-control"
                  name="genero"
                  onChange={handleChangeactu}
                  value={privateeditPosts.genero}
                >
                  <option value="" default>
                    genero
                  </option>
                  <option value="masculino">masculino</option>
                  <option value="femenino">femenino</option>
                </select>
                <br></br>
                <label>cliente:</label>
                <input
                  className="form-control"
                  name="cliente"
                  placeholder="cliente"
                  type="text"
                  onChange={handleChangeactu}
                  value={privateeditPosts.cliente}
                />
                <br></br>
                <label>Sede de trabajo:</label>
                <input
                  className="form-control"
                  name="sede_trabajo"
                  placeholder="sede de trabajo"
                  type="text"
                  onChange={handleChangeactu}
                  value={privateeditPosts.sede_trabajo}
                />
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
