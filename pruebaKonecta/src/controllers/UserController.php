<?php

namespace App\Controllers;

use App\Config\ResponseHttp;
use App\Config\Security;
use App\Models\UserModel;
use Rakit\Validation\Validator;

class UserController extends BaseController
{

    /************************************Login***********************************************/
    final public function userLogin(string $endPoint)
    {
        if ($this->getMethod() == 'post' && $endPoint ==  "/user/Login") {
            $validator = new Validator;

            $validation = $validator->validate($this->getParam(), [
                'name'               => 'required|regex:/^[a-zA-Z ]+$/',
                'password'           => 'required|min:7'
            ]);
            $name = $this->getParam()['name'];
            $password = $this->getParam()['password'];

            if (empty($name) || empty($password)) {
                echo json_encode(ResponseHttp::status400('Todos los campos son necesarios'));
            } else if ($validation->fails()) {
                $errors = $validation->errors();
                echo json_encode(ResponseHttp::status400($errors->all()[0]));
            } else {
                UserModel::setName($name);
                UserModel::setPassword($password);
                echo json_encode(UserModel::login());
            }
            exit;
        }
    }
    /************************************logout***********************************************/
    final public function userLogout(string $endPoint)
    {
        if ($this->getMethod() == 'get' && $endPoint == "/user/Logout") {
            Security::validateTokenJwt(Security::secretKey());
            echo json_encode(UserModel::logout());
            exit;
        }
    }
    /**********************Consultar refresh token*********************/
    final public function getregresToken(string $endPoint)
    {
        if ($this->getMethod() == 'get' && $endPoint == "/user/refresh_token") {
            echo json_encode(UserModel::getregresToken());
            exit;
        }
    }
    /**********************Consultar todos los usuarios*********************/
    final public function getAll(string $endPoint)
    {
        if ($this->getMethod() == 'get' && $endPoint == "/user/getsuers") {
            echo json_encode(UserModel::getAll());
            exit;
        }
    }

    /**********************Consultar un usuario por DNI*******************************/
    final public function getUser(string $endPoint)
    {
        if ($this->getMethod() == 'post' && $endPoint == "/user/getOneUser") {
            if (empty($this->getParam()['id_user'])) {
                echo json_encode(ResponseHttp::status400('El campo id_user es requerido'));
            } else {
                new UserModel($this->getParam());
                echo json_encode(UserModel::getUser());
                exit;
            }
            exit;
        }
    }

    /***************************************Registrar usuario*************************************************/
    final public function registerSave(string $endPoint)
    {

        if ($this->getMethod() == 'post' && $endPoint == "/user/register") {
            // Security::validateTokenJwt(Security::secretKey()); 

            $validator = new Validator;

            $validation = $validator->validate($this->getParam(), [
                'name'               => 'required|regex:/^[a-zA-Z ]+$/',
                'password'           => 'required|min:7',
                'confirmPassword'    => 'required|same:password'
            ]);

            if ($validation->fails()) {
                $errors = $validation->errors();
                echo json_encode(ResponseHttp::status400($errors->all()[0]));
            } else {

                new UserModel($this->getParam());
                echo json_encode(UserModel::userSave());
            }

            exit;
        } else {
            echo json_encode(ResponseHttp::status404());
        }
    }



    /****************************************cambio estado user******************************/
    final public function cambiostado(string $endPoint)
    {
        if ($this->getMethod() == 'put' &&  $endPoint == "/user/cambiostado") {
            if (empty($this->getParam()['id_user']) || empty($this->getParam()['state'])) {
                echo json_encode(ResponseHttp::status400('Todos los campos son requeridos'));
            } else {
                UserModel::setId_user($this->getParam()['id_user']);
                UserModel::setState($this->getParam()['state']);
                echo json_encode(UserModel::cambiostado());
            }
            exit;
        }
    }
    /****************************************Eliminar usuario******************************/
    final public function deleteUser(string $endPoint)
    {
        if ($this->getMethod() == 'delete' &&  $endPoint ==  "/user/delete") {
            if (empty($this->getParam()['id_user'])) {
                echo json_encode(ResponseHttp::status400('Todos los campos son requeridos'));
            } else {
                UserModel::setid_user($this->getParam()['id_user']);
                echo json_encode(UserModel::deleteUser());
            }
            exit;
        }
    }

    /*
        **************************************************Actualizar contraseña de usuario********************************************
        final public function patchPassword(string $endPoint)
        {        
            if ($this->getMethod() == 'patch' && "" == $endPoint){            
                Security::validateTokenJwt(Security::secretKey());
    
                $jwtUserData = Security::getDataJwt();                  
    
                if (empty($this->getParam()['oldPassword']) || empty($this->getParam()['newPassword']) || empty($this->getParam()['confirmNewPassword'])) {
                    echo json_encode(ResponseHttp::status400('Todos los campos son requeridos'));
                } else if (!UserModel::validateUserPassword($jwtUserData['id_user'],$this->getParam()['oldPassword'])) {
                    echo json_encode(ResponseHttp::status400('La contraseña antigua no coincide'));
                } else if (strlen($this->getParam()['newPassword']) < 8 || strlen($this->getParam()['confirmNewPassword']) < 8 ) {
                    echo json_encode(ResponseHttp::status400('La contraseña debe tener un minimo de 8 caracteres'));
                }else if ($this->getParam()['newPassword'] !== $this->getParam()['confirmNewPassword']){
                    echo json_encode(ResponseHttp::status400('Las contraseñas no coinciden'));
                } else {
                    UserModel::setId_user($jwtUserData['id_user']);
                    UserModel::setPassword($this->getParam()['newPassword']); 
                    echo json_encode(UserModel::patchPassword());
                } 
                exit;
            }        
        } 
*/
}
