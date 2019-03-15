var express = require('express')
var router = express.Router()
var db = require('../../lib/database')();
var mid = require("../../middlewares")
var moment = require ('moment')


// [FRONT DESK - LOGIN PAGE] 
router.get('/frontdesk', (req, res) => {
  const query =`SELECT * FROM utilities_tbl`
  
  db.query(query,(err,out)=>{
    req.session.utilities= out[0]
    res.render('frontdesk/frontdesk',{
      reqSession: req.session
    })
  })
})
// [LOGIN]
router.post("/frontdesk/login",(req, res) => {
	const query = `
  select * from admin_tbl where admin_username = "${req.body.admin_username}" and admin_desc="front_desk"`

		db.query(query, (err, out) => {
 		if(!out[0])
			return res.redirect("/frontdesk#notfound")
		else {
			if(out[0].admin_password !== req.body.admin_password)
				return res.redirect("/frontdesk#incorrect")
			else {
				delete out[0].admin_password
				req.session.user = out[0]	
				return res.redirect("/frontdesk/home")
			}
		}

  })
})
// [LOG OUT]
router.post("/frontdesk/logout", (req, res) => {
  req.session.destroy(err => {
    if(err) console.err
    res.redirect("/frontdesk")
  })
})
// [FRONTDESK-HOME]
router.get('/frontdesk/home',mid.frontdesknauthed,(req,res)=>{
  var date_time = moment(new Date()).format('MMMM-DD-YYYY HH:mm')
  var dateLang= moment(new Date()).format('MMMM-DD-YYYY')
  const query = ` select * from customer_tbl where delete_stats=0;
  SELECT * FROM utilities_tbl;
  SELECT * FROM vat_exempted_tbl;
  SELECT therapist_tbl.*, therapist_attendance_tbl.* 
  FROM therapist_tbl JOIN therapist_attendance_tbl 
  ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
  WHERE therapist_tbl.therapist_availability =0 AND therapist_tbl.delete_stats=0`
  db.query(query,(err,out) =>{
    req.session.utilities = out[1]
      res.render('frontdesk/registration',{
        customers: out[0],
        reqSession: req.session,
        vatExempts: out[2]
      })
      for(var i=0;i<out[3].length;i++){
        console.log(moment(out[3][i].therapist_datetime_in).format('MMMM-DD-YYYY'))
        var therapist_date = moment(out[3][i].therapist_datetime_in).format('MMMM-DD-YYYY')
        console.log(moment(therapist_date).isBefore(dateLang))
        if(moment(therapist_date).isBefore(dateLang)){
          const therapist_attendance = `UPDATE therapist_attendance_tbl 
            SET therapist_datetime_in = NULL, 
            availability = 0,
            therapist_reserved =0 WHERE therapist_id= "${out[3][i].therapist_id}"`
            
            db.query(therapist_attendance,(err,out)=>{

            })
        }
      }
      // var closing_time = dateLang+' '+req.session.utilities[0].closing_time
      //     closing_time = moment(closing_time).format('MMMM-DD-YYYY HH:mm')
      // var opening_time = dateLang+' '+req.session.utilities[0].opening_time
      //     opening_time = moment(opening_time).format('MMMM-DD-YYYY HH:mm')
      //     opening_time = moment(opening_time).subtract(6,'h').format('MMMM-DD-YYYY HH:mm')
      //     // opening_time = moment(opening_time).format('MMMM-DD-YYYY hh:mm')
      //     console.log('CLOSING TIME',closing_time)
      //     console.log('DATE AND TIME',date_time)
      //     console.log('OPENING TIME',opening_time)
      // console.log(moment(date_time).isSameOrAfter(closing_time) && moment(date_time).isSameOrBefore(opening_time))
      // if(moment(date_time).isSameOrAfter(closing_time) && moment(date_time).isSameOrBefore(opening_time))
      // {
      //   const therapist_attendance = `UPDATE therapist_attendance_tbl 
      //   SET therapist_datetime_in = NULL, 
      //   availability = 0,
      //   doneService_count = 0,
      //    therapist_reserved =0`
        
      //   db.query(therapist_attendance,(err,out)=>{
      //     console.log(therapist_attendance)
      //       console.log(err)
      //   })
      // }
    })
    
  })


  
router.post('/Customer/viewCustomerDetails',(req,res)=>{
  const query = `SELECT * FROM customer_tbl WHERE cust_id = ${req.body.customer_id}`

  db.query(query,(err,out)=>{
    console.log(out)
    res.send(out)
  })
})
router.post('/Customer/viewCustomerLoyaltyDetails',(req,res)=>{
  const query = `SELECT customer_tbl.* ,loyalty_tbl.* FROM customer_tbl 
  JOIN loyalty_tbl ON customer_tbl.cust_id = loyalty_tbl.cust_id WHERE customer_tbl.cust_id = ${req.body.customer_id}`

  db.query(query,(err,out)=>{
    console.log(query)
    console.log(out)
    res.send(out)
  })
})
// // [SEARCH]
// router.post('/frontdesk/search', (req, res) => {
//   console.log(req.body.searchBar)
//   const query= `SELECT * FROM customer_tbl WHERE
//   cust_fname LIKE '%${req.body.searchBar}%' OR
//   cust_mname LIKE '%${req.body.searchBar}%' OR
//   cust_lname LIKE '%${req.body.searchBar}%' OR
//   CONCAT(cust_fname," ",cust_lname)  = '${req.body.searchBar}' AND delete_stats=0
//   `
//   db.query(query, (err,out)=>{
//     res.send({out:out})
//     console.log(query)
//     console.log(out)
//   })
// })

// [ADD NEW CUSTOMER]
router.post('/frontdesk/home/newCustomer',(req, res) => {
  const query= `select * from customer_tbl where cust_fname LIKE "%${req.body.firstname}%" and cust_lname LIKE "%${req.body.lastname}%" 
  and cust_birthMonth LIKE "%${req.body.month}%" and cust_birthDate LIKE "%${req.body.date}%" and cust_birthYear LIKE "%${req.body.year}%" and cust_address LIKE "%${req.body.address}%"`
  
  db.query(query, (err, out) => {
    if(out== undefined || out == 0)
    {
    var alertSuccess = 1 ;
    var notSuccess = 0
    const query = `
    insert into 
    customer_tbl(cust_fname,cust_mname, cust_lname, cust_birthMonth, cust_birthDate, cust_birthYear, cust_address,cust_contact_no, cust_gender, medical_history, delete_stats, cust_type, vat_exempt_id,vat_exempt_id_no) 
    values("${req.body.firstname}","${req.body.middlename}","${req.body.lastname}", "${req.body.month}","${req.body.date}","${req.body.year}", 
    "${req.body.address}","${req.body.contact_no}", "${req.body.gender}", "${req.body.medical_history}",0,0,${req.body.vat_type_id},"${req.body.vat_id_no}")
    `

    db.query(query, (err, out) => {
      console.log("----------------------------")
      console.log("CUSTOMER NOT EXIST")
      console.log("----------------------------")
      console.log("NAGINSERT CHECK MO PA SA DB")
      console.log("----------------------------")
      console.log(query)
      console.log(alertSuccess)
      // return res.redirect("/frontdesk/home#success")
      res.send({alertSuccess:alertSuccess})
    })
    }
    else if(out != undefined) 
    {
      db.query(query, (err, out) => {
        console.log("----------------------------")
        console.log("CUSTOMER ALREADY EXIST")
        console.log("----------------------------")
        console.log("DI NAGINSERT CHECK MO PA SA DB")
        console.log("----------------------------")

        res.send({alertSuccess:notSuccess})
        // return res.redirect("/frontdesk/home#customeralreadyexist")
      })
    }
  })
})

//[ADD NEW CUSTOMER - LOYALTY]
router.post('/frontdesk/home/newCustomer/Loyalty',(req, res) => {
  var cust_id;
  var alertSuccess =0
  var notSuccess=1
  const query= `select * from customer_tbl where cust_fname LIKE "%${req.body.firstname}%" and cust_lname LIKE "%${req.body.lastname}%" 
  and cust_birthMonth LIKE "%${req.body.month}%" and cust_birthDate LIKE "%${req.body.date}%" and cust_birthYear LIKE "%${req.body.year}%" and cust_address LIKE "%${req.body.address}%"`
  db.query(query, (err, out) => {
    if(out== undefined || out == 0)
    {
      const query = `select * from loyalty_tbl where member_username = "${req.body.username}"`
      db.query(query, (err,out)=>{
        if(out== undefined || out ==0)
        {
          var alertSuccess = 1 ;
          var notSuccess= 0;
          const query = `
          insert into 
          customer_tbl(cust_fname,cust_mname, cust_lname, cust_birthMonth, cust_birthDate, cust_birthYear, cust_address,cust_contact_no, cust_gender, medical_history, delete_stats,cust_type) 
          values("${req.body.firstname}","${req.body.middlename}","${req.body.lastname}", "${req.body.month}","${req.body.date}","${req.body.year}", 
          "${req.body.address}","${req.body.contact_no}", "${req.body.gender}", "${req.body.medical_history}",0,1)
          `
      
          db.query(query, (err, out) => {
            cust_id= out.insertId;
            const query1 =`insert into loyalty_tbl(cust_id,member_username, member_password, member_points, membership_validity,paid_status) 
            value("${cust_id}","${req.body.username}","${req.body.password}",0,"${req.body.membershipDate}",0)`
            db.query(query1, (err,out)=>{
              console.log(query1)
              console.log(err)
              res.send({alertSuccess: alertSuccess})
            })

          })
        }
        else if(out != undefined)
        {
          db.query(query, (err, out) => {
            res.send({alertSuccess: notSuccess})
          })
        }
      })
    }
    else if(out != undefined) 
    {
      db.query(query, (err, out) => {
        res.send({alertSuccess:notSuccess})
      })
    }
  })
})


// REGISTRATION FOR LOYALTY PAY LATER
router.post('/RegisterCommonToLoyalty',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1
  var loyaltyExist=2
  const query = `SELECT * FROM loyalty_tbl WHERE member_username="${req.body.username}"`

  db.query(query,(err,out)=>{
    if(out == undefined || out == 0)
    {
      const query = `INSERT INTO loyalty_tbl(cust_id,member_username,member_password,member_points,membership_validity,paid_status)
      VALUES("${req.body.cust_id}","${req.body.username}","${req.body.password1}",0,"${req.body.validity}",0)`
      
      db.query(query,(err,out)=>{
        if(err)
        {
          res.send({alertDesc:notSuccess})
          console.log(err)
        }
        else
        {
          const query =`UPDATE customer_tbl SET cust_type = 1 WHERE cust_id = "${req.body.cust_id}"`
        
          db.query(query,(err,out)=>{
            if(err)
            {
              res.send({alertDesc:notSuccess})
              console.log(err)
            }
            else
            {
              res.send({alertDesc:alertSuccess})
            }
          })
        }
      })
    }
  else if (out != undefined || out != 0)
  {
    res.send({alertDesc:loyaltyExist})
  }
  })
})

