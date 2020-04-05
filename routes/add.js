var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'my-nodeapp-db',
        charset: 'utf8'
    }
});

var Bookshelf = require('bookshelf')(knex);

//Bookshelf.plugin('pagination');

var User = Bookshelf.Model.extend({
    tableName: 'users'
});

var Markdata = Bookshelf.Model.extend({
    tableName: 'markdata',
    user: function() {
        return this.belongsTo(User);
    }
});

router.get('/', (req, res, next) => {
    if(req.session.login == null) {
        res.redirect('/login');
        return;
    }
    res.render('add', { title: 'Add'});
});

router.post('/', (req, res, next) => {
    var today = new Date();
    var rec = {
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.login.id,
        created_at: today,
        updated_at: today
    }
    new Markdata(rec).save().then((model) => {
        res.redirect('/');
    });
});

module.exports = router;