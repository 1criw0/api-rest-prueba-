<?php

use App\Config\ErrorLog;
use App\Config\ResponseHttp;
use App\DB\ConnectionDB;

ErrorLog::activateErrorLog();

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__,2));
$dotenv->load();

/*********Datos de conexión*********/
$data = array(
    'serverDB' => $_ENV['SERVER_DB'],
    'user'     => $_ENV['USER'],
    'password' => $_ENV['PASSWORD'],
    'DB'       => $_ENV['DB'],
    'host'     => $_ENV['HOST'],
    'port'     => $_ENV['PORT']
);

/***********************Validamos el tipo de Base de Datos************************/
if(empty($data['serverDB']) || empty($data['user']) || 
   empty($data['DB']) || empty($data['host']) || empty($data['port']) ){ 
       error_log('Campos de la DB vaciosg');
       die(json_encode(ResponseHttp::status500('Campos de la DB vacioss')));
} else if(strtolower($data['serverDB']) === 'mysql') {
    $user     = $data['user'];
    $password = $data['password'];
    $db       = $data['DB'];
    $host      = $data['host'];
    $port     = $data['port'];
    $charset  = 'utf8mb4';
    $hostt     = 'mysql:host='.$host.";".'port='.$port.';dbname='.$db .";charset=" .$charset;    
    $connection = ConnectionDB::from($hostt , $user , $password);
}