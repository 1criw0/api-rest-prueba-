<?php

namespace App\Models;

use App\Config\ResponseHttp;
use App\Config\Security;
use App\DB\ConnectionDB;
use App\DB\Sql;
use Ramsey\Uuid\Uuid;
use App\Models\ValidationModel;


class AsesorModel extends ConnectionDB
{

    //Propiedades de la base de datos
    private static string $id_user;
    private static string $nombre;
    private static string $cedula;
    private static int $telefono;
    private static string $fecha_nacimineto;
    private static string $genero;
    private static string $cliente;
    private static string $sede_trabajo;


    public function __construct(array $data)
    {
        if (!empty($data['id_user'])) {
            self::$id_user = $data['id_user'];
        }
        if (!empty($data['name'])) {
            self::$nombre   = $data['name'];
        }
        if (!empty($data['cedula'])) {
            self::$cedula   = $data['cedula'];
        }
        if (!empty($data['telefono'])) {
            self::$telefono   = $data['telefono'];
        }
        if (!empty($data['fecha_nacimineto'])) {
            self::$fecha_nacimineto   = $data['fecha_nacimineto'];
        }
        if (!empty($data['genero'])) {
            self::$genero = $data['genero'];
        }
        if (!empty($data['cliente'])) {
            self::$cliente = $data['cliente'];
        }
        if (!empty($data['sede_trabajo'])) {
            self::$sede_trabajo = $data['sede_trabajo'];
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
    final public static function getCedula()
    {
        return self::$cedula;
    }
    final public static function getTelefono()
    {
        return self::$telefono;
    }
    final public static function getFecha_nacimineto()
    {
        return self::$fecha_nacimineto;
    }
    final public static function getGenero()
    {
        return self::$genero;
    }
    final public static function getCliente()
    {
        return self::$cliente;
    }
    final public static function getSede_trabajo()
    {
        return self::$sede_trabajo;
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
    final public static function setCedula()
    {
        return self::$cedula;
    }
    final public static function setTelefono()
    {
        return self::$telefono;
    }
    final public static function setFecha_nacimineto()
    {
        return self::$fecha_nacimineto;
    }
    final public static function setGenero()
    {
        return self::$genero;
    }
    final public static function setCliente()
    {
        return self::$cliente;
    }
    final public static function setSede_trabajo()
    {
        return self::$sede_trabajo;
    }

    /**************************Consultar todos los asesores***************************/
    final public static function getAll()
    {
        ValidationModel::validacion();
        try {
            $con = self::getConnection();
            $query = $con->prepare("SELECT a.id_user as 'id_user',a.name_asesor as'name_asesor',a.cedula as 'cedula',a.telefono as 'telefono',a.fecha_nacimineto as 'fecha_nacimineto',a.edad as 'edad',a.genero as 'genero',a.cliente as 'cliente',a.sede_trabajo as 'sede_trabajo',u.name_user as 'name_user',a.created_at as 'created_at', a.updated_at as'updated_at' FROM asesor a LEFT JOIN user u ON a.user_registrador = u.id_user ORDER BY updated_at DESC");
            $query->execute();
            $rs['data'] = $query->fetchAll(\PDO::FETCH_ASSOC);
            return $rs;
        } catch (\PDOException $e) {
            error_log("UserModel::getAll -> " . $e);
            die(json_encode(ResponseHttp::status500('No se pueden obtener los datos')));
        }
    }

    /**************************Consultar un usuario por DNI**************************************/
    final public static function getAsesor()
    {
        ValidationModel::validacion();
        try {
            $con = self::getConnection();
            $query = $con->prepare("SELECT id_user,name_asesor,cedula,telefono,fecha_nacimineto,edad,genero,cliente,sede_trabajo,name_user,created_at,updated_at FROM asesor,user WHERE id_user = :id_user and user_register=id_user");
            $query->execute([
                ':id_user' => self::getId_user()
            ]);

            if ($query->rowCount() == 0) {
                return ResponseHttp::status400('El id_user ingresado no esta registrado');
            } else {
                $rs['data'] = $query->fetchAll(\PDO::FETCH_ASSOC);
                return $rs;
            }
        } catch (\PDOException $e) {
            error_log("UserModel::getUser -> " . $e);
            die(json_encode(ResponseHttp::status500('No se pueden obtener los datos del asesor')));
        }
    }

    /*******************************************Registrar asesor************************************************/
    final public static function userSave()
    {  
        self::setId_user((string)Uuid::uuid4());
        $dataId=ValidationModel::validacion();
        $edadd = ValidationModel::calculaedad(self::getFecha_nacimineto());
        if (Sql::exists("SELECT name_asesor FROM asesor WHERE cedula = :cedula", ":cedula", self::getCedula())) {
            return ResponseHttp::status400('El usuario con la cedula suministrada ya esta registrado');
        } else {

            try {
                $con = self::getConnection();
                $query1 = "INSERT INTO asesor (id_user,name_asesor,cedula,telefono,fecha_nacimineto,edad,genero,cliente,sede_trabajo,user_registrador,created_at,updated_at) VALUES";
                $query2 = "(:id_user,:name_asesor,:cedula,:telefono,:fecha_nacimineto,:edad,:genero,:cliente,:sede_trabajo,:user_registrador,:created_at,:updated_at)";
                $query = $con->prepare($query1 . $query2);
                $query->execute([
                    ':id_user'     => self::getId_user(),
                    ':name_asesor'  => self::getName(),
                    ':cedula'  => self::getCedula(),
                    ':telefono'  => self::getTelefono(),
                    ':fecha_nacimineto'  => self::getFecha_nacimineto(),
                    ':edad'  => $edadd,
                    ':genero'  => self::getGenero(),
                    ':cliente'  => self::getCliente(),
                    ':sede_trabajo'  => self::getSede_trabajo(),
                    ':user_registrador'  =>  $dataId,
                    ':created_at' => Security::DateAct(),
                    ':updated_at' => Security::DateAct(),
                ]);
                if ($query->rowCount() > 0) {
                    return ResponseHttp::status200('El asesor ' . self::getName() . ' fue registrado exitosamente');
                } else {
                    return ResponseHttp::status500('No se puede registrar el Asesor');
                }
            } catch (\PDOException $e) {
                error_log('UserModel::post -> ' . $e);
                die(json_encode(ResponseHttp::status500()));
            }
        }
    }

    /******************************Actualizar asesor********************************/
    final public static function actualizar()
    {
        $dataId=ValidationModel::validacion();
        $edadd = ValidationModel::calculaedad(self::getFecha_nacimineto());

        try {
            $con = self::getConnection();
            $query = "UPDATE asesor Set name_asesor=:name_asesor,cedula=:cedula,telefono=:telefono,fecha_nacimineto=:fecha_nacimineto,edad=:edad,genero=:genero,cliente=:cliente,sede_trabajo=:sede_trabajo,user_registrador=:user_registrador,updated_at=:updated_at WHERE id_user=:id_user";
            $query = $con->prepare($query);
            $query->execute([
                ':name_asesor'  => self::getName(),
                ':cedula'  => self::getCedula(),
                ':telefono'  => self::getTelefono(),
                ':fecha_nacimineto'  => self::getFecha_nacimineto(),
                ':edad'  => $edadd,
                ':genero'  => self::getGenero(),
                ':cliente'  => self::getCliente(),
                ':sede_trabajo'  => self::getSede_trabajo(),
                ':user_registrador'  =>  $dataId,
                ':updated_at' => Security::DateAct(),
                ':id_user'     => self::getId_user(),
            ]);
            if ($query->rowCount() > 0) {
                return ResponseHttp::status200('El asesor ' . self::getName() . ',fue actualizado exitosamente');
            } else {
                return ResponseHttp::status500('No se puede modificar el asesor');
            }
        } catch (\PDOException $e) {
            error_log('UserModel::post -> ' . $e);
            die(json_encode(ResponseHttp::status500('cedula duplicada o error con la base de datos')));
        }
    }

    /*******************************Eliminar asesor**************************/
    final public static function deleteasesor()
    {
        ValidationModel::validacion();
        try {
            $con   = self::getConnection();
            $query = $con->prepare("DELETE FROM asesor WHERE id_user = :id_user");
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