// REGISTRATION FOR LOYALTY PAY NOW
router.post('/RegisterCommonToLoyaltyPayNow',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1
  var loyaltyExist=2
  const query = `SELECT * FROM loyalty_tbl WHERE member_username= "${req.body.username}"`

  db.query(query,(err,out)=>{
    if(out == undefined || out == 0 )
    {
      const query = `INSERT INTO loyalty_tbl(cust_id,member_username,member_password,member_points,membership_validity,paid_status)
      VALUES("${req.body.cust_id}","${req.body.username}","${req.body.password1}",0,"${req.body.validity}",1)`

      db.query(query,(err,out)=>{
        var inserted_id = out.insertId
        if(err)
        {
          res.send({alertDesc:notSuccess})
          console.log('ERROR IN INSERTING THE DATA OF NEW LOYALTY MEMBER')
          console.log(err)
        }
        else
        {
          const query =`UPDATE customer_tbl SET cust_type = 1 WHERE cust_id = "${req.body.cust_id}"`

          db.query(query,(err,out)=>{
            if(err)
            {
              res.send({alertDesc:notSuccess})
              console.log('ERROR IN UPDATING THE CUST_TYPE OF EXISTING CUSTOMER')
              console.log(err)
            }
            else
            {
              var dateNow = moment(new Date()).format('MMMM DD, YYYY')
              const query =`INSERT INTO payment_loyalty_trans_tbl(loyalty_id,payment_date,payment_amount)
              VALUES("${inserted_id}","${dateNow}","${req.body.membership_fee}")`

              db.query(query,(err,out)=>{
                if(err)
                {
                  res.send({alertDesc:notSuccess})
                  console.log('ERROR IN INSERTING THE DATA ON PAYMENT_LOYALTY_TRANS_TBL')
                  console.log(err)
                }
                else
                {
                  res.send({alertDesc:alertSuccess})
                }
              })
            }
          })
        }
      })
    }
    else if( out != undefined || out != 0 )
    {
      res.send({alertDesc:loyaltyExist})
    }
  })
})
// // [RESERVATION]
// router.get('/reservation',mid.frontdesknauthed,(req, res) => {
//   date = req.query.date 
//   console.log(date)
//   console.log('ID NI CUSTOMER')
//   console.log(customerId)
//   const query = `
//   SELECT services_tbl.*, service_duration_tbl.service_duration_desc, service_type_tbl.service_type_desc from services_tbl join service_duration_tbl 
//   on services_tbl.service_duration_id = service_duration_tbl.service_duration_id join service_type_tbl 
//   on services_tbl.service_type_id = service_type_tbl.service_type_id where services_tbl.delete_stats=0 and services_tbl.service_availability=0; 
//   SELECT * FROM promo_bundle_tbl where delete_stats = 0;
//   SELECT * FROM room_tbl where delete_stats=0 and room_availability= 0 and room_type_id=2;
//   SELECT * FROM room_tbl where delete_stats=0 and room_availability= 0 and room_type_id=6;
//   SELECT * FROM therapist_tbl where delete_stats=0 and therapist_availability= 0;
//   SELECT * FROM customer_tbl where delete_stats=0 and cust_id=${customerId}`
  
//   db.query(query,(err,out) =>{
//       res.render('frontdesk/reservation',{
//         services: out[0],
//         promos: out[1],
//         crooms: out[2],
//         prooms: out[3],
//         therapists: out[4],
//         customers: out[5],
//         date
//       })
//     })
//   })


router.post('/selectTime/query',(req, res) => {
  const query = `select * from room_tbl where delete_stats=0 and room_availability=0`
  db.query(query,(err, out) => {
    res.send(out)
    console.log(out)
    console.log('OUT FROM QUERY^')
  })
})

router.post('/selectTime/queryRoom',(req,res)=>{
  const query = `SELECT * FROM room_tbl where delete_stats = 0 AND room_availability=0`

  db.query(query,(err,out)=>{
    res.send(out)
    console.log(out)
    console.log('OUT FROM QUERY ROOM ^')
  })
})

router.post('/selectTime/queryCommon',(req, res) => {
  const query = `SELECT room_tbl.*, room_type_tbl.*
  FROM room_tbl 
  JOIN room_type_tbl ON room_tbl.room_type_id = room_type_tbl.room_type_id
  WHERE room_tbl.room_rate = 0
  GROUP BY room_tbl.room_type_id;
  SELECT * FROM room_tbl where room_gender = 1;
  SELECT * FROM room_tbl where room_gender = 2
  `

  db.query(query,(err, out) => {
    res.send({common:out[0],
    boys:out[1],
    girls:out[2]
    })
    console.log(out)
    console.log('OUT^')
  })
})
router.post('/selectTime/addResource/Multiple', mid.frontdesknauthed,(req,res)=>{
  var dateNow = moment().format('MM-DD-YYYY')
  console.log(dateNow)
  var datePicked = moment(req.body.datePick).format('YYYY-MM-DD')
  const query =`SELECT SUM(bed_occupied_boys) AS boys_occupied,SUM(bed_occupied_girls) AS girls_occupied, 
  walkin_queue_tbl.*, room_in_service_tbl.* , room_tbl.*
  FROM walkin_queue_tbl JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_date = '${datePicked}' AND walkin_queue_tbl.delete_stats = 0  AND walkin_queue_tbl.walkin_indicator != 2
  GROUP BY walkin_queue_tbl.walkin_start_time , room_tbl.room_name
  ORDER BY walkin_queue_tbl.walkin_start_time`

  db.query(query,(err,out)=>{
    console.log(query)
    console.log('QUERY FROM MULTIPLE')
    console.log('==============================================')
    console.log(out)
    console.log('OUT FROM MULTIPLE^')
    for(var i=0;i<out.length;i++)
    {
      out[i].walkin_date = moment(out[i].walkin_date).format('MM-DD-YYYY')
    }
    res.send(out)
  })
})
router.post('/selectTime/addResource', mid.frontdesknauthed,(req,res)=>{
  console.log(req.body)
  var dateNow = moment().format('MM-DD-YYYY')
  // console.log(dateNow)
  var datePicked = moment(req.body.datePick).format('YYYY-MM-DD')
  console.log('date picked',datePicked)
  const query =`SELECT SUM(bed_occupied_boys) AS boys_occupied,SUM(bed_occupied_girls) AS girls_occupied, 
  walkin_queue_tbl.*, room_in_service_tbl.* , room_tbl.*
  FROM walkin_queue_tbl JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_date = '${datePicked}' AND room_tbl.room_id= ?
  AND walkin_queue_tbl.delete_stats= 0 
  AND walkin_queue_tbl.walkin_indicator != 2
  GROUP BY walkin_queue_tbl.walkin_start_time , room_tbl.room_name
  ORDER BY walkin_queue_tbl.walkin_start_time `

  db.query(query,[req.body.id],(err,out)=>{
    for(var i=0;i<out.length;i++)
    {
      out[i].walkin_date = moment(out[i].walkin_date).format('MM-DD-YYYY')
    }
    res.send(out)
    console.log('OUT')
    console.log(out)
    console.log(query)
  })
})


// // [BOOK RESERVATION - SELECTING DATE]
// router.get('/selectDate',mid.frontdesknauthed,(req,res)=>{
//   res.render('frontdesk/selectDate')
// })

// [BOOK RESERVATION - SELECTING DATE]
router.get('/selectDate',mid.frontdesknauthed,(req, res) => {
  customerId = req.query.id
  restype=req.query.reservetype
  var male = req.query.male
  var female = req.query.female
  console.log(male)
  console.log(female)
  console.log(customerId)
  const query = `SELECT * FROM customer_tbl where cust_id= ${customerId};
  SELECT * FROM utilities_tbl`
  db.query(query,(err,out) =>{
    req.session.utilities = out[1]
		res.render("frontdesk/selectDate",{
      customers: out[0],
      customerId,
      restype, male,female,
      reqSession: req.session
		})
	})
})

