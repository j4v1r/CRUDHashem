const PORT = process.env.PORT || 3000
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || 'n0m3l0'
const DB_NAME = process.env.DB_NAME || 'pokemones'
const DB_PORT = process.env.DB_PORT || 3306

const express = require('express');
const mysql = require('mysql2');
let bodyParser = require('body-parser');
let app = express();

let con = mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    port:DB_PORT,
    database:DB_NAME,
})

app.use(express.static('public'))
con.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.post('/addPok', (req, res) => {
    let nombre = req.body.name
    let region = req.body.region
    let tipo = req.body.tipo
    con.query('insert into pokemon (region,tipo,nombre) values ("' + region + '","' + tipo + '","' + nombre + '")', (err, respuesta, fields) => {
        if (err) return console.log("Error", err)
        return res.send(`<a href="index.html">Inicio
                            </a><h1>Nombre: ${nombre}</h1>
                            <h1>Región: ${region}</h1>
                            <h1>Tipo: ${tipo}</h1>`)
    })
})

app.get('/getPok', (req, res) => {
    con.query('SELECT *FROM pokemon', (err, respuesta, field) => {
        if (err) return console.log('ERROR:', err)
        let userHTML = ``
        let i = 0
        console.log(respuesta)
        userHTML += `<a href="index.html">Inicio</a>`
        respuesta.forEach(user => {
            i++
            userHTML += `<tr>
                        <td class="texto2">${i}</td>  
                        <td class="texto2">${user.nombre}</td>
                        <td class="texto2">${user.region}</td>
                        <td class="texto2">${user.tipo}</td>
                        <td class="texto2"><a href="/delPok?id_pokemon=${user.id_pokemon}">Eliminar</a></td>
                        <td class="texto2"><a href="/mandarAUpdate?id_pokemon=${user.id_pokemon}">Editar</a></td>
                    </tr>`
        })

        return res.send(`
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>Pokedex</title>
        <script src="https://example.com/fontawesome/v6.2.0/js/all.js" data-search-pseudo-elements ></script>
    </head>
    <body>
        <table class="tablita">
        <tr>
            <th class="texto2">Id </th>
            <th class="texto2">Nombre </th>
            <th class="texto2">Región </th>
            <th class="texto2">Tipo </th>
            <th class="texto2">Eliminar</th>
            <th class="texto2">Editar</th>
        </tr>
            ${userHTML}
            </table>
            </body>
            </html>`)
    })
})

app.get('/mandarAUpdate', (req, res) => {
    let id_pokemon = req.query.id_pokemon
    con.query('select * from pokemon where id_pokemon=' +id_pokemon+'', (err, respuesta, field) => {
      if (err) return console.log('ERROR:', err)
      var userHTML = ``
      var i = 0
      respuesta.forEach(respuesta => {
        i++
        userHTML += `
        <form action="/editPok" method="post" class="formulario">
            <table class="tablita">
                <tr>
                    <th><h1 class="texto">Cambiar Nombre</h1></th>
                </tr>
                <tr>
                    <td><input type="text" name="nom1" class="campos" placeholder="Nombre Antiguo" value="${respuesta.nombre}"></td>
                </tr>
                <tr>
                    <th><h1 class="texto">Cambiar Región</h1></th>
                </tr>
                <tr>
                    <td><input type="text" name="reg1" class="campos" placeholder="Region Antigua" value="${respuesta.region}"></td>
                </tr>
                <tr>
                    <th><h1 class="texto">Cambiar Tipo</h1></th>
                </tr>
                <tr>
                    <td><input type="text" name="tip1" class="campos" placeholder="Tipo Antiguo" value="${respuesta.tipo}"></td>
                    <td><input type="hidden" name="id_pokemon" value="${respuesta.id_pokemon}"></td>
                </tr>
                <tr>
                    <td><input type="submit" value="Cambiar" class="boton"></td>
                </tr>
                <tr>
                    <td><a href="index.html">Regresar</a></td>
                </tr>
            </table>
        </form>`
    })
    return res.send(`
    <DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>Editar
        </title>
    </head>
    <body>
        <div class="uno">
        ${userHTML}
        </div>
    </body>
    </html>
        `)
    })
})

app.post('/editPok', (req, res) => {
    let nombrePok=req.body.nom1;
    let regionPok=req.body.reg1;
    let tipoPok=req.body.tip1;
    let id_pokemon = parseInt(req.body.id_pokemon);
    con.query('UPDATE pokemon SET region="'+regionPok+'", tipo="'+tipoPok+'", nombre="'+nombrePok+'" WHERE id_pokemon='+id_pokemon+'', (err) => {
        if (err) return console.log('ERROR:', err)
        return res.redirect("/getPok")
    })
})

app.get('/delPok', (req, res) => {
    let nombrePok=parseInt(req.query.id_pokemon);

    con.query('DELETE FROM pokemon where id_pokemon=' + nombrePok + '', (err) => {
        if (err) return console.log('ERROR:', err)
        return res.send(`
        <a href="index.html">Inicio</a>
        <h1>Pokemon ${nombrePok} eliminado</h1>`)
    })
})

app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto 4000")
})
