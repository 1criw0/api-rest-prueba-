<?php

namespace App\Models;

use App\Config\ResponseHttp;
use App\Config\Security;
use App\DB\ConnectionDB;
use App\DB\Sql;
use Ramsey\Uuid\Uuid;

class ValidationModel extends ConnectionDB
{

    //Propiedades de la base de datos
    private static string $id_user;
    private static string $nombre;
    private static int    $rol;
    private static string $state;
    private static string $password;


/**************************Se valida el estado del usuario y su id ***************************/
final public static function validarsetado($dataId,$dataToken) 
{
    try {
        $con = self::getConnection();
        $query = $con->prepare("SELECT state_token FROM tokens_login WHERE id_user = :id_user and token_user =:token_user");
        $query->execute([
            ':id_user' => $dataId,
            ':token_user' => $dataToken
        ]);
        if ($query->rowCount() == 0) {
            die(json_encode(ResponseHttp::status401('Token invalido o expirado'))); 
        }else{
            /********************se valida que el estado del token de sesion este activo***************************/
            $res = $query->fetch(\PDO::FETCH_ASSOC);

            date_default_timezone_set("America/Bogota_City");
            
            $end = $res['expired_at'];
            $fecha_actual = strtotime(date("Y-m-d H:i:s"));
            $fecha_exipacion = strtotime($end);
                if($fecha_actual > $fecha_exipacion){
                    $fecha =true;
                }else{
                    $fecha =false;
                }
            if($res['state_token']=='true' && $fecha==true) {
                $con = self::getConnection();
                $query = $con->prepare("SELECT * FROM user WHERE id_user = :id_user and state =:state");
                $query->execute([
                    ':id_user' => $dataId,
                    ':state' => 'true'
                ]);
                if ($query->rowCount() >0) {
                    $res = $query->fetch(\PDO::FETCH_ASSOC);
                    $data = [
                        /************************se envian los datos de usuario logeado como respuesta***********************************/
                        'id_user'  => $res['id_user'],
                        'name_user'   => $res['name_user'],
                        'state'   => $res['state']
                    ];
                    return $data;
                } else {
                   
                    die(json_encode(ResponseHttp::status401('No esta utorizando')));
                }
            }else{
                die(json_encode(ResponseHttp::status401('Token invalido o expirado')));
            } 
        }


    } catch (\PDOException $e) {
        error_log("UserModel::getAll -> " . $e);
        die(json_encode(ResponseHttp::status500('No se pueden obtener los datos')));
    }
}
    /**************************calcular edad***************************/
    final public static function calculaedad($fechanacimiento){
        list($ano,$mes,$dia) = explode("-",$fechanacimiento);
        $ano_diferencia  = date("Y") - $ano;
        $mes_diferencia = date("m") - $mes;
        $dia_diferencia   = date("d") - $dia;
        if ($dia_diferencia < 0 || $mes_diferencia < 0)
          $ano_diferencia--;
        return $ano_diferencia;
      }
  /**************************calcular edad***************************/
  final public static function validacion(){
        /*******************************************validacion de token************************************************/
        Security::validateTokenJwt(Security::secretKey());
        /*******************************************traer datos de token************************************************/
        $data = Security::getDataJwt();
        $dataId= $data['IDToken'];
        $dataToken= $data['Token'];
        /*******************************************se valida el estado del usuario que hace la peticion, si esta logeado o no************************************************/
        ValidationModel::validarsetado($dataId,$dataToken);
        return $dataId;
  }

  final public static function validacionuser(){
    /*******************************************validacion de token************************************************/
    Security::validateTokenJwt(Security::secretKey());
    /*******************************************traer datos de token************************************************/
    $data = Security::getDataJwt();
    $dataId= $data['IDToken'];
    $dataToken= $data['Token'];

    $data=[
        'IDToken'=>$dataId,
        'Token'=>$dataToken
    ];
    /*******************************************se valida el estado del usuario que hace la peticion, si esta logeado o no************************************************/
    ValidationModel::validarsetado($dataId,$dataToken);
    return $data;
}

}