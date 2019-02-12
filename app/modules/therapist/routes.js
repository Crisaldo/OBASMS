var express = require('express')
var router = express.Router()
var db = require('../../lib/database')();
var mid = require("../../middlewares")
var moment = require ('moment')


router.get('/login/',(req,res)=>{
    const query = `SELECT * FROM utilities_tbl`
    db.query(query,(err,out)=>{
        req.session.utilities= out[0]
        res.render('therapist/therapist',{
          reqSession: req.session
        })
      })
    })
router.get('/home',mid.therapististnauthed, (req, res) => {
   const query = `SELECT * FROM therapist_tbl WHERE therapist_id = "${req.session.user.therapist_id}"`

   db.query(query,(err,out)=>{
       res.render("therapist/landing",{
           therapists : out
       })
   })
})

router.post("/therapist/login",(req, res) => {
	const query = `
    SELECT * FROM therapist_tbl
    JOIN therapist_account_tbl ON therapist_tbl.therapist_id = therapist_account_tbl.therapist_id 
    WHERE therapist_tbl.delete_stats=0 AND therapist_account_tbl.therapist_username = "${req.body.username}"`

		db.query(query, (err, out) => {
 		if(!out[0])
			return res.redirect("/therapist/login#notfound")
		else {
			if(out[0].therapist_password !== req.body.password)
				return res.redirect("/therapist/login#incorrect")
			else {
				delete out[0].therapist_password
				req.session.user = out[0]	
				return res.redirect("/therapist/home")
			}
		}

  })
})

exports.therapist = router;