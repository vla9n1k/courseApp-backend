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
    }
};

module.exports = config;
```

### Compiles and hot-reloads for development
```
npm start