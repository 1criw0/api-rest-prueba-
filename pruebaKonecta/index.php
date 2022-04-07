<?php
      header("Access-Control-Allow-Origin: *");
      header("Access-Control-Allow-Credentials: true");
      header('Access-Control-Allow-Methods: GET,PUT,POST,PATCH,DELETE');
      header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
      header('Content-Type: application/json'); 

use App\Config\ErrorLog;
use App\Config\ResponseHttp;

require './vendor/autoload.php';

//ResponseHttp::headerHttpPro($_SERVER['REQUEST_METHOD'],$_SERVER['HTTP_ORIGIN']);//CORS Producción
ResponseHttp::headerHttpDev($_SERVER['REQUEST_METHOD']);//CORS Desarrollo
ErrorLog::activateErrorLog();

$url = $_SERVER['REQUEST_URI'];

if (isset($url)) {
    
    $params = explode('/',$url);
    $list = array('asesor',"user",'product');
    $file = './src/Routes/' .$params[1].'.php';
    if (!in_array($params[1],$list)) {
        echo json_encode(ResponseHttp::status400());                
        exit;
    }      

    if (is_readable($file)) {
        require $file;
        exit;
    } else {
        echo json_encode(ResponseHttp::status500('La ruta solicitada no existe'));
    }

} else {
    echo json_encode(ResponseHttp::status500());
    exit;
}