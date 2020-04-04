var express = require('express');
var router = express.Router();

var mysql = require('mysql');
const { check, validationResult } = require('express-validator');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host    : 'localhost',
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
        content: {name: '', password: ''},
        form: '名前とパスワードを入力下さい。'
    }
    res.render('login', data);
})

router.post('/', 

[
    check('username', 'NAMEは必ず入力して下さい。').notEmpty(),
    check('password', 'PASSWORDは必ず入力して下さい。').notEmpty()
],

(req, res, next) => {
    var request = req;
    var response = res;

    
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            var content = '<ul class="error">';
            var result_arr = result.array();
            for(var n in result_arr) {
                content += '<li>' + reault_arr[n].msg + '</li>'
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

            User.query({where: {name: nm}, andWhre: {password: pw}})
              .fetch()
              .then((model) => {
                  if (model == null) {
                      var data = {
                          title: '再入力',
                          content: '<p class="error">名前またはパスワードが違います</p>',
                          form: req.body
                      };
                      respose.render('login', data);
                  } else {
                      request.session.login = model.attributes;
                      var data = {
                          title: 'Login',
                          content: '<p>ログインしました!<br>トップページに戻ってメッセージを送信下さい。</p>',
                          form: req.body
                      }
                      respose.render('login', data);
                  }
              });
        }
    })
});

module.exports = router;