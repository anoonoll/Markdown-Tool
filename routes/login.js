var express = require('express');
var router = express.Router();

var mysql = require('mysql');

const { check, validationResult } = require('express-validator');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host    : '127.0.0.1',
        user    : 'root',
        password: '',
        database: 'my-nodeapp-db',
        charset : 'utf8'
    }
});

var Bookshelf = require('bookshelf')(knex);

var User = Bookshelf.Model.extend({
    tableName: 'users'
});

router.get('/', (req, res, next) => {
    var data = {
        title: 'Login',
        form: {name: '', password: ''},
        content: '名前とパスワードを入力下さい。'
    }
    res.render('login', data);
})

router.post('/', 

[
    check('name', 'NAMEは必ず入力して下さい。').notEmpty(),
    check('password', 'PASSWORDは必ず入力して下さい。').notEmpty()
],

(req, res, next) => {
    var request = req;
    var response = res;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        var content = '<ul class="error">';
        var result_arr = errors.array();
        for(var n in result_arr) {
            content += '<li>' + result_arr[n].msg + '</li>'
        }
        content += '</ul>';
        var data = {
            title: 'Login',
            content: content,
            form: req.body
        }
        response.render('login', data);
    } else {
        var nm = req.body.name;
        var pw = req.body.password;

        User.query({where: {name: nm}, andWhere: {password: pw}})
            .fetch()
            .then((model) => {
                if (model == null) {
                    var data = {
                        title: '再入力',
                        content: '<p class="error">名前またはパスワードが違います</p>',
                        form: req.body
                    };
                    response.render('login', data);
                } else {
                    request.session.login = model.attributes;
                    var data = {
                        title: 'Login',
                        content: '<p>ログインしました!<br>トップページに戻ってメッセージを送信下さい。</p>',
                        form: req.body
                    }
                    response.render('login', data);
                }
            }).catch((error) => {
                var data = {
                  title: '再入力',
                  content: '<p class="error">名前またはパスワードが違います。</p>',
                  form: req.body
                };
                res.render('login', data);
                console.log(error);
            });
    }
});

module.exports = router;