// [BOOK RESERVATION - CHOOSE SERVICES]
router.get('/bookreservation', mid.frontdesknauthed,(req, res) => {
  var total_male = req.query.male
  var total_female = req.query.female
  var total_res = parseInt(total_male) + parseInt(total_female)
  var dateHello = req.query.date
  var time = req.query.time
  room = req.query.room
  roomId = req.query.roomId
  var date_time = moment(dateHello+' '+time).format('MM-DD-YYYY HH:mm')
  var reservetype = req.query.reservetype
  var pickedDate = moment(dateHello).format('YYYYMMDD')
  console.log(pickedDate)
  console.log('RESERVETYPE',reservetype)
  if(reservetype =='single')
  {
    const query = `
  SELECT * FROM services_tbl 
  JOIN service_duration_tbl ON services_tbl.service_duration_id = service_duration_tbl.service_duration_id 
  JOIN service_type_tbl ON services_tbl.service_type_id = service_type_tbl.service_type_id 
  WHERE services_tbl.delete_stats=0 AND services_tbl.service_availability=0; 
  SELECT * FROM promo_bundle_tbl
  WHERE delete_stats= 0 
  AND promobundle_availability=0 
  AND promobundle_maxPerson = 1 
  AND promobundle_valid_from <= '${pickedDate}' 
  AND promobundle_valid_until >= '${pickedDate}';
  SELECT * FROM room_tbl where delete_stats=0 and room_availability= 0 and room_type_id=2;
  SELECT * FROM room_tbl where delete_stats=0 and room_availability= 0 and room_type_id=6;
  SELECT * FROM customer_tbl where delete_stats=0 and cust_id=${customerId};
  SELECT * FROM utilities_tbl;
  SELECT * FROM package_tbl
  JOIN service_in_package_tbl ON package_tbl.package_id = service_in_package_tbl.package_id
  JOIN services_tbl ON service_in_package_tbl.service_id = services_tbl.service_id
  WHERE package_tbl.delete_stats= 0 AND package_tbl.package_availability = 0 
  AND package_maxPerson = 1
  GROUP BY service_in_package_tbl.package_id;
  SELECT * FROM giftcertificate_tbl WHERE release_stats = 2 OR release_stats=4;`
  
  db.query(query,(err,out) =>{
    req.session.utilities = out[5]
    var services= out[0]
    var promos= out[1]
    var crooms= out[2]
    var prooms= out[3]
    var customers= out[4]
    var packages = out[6]
    var giftcerts = out[7]

    // console.log(req.session.utilities)
    // console.log(req.session.utilities[0].company_name)
    var date = moment(new Date()).format('MM-DD-YYYY')
      var firstShift_timeStart = date+" "+req.session.utilities[0].firstShift_timeStart
      var firstShift_timeEnd = date+" "+req.session.utilities[0].firstShift_timeEnd
      firstShift_timeStart = moment(firstShift_timeStart).format('MM-DD-YYYY HH:mm')
      firstShift_timeEnd = moment(firstShift_timeEnd).format('MM-DD-YYYY HH:mm')
      var secondShift_timeStart = date+" "+req.session.utilities[0].secondShift_timeStart
      var secondShift_timeEnd = date+" "+req.session.utilities[0].secondShift_timeEnd
      secondShift_timeStart = moment(secondShift_timeStart).format('MM-DD-YYYY HH:mm')
      secondShift_timeEnd = moment(secondShift_timeEnd).format('MM-DD-YYYY HH:mm')
      var date_timeNow = moment(new Date()).format('MM-DD-YYYY HH:mm ')
    
      // console.log(secondShift_timeStart)
      // console.log(secondShift_timeEnd)
      console.log("TIME PICK "+date_time)
      console.log(secondShift_timeEnd)
      console.log(moment(date_time).isSameOrAfter(firstShift_timeStart))
      console.log(moment(date_time).isBefore(firstShift_timeEnd))
      console.log(moment(date_time).isSameOrBefore(secondShift_timeStart))
      console.log(moment(date_time).isSameOrAfter(secondShift_timeEnd))
      console.log('=======================================================')
      console.log(moment(date_time).isSameOrAfter(secondShift_timeStart))
      console.log(moment(date_time).isSameOrAfter(secondShift_timeEnd))
      console.log(moment(date_time).isSameOrAfter(firstShift_timeStart))
      console.log(moment(date_time).isSameOrBefore(firstShift_timeEnd))

      var current_date = moment(new Date()).format('MM-DD-YYYY')
      var choosenDate = moment(dateHello).format('MM-DD-YYYY')
      if(moment(current_date).isSame(choosenDate))
      {
        if(moment(date_time).isSameOrAfter(firstShift_timeStart) && moment(date_time).isBefore(firstShift_timeEnd) && moment(date_time).isSameOrBefore(secondShift_timeStart) && moment(date_time).isSameOrAfter(secondShift_timeEnd))
        {
          console.log('FIRST')
          const query=`SELECT therapist_tbl.*, therapist_attendance_tbl.* 
          FROM therapist_tbl JOIN therapist_attendance_tbl
          ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
          WHERE therapist_attendance_tbl.availability =1 AND therapist_tbl.therapist_shift='First'
          ORDER BY therapist_attendance_tbl.therapist_datetime_in ASC`
      
          db.query(query,(err,out)=>{
            res.render('frontdesk/fdBookReservation',{
              date, time,room, roomId,
              reqSession: req.session,services,promos, crooms, prooms, customers,
              therapist: out, packages,
              dateHello, giftcerts,reservetype,total_male,total_female,total_res          })
          })
        }
        else if(moment(date_time).isSameOrAfter(secondShift_timeStart) && moment(date_time).isSameOrAfter(secondShift_timeEnd) && moment(date_time).isSameOrAfter(firstShift_timeStart) && moment(date_time).isSameOrAfter(firstShift_timeEnd))
        {
          console.log('SECOND')
          const query=`SELECT therapist_tbl.*, therapist_attendance_tbl.* 
          FROM therapist_tbl JOIN therapist_attendance_tbl
          ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
          WHERE therapist_attendance_tbl.availability =1 AND therapist_tbl.therapist_shift='Second'
          ORDER BY therapist_attendance_tbl.therapist_datetime_in ASC`
      
          db.query(query,(err,out)=>{
            res.render('frontdesk/fdBookReservation',{
              date, time,room, roomId,
              reqSession: req.session,services,promos, crooms, prooms, customers,
              therapist: out,packages,
              dateHello, giftcerts,reservetype,total_male,total_female,total_res 
            })
          })
        }
      } else {
        if(moment(date_time).isSameOrAfter(firstShift_timeStart) && moment(date_time).isBefore(firstShift_timeEnd) && moment(date_time).isSameOrBefore(secondShift_timeStart) && moment(date_time).isSameOrAfter(secondShift_timeEnd))
        {
          console.log('FIRST')
          const query=`SELECT *
          FROM therapist_tbl JOIN therapist_attendance_tbl
          ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
          WHERE therapist_tbl.therapist_shift='First' AND therapist_tbl.delete_stats = 0
          ORDER BY therapist_attendance_tbl.therapist_datetime_in ASC`
      
          db.query(query,(err,out)=>{
            res.render('frontdesk/fdBookReservation',{
              date, time,room, roomId,
              reqSession: req.session,services,promos, crooms, prooms, customers,
              therapist: out, packages,
              dateHello, giftcerts,reservetype,total_male,total_female,total_res          })
          })
        }
        else if(moment(date_time).isSameOrAfter(secondShift_timeStart) && moment(date_time).isSameOrAfter(secondShift_timeEnd) && moment(date_time).isSameOrAfter(firstShift_timeStart) && moment(date_time).isSameOrAfter(firstShift_timeEnd))
        {
          console.log('SECOND')
          const query=`SELECT therapist_tbl.*, therapist_attendance_tbl.* 
          FROM therapist_tbl JOIN therapist_attendance_tbl
          ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
          WHERE therapist_tbl.therapist_shift='Second' AND therapist_tbl.delete_stats = 0
          ORDER BY therapist_attendance_tbl.therapist_datetime_in ASC`
      
          db.query(query,(err,out)=>{
            res.render('frontdesk/fdBookReservation',{
              date, time,room, roomId,
              reqSession: req.session,services,promos, crooms, prooms, customers,
              therapist: out,packages,
              dateHello, giftcerts,reservetype,total_male,total_female,total_res 
            })
          })
        }
      }
      
    })

  }
  else
  {

    // console.log(dateHello+' jkjkjj '+time)
  
    const query = `
    SELECT * FROM services_tbl 
    JOIN service_duration_tbl ON services_tbl.service_duration_id = service_duration_tbl.service_duration_id 
    JOIN service_type_tbl ON services_tbl.service_type_id = service_type_tbl.service_type_id 
    WHERE services_tbl.delete_stats=0 AND services_tbl.service_availability=0; 
    SELECT * FROM promo_bundle_tbl
    JOIN service_in_promo_tbl ON service_in_promo_tbl.promobundle_id = promo_bundle_tbl.promobundle_id
    JOIN services_tbl ON service_in_promo_tbl.service_id = services_tbl.service_id
    WHERE promo_bundle_tbl.delete_stats= 0 AND promo_bundle_tbl.promobundle_availability=0 AND promobundle_maxPerson = "${total_res}" AND promobundle_valid_from <= '${pickedDate}'AND promobundle_valid_until >= '${pickedDate}'
    GROUP BY service_in_promo_tbl.promobundle_id;
    SELECT * FROM room_tbl where delete_stats=0 and room_availability= 0 and room_type_id=2;
    SELECT * FROM room_tbl where delete_stats=0 and room_availability= 0 and room_type_id=6;
    SELECT * FROM customer_tbl where delete_stats=0 and cust_id=${customerId};
    SELECT * FROM utilities_tbl;
    SELECT * FROM package_tbl
    JOIN service_in_package_tbl ON package_tbl.package_id = service_in_package_tbl.package_id
    JOIN services_tbl ON service_in_package_tbl.service_id = services_tbl.service_id
    WHERE package_tbl.delete_stats= 0 AND package_tbl.package_availability = 0 
    AND package_maxPerson = "${total_res}"
    GROUP BY service_in_package_tbl.package_id ;
    SELECT * FROM giftcertificate_tbl WHERE release_stats = 2 OR release_stats=4`
    
    db.query(query,(err,out) =>{
      req.session.utilities = out[5]
      var services= out[0]
      var promos= out[1]
      var crooms= out[2]
      var prooms= out[3]
      var customers= out[4]
      var packages = out[6]
      var giftcerts = out[7]
      // console.log(req.session.utilities)
      // console.log(req.session.utilities[0].company_name)
      var date = moment(new Date()).format('MM-DD-YYYY')
        var firstShift_timeStart = date+" "+req.session.utilities[0].firstShift_timeStart
        var firstShift_timeEnd = date+" "+req.session.utilities[0].firstShift_timeEnd
        firstShift_timeStart = moment(firstShift_timeStart).format('MM-DD-YYYY HH:mm')
        firstShift_timeEnd = moment(firstShift_timeEnd).format('MM-DD-YYYY HH:mm')
        var secondShift_timeStart = date+" "+req.session.utilities[0].secondShift_timeStart
        var secondShift_timeEnd = date+" "+req.session.utilities[0].secondShift_timeEnd
        secondShift_timeStart = moment(secondShift_timeStart).format('MM-DD-YYYY HH:mm')
        secondShift_timeEnd = moment(secondShift_timeEnd).format('MM-DD-YYYY HH:mm')
        var date_timeNow = moment(new Date()).format('MM-DD-YYYY HH:mm ')
      
        // console.log(secondShift_timeStart)
        // console.log(secondShift_timeEnd)
        console.log("TIME PICK "+date_time)
        console.log(secondShift_timeEnd)
        console.log(moment(date_time).isSameOrAfter(firstShift_timeStart))
        console.log(moment(date_time).isBefore(firstShift_timeEnd))
        console.log(moment(date_time).isSameOrBefore(secondShift_timeStart))
        console.log(moment(date_time).isSameOrAfter(secondShift_timeEnd))
        console.log('=======================================================')
        console.log(moment(date_time).isSameOrAfter(secondShift_timeStart))
        console.log(moment(date_time).isSameOrAfter(secondShift_timeEnd))
        console.log(moment(date_time).isSameOrAfter(firstShift_timeStart))
        console.log(moment(date_time).isSameOrBefore(firstShift_timeEnd))
        if(moment(date_time).isSameOrAfter(firstShift_timeStart) && moment(date_time).isBefore(firstShift_timeEnd) && moment(date_time).isSameOrBefore(secondShift_timeStart) && moment(date_time).isSameOrAfter(secondShift_timeEnd))
        {
          console.log('FIRST')
          const query=`SELECT therapist_tbl.*, therapist_attendance_tbl.* 
          FROM therapist_tbl JOIN therapist_attendance_tbl
          ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
          WHERE therapist_attendance_tbl.availability =1 AND therapist_tbl.therapist_shift='First'
          ORDER BY therapist_attendance_tbl.therapist_datetime_in DESC`
      
          db.query(query,(err,out)=>{
            res.render('frontdesk/fdBookReservation',{
              date, time,room, roomId,
              reqSession: req.session,services,promos, crooms, prooms, customers,
              therapist: out, packages,
              dateHello, giftcerts,reservetype,total_male,total_female,total_res 
            })
          })
        }
        else if(moment(date_time).isSameOrAfter(secondShift_timeStart) && moment(date_time).isSameOrAfter(secondShift_timeEnd) && moment(date_time).isSameOrAfter(firstShift_timeStart) && moment(date_time).isSameOrAfter(firstShift_timeEnd))
        {
          console.log('SECOND')
          const query=`SELECT therapist_tbl.*, therapist_attendance_tbl.* 
          FROM therapist_tbl JOIN therapist_attendance_tbl
          ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
          WHERE therapist_attendance_tbl.availability =1 AND therapist_tbl.therapist_shift='Second'
          ORDER BY therapist_attendance_tbl.therapist_datetime_in ASC`
      
          db.query(query,(err,out)=>{
            res.render('frontdesk/fdBookReservation',{
              date, time,room, roomId,
              reqSession: req.session,services,promos, crooms, prooms, customers,
              therapist: out,packages,
              dateHello, giftcerts,reservetype,total_male,total_female,total_res 
            })
          })
        }
      })
  }


    })

