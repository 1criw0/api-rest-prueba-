<?php

use App\Config\ResponseHttp;
use App\Controllers\AsesorController;
use App\Config\ErrorLog;

/*************Obtener el metodo HTTP************/
function getMethod()
{
    return strtolower($_SERVER['REQUEST_METHOD']);
}
/*************Parametros enviados por la URL*******************/
$url = $_SERVER['REQUEST_URI'];
$params = explode('/', $url);
/*************Instancia del controlador de usuario**************/
$app = new AsesorController();

/*************Rutas***************/
if ($url == "/asesor/register" && getMethod() == 'post') {
    $app->registerSave("/asesor/register");

} else if ($url == "/asesor/Allasesores" && getMethod() == 'get') {
    $app->getAll("/asesor/Allasesores");

} else if ($url == "/asesor/actualizar" && getMethod() == 'put') {
    $app->actuaSave("/asesor/actualizar");

} else if ($url == "/asesor/delete" && getMethod() == 'delete') {
    $app->deleteAse("/asesor/delete");

} else if ($url == "/asesor/getAsesor" && getMethod() == 'post') {
    $app->getAse("/asesor/getAsesor");
    
} else {
    /****************Error 404*****************/
    echo json_encode(ResponseHttp::status404());
}
