const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/urls', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})