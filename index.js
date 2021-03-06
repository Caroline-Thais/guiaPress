const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");
const flash = require("express-flash");
const validator = require('validator');

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//View engine
app.set("view engine", "ejs");

//Static
app.use(express.static("public"));
  
//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Flash
app.use(flash());

//Sessions
app.use(session({
    secret: "qualquercoisa",  
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 2400000}
}))

//Express Validator
const { body, validationResult } = require('express-validator');
const { get } = require("express/lib/response");

//Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    });

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/allarticles", (req, res) => {
  
    
        Article.findAll({
            order: [
                ['id','DESC']
            ],
            
        }).then(articles => { 
            Category.findAll().then(categories => {
            res.render("allarticles", {articles: articles, categories: categories});
        }   );  
        });
    });
    app.get("/:slug", (req, res) => {
        var slug = req.params.slug;
        Article.findOne({
            where:{
                slug: slug
            }
        }).then(article => {
            if(article != undefined){
                Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
                });
            }else{
                res.redirect("/allarticles");
            }
        }).catch(err => {
            res.redirect("/allarticles");
        });
    });
    
    app.get("/category/:slug", (req, res) => {
        var slug = req.params.slug;
        Category.findOne({
            where: {
                slug: slug
            },
            include: [{model: Article}]
        }).then( category => {
            if(category != undefined){
                Category.findAll().then(categories => {
                    res.render("allarticles", {articles: category.articles, categories: categories})
                });
            }else{
                res.redirect("allarticles");
            }
    
            }).catch(err => {
                res.redirect("allarticles");
            })
        });

   
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => { 
        Category.findAll().then(categories => {
        res.render("index", {articles: articles, categories: categories});
    }   );  
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
            res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/index");
        }
    }).catch(err => {
        res.redirect("/index");
    });
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            });
        }else{
            res.redirect("/");
        }

        }).catch(err => {
            res.redirect("/");
        })
    });

//const PORT = process.env.PORT || 3000
app.listen(3000, () => {
    console.log("O servidor etá rodando.")
});

