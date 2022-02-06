const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/AdminAuth");
const session = require("express-session");
const flash = require("express-flash"); 
const bodyParser = require("body-parser"); 
var validator = require('validator');

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
    res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", adminAuth, (req, res) => {


    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user == undefined){

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    User.create({
        email: email,
        password: hash
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch((err) => {
        res.redirect("/admin/articles");
    });

    
    }else{
            res.redirect("/admin/users/create");
        }
    });
});



router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){//Se existe um usuário com esse email
            //Validar senha
            var correct = bcrypt.compareSync(password, user.password);
        
        if(correct){
            req.session.user = {
                id: user.id,
                email: user.email
            }
            res.redirect("/admin/users/panel");
        }else{
            res.redirect("/login");
        }
        }else{
            res.redirect("/login");
        }
    });
});

router.get("/admin/users/panel", (req, res) => {
    res.render("admin/users/panel");
})


router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;