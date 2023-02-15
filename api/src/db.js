require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;
const VideogameModel = require('./models/Videogame')
const GenresModel = require('./models/Genres')


const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/videogames`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Videogame, Genres } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
VideogameModel(sequelize)
GenresModel(sequelize)

Videogame.belongsToMany(Genres, {through:'manyVideogames'})
Genres.belongsToMany(Videogame, {through:'manyVideogames'})


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
















// const mysql = require('mysql'); // Importa el módulo de MySQL

// // Crea una conexión a la base de datos
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'mypassword',
//   database: 'mydatabase'
// });

// // Conecta a la base de datos
// connection.connect();

// // Define la URL de la API que se va a consultar
// const url = 'https://api.example.com/data';

// // Utiliza el módulo 'request' para hacer una solicitud a la API
// request(url, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     const data = JSON.parse(body); // Analiza la respuesta de la API
//     const query = 'INSERT INTO mytable (field1, field2) VALUES (?, ?)'; // Define la consulta SQL para insertar los datos en la base de datos

//     data.forEach(item => {
//       // Ejecuta la consulta SQL para insertar los datos en la base de datos
//       connection.query(query, [item.field1, item.field2], function(err, result) {
//         if (err) throw err;
//         console.log('Datos insertados en la base de datos');
//       });
//     });
//   }
// });

// // Cierra la conexión a la base de datos después de haber insertado los datos
// connection.end();

