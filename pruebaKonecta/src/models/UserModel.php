<?php

namespace App\Models;

use App\Config\ResponseHttp;
use App\Config\Security;
use App\DB\ConnectionDB;
use App\DB\Sql;
use Ramsey\Uuid\Uuid;
use App\Models\ValidationModel;

class UserModel extends ConnectionDB
{

    //Propiedades de la base de datos
    private static string $id_user;
    private static string $nombre;
    private static int    $rol;
    private static string $state;
    private static string $password;


    public function __construct(array $data)
    {

        if (!empty($data['name'])) {
            self::$nombre   = $data['name'];
        }
        if (!empty($data['password'])) {
            self::$password = $data['password'];
        }
        if (!empty($data['state'])) {
            self::$state = $data['state'];
        }
        if (!empty($data['id_user'])) {
            self::$id_user = $data['id_user'];
        }
    }

    /************************Metodos Getter**************************/
    final public static function getId_user()
    {
        return self::$id_user;
    }
    final public static function getName()
    {
        return self::$nombre;
    }
    final public static function getPassword()
    {
        return self::$password;
    }
    final public static function getRol()
    {
        return self::$rol;
    }
    final public static function getState()
    {
        return self::$state;
    }


    /**********************************Metodos Setter***********************************/
    final public static function setId_user(string $id_user)
    {
        self::$id_user = $id_user;
    }
    final public static function setName(string $nombre)
    {
        self::$nombre = $nombre;
    }
    final public static function setPassword(string $password)
    {
        self::$password = $password;
    }
    final public static function setRol(string $rol)
    {
        self::$rol = $rol;
    }
    final public static function setState(string $state)
    {
        self::$state = $state;
    }


    /*********************************************Login******************************************/
    final public static function login()
    {

        try {
            /************************se valida usuario***********************************/
            $con = self::getConnection()->prepare("SELECT * FROM user WHERE name_user = :name_user ");
            $con->execute([
                ':name_user' => self::getName()
            ]);

            if ($con->rowCount() === 0) {
                return ResponseHttp::status400("El usuario o password son incorrectos");
            } else {
                foreach ($con as $res) {
                    /************************se valida password***********************************/
                    if (Security::validatePassword(self::getPassword(), $res['password'])) {
                        /************************validamos el rol del usuario 1=admin ***********************************/
                        if ($res['rol'] == 1) {
                            /************************validamos que el estado del usuario este activo***********************************/
                            if ($res['state'] == 'true') {
                                /************************se genera token con el id del usuario logeado y con la llave secreta***********************************/
                                $payload = ['IDToken' => $res['id_user']];
                                $token = Security::createTokenJwt(Security::secretKey(), $payload);
                                /************************se almacena el token de la sesion***********************************/
                                $con = self::getConnection();
                                $query1 = "INSERT INTO tokens_login (id_user,token_user,state_token,created_at,expired_at) VALUES";
                                $query2 = "(:id_user,:token_user,:state_token,:created_at,:expired_at)";
                                $query = $con->prepare($query1 . $query2);
                                $query->execute([
                                    ':id_user'     => $res['id_user'],
                                    ':token_user'  => $token,
                                    ':state_token' => 'true',
                                    ':created_at' => Security::DateAct(),
                                    ':expired_at' => Security::DateEXP()
                                ]);
                                if ($query->rowCount() > 0) {
                                    $data = [
                                        /************************se envian los datos de usuario logeado como respuesta***********************************/
                                        ':id_user'   => $res['id_user'],
                                        'name_user'  => $res['name_user'],
                                        'rol'   => $res['rol'],
                                        'state'   => $res['state'],
                                        'token' => $token
                                    ];
                                    return ResponseHttp::status200($data);
                                    exit;
                                } else {
                                    die(json_encode(ResponseHttp::status500('error al hacer login')));
                                }
                            } else {
                                return ResponseHttp::status400('El usuario esta desactivado, por favor comuniquese con el administrador');
                                exit;
                            }
                        } else {
                            return ResponseHttp::status400('El usuario no tiene los permisos necesarios para ingresar');
                            exit;
                        }
                    } else {
                        return ResponseHttp::status400('El usuario o password son incorrectos');
                    }
                }
            }
        } catch (\PDOException $e) {
            error_log("UserModel::Login -> " . $e);
            die(json_encode(ResponseHttp::status500()));
        }
    }
    /*********************************************Logout******************************************/
    final public static function logout()
    {
       
        $data=ValidationModel::validacionuser();
        try {
            /************************se cambia estado del login y el token**********************************/
            $con = self::getConnection()->prepare("UPDATE tokens_login SET state_token = :state_token WHERE id_user = :id_user and token_user =:token_user");
            $con->execute([
                ':state_token' => 'false',
                ':id_user' => $data['IDToken'],
                ':token_user' => $data['Token']
            ]);

            if ($con->rowCount() === 0) {
                return ResponseHttp::status400("No se pudo cerrar sesion");
            } else {
                return ResponseHttp::status200('Sesion Finalzada');
            }
        } catch (\PDOException $e) {
            error_log("UserModel::Login -> " . $e);
            die(json_encode(ResponseHttp::status500()));
        }
    }

