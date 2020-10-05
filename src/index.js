const express = require('express');
const mongoose = require('../../Casa-Verde/src/dbconnect/db-connection');
const url = require('./models/url');
require('./dbConnection');
const ShortUrl = require('./models/url');

const app = express();

/**
 * configuraciones del servidor express
**/
app.set('view engine', 'ejs');
app.set('views', 'src');
app.use(express.urlencoded({ extended: false }));//con esta propiedad es que el servidor logra obtener el dato del input de la URL

/**
 * rutas del servidor
 */
var variable = {};
app.get('/', async (req, res) => {
    const urls = await ShortUrl.find();
    variable.data = urls;
    const lastLink = urls[urls.length - 1];
    console.log("last Index of: " + lastLink);
    variable.last = lastLink.short;
    res.render('main', variable);
});

app.post('/short', async (req, res) => {
    let url = new ShortUrl({
        full: req.body.shortener
    });
    console.log("URL solicitada: " + url.full);
    await url.save();
    res.redirect('/');
});

app.get('/:shortid', async (req, res) => {
    const completeUrl = await ShortUrl.findOne({ short: req.params.shortid });
    if (!completeUrl) {
        return res.sendStatus(404);
    }
    completeUrl.clicks++;
    await completeUrl.save()
    console.log("clicks del enlace '" + completeUrl.full + "' = " + completeUrl.clicks);
    variable.data = await ShortUrl.find();
    res.redirect(completeUrl.full);
});

app.delete('/:shortid', async (req, res) => {
    const url = await ShortUrl.findOne({ short: req.params.shortid });
    if (!url) {
        return res.sendStatus(404);
    }
    await url.deleteOne().then(res.redirect('/', 200));
});


mongoose.connection.on('open', () => {
    app.listen(1337, () => {
        console.log("Servidor iniciado en puerto 1337");
    });
});