// CHECK THERAPIST AVAILABILITY
router.post('/TherapistValidate',(req,res)=>{
  var notAvailable =0
  console.log(req.body)
  var walkin_dateRes = moment(req.body.walkin_date).format('YYYY-MM-DD')
  var therapist = req.body.therapist_id
  if(req.body.restype == 'single')
  {
    const query =`SELECT * FROM therapist_tbl
    JOIN therapist_attendance_tbl ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
    JOIN therapist_in_service_tbl ON therapist_tbl.therapist_id = therapist_in_service_tbl.therapist_id
    JOIN walkin_queue_tbl ON therapist_in_service_tbl.walkin_id = walkin_queue_tbl.walkin_id
    WHERE therapist_tbl.therapist_id="${therapist}" AND walkin_queue_tbl.walkin_date ="${walkin_dateRes}"
    AND walkin_queue_tbl.delete_stats = 0 AND walkin_queue_tbl.walkin_indicator != 2`
  
    db.query(query,(err,out)=>{
      console.log(query)
      console.log(out)
      for(var i=0;i<out.length;i++)
      {
        var walkin_date = moment(out[i].walkin_date).format('MM-DD-YYYY')
        var StartTime = walkin_date+" "+out[i].walkin_start_time
        var EndTime = walkin_date+' '+out[i].walkin_end_time
        var time_pick = req.body.walkin_date+" "+req.body.time_pick
        var start_time = moment(time_pick).isSameOrAfter(StartTime)
        var end_time = moment(time_pick).isSameOrBefore(EndTime)
        console.log('START',start_time)
        console.log('End',end_time)
        if(start_time && end_time)
        {
          return res.send({alertDesc:notAvailable,out})
        }
      }
    })
  }
  else 
  {
    for(var i=0;i<therapist.length;i++)
    {
      const query =`SELECT * FROM therapist_tbl
    JOIN therapist_attendance_tbl ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
    JOIN therapist_in_service_tbl ON therapist_tbl.therapist_id = therapist_in_service_tbl.therapist_id
    JOIN walkin_queue_tbl ON therapist_in_service_tbl.walkin_id = walkin_queue_tbl.walkin_id
    WHERE therapist_tbl.therapist_id="${therapist[i]}" AND walkin_queue_tbl.walkin_date ="${walkin_dateRes}"`
  
    db.query(query,(err,out)=>{
      console.log(query)
      console.log(out)
      for(var i=0;i<out.length;i++)
      {
        var walkin_date = moment(out[i].walkin_date).format('MM-DD-YYYY')
        var StartTime = walkin_date+" "+out[i].walkin_start_time
        var EndTime = walkin_date+' '+out[i].walkin_end_time
        var time_pick = req.body.walkin_date+" "+req.body.time_pick
        var start_time = moment(time_pick).isSameOrAfter(StartTime)
        var end_time = moment(time_pick).isSameOrBefore(EndTime)
        console.log('START',start_time)
        console.log('End',end_time)
        if(start_time && end_time)
        {
          return res.send({alertDesc:notAvailable,out})
        }
      }
    })
    }
  }
})

// [BOOK RESERVATION - CHECK CUSTOMER DETAILS]
router.post('/CheckCustomer/Details',(req,res)=>{
  const customerQuery =`SELECT * FROM customer_tbl WHERE cust_id = ${req.body.cust_id}`

  db.query(customerQuery,(err,out)=>{
    console.log(out)
    console.log(out[0].cust_type == 0)
    if(out[0].cust_type == 0 )
    {
      res.send(out)
    }
    else
    {
      const query = `SELECT customer_tbl.* , loyalty_tbl.* FROM customer_tbl
      JOIN loyalty_tbl ON customer_tbl.cust_id = loyalty_tbl.cust_id 
      WHERE customer_tbl.cust_id = ${req.body.cust_id}`

      db.query(query,(err,out)=>{
        res.send(out)
      })
    }


  })
})

// [BOOK RESERVATION - CHECK ROOM DETAILS]
router.post('/CheckRoomDetails',(req,res)=>{
  if(req.body.room_id=='common')
  {
    const query = `SELECT * FROM room_tbl WHERE room_rate = 0 `

    db.query(query,(err,out)=>{
      res.send(out[0])
    })
  }
  else
  {
    const query = `SELECT * FROM room_tbl WHERE room_id =${req.body.room_id}`
  
    db.query(query,(err,out)=>{
      res.send(out[0])
    })

  }
}) 
// [BOOK RESERVATION - ADD RESERVATION]
router.post('/bookreservation/addReservation',(req,res)=>{
  var datePicked = moment(req.body.date).format('YYYY-MM-DD')
  console.log(req.body)
  const query= `INSERT INTO walkin_queue_tbl(cust_id, walkin_start_time, walkin_end_time, walkin_total_amount, walkin_total_points,walkin_date,walkin_payment_status,walkin_indicator,bed_occupied_boys,bed_occupied_girls,delete_stats,walkin_lock_no)
  values("${req.body.customerId}","${req.body.timeStart}","${req.body.timeEnd}","${req.body.finalTotal}","${req.body.finalPoints}","${datePicked}",0,0,"${req.body.bed_occupied_boys}","${req.body.bed_occupied_girls}",0,"${req.body.locker_num}")`
  db.query(query,(err,out)=>{
    var notSuccess=0;
    var querySuccess= 1
    var walkinId = out.insertId;
    var restype = req.body.restype
    if(err){
      res.send({alertDesc: notSuccess})
      console.log(err)
    } else{
      if(req.body.serviceId != undefined) {
        for (var x=0; x < req.body.serviceId.length; x++) {
          const query1= `INSERT INTO walkin_services_tbl(walkin_id,service_id,service_total_quantity,service_total_duration,service_total_price) 
          VALUES("${walkinId}","${req.body.serviceId[x]}","${req.body.serviceQuantity[x]}","${req.body.serviceNewDuration[x]}",
          "${req.body.serviceTotal[x]}")`
          db.query(query1,(err,out)=>{
            if(err){
              console.log(err)
            }
          })
        }
      }

      if(req.body.promoId != undefined)
      {
        for(var i=0; i<req.body.promoId.length;i++){
          const query1= `INSERT INTO walkin_services_tbl(walkin_id,promobundle_id,service_total_quantity,service_total_duration,service_total_price) 
          VALUES("${walkinId}","${req.body.promoId[i]}","${req.body.promoQuantity[i]}","${req.body.promoNewDuration[i]}"
          ,"${req.body.promoTotal[i]}")`
          db.query(query1,(err,out)=>{
            console.log(query1)
            if(err){
              console.log(err)
            }
          })
        }
      }
      if(req.body.packageId != undefined)
      {
        for(let x=0;x<req.body.packageId.length;x++)
        {
          const query1= `INSERT INTO walkin_services_tbl(walkin_id,package_id,service_total_quantity,service_total_duration,service_total_price) 
          VALUES("${walkinId}","${req.body.packageId[x]}","${req.body.packageQuantity[x]}","${req.body.packageNewDuration[x]}",
            "${req.body.packageTotal[x]}")`
            db.query(query1,(err,out)=>{
              console.log(query1)
              if(err){
                console.log(err)
                console.log("QUERY")
                console.log(query1)
              }
          })
        }
      }

      const query = `INSERT INTO therapist_in_service_tbl(therapist_id,walkin_id)
      VALUES("${req.body.therapist_id}","${walkinId}")`

      db.query(query,(err,out)=>{
        if(err){
          res.send({alertDesc:notSuccess})
          console.log("ERROR IN INSERTING AT THERAPIST_IN_SERVICE_TBL")
          console.log(err)
        }else
        {
          res.send({alertDesc:querySuccess})
        }
      })
    }

    if(req.body.restype == 'single'){
      const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
      VALUE("${req.body.roomId}","${walkinId}")`

      db.query(query,(err,out)=>{
        if(err){
          console.log(err)
          console.log(query)
        }
      })
    } else if(req.body.restype == 'multiple'){
      if(req.body.roomId == 'common'){
        const query = `SELECT * room_tbl WHERE room_rate = 0 AND delete_stats = 0`

        db.query(query,(err,out)=>{
          if(out[0].room_gender == 1){
            if(req.body.bed_occupied_boys != 0){
              const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
              VALUE("${walkinId}","${out[0].room_id}")`

              db.query(query,(err,out)=>{
                if(err){
                  console.log(err)
                  console.log(query)
                }
              })
            }
          }

          if(out[0].room_gender == 2){
            if(req.body.bed_occupied_girls != 0){
              const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
              VALUE("${walkinId}","${out[0].room_id}")`

              db.query(query,(err,out)=>{
                if(err){
                  console.log(err)
                  console.log(query)
                }
              })
            }
          }

        })
      }
      if(req.body.roomId != 'common'){
        var total_occupied = parseInt(req.body.bed_occupied_boys) + parseInt(req.body.bed_occupied_girls)

        const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
        VALUE("${req.body.roomId}","${walkinId}")`

        db.query(query,(err,out)=>{
          if(err){
            console.log(err)
            console.log(query)
          }
        })
      }
    }
  })
})

router.get('/selectTime',mid.frontdesknauthed,(req,res)=>{
  var restype= req.query.reservetype
  var male = req.query.male
  var female = req.query.female
  const query =`SELECT * FROM utilities_tbl`

  db.query(query,(err,out)=>{
    req.session.utilities= out[0]
    res.render('frontdesk/selectTime',{
      reqSession: req.session,
      date:req.query, restype,male, female

  })
  })
})

