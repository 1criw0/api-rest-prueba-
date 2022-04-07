# konecta_prueba_full
back realizado en php/composer y front realizado en react/nexts js

para probar este proyecto se debe:

1.crear las base de datos y las tablas correspondientes del proyexto,esta sintaxis mysql esta ubicada en el back php pruebakonecta/base de datos.txt

NOTA:en este archivo tambien se encuentra un json con el formato y el metodoto para registar un nuevo usuario.

NOTA2:Se debe enviar este json desde postman o algun tester 'HTTP' con la direccion del servidor donde se ejecuta el back y el metodo post.

NOTA3:El usuario por defecto se crea con un estado de false  por ende es necesario cambiar este usuario a true,para ello se debe hacer un update con el id del usuario anteriormente creado y pasarlo a state true,la sintaxis se encuentra en el archivo menciado anteriormente;solo es necesario colocar el id generado.

NOTA4:Se debe realizar estos pasos ya que el back php cuenta con una encriptacion de contraseñas por este motivo si no se realiza el registro atraves del back,cuando se realice el logueo la contraseña sera incorrecta.


2.una vez hecho los pasos anteriores se puede correr el fornt y loguearse.

3.Una vez logueado podra ver,crear,editar y/o eliminar asesores, tambien podra crear,habilitar/desabilitar y/o eliminar usuarios.

bye...