        /**************************Consultar todos los usuarios***************************/
        final public static function getregresToken()
        {
            
           ValidationModel::validacionuser();
           $data=['user'=>true];
           die(json_encode(ResponseHttp::status200(($data))));
        }
    /**************************Consultar todos los usuarios***************************/
    final public static function getAll()
    {
        ValidationModel::validacionuser();
        try {
            $con = self::getConnection();
            $query = $con->prepare("SELECT id_user,name_user,rol,state,updated_at FROM user");
            $query->execute();
            $rs['data'] = $query->fetchAll(\PDO::FETCH_ASSOC);
            return $rs;
        } catch (\PDOException $e) {
            error_log("UserModel::getAll -> " . $e);
            die(json_encode(ResponseHttp::status500('No se pueden obtener los datos')));
        }
    }

    /**************************Consultar un usuario por ID**************************************/
    final public static function getUser()
    {
        ValidationModel::validacionuser();
        try {
            $con = self::getConnection();
            $query = $con->prepare("SELECT id_user,name_user,rol,state,updated_at FROM user WHERE id_user = :id_user");
            $query->execute([
                ':id_user' => self::getId_user()
            ]);

            if ($query->rowCount() == 0) {
                return ResponseHttp::status400('El usuario ingresado no esta registrado');
            } else {
                $rs['data'] = $query->fetchAll(\PDO::FETCH_ASSOC);
                return $rs;
            }
        } catch (\PDOException $e) {
            error_log("UserModel::getUser -> " . $e);
            die(json_encode(ResponseHttp::status500('No se pueden obtener los datos del usuario')));
        }
    }

    /*******************************************Registrar usuario************************************************/
    final public static function userSave()
    {

        if (Sql::exists("SELECT name_user FROM user WHERE name_user = :name_user", ":name_user", self::getName())) {
            return ResponseHttp::status400('El usuario ' . self::getName() . ' ya esta registrado');
        } else {

            self::setId_user((string)Uuid::uuid4());
            self::setState((string)'false');
            self::setRol(1);


            try {
                $con = self::getConnection();
                $query1 = "INSERT INTO user (id_user,name_user,password,rol,state,created_at,updated_at) VALUES";
                $query2 = "(:id_user,:name_user,:password,:rol,:state, CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP())";
                $query = $con->prepare($query1 . $query2);
                $query->execute([
                    ':id_user'     => self::getId_user(),
                    ':name_user'  => self::getName(),
                    ':password' => Security::createPassword(self::getPassword()),
                    ':rol'     => self::getRol(),
                    ':state'     => self::getState(),
                ]);
                if ($query->rowCount() > 0) {
                    return ResponseHttp::status200('Usuario ' . self::getName() . ' fue registrado exitosamente');
                } else {
                    return ResponseHttp::status500('No se puede registrar el usuario');
                }
            } catch (\PDOException $e) {
                error_log('UserModel::post -> ' . $e);
                die(json_encode(ResponseHttp::status500()));
            }
        }
    }


