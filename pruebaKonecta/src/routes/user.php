<?php

use App\Config\ResponseHttp;
use App\Controllers\UserController;

/*************Obtener el metodo HTTP************/
function getMethod()
{
    return strtolower($_SERVER['REQUEST_METHOD']);
}
/*************Parametros enviados por la URL*******************/
$url = $_SERVER['REQUEST_URI'];
$params = explode('/', $url);
/*************Instancia del controlador de usuario**************/
$app = new UserController();

/*************Rutas***************/
if ($url == "/user/getsuers"  && getMethod() == 'get') {
    $app->getAll("/user/getsuers");
}
if ($url == "/user/getOneUser"  && getMethod() == 'post') {
    $app->getUser("/user/getOneUser");
} 
else if ($url == "/user/register" && getMethod() == 'post') {
    $app->registerSave("/user/register");
} 
else if ($url == "/user/Login" && getMethod() == 'post') {
    $app->userLogin("/user/Login");
} 
else if ($url == "/user/Logout"  && getMethod() == 'get') {
    $app->userLogout("/user/Logout");
} 
else if ($url == "/user/delete"  && getMethod() == 'delete') {
    $app->deleteUser("/user/delete");
} 
else if ($url == "/user/cambiostado"  && getMethod() == 'put') {
    $app->cambiostado("/user/cambiostado");
} 
else if ($url == "/user/refresh_token"  && getMethod() == 'get') {
    $app->getregresToken("/user/refresh_token");
} 
else {
    /****************Error 404*****************/
    echo json_encode(ResponseHttp::status404());
}