router.get('/fdHome', (req, res) => {
  res.render('frontdesk/Home')
})
router.get('/fdReservation',mid.frontdesknauthed, (req, res) => {

  var fullDate = moment(new Date()).format('MM-DD-YYYY')

  console.log(fullDate)
  const query = `SELECT * FROM walkin_queue_tbl 
  JOIN customer_tbl on customer_tbl.cust_id = walkin_queue_tbl.cust_id 
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl on room_tbl.room_id = room_in_service_tbl.room_id 
  JOIN therapist_in_service_tbl ON therapist_in_service_tbl.walkin_id = walkin_queue_tbl.walkin_id
  JOIN therapist_tbl ON therapist_tbl.therapist_id = therapist_in_service_tbl.therapist_id
  WHERE walkin_queue_tbl.delete_stats = 0 AND walkin_queue_tbl.walkin_indicator = 0
  AND walkin_queue_tbl.walkin_date = CURDATE();
  SELECT *
  FROM walkin_queue_tbl 
  JOIN customer_tbl on customer_tbl.cust_id = walkin_queue_tbl.cust_id 
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl on room_tbl.room_id = room_in_service_tbl.room_id 
  WHERE walkin_queue_tbl.walkin_date != CURDATE() AND walkin_queue_tbl.delete_stats = 0;
  SELECT * FROM utilities_tbl`
  db.query(query,(err,out)=>{
    req.session.utilities = out[2]

    for(var i=0;i<out[1].length;i++)
    {
      out[1][i].walkin_date = moment(out[1][i].walkin_date).format('MMMM DD, YYYY')
    }

    for(var i=0;i<out[0].length;i++)
    {
      out[0][i].walkin_date = moment(out[0][i].walkin_date).format('MMMM DD, YYYY')
    }
    res.render('frontdesk/fdReservation',{
      walkins: out[0],
      reservs: out[1],
      reqSession: req.session
    })
  })
})

router.post('/fdReservation/viewServices',(req,res)=>{
  const query = `SELECT * FROM walkin_queue_tbl
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id
  JOIN services_tbl ON services_tbl.service_id = walkin_services_tbl.service_id
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_id= "${req.body.id}";
  SELECT * FROM walkin_queue_tbl
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id
  JOIN promo_bundle_tbl ON promo_bundle_tbl.promobundle_id = walkin_services_tbl.promobundle_id
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_id= "${req.body.id}";
  SELECT * FROM walkin_queue_tbl
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id
  JOIN package_tbl ON package_tbl.package_id = walkin_services_tbl.package_id
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_id= "${req.body.id}"
  `
  
  db.query(query,(err,out)=>{
    console.log(query)
    var out1= out[0]
    var outPromo= out[1]
    var outPackage= out[2]
    console.log(out[1])
    const query1 = `SELECT * FROM walkin_queue_tbl 
    JOIN customer_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id 
    JOIN therapist_in_service_tbl ON therapist_in_service_tbl.walkin_id = walkin_queue_tbl.walkin_id
    JOIN therapist_tbl ON therapist_tbl.therapist_id = therapist_in_service_tbl.therapist_id
    where walkin_queue_tbl.walkin_id =?`
    db.query(query1,[req.body.id],(err,out)=>{
      return res.send({
        out1:out1,
        outPromo:outPromo,
        outPackage:outPackage, 
        out2:out[0]})
    })
  })
})

router.post('/fdReservation/CancelReservation',(req,res)=>{
  var alertSuccess = 0
  var notSuccess = 1
  const query = `UPDATE walkin_queue_tbl SET delete_stats = 1 WHERE walkin_id=?`

  db.query(query,[req.body.id],(err,out)=>{
    console.log(query)
    if(err)
    {
      console.log(err)
      res.send({alertDesc:notSuccess})
    }
    else
    {
      res.send({alertDesc:alertSuccess})  
    }
  })
})

router.get('/summary', (req, res) => {
  res.render('frontdesk/summary')
})

// [PAYMENT - VIEW]
router.get('/payment',mid.frontdesknauthed, (req, res) => {
  const query = `SELECT *
  FROM walkin_queue_tbl 
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON customer_tbl.cust_id = walkin_queue_tbl.cust_id 
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_payment_status = 0 AND walkin_queue_tbl.delete_stats = 0
  GROUP BY walkin_services_tbl.walkin_id;
  SELECT *
  FROM walkin_queue_tbl 
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON customer_tbl.cust_id = walkin_queue_tbl.cust_id
  JOIN services_tbl ON services_tbl.service_id = walkin_services_tbl.service_id
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE  walkin_queue_tbl.delete_stats = 0 AND walkin_queue_tbl.walkin_payment_status = 1 || walkin_queue_tbl.walkin_payment_status = 2 || walkin_queue_tbl.walkin_payment_status != 0 
  AND walkin_queue_tbl.walkin_indicator = 2 
  GROUP BY walkin_queue_tbl.walkin_id;
  SELECT * FROM giftcertificate_tbl WHERE release_stats = 2 OR release_stats=4;
  SELECT * FROM loyalty_tbl 
  JOIN customer_tbl ON loyalty_tbl.cust_id = customer_tbl.cust_id 
  WHERE loyalty_tbl.paid_status=0;
  SELECT * FROM customer_tbl 
  JOIN amenities_reservation_tbl ON customer_tbl.cust_id = amenities_reservation_tbl.cust_id;
  SELECT * FROM utilities_tbl;
`
  db.query(query,(err,out)=>{
    req.session.utilities = out[5]
    for(var i=0;i< out[1].length;i++){
      out[1][i].walkin_date = moment(out[1][i].walkin_date).format('MMMM DD, YYYY')
    }
    res.render('frontdesk/payment',{
      notpaids : out[0],
      paids: out[1],
      reqSession: req.session,
      giftcerts: out[2],
      loyaltys: out[3],
      amenities: out[4]
    })
  })
})

// [PAYMENT - VIEW DETAILS]
router.post('/payment/query/CheckoutDets',mid.frontdesknauthed, (req, res) => {
  const query = `SELECT * FROM walkin_queue_tbl
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id
  JOIN services_tbl ON services_tbl.service_id = walkin_services_tbl.service_id
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_id= "${req.body.id}";
  SELECT * FROM walkin_queue_tbl
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id
  JOIN promo_bundle_tbl ON promo_bundle_tbl.promobundle_id = walkin_services_tbl.promobundle_id
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_id= "${req.body.id}";
  SELECT * FROM walkin_queue_tbl
  JOIN walkin_services_tbl ON walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id
  JOIN customer_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id
  JOIN package_tbl ON package_tbl.package_id = walkin_services_tbl.package_id
  JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_id= "${req.body.id}"`
  
  db.query(query,(err,out)=>{
    var outServices= out[0];
    var outPromo = out[1]
    var outPackage = out[2]
    const custQuery =`SELECT walkin_queue_tbl.* , customer_tbl.* FROM walkin_queue_tbl
    JOIN customer_tbl ON customer_tbl.cust_id = walkin_queue_tbl.cust_id WHERE walkin_queue_tbl.walkin_id=?`
    
    db.query(custQuery,[req.body.id],(err,out)=>{
      console.log(out[0].cust_type)
      if(out[0].cust_type==0)
      {
        const query1 = `SELECT walkin_queue_tbl.*, customer_tbl.* from walkin_queue_tbl 
        join customer_tbl on walkin_queue_tbl.cust_id = customer_tbl.cust_id 
        where walkin_queue_tbl.walkin_id =?`
        db.query(query1,[req.body.id],(err,out)=>{
          console.log(query1)
          return res.send({
            outServices:outServices,
            outPromo: outPromo,
            outPackage:outPackage,
            out2:out[0]})
        }) 
      }
      else if(out[0].cust_type==1)
      {
        console.log("ID: "+req.body.id)
        const query1 = `SELECT walkin_queue_tbl.*, customer_tbl.*,loyalty_tbl.* from walkin_queue_tbl 
        join customer_tbl on walkin_queue_tbl.cust_id = customer_tbl.cust_id 
        join loyalty_tbl on loyalty_tbl.cust_id = customer_tbl.cust_id
        where walkin_queue_tbl.walkin_id =?`
        db.query(query1,[req.body.id],(err,out)=>{
          return res.send({            
            outServices:outServices,
            outPromo: outPromo,
            outPackage:outPackage, 
            out2:out[0]})
      })
      console.log(out)
    }  
  })
})
})



// [PAYMENT - VIEW SUMMARY]
router.post('/payment/query/CheckSummary',mid.frontdesknauthed, (req, res) => {
  const query = `SELECT walkin_queue_tbl.*, walkin_services_tbl.*, 
  customer_tbl.cust_fname, customer_tbl.cust_lname, customer_tbl.cust_mname, 
  services_tbl.service_name, services_tbl.service_price, 
  room_tbl.room_name, room_tbl.room_rate, freebies_tbl.*
    from walkin_queue_tbl 
    join walkin_services_tbl on walkin_queue_tbl.walkin_id = walkin_services_tbl.walkin_id 
    join customer_tbl on customer_tbl.cust_id = walkin_queue_tbl.cust_id 
    join services_tbl on services_tbl.service_id = walkin_services_tbl.service_id
    JOIN freebies_tbl ON services_tbl.service_id = freebies_tbl.service_id
    join room_tbl on room_tbl.room_id = walkin_services_tbl.room_id where walkin_services_tbl.walkin_id=?`
  
  db.query(query,[req.body.id],(err,out)=>{
    var out1= out;
    const custQuery =`SELECT walkin_queue_tbl.* , customer_tbl.* FROM walkin_queue_tbl
    JOIN customer_tbl ON customer_tbl.cust_id = walkin_queue_tbl.cust_id WHERE walkin_queue_tbl.walkin_id=?`
    
    db.query(custQuery,[req.body.id],(err,out)=>{
      // console.log(out[0].cust_type)
      if(out[0].cust_type==0)
      {
        // const queryAmount = `SELECT services_availed_tbl.* , payment_tbl.*, walkin_queue_tbl.* FROM
        // services_availed_tbl
        // JOIN payment_tbl ON services_availed_tbl.service_availed_id = payment_tbl.services_availed_id
        // JOIN walkin_queue_tbl ON walkin_queue_tbl.walkin_id = services_availed_tbl.transaction_id
        // WHERE walkin_queue_tbl.walkin_id=?`
        const query1 = `SELECT walkin_queue_tbl.*, customer_tbl.* from walkin_queue_tbl 
        join customer_tbl on walkin_queue_tbl.cust_id = customer_tbl.cust_id 
        where walkin_queue_tbl.walkin_id =?`
        db.query(query1,[req.body.id],(err,out)=>{
          var out2 = out[0]
           const queryAmount = `SELECT services_availed_tbl.* , payment_tbl.*, walkin_queue_tbl.* FROM
           services_availed_tbl
           JOIN payment_tbl ON services_availed_tbl.service_availed_id = payment_tbl.services_availed_id
           JOIN walkin_queue_tbl ON walkin_queue_tbl.walkin_id = services_availed_tbl.transaction_id
           WHERE walkin_queue_tbl.walkin_id=?`

           db.query(queryAmount,[req.body.id],(err,out)=>{
              return res.send({out1:out1, out2:out2, out3:out[0]})

           })
        }) 
      }
      else if(out[0].cust_type==1)
      {
        console.log("ID: "+req.body.id)
        const query1 = `SELECT walkin_queue_tbl.*, customer_tbl.*,loyalty_tbl.* from walkin_queue_tbl 
        join customer_tbl on walkin_queue_tbl.cust_id = customer_tbl.cust_id 
        join loyalty_tbl on loyalty_tbl.cust_id = customer_tbl.cust_id
        where walkin_queue_tbl.walkin_id =?`
        db.query(query1,[req.body.id],(err,out)=>{
          var out2 = out[0]
          const queryAmount = `SELECT services_availed_tbl.* , payment_tbl.*, walkin_queue_tbl.* FROM
          services_availed_tbl
          JOIN payment_tbl ON services_availed_tbl.service_availed_id = payment_tbl.services_availed_id
          JOIN walkin_queue_tbl ON walkin_queue_tbl.walkin_id = services_availed_tbl.transaction_id
          WHERE walkin_queue_tbl.walkin_id=?`

          db.query(queryAmount,[req.body.id],(err,out)=>{
            console.log('OUT2')
            console.log(out2)
            console.log('OUT3')
            console.log(out)
            return res.send({out1:out1, out2:out2, out3:out[0]})

          })
      })
    }  
  })
})

  // const queryAmount = `SELECT services_availed_tbl.* , payment_tbl.*, walkin_queue_tbl.* FROM
  // services_availed_tbl
  // JOIN payment_tbl ON services_availed_tbl.service_availed_id = payment_tbl.services_availed_id
  // JOIN walkin_queue_tbl ON walkin_queue_tbl.walkin_id = services_availed_tbl.transaction_id
  // WHERE walkin_queue_tbl.walkin_id=?`

  // db.query(queryAmount,[req.body.id],(err,out)=>{
  //   res.send({out3:out[0]})
  // })
})




