# Backend for CourseApp

## Project setup
```
Create config.js file in project directory
It should look like this:

const config = {
    app: {
        port: `APP_PORT`
    },
    db: {
        name: 'DB_NAME',
        user: 'USERNAME',
        password: 'PASSWORD',
        host: 'DB_HOST'
    },
    jwt: {
        secret: 'SECRET_STRING'
    }
};

module.exports = config;
```
Make sure to adjust Headers in app.js file according to your needs
### Compiles and hot-reloads for development
```
npm start