    /*******************************Cambiar estado de usuario**************************/
    final public static function cambiostado()
    {
        ValidationModel::validacionuser();
        try {
            $con = self::getConnection();
            $query = $con->prepare("SELECT state FROM user WHERE id_user = :id_user");
            $query->execute([
                ':id_user' => self::getId_user()
            ]);
            if ($query->rowCount() > 0) {
                $res = $query->fetch(\PDO::FETCH_ASSOC);
                if ($res['state'] == self::getState()) {
                    return ResponseHttp::status500('El usuario ya tiene este estado');
                } else {
                    $con = self::getConnection();
                    $query = $con->prepare("UPDATE user SET state =:state WHERE id_user = :id_user");
                    $query->execute([
                        ':state' => self::getState(),
                        ':id_user' => self::getId_user()
                    ]);
                    if ($query->rowCount() > 0) {
                        return ResponseHttp::status200('se cambio el estado del usuario exitosamente');
                    } else {
                        return ResponseHttp::status500('Error al actualizar el estado del usuario');
                    }
                }
            }else{
                return ResponseHttp::status401('El usuario no esta registrado');
            }
        } catch (\PDOException $e) {
            error_log("UserModel::patchPassword -> " . $e);
            die(json_encode(ResponseHttp::status500()));
        }
    }

    /*******************************Eliminar usuario**************************/
    final public static function deleteUser()
    {
        ValidationModel::validacionuser();
        try {
            $con   = self::getConnection();
            $query = $con->prepare("DELETE FROM user WHERE id_user = :id_user");
            $query->execute([
                ':id_user' => self::getId_user()
            ]);

            if ($query->rowCount() > 0) {
                return ResponseHttp::status200('Usuario eliminado exitosamente');
            } else {
                return ResponseHttp::status500('No se puede eliminar el usuario');
            }
        } catch (\PDOException $e) {
            error_log("UserModel::deleteUser -> " . $e);
            die(json_encode(ResponseHttp::status500('No se puede eliminar el usuario')));
        }
    }
}


/*
    ********************************VALIDAR contraseña antigua********************************
    final public static function validateUserPassword(string $id_user, string $oldPassword)
    {
        try {
            $con = self::getConnection();
            $query = $con->prepare("SELECT password FROM user WHERE id_user = :id_user");
            $query->execute([
                ':IDToken' => $IDToken
            ]);

            if ($query->rowCount() == 0) {
                die(json_encode(ResponseHttp::status500()));
            } else {
                $res = $query->fetch(\PDO::FETCH_ASSOC);

                if (Security::validatePassword($oldPassword, $res['password'])) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (\PDOException $e) {
            error_log('UserModel::validateUserPassword -> ' . $e);
            die(json_encode(ResponseHttp::status500()));
        }
    }


     ********************************Actualizar la contraseña de usuario********************************
    final public static function patchPassword()
    {
        try {
            $con = self::getConnection();
            $query = $con->prepare("UPDATE user SET password = :password WHERE id_user = :id_user");
            $query->execute([
                ':password' => Security::createPassword(self::getPassword()),
                ':id_user'  => self::getid_user()
            ]);
            if ($query->rowCount() > 0) {
                return ResponseHttp::status200('Contraseña actualizado exitosamente');
            } else {
                return ResponseHttp::status500('Error al actualizar la contraseña del usuario');
            }
        } catch (\PDOException $e) {
            error_log("UserModel::patchPassword -> " . $e);
            die(json_encode(ResponseHttp::status500()));
        }
    }
    */