// [PAYMENT - LOYALTY REGISTRATION]
router.post('/payment/register',(req,res)=>{
  const query = `SELECT * FROM loyalty_tbl where member_username = "${req.body.username}";
  SELECT * FROM utilities_tbl`
  
  db.query(query,(err,out)=>{
    console.log(out)
    if(out[0]== undefined || out[0] == 0)
      {
        console.log('WALA PA')
        var alertSuccess =0
        var notSuccess =1
        const query1=`INSERT INTO loyalty_tbl (cust_id, member_username, member_password, member_points, membership_validity, paid_status)
        values("${req.body.id}","${req.body.username}","${req.body.password}", 0, "${req.body.membership_validity}",0)`

        db.query(query1,(err,out)=>{
          console.log(query1)
          const query2 = `UPDATE customer_tbl SET cust_type =1 WHERE cust_id =${req.body.id}`

          db.query(query2,(err,out)=>{
              if(err)
              {
                console.log(err)
                res.send({alertDesc:notSuccess})
              }
              else
              {
                res.send({alertDesc:alertSuccess})
              }

          })
        })

      }
    else if(out != undefined)
      {
        var Exist = 3
        res.send({alertDesc:Exist})
      }  
  })
})

//[PAYMENT - LATE PAYMENT OF LOYALTY]
router.post('/LatePaymentForLoyalty',(req,res)=>{
  var alertSuccess =0
  var notSuccess =1
  var dateNow = moment(new Date()).format('MMMM DD, YYYY')
  const query = `UPDATE loyalty_tbl SET paid_status =1 WHERE member_id = "${req.body.loyalty_id}"`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log('ERROR IN UPDATING THE PAID_STATUS IN LOYALTY_TBL')
      console.log(err)
    }
    else
    {
      const query =`INSERT INTO payment_loyalty_trans_tbl(loyalty_id,payment_date,payment_amount)
      VALUES("${req.body.loyalty_id}","${dateNow}","${req.body.membership_fee}")`

      db.query(query,(err,out)=>{
        if(err)
        {
          res.send({alertDesc:notSuccess})
          console.log('ERROR IN INSERTING THE DATA OF LOYALTY ON PAYMENT_LOYALTY_TRANS_TBL')
          console.log(err)
        }
        else
        {
          res.send({alertDesc:alertSuccess})
        }
      })
    }
  })
})

// [PAYMENT - FINISH]
router.post('/payment/Finish',(req,res)=>{

  var date= moment(new Date()).format('MMMM DD YYYY')
  const queryServAv = `SELECT * FROM services_availed_tbl where transaction_id = ${req.body.id}`
  db.query(queryServAv,(err,out)=>{
  console.log(out)
  const query = `INSERT INTO payment_tbl (services_availed_id, payment_type,payment_date,amount)
  values("${out[0].service_availed_id}","Cash","${date}","${req.body.amount}")`
  db.query(query,(err,out)=>{
    console.log(query)
    console.log(err)
  })
  })

    console.log("cust_id: "+req.body.cust_id)

    const query1=`SELECT * FROM loyalty_tbl where cust_id= ${req.body.cust_id}`

    db.query(query1,(err,out)=>{
      console.log(query1)
      console.log("OUT")
      console.log(out)
      if(out.paid_status==0)
        {
          
          const queryPaid = `UPDATE loyalty_tbl SET paid_status=1, member_points="${req.body.total_points}" WHERE cust_id=${req.body.cust_id};
          UPDATE walkin_queue_tbl SET walkin_payment_status =1 where walkin_id=${req.body.id}`

          db.query(queryPaid,(err,out)=>{
            if(err)
              {
                console.log(err)
                var notSuccess=1
                res.send({alertDesc:notSuccess})
              }
            else
              {
                var alertSuccess=0
                res.send({alertDesc:alertSuccess})
              }
          })
        }
        else if(out== undefined || out==0)
        {
          const queryPaid = `
          UPDATE walkin_queue_tbl SET walkin_payment_status =1 where walkin_id=${req.body.id}`

          db.query(queryPaid,(err,out)=>{
            if(err)
              {
                console.log(err)
                var notSuccess=1
                res.send({alertDesc:notSuccess})
              }
            else
              {
                var alertSuccess=0
                res.send({alertDesc:alertSuccess})
              }
          })
        }
        
    })
  })

  router.post('/payment/Finish/GC',(req,res)=>{
    var date= moment(new Date()).format('MMMM DD YYYY')
    const queryServAv = `SELECT * FROM services_availed_tbl where transaction_id = ${req.body.id}`
    db.query(queryServAv,(err,out)=>{
      console.log(out)
        const query = `INSERT INTO payment_tbl (services_availed_id, payment_type,payment_date,amount)
        values("${out[0].service_availed_id}","Cash","${date}","${req.body.amount}")`
        db.query(query,(err,out)=>{
          console.log(err)
      })
    })
  
      console.log("cust_id: "+req.body.cust_id)
      const query1=`SELECT * FROM loyalty_tbl where cust_id= ${req.body.cust_id}`
      db.query(query1,(err,out)=>{
        console.log(out)
        console.log(out[0].paid_status)
        if(out[0].paid_status==0)
          {
            const queryPaid = `UPDATE loyalty_tbl SET paid_status=1, member_points="${req.body.total_points}" WHERE cust_id=${req.body.cust_id};
            UPDATE walkin_queue_tbl SET walkin_payment_status =1 where walkin_id=${req.body.id}`
            db.query(queryPaid,(err,out)=>{
              console.log(queryPaid)
              console.log(err)
              if(err)
                {
                  var notSuccess=1
                  res.send({alertDesc:notSuccess})
                }
              else
                {
                  console.log(req.body.gc_id.length)
                  for(var i=0;i<req.body.gc_id.length;i++)
                    {
                      const query = `UPDATE giftcertificate_tbl SET release_stats = 3 WHERE gc_id = ${req.body.gc_id[i]}`

                      db.query(query,(err,out)=>{
                        console.log(query)
                        console.log(err)
                      })
                    }
                  var alertSuccess=0
                  res.send({alertDesc:alertSuccess})
                }
            })
          }
          else if(out== undefined || out==0)
          {
            const queryPaid = `
            UPDATE walkin_queue_tbl SET walkin_payment_status =1 where walkin_id=${req.body.id}`
            db.query(queryPaid,(err,out)=>{
              if(err)
                {
                  console.log(err)
                  var notSuccess=1
                  res.send({alertDesc:notSuccess})
                }
              else
                {
                  var alertSuccess=0
                  res.send({alertDesc:alertSuccess})
                  for(var i=0;req.body.gc_id.length;i++)
                    {
                      const query = `UPDATE giftcertificate_tbl SET released_stats = 3 WHERE gc_id = ${req.body.gc_id[i]}`

                      db.query(query,(err,out)=>{

                      })
                    }
                }
            })
          }
      })

      
    })

