## Índice
1. [Introducción](#web-vue-con-docker)
2. [Requisitos](#requisitos)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Acceso a la Interfaz Web](#acceso-a-la-interfaz-web)
6. [Detener los Contenedores](#detener-los-contenedores)
7. [Licencia](#licencia)
7. [Contacto](#contacto)


# Web Vue con Docker
Este proyecto proporciona una interfaz de usuario para interactuar con la API RESTful y los WebSockets de la aplicación de remates. Está basado en Vue.js y se ejecuta dentro de un contenedor Docker que se conecta a los servicios de API y Socket.

La aplicación web permite a los usuarios gestionar su cuenta, realizar pujas en remates, ver artículos disponibles, consultar información de empresas, y mucho más. La comunicación en tiempo real para las pujas y el estado de los remates se maneja a través de WebSockets.

## Requisitos

Este proyecto se ejecuta utilizando Docker y depende de los siguientes servicios:

- **api**: El servidor principal que maneja la lógica de la aplicación.
- **socket**: Para manejar la comunicación en tiempo real (WebSockets).
- **db**: Contenedor de base de datos (por ejemplo, PostgreSQL o MySQL).
- **redis**: Usado para la gestión de tareas asíncronas con Celery y almacenamiento en caché.
- **celery**: Procesamiento de tareas en segundo plano.
- **web**: La interfaz de usuario para interactuar con la aplicación a través de una página web.


La interacción entre estos contenedores permite que la interfaz web funcione de manera dinámica y sincrónica.

### Tecnologías en el Web
- **Vue.js**: Framework JavaScript para la construcción de la interfaz de usuario (Frontend).
- **Vuex**: Gestión del estado de la aplicación en el frontend.
- **Vue Router**: Gestión de las rutas y navegación dentro de la aplicación.
- **Socket.io**: Biblioteca para la comunicación en tiempo real con el servidor WebSocket.
- **Docker**: Contenedor para la ejecución de la aplicación web.

## Estructura del Proyecto
```bash
/web
│
├── src/
│   ├── assets/            # Archivos estáticos (imágenes, fuentes, etc.)
│   ├── components/        # Componentes reutilizables de Vue
│   ├── views/             # Vistas de la aplicación
│   ├── store/             # Gestión del estado con Vuex
│   ├── router/            # Rutas de la aplicación (Vue Router)
│   ├── App.vue            # Componente raíz de la aplicación
│   ├── fetch.js           # Archivo js que contiene la lógica de las peticiones a la API
│   ├── socket.js          # Archivo js que contiene la conexión con socket
│   └── main.js            # Punto de entrada de la aplicación
├── public/
│   └──  index.html        # HTML principal
├── Dockerfile             # Archivo para crear el contenedor Docker de la aplicación Web
├── package.json           # Dependencias de Node.js
├── docker-compose.yml     # Configuración de Docker Compose para levantar los contenedores
└── nginx.conf             
```
## Instalación y Configuración

1. **Crear docker-compose**:
    Cree un archivo llamado ``docker-compose.yml`` que contenga:
    ```yaml
    version: '3.3'

    services:
      db:
        image: gastonnicora/remates-sql
        expose:
          - "3306"
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_USER: user
          MYSQL_PASSWORD: user
          MYSQL_DATABASE: Remates
        volumes:
          - db_data:/var/lib/mysql
        networks:
          - mynetwork 

      web:
        image: gastonnicora/remates-vue
        ports:
          - "80:80"
        restart: always
        depends_on:
          - api
          - socket
        networks:
          - socket
          - conn 

      api:
        image: gastonnicora/remates-python
        restart: always
        environment:
          DB_HOST: db:3306
          DB_USER: user
          DB_PASS: user
          DB_NAME: Remates
          REDIS_HOST: redis
        depends_on:
          - db
          - redis
        ports:
          - "4000:4000"
        networks:
          - mynetwork 
          - conn 
      
      socket:
        image: gastonnicora/remates-socket
        restart: always
        environment:
          REDIS_HOST: redis
        depends_on:
          - api
          - redis
        expose:
          - "4001"
        ports:
          - "4001:4001"
        networks:
          - mynetwork
          - socket 

      celery:
        image: gastonnicora/remates-celery
        restart: always
        depends_on:
          - redis
          - api
        ports:
          - "5555:5555"
        expose:
          - "5000" 
        networks:
          - mynetwork 

      phpmyadmin:
        image: phpmyadmin
        restart: always
        environment:
          PMA_HOST: db
          PMA_PORT: 3306
        ports:
          - "90:80"
        depends_on:
          - db
        networks:
          - mynetwork 

      redis:
        image: redis:7-alpine
        expose:
          - "6379"
        volumes:
          - redis_data:/data
        networks:
          - mynetwork

    networks:
      mynetwork:
      socket:
        driver: bridge 
      conn:
        driver: bridge 

    volumes:
      db_data:
      redis_data: 

    ```

2. **Construye y levanta los contenedores con Docker Compose**:

    Asegúrate de que Docker y Docker Compose estén instalados en tu máquina.

    Ejecuta el siguiente comando para construir y levantar los contenedores necesarios:

    ```bash
    docker-compose up --build 
    ```

    Este comando levantará los siguientes contenedores:

    - **api**: Contenedor que ejecuta la API RESTful.
    - **db**: Contenedor de la base de datos (MySQL).
    - **redis**: Contenedor para el almacenamiento de tareas de Celery y la comunicación entre la API, el WebSocket y Celery
    - **celery**: Contenedor para ejecutar tareas asíncronas.
    - **socket**: Contenedor para gestionar las conexiones WebSocket en tiempo real.
    - **web**: Contenedor con la interfaz de usuario 
3. **Accede a la interfaz web**:

    Una vez que los contenedores estén levantados, puedes acceder a la aplicación web en la siguiente dirección:

    ```arduino
    http://localhost
    ```
    Desde aquí podrás interactuar con los remates, artículos, usuarios, y realizar pujas en tiempo real.

## Acceso a la Interfaz Web
La interfaz web proporciona las siguientes funcionalidades clave:

- **Autenticación de Usuarios**: Registro, inicio de sesión, y gestión de sesión con JWT.
- **Gestión de Remates**: Visualización de remates activos, terminados y por empezar.
- **Pujas en Tiempo Real**: Participación en remates en tiempo real usando WebSockets.
- **Visualización de Artículos**: Consulta de artículos disponibles en los remates.
- **Gestión de Perfil de Usuario**: Modificación de información de usuario y contraseña.

La interfaz web consume la API para gestionar la mayoría de los datos, mientras que WebSocket permite la comunicación en tiempo real, como actualizaciones instantáneas de pujas.

## Detener los Contenedores
Para detener y eliminar los contenedores en ejecución, ejecuta el siguiente comando:

```bash
docker-compose down
```
Si deseas eliminar también los volúmenes (datos persistentes), usa la opción -v:

```bash
docker-compose down -v
```

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto
  - **Email**: gastonmatias.21@gmail.com
  - **Telefono**: 2345453976