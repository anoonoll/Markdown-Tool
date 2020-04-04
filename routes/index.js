var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'my-nodeapp-db',
    charset : 'utf-8'
  }
});

var Bookshelf = require('bookshelf')(knex);

//Bookshelf.plugin('pagination');

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

var Markdata = Bookshelf.Model.extend({
  tableName    : 'Markdata',
  hasTimestamps: true,
  user         : function() {
    return this.belongsTo(User);
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.login == null) {
    res.redirect('/login');
    return;
  }
  new Markdata(['title']).orderBy('created_at', 'DESC')
      .where('user_id', "=", req.session.login.id)
      .fetchPage({page: 1, pageSize: 10, widhRelated: ['user']})
      .then((collection) => {
        var data = {
          title: 'Markdown Search',
          login: req.session.login,
          message: '※最近のデータ',
          form: {find: ''},
          content: collection.toArray()
        };
        res.render('index', data);
      })
});

router.post('/', function(req, res, next) {
  new Markdata().orderBy('created_at', 'DESC')
      .where('content', 'like', '%' + req.body.find + '%')
      .fetchAll({widhRelated: ['user']})
      .then((collection) => {
      var data = {
        title: 'Markdown Search',
        login: req.session.login,
        message: '※"' + req.body.find + '" で検索された最近の投稿データ',
        form: req.body,
        conent: collection.toArray() 
      }
      res.render('index', data);
    })
})

module.exports = router;