// [PAYMENT - EARLY PAYMENT]
router.post('/payment/Early',(req,res)=>{
  var alertSuccess=0;
  var notSuccess= 1
  console.log(req.body)
  var datePicked = moment(req.body.date).format('YYYY-MM-DD')
  if(req.body.paid_stats == 0){
    var amount = parseFloat(req.body.amount) - parseFloat(req.body.amount)
  } else if(req.body.paid_stats != 0){
    var amount = req.body.amount
  }
  const query = `INSERT INTO walkin_queue_tbl(cust_id, walkin_start_time, walkin_end_time, walkin_total_amount, walkin_total_points,walkin_date,walkin_payment_status,walkin_indicator,bed_occupied_boys,bed_occupied_girls,walkin_lock_no,delete_stats)
  values("${req.body.cust_id}","${req.body.timeStart}","${req.body.EndTime}","${amount}","${req.body.finalPoints}","${datePicked}",1,0,"${req.body.bed_occupied_boys}","${req.body.bed_occupied_girls}","${req.body.locker_num}",0)`

  db.query(query,(err,out)=>{
    var walkinId=out.insertId;
    var restype = req.body.restype
      const query1 = `INSERT INTO services_availed_tbl(transaction_id) VALUE("${walkinId}")`
      db.query(query1,(err,out)=>{
        var service_availed_id = out.insertId
        if(err){
          console.log(err)
          console.log(query)
        } else {


          if(req.body.gift_certs != undefined){
            if(req.body.gift_certs.length != 0){
              for(var i=0;i<req.body.gift_certs.length;i++){
                const query = `INSERT INTO giftcert_payment_tbl(services_availed_id,payment_date,gc_id,cust_id)
                VALUE("${service_availed_id}","${datePicked}","${req.body.gift_certs[i]}","${req.body.cust_id}");
                UPDATE giftcertificate_tbl SET release_stats = 3 WHERE gc_id = "${req.body.gift_certs[i]}"`

                db.query(query,(err,out)=>{
                })
              }
            }
          }


          if(req.body.amount_received != 0){
            if(req.body.payment_type == 0){
              var total_amount = req.body.amount
            } else if(req.body.payment_type != 0) {
              var total_amount = req.body.balance
            } 
            console.log('TOTAL_AMOUNT', total_amount)
            const query = `INSERT INTO payment_tbl(services_availed_id,payment_date,amount,cust_id)
            VALUE("${service_availed_id}","${datePicked}","${total_amount}","${req.body.cust_id}")`

            db.query(query,(err,out)=>{

            })
          }


          if(req.body.payment_type == 2 || req.body.payment_type == 4 || req.body.payment_type == 5 || req.body.payment_type == 6){
            if(req.body.cust_type == 1){
              const query = `INSERT INTO points_payment_tbl(services_availed_id,payment_date,total_points,cust_id)
              VALUE("${service_availed_id}","${datePicked}","${req.body.payment_points}","${req.body.cust_id}");
              UPDATE loyalty_tbl SET member_points = "${req.body.newPoints}" WHERE cust_id = "${req.body.cust_id}"`
              
              db.query(query,(err,out)=>{
              })
            }
          }
        }
    })

    if(req.body.serviceId != undefined)
    {
      console.log('PUMASOK SA SERVICE')
      for(var x=0;x<req.body.serviceId.length;x++)
      {
        const query1= `INSERT INTO walkin_services_tbl(walkin_id,service_id,service_total_quantity,service_total_duration,bed_occupied,service_total_price) 
        VALUES("${walkinId}","${req.body.serviceId[x]}","${req.body.serviceQuantity[x]}","${req.body.serviceNewDuration[x]}",
          "${req.body.bed_quantity}","${req.body.serviceTotal[x]}")`
          db.query(query1,(err,out)=>{
            console.log(query1)
            if(err){
              console.log(err)
            }
        })

      }

    }

    if(req.body.promoId != undefined)
    {
      console.log('PUMASOK SA PROMO')
      for(var x=0;x<req.body.promoId.length;x++)
      {

        const query1= `INSERT INTO walkin_services_tbl(walkin_id,promobundle_id,service_total_quantity,service_total_duration,bed_occupied,service_total_price) 
        VALUES("${walkinId}","${req.body.promoId[x]}","${req.body.promoQuantity[x]}","${req.body.promoNewDuration[x]}",
          "${req.body.bed_quantity}","${req.body.promoTotal[x]}")`
          db.query(query1,(err,out)=>{
            console.log(query1)
            if(err){
              console.log(err)
            }
        })
      }

    }
    if(req.body.packageId != undefined)
    {
      console.log('PUMASOK SA PACKAGE')
      for(var x=0;x<req.body.serviceId.length;x++)
      {

        const query1= `INSERT INTO walkin_services_tbl(walkin_id,package_id,service_total_quantity,service_total_duration,bed_occupied,service_total_price) 
        VALUES("${walkinId}","${req.body.packageId[x]}","${req.body.packageQuantity[x]}","${req.body.packageNewDuration[x]}",
          "${req.body.bed_quantity}","${req.body.packageTotal[x]}")`
          db.query(query1,(err,out)=>{
            console.log(query1)
            if(err){
              console.log(err)
            }
        })
      }

    }

      const query = `INSERT INTO therapist_in_service_tbl(therapist_id,walkin_id)
      VALUES("${req.body.therapist_id}","${walkinId}")`

      db.query(query,(err,out)=>{
        if(err)
        {
          res.send({alertDesc:notSuccess})
          console.log("ERROR IN INSERTING AT THERAPIST_IN_SERVICE_TBL")
          console.log(err)
        }
        else
        {
          res.send({alertDesc:alertSuccess})
        }
      })


      
    if(req.body.restype == 'single'){
      const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
      VALUE("${req.body.roomId}","${walkinId}")`

      db.query(query,(err,out)=>{
        if(err){
          console.log(err)
          console.log(query)
        }
      })
    } else if(req.body.restype == 'multiple'){
      if(req.body.roomId == 'common'){
        const query = `SELECT * room_tbl WHERE room_rate = 0 AND delete_stats = 0`

        db.query(query,(err,out)=>{
          if(out[0].room_gender == 1){
            if(req.body.bed_occupied_boys != 0){
              const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
              VALUE("${walkinId}","${out[0].room_id}")`

              db.query(query,(err,out)=>{
                if(err){
                  console.log(err)
                  console.log(query)
                }
              })
            }
          }

          if(out[0].room_gender == 2){
            if(req.body.bed_occupied_girls != 0){
              const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
              VALUE("${walkinId}","${out[0].room_id}")`

              db.query(query,(err,out)=>{
                if(err){
                  console.log(err)
                  console.log(query)
                }
              })
            }
          }

        })
      }
      if(req.body.roomId != 'common'){
        var total_occupied = parseInt(req.body.bed_occupied_boys) + parseInt(req.body.bed_occupied_girls)

        const query = `INSERT INTO room_in_service_tbl(room_id,walkin_id)
        VALUE("${req.body.roomId}","${walkinId}")`

        db.query(query,(err,out)=>{
          if(err){
            console.log(err)
            console.log(query)
          }
        })
      }
    }
  })

  if(req.body.paid_stats == 0) {
    const query = `SELECT * FROM loyalty_tbl WHERE cust_id = "${req.body.cust_id}"`

    db.query(query,(err,out)=>{
      if(err){
        console.log(err)
        console.log(query)
      } else {
        const query = `INSERT INTO payment_loyalty_trans_tbl(loyalty_id,payment_date,payment_amount)
        VALUE("${out[0].member_id}","${datePicked}","${req.body.membership_fee}")`

        db.query(query,(err,out)=>{
          if(err){
            console.log(err)
            console.log(query)
          } else {
            const query = `SELECT * FROM utilities_tbl`

            db.query(query,(err,out)=>{
              var membership_validity = moment(datePicked).add(out[0].membership_validity,'months').format('MMMM DD, YYYY')

              const query = `UPDATE loyalty_tbl SET paid_status = 1, membership_validity= "${membership_validity}" WHERE cust_id = "${req.body.cust_id}"`
  
              db.query(query,(err,out)=>{
                if(err){
                  console.log(err)
                  console.log(query)
                } else {
  
                }
              })
            })
          }
        })
      }
      
    })
  }


  // if(req.body.paid_stats == 1){
  //   const query = `UPDATE loyalty_tbl SET member_points= "${}"`
  // }
})



// [THERAPIST ATTENDANCE]
router.get('/therapist',mid.frontdesknauthed, (req, res) => {
  const query = `SELECT * FROM utilities_tbl;
  SELECT therapist_tbl.*, therapist_attendance_tbl.* 
  FROM therapist_tbl JOIN therapist_attendance_tbl 
  ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
  WHERE therapist_tbl.therapist_availability =0 AND therapist_tbl.delete_stats=0 
  ORDER BY therapist_shift ASC`

  db.query(query,(err,out)=>{
    req.session.utilities = out[0]
    res.render('frontdesk/therapist',{
      reqSession: req.session,
      therapist: out[1]
    })
    var current_date = moment(new Date()).format('MMMM-DD-YYYY')
    for(var i=0;i<out[1].length;i++)
    {
      if(out[1][i].therapist_datetime_in == null){
        console.log(out[1][i].therapist_fname)
        const query = `UPDATE therapist_attendance_tbl 
          SET availability = 0, therapist_datetime_in = NULL WHERE therapist_id='${out[1][i].therapist_id}'`

          db.query(query,(err,out)=>{

          })
        }
      else if (out[1][i].therapist_datetime_in != null){
        var therapist_date = moment(out[1][i].therapist_datetime_in).format('MMMM-DD-YYYY')
        console.log(out[1][i].therapist_lname)
        if(moment(therapist_date).isBefore(current_date)){
          const query = `UPDATE therapist_attendance_tbl 
          SET availability = 0,therapist_datetime_in = NULL WHERE therapist_id='${out[1][i].therapist_id}'`

          db.query(query,(err,out)=>{

          })
        }
      }
      // console.log(therapist_date)
      // if(therapist_date[i]=='Invalid date')
      // {
      //   const query = `UPDATE therapist_attendance_tbl 
      //   SET therapist_datetime_in = NULL, 
      //   availability = 0,
      //   doneService_count = 0,
      //   therapist_reserved =0 WHERE therapist_datetime_in= NULL`

      //   db.query(query,(err,out)=>{

      //   })
      // }
      
      // if(therapist_date[i] !='Invalid date' && moment(therapist_date).isBefore(current_date))
      // {
      //   const query = `UPDATE therapist_attendance_tbl 
      //   SET therapist_datetime_in = NULL, 
      //   availability = 0,
      //   doneService_count = 0,
      //   therapist_reserved =0`

      //   db.query(query,(err,out)=>{
          
      //   })
      // }
      console.log(moment(therapist_date).isBefore(current_date))
      console.log("-----------------------")
      console.log(current_date)
      console.log(therapist_date)
    }
  })
})

router.post('/therapist/Present',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1

  const query=`UPDATE therapist_attendance_tbl SET therapist_datetime_in="${req.body.datetime_in}",
  doneService_count=0, availability=1 WHERE therapist_id="${req.body.therapist_id}"`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})  

router.post('/therapist/BreakTime',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1

  const query=`UPDATE therapist_attendance_tbl SET availability =3 WHERE therapist_id="${req.body.therapist_id}"`
  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})
  
router.post('/therapist/DoneBreakTime',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1

  const query=`UPDATE therapist_attendance_tbl SET availability =1 WHERE therapist_id="${req.body.therapist_id}"`
  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})

router.post('/therapist/Absent',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1

  const query=`UPDATE therapist_attendance_tbl SET availability =2 WHERE therapist_id="${req.body.therapist_id}"`
  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})

// [DELETE COMMON CUSTOMER]
router.post('/DeleteCustomer',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1
  var IncorrectPassword=2

  const query=`SELECT * FROM admin_tbl WHERE admin_id=1 AND admin_password = "${req.body.admin_password}"`
  
  db.query(query,(err,out)=>{
    console.log(query)
    if(out == undefined || out == 0 )
    {
      res.send({alertDesc:IncorrectPassword})
    }
    else
    {
      const query1 = `UPDATE customer_tbl set delete_stats=1 WHERE cust_id = "${req.body.cust_id}"`

      db.query(query1,(err,out)=>{
        if(err)
        {
          console.log(err)
          res.send({alertDesc:notSuccess})
        }
        else
        {
          res.send({alertDesc:alertSuccess})
        }
      })
    }
  })
})
// // DELETE LOYALTY CUSTOMER
// router.post('/DeleteLoyaltyCustomer',(req,res)=>{
//   var alertSuccess=0
//   var notSuccess=1
//   var IncorrectPassword=2

//   const query=`SELECT * FROM admin_tbl WHERE admin_id=1 AND admin_password = "${req.body.admin_password}"`
  
//   db.query(query,(err,out)=>{
//     console.log(query)
//     if(out == undefined || out == 0 )
//     {
//       res.send({alertDesc:IncorrectPassword})
//     }
//     else
//     {
//       const query1 = `UPDATE customer_tbl set delete_stats=1 WHERE cust_id = "${req.body.cust_id}"`

//       db.query(query1,(err,out)=>{
//         if(err)
//         {
//           console.log(err)
//           res.send({alertDesc:notSuccess})
//         }
//         else
//         {
//           res.send({alertDesc:alertSuccess})
//         }
//       })
//     }
//   })
// })


