<?php

namespace App\Controllers;

use App\Config\ResponseHttp;
use App\Config\Security;
use App\Models\AsesorModel;
use Rakit\Validation\Validator;

class AsesorController extends BaseController
{

    /**********************Consultar todos los asesores*********************/
    final public function getAll(string $endPoint)
    {
        if ($this->getMethod() == 'get' && $endPoint == "/asesor/Allasesores") {
            Security::validateTokenJwt(Security::secretKey());
            echo json_encode(AsesorModel::getAll());
            exit;
        }
    }

    /**********************Consultar un asesor por id*******************************/
    final public function getAse(string $endPoint)
    {
        if ($this->getMethod() == 'post' && $endPoint == "/asesor/getAsesor") {
            if (empty($this->getParam()['id_user'])) {
                echo json_encode(ResponseHttp::status400('El campo id_user es requerido'));
            } else {
                AsesorModel::setid_user($this->getParam()['id_user']);
                echo json_encode(AsesorModel::getAsesor());
                exit;
            }
            exit;
        }
    }

    /*************************************Registrar asesor*************************************************/
    final public function registerSave(string $endPoint)
    {

        if ($this->getMethod() == 'post' && $endPoint == "/asesor/register") {

            $validator = new Validator;

            $validation = $validator->validate($this->getParam(), [
                'name'            => 'required|regex:/^[a-zA-Z ]+$/',
                'cedula'          => 'required|numeric',
                'telefono'        => 'required|numeric',
                'genero'          => 'required|regex:/^[a-zA-Z ]+$/',
                'cliente'         => 'required|regex:/^[a-zA-Z ]+$/',
                'sede_trabajo'    => 'required|regex:/^[a-zA-Z ]+$/',
            ]);

            if ($validation->fails()) {
                $errors = $validation->errors();
                echo json_encode(ResponseHttp::status400($errors->all()[0]));
            } else {

                $validation = $validator->validate($this->getParam(), [
                    'name'        => 'required|min:2',
                    'cedula'        => 'required|min:10|max:10',
                    'telefono'        => 'required|min:10|max:10',
                    'fecha_nacimineto' => 'required|date',
                    'genero'          => 'required|min:8|max:9',
                    'cliente'         => 'required|min:2',
                    'sede_trabajo'    => 'required|min:2'
                ]);
                if ($validation->fails()) {
                    $errors = $validation->errors();
                    echo json_encode(ResponseHttp::status400($errors->all()[0]));
                } else {
                    new AsesorModel($this->getParam());
                    echo json_encode(AsesorModel::userSave());
                }
            }

            exit;
        } else {
            echo json_encode(ResponseHttp::status404());
        }
    }

    /************************************Actualizar asesor*************************************************/
    final public function actuaSave(string $endPoint)
    {

        if ($this->getMethod() == 'put' && $endPoint == "/asesor/actualizar") {

            $validator = new Validator;

            $validation = $validator->validate($this->getParam(), [
                'name'            => 'required|regex:/^[a-zA-Z ]+$/',
                'cedula'          => 'required|numeric',
                'telefono'        => 'required|numeric',
                'genero'          => 'required|regex:/^[a-zA-Z ]+$/',
                'cliente'         => 'required|regex:/^[a-zA-Z ]+$/',
                'sede_trabajo'    => 'required|regex:/^[a-zA-Z ]+$/'
            ]);

            if ($validation->fails()) {
                $errors = $validation->errors();
                echo json_encode(ResponseHttp::status400($errors->all()[0]));
            } else {

                $validation = $validator->validate($this->getParam(), [
                    'name'        => 'required|min:2',
                    'cedula'        => 'required|min:10|max:10',
                    'telefono'        => 'required|min:10|max:10',
                    'fecha_nacimineto' => 'required|date',
                    'genero'          => 'required|min:8|max:9',
                    'cliente'         => 'required|min:2',
                    'sede_trabajo'    => 'required|min:2'
                ]);
                if ($validation->fails()) {
                    $errors = $validation->errors();
                    echo json_encode(ResponseHttp::status400($errors->all()[0]));
                } else {

                    new AsesorModel($this->getParam());
                    echo json_encode(AsesorModel::actualizar());
                }
            }
            exit;
        } else {
            echo json_encode(ResponseHttp::status404());
        }
    }

    /************************************Eliminar asesor******************************/
    final public function deleteAse(string $endPoint)
    {
        if ($this->getMethod() == 'delete' &&  $endPoint ==  "/asesor/delete") {
            if (empty($this->getParam())) {
                echo json_encode(ResponseHttp::status400('Todos los campos son requeridos'));
            } else {
                new AsesorModel($this->getParam());
                echo json_encode(AsesorModel::deleteasesor());
            }
            exit;
        }
    }
}
