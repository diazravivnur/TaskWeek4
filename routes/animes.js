//Setup Depedency
var express = require('express')
var router = express.Router();
var dbConnetion = require('../lib/db');


//Get Data Animes
router.get('/', function(req, res, next) {
    dbConnetion.query("SELECT * FROM animes", function(err, rows){
        if(err){
            req.flash("Error", err);
            //Render Error
            res.render("animes", {data: ''})
            console.log(err)
        } else{
            //Render Data to Web
            res.render("animes", {data:rows})
        }
    })
})


//Display add animes Page
router.get('/add', function(req, res, next){
    //render to add.ejs
    res.render("animes/add", {
        animesTitle : "",
        animesDescription : "",
    })
})


//Add new Animes
router.post('/add', function(req, res, next){
    
    let animesTitle = req.body.animesTitle;
    let animesDescription = req.body.animesDescription;
    let errors = false;

    if(animesTitle.length === 0 || animesDescription.length === 0){
        //set Flash Message
        req.flash('Error', "Please enter Animes and Description");

        //render Response Error
        res.render('animes/add', {
            animesTitle : animesTitle,
            animesDescription : animesDescription
        })
    }
    //If No err
    if(!errors){
        var form_data = {
            animesTitle : animesTitle,
            animesDescription : animesDescription,
        }
        dbConnetion.query("INSERT INTO animes ", form_data, function(err, result){
            if(err){
                //Get Error Data
                req.flash("Error", err)

                //render to add.ejs
                res.render("animes/add", {
                    animesTitle: form_data.animesTitle,
                    animesDescription: form_data.animesDescription
                })
            } else{
                req.flash("Success", "Animes Successfully Added");
                res.redirect("/animes");
            }
        })
    }
})

//Edit Data Animes
router.get('/edit/(:id)', function(req, res, next){
    let id = req.params.id;

    //Get Id Data animes
    dbConnetion.query("SELECT * FROM animes where id = " + id, function(err, rows, fields){
        if(err) throw err

        //if data Not Found
        if(rows.length <= 0){
            req.flash("error", "Animes not Found with id = " + id)
            res.redirect("/animes")
        }else {
            //Render Edit to edit.ejs
            res.render("animes/edit", {
                title: "Edit Animes",
                id: rows[0].id,
                animesTitle: rows[0].animesTitle,
                animesDescription: rows[0].animesDescription,
            })
        }
        

        //Store Data to Db
        if(!errors){
            var form_data = {animesTitle: animesTitle, animesDescription:animesDescription}
            dbConnetion.query("UPDATE animes set ? where id =" + id, form_data, function(err, result){

                //if(err) throw error
                if(err){
                    req.flash("error", err)
                    res.render("animes/edit", {
                        id: req.params.id,
                        animesTitle: req.params.animesTitle,
                        animesDescription: req.params.animesDescription
                    })
                }
            })
        } else {
            req.flash("Success", "anime successfully update");
            req.redirect("/animes");
        }
    })
})


//delete animes
router.get('/delete/(:id)', function(req, res, next){
    let id = req.params.id;
    dbConnetion.query("DELETE FROM animes WHERE id =" + id, function(err, result){
        //if Err
        if(err){
            req.flash("Error", err)
            res.redirect("/animes")
        }else{
            req.flash("Success", "anime successfully Deleted id =" + id)
            res.redirect("/animes")
        }
    })
})



module.exports = router;