// [GIFT CERTIFICATE - VIEW]

router.get('/giftcert',(req, res) => {

  const query =`SELECT * FROM giftcertificate_tbl WHERE release_stats =1;
  SELECT * FROM utilities_tbl `

  db.query(query,(err,out)=>{
    req.session.utilities = out[1]
    console.log(req.session)
    res.render('frontdesk/giftcert',{
      giftcerts: out[0],
      reqSession: req.session
    })
  })
})

// [GIFT CERTIFICATE - SELL]
router.post('/SoldGiftCertificate',(req,res)=>{
  var alertSuccess =0
  var notSuccess =1
  var date = moment(new Date()).format('YYYY-MM-DD')
  const query = `UPDATE giftcertificate_tbl SET release_stats= 2, date_sold = '${date}' WHERE gc_id = ${req.body.gc_id}`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})

// [GIFT CERTIFICATE - GIFT]
router.post('/AsGiftGiftCertificate',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1

  const query=`UPDATE giftcertificate_tbl SET release_stats= 4 WHERE gc_id = ${req.body.gc_id}`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})

// [AMENITY - PAYMENT - NOW]
router.post('/AmenityPayNow',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1
  var date = moment(new Date()).format('MMMM DD, YYYY hh:mm A')
  var date_only = moment().format('YYYY-MM-DD')
  const query = `INSERT INTO amenities_reservation_tbl(cust_id,number_ofGuest,total_fee,paid_status,date,date_only)
  VALUES("${req.body.cust_id}","${req.body.guest_quantity}","${req.body.entrance_fee_total}",1,"${date}","${date_only}")`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log('ERROR IN AMENITY ADVANCE PAYMENT ON INSERTING THE DATA AT AMENITIES RESERVATION TABLE')
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})

// [AMENITY - PAYMENT - LATER]
router.post('/AmenityPayLater',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1
  var date = moment(new Date()).format('MMMM DD, YYYY hh:mm A')
  var date_only = moment().format('YYYY-MM-DD')
  const query = `INSERT INTO amenities_reservation_tbl(cust_id,number_ofGuest,total_fee,paid_status,date,date_only)
  VALUES("${req.body.cust_id}","${req.body.guest_quantity}","${req.body.entrance_fee_total}",0,"${date}","${date_only}")`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log('ERROR IN AMENITY ADVANCE PAYMENT ON INSERTING THE DATA AT AMENITIES RESERVATION TABLE')
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
      console.log('QUERY DITO========')
      console.log(query)
    }
  })
})

// [AMENITY - REFUND]
router.post('/AmenityRefund',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1
  
  const query = `UPDATE amenities_reservation_tbl SET paid_status =2 
  WHERE cust_id='${req.body.cust_id}' AND amenity_reservation_id='${req.body.amenity_id}'`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log('ERROR IN UPDATING THE AMENITIES RESERVATION TABLE [REFUND]')
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})

// [AMENITY - LATE PAYMENT]
router.post('/AmenityLatePayment',(req,res)=>{
  var alertSuccess=0
  var notSuccess=1
  
  const query = `UPDATE amenities_reservation_tbl SET paid_status = 1
  WHERE cust_id='${req.body.cust_id}' AND amenity_reservation_id='${req.body.amenity_id}'`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log('ERROR IN UPDATING THE AMENITIES RESERVATION TABLE [REFUND]')
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})

router.post('/Change/Therapist',(req,res)=>{
  var dateRes = moment(req.body.dateRes).format('YYYY-MM-DD')
  var res_timeStart = dateRes+' '+req.body.startTime
  var res_timeEnd = dateRes+' '+req.body.endTime

  if(moment(dateRes).isSame(moment().format('MM-DD-YYYY')))
  {
    console.log('NOW')
    const query = `SELECT * FROM utilities_tbl`

    db.query(query,(err,out)=>{
      var firstShift_start = dateRes+' '+out[0].firstShift_timeStart
      var firstShift_end = dateRes+' '+out[0].firstShift_timeEnd
      if(moment(res_timeStart).isSameOrAfter(firstShift_start) && moment(res_timeStart).isBefore(firstShift_end))
      {
        console.log('FIRST')
        const query = `SELECT * FROM therapist_tbl 
        JOIN therapist_attendance_tbl ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
        WHERE availability = 1 AND therapist_tbl.therapist_id != ${req.body.therapist_id}  AND therapist_tbl.therapist_shift='FIRST'
        AND therapist_tbl.therapist_availability =0`

        db.query(query,(err,out)=>{
          if(err)
          {
            console.log(err)
          }
          res.send(out)
        })
      }
      else
      {
        console.log('FIRST')
        const query = `SELECT * FROM therapist_tbl 
        JOIN therapist_attendance_tbl ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
        WHERE availability = 1 AND therapist_tbl.therapist_id != ${req.body.therapist_id} AND therapist_tbl.therapist_shift='SECOND'
        AND therapist_tbl.therapist_availability =0`

        db.query(query,(err,out)=>{
          if(err)
          {
            console.log(err)
          }
          res.send(out)
        })
      }
    })
  }
  else
  {
    if(moment(res_timeStart).isSameOrAfter(firstShift_start) && moment(res_timeStart).isBefore(firstShift_end))
      {
        console.log('FIRST')
        const query = `SELECT * FROM therapist_tbl 
        JOIN therapist_attendance_tbl ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
        WHERE therapist_tbl.therapist_id != 67 AND therapist_tbl.therapist_shift='FIRST'
        AND therapist_tbl.therapist_availability =0`

        db.query(query,(err,out)=>{
          if(err)
          {
            console.log(err)
          }
          else
          {
            console.log(out)
            res.send(out)

          }
        })
      }
      else
      {
        console.log('FIRST')
        const query = `SELECT * FROM therapist_tbl 
        JOIN therapist_attendance_tbl ON therapist_tbl.therapist_id = therapist_attendance_tbl.therapist_id
        WHERE  therapist_tbl.therapist_id != 67 AND therapist_tbl.therapist_shift='SECOND'
        AND therapist_tbl.therapist_availability =0`

        db.query(query,(err,out)=>{
          if(err)
          {
            console.log(err)
          }
          else
          {
            res.send(out)
            console.log(out)
          }
        })
      }
  }
})

router.post('/ChangeTherapist',(req,res)=>{
  var alertSuccess =0
  var notSuccess =1

  const query = `UPDATE therapist_in_service_tbl SET therapist_id ="${req.body.therapist_id}" WHERE walkin_id ="${req.body.walkin_id}"`

  db.query(query,(err,out)=>{
    if(err)
    {
      res.send({alertDesc:notSuccess})
      console.log(err)
    }
    else
    {
      res.send({alertDesc:alertSuccess})
    }
  })
})
router.post('/payment/PayNow',(req,res)=>{
  var date = moment(new Date()).format('YYYY-MM-DD')
  console.log(req.body)
  const query = `UPDATE walkin_queue_tbl SET walkin_payment_status = 1 WHERE walkin_id = "${req.body.walkin_id}"`
  db.query(query,(err,out)=>{
    if(err){
      var alertDesc = 1
      res.send({alertDesc:alertDesc})
      console.log(err)
      console.log(query)
    } else {
      const query = `INSERT INTO services_availed_tbl(transaction_id)
      VALUE("${req.body.walkin_id}")`

      db.query(query,(err,out)=>{
        if(err){
          console.log(err)
          console.log(query)
        } else {
          var service_availed_id = out.insertId

          // CASH
          if(req.body.amount_received != 0){
            if(req.body.payment_type == 0){
              var total_amount = req.body.total_price
            } else if(req.body.payment_type != 0) {
              var total_amount = req.body.balance
            } 
            console.log('TOTAL_AMOUNT', total_amount)
            const query = `INSERT INTO payment_tbl(services_availed_id,payment_date,amount,cust_id)
            VALUE("${service_availed_id}","${date}","${total_amount}","${req.body.cust_id}")`

            db.query(query,(err,out)=>{

            })
          }

          // GIFT CERTIFICATE
          console.log(req.body.gift_certs !=undefined)
          if(req.body.gift_certs != undefined){
            if(req.body.gift_certs.length != 0){
              for(var i=0;i<req.body.gift_certs.length;i++){
                const query = `INSERT INTO giftcert_payment_tbl(services_availed_id,payment_date,gc_id,cust_id)
                VALUE("${service_availed_id}","${date}","${req.body.gift_certs[i]}","${req.body.cust_id}");
                UPDATE giftcertificate_tbl SET release_stats = 3 WHERE gc_id = "${req.body.gift_certs[i]}"`

                db.query(query,(err,out)=>{
                })
              }
            }
          }
          // POINTS
          if(req.body.payment_type == 2 || req.body.payment_type == 4 || req.body.payment_type == 5 || req.body.payment_type == 6){
            if(req.body.cust_type == 1){
              const query = `INSERT INTO points_payment_tbl(services_availed_id,payment_date,total_points,cust_id)
              VALUE("${service_availed_id}","${date}","${req.body.total_points}","${req.body.cust_id}");
              UPDATE loyalty_tbl SET member_points = "${req.body.newPoints}" WHERE cust_id = "${req.body.cust_id}"`
              
              db.query(query,(err,out)=>{
              })
            }
          }
        }
      })

      var alertDesc = 0 
      res.send({alertDesc:alertDesc})
    }
  })
})

router.post('/checkVatID',(req,res)=>{
  const query = `select * from customer_tbl where vat_exempt_id_no = "${req.body.input_val}"`

  db.query(query,(err,out)=>{
    if(err){
      console.log("ERROR AT VALIDATING VAT ID")
      console.log(err)
      console.log(query)
    } else {
      if(out==undefined || out==0){
        var results = 0 
        res.send({results:results})
      } else if (out != undefined || out != 0) {
        var results = 1
        res.send({results:results})
      }
    }
  })
})

router.post('/RoomId',(req,res)=>{
  const query = `SELECT * FROM room_tbl WHERE room_id = "${req.body.room_id}"`

  db.query(query,(err,out)=>{
    if(err){
      console.log(err)
    } else {
      res.send({out:out})
    }
  })
})

router.post('/reservationRefund',(req,res)=>{
  const query = `SELECT * FROM admin_tbl WHERE admin_id = 1 AND admin_password = "${req.body.admin_password}"`

  db.query(query,(err,out)=>{
    if(out == undefined || out == ''){
      var passIncorrect = 3
      res.send({alertDesc:passIncorrect})
    } else if(out != undefined || out != ''){
      const query = `UPDATE walkin_queue_tbl SET delete_stats = 1 WHERE walkin_id = "${req.body.walkin_id}"`

      db.query(query,(err,out)=>{
        if(!err){
          var refundSuccess = 0
          res.send({alertDesc:refundSuccess})
        }
      })
    }
  })
})
exports.frontdesk = router;