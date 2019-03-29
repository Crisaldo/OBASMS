var express = require('express')
var router = express.Router()
var db = require('../../lib/database')();
var mid = require("../../middlewares")
var moment = require ('moment')


router.get('/sample',(req, res) => {
  res.render('customer/sample')
})

// LANDING PAGE
router.get('/customer',(req, res) => {
  const query = `SELECT * FROM utilities_tbl;
  SELECT * FROM services_tbl JOIN service_duration_tbl ON services_tbl.service_duration_id = service_duration_tbl.service_duration_id
  JOIN service_type_tbl ON services_tbl.service_type_id = service_type_tbl.service_type_id
  WHERE services_tbl.delete_stats = 0`

  db.query(query,(err,out)=>{
    req.session.utilities= out[0]
    res.render('customer/landing',{
      reqSession: req.session,
      services : out[1]
    })
  })
})

router.get('/login',(req, res) => {
  res.render('customer/login')
})

router.get('/customerProfile',(req, res) => {
  res.render('customer/custProfile')
})


// router.get('/custHome',mid.guestistnauthed,(req, res) => {
// 	const query =`SELECT customer_tbl.*, loyalty_tbl.* 
// 	FROM customer_tbl
// 	JOIN loyalty_tbl ON customer_tbl.cust_id = loyalty_tbl.cust_id
// 	WHERE customer_tbl.cust_id = ${req.session.user.cust_id}`
	
// 	db.query(query, (err,out)=>{
// 		res.render('customer/custHome',{
// 				customers: out,
// 				id: req.session.user.cust_id
// 		})
// 	})
//   })


// [LOGIN]
router.post("/customer/login",(req, res) => {
	const query = `
    SELECT customer_tbl.*, loyalty_tbl.* FROM customer_tbl
    JOIN loyalty_tbl ON customer_tbl.cust_id = loyalty_tbl.cust_id 
    WHERE customer_tbl.delete_stats=0 AND loyalty_tbl.member_username = "${req.body.username}"`

		db.query(query, (err, out) => {
 		if(!out[0])
			return res.redirect("/customer/login#notfound")
		else {
			if(out[0].member_password !== req.body.password)
				return res.redirect("/customer/login#incorrect")
			else {
				delete out[0].member_password
				req.session.user = out[0]	
				return res.redirect("/customer/home")
			}
		}

  })
})
// [LOG OUT]
router.post("/customer/logout", (req, res) => {
  req.session.destroy(err => {
    if(err) console.err
    res.redirect("/customer")
  })
})
// CUSTOMER HOMEPAGE
router.get('/home',mid.guestistnauthed,(req,res)=>{
	const query = `SELECT customer_tbl.*, loyalty_tbl.*
	FROM customer_tbl
	JOIN loyalty_tbl ON customer_tbl.cust_id = loyalty_tbl.cust_id
	WHERE customer_tbl.cust_id=${req.session.user.cust_id}`

	db.query(query,(err,out)=>{
    if (err) console.log(err)
    console.log(out)
    var queryString = `SELECT * FROM customer_tbl
    JOIN walkin_queue_tbl ON walkin_queue_tbl.cust_id = customer_tbl.cust_id
    JOIN therapist_in_service_tbl ON therapist_in_service_tbl.walkin_id = walkin_queue_tbl.walkin_id
    JOIN therapist_tbl ON therapist_tbl.therapist_id = therapist_in_service_tbl.therapist_id
    JOIN walkin_services_tbl ON walkin_services_tbl.walkin_id = walkin_queue_tbl.walkin_id
    JOIN room_in_service_tbl ON room_in_service_tbl.walkin_id = walkin_services_tbl.walkin_id
    JOIN room_tbl ON room_in_service_tbl.room_id = room_tbl.room_id 
    JOIN services_tbl ON services_tbl.service_id = walkin_services_tbl.service_id
    JOIN service_type_tbl ON service_type_tbl.service_type_id = services_tbl.service_type_id
    WHERE customer_tbl.cust_id=${req.session.user.cust_id}
      GROUP BY walkin_queue_tbl.walkin_id`
      db.query(queryString,(err,out2)=>{
        for(i=0;i<out2.length;i++){
          out2[i].walkin_date = moment(out2[i].walkin_date).format('MM/DD/YYYY')
        }
        if(err) console.log(err)
        res.render('customer/home',{
          customers: out,
          id: req.session.user.cust_id,
          reservations: out2
        })
      })
    
	})
})
// SELECT DATE
router.get('/selectDate',mid.guestistnauthed,(req,res)=>{
    customerId = req.query.id
    date = req.query.date
		restype= req.query.reservetype
		male = req.query.male
    female = req.query.female
    console.log(date)
		const query = `SELECT customer_tbl.*, loyalty_tbl.*
		FROM customer_tbl
		JOIN loyalty_tbl ON customer_tbl.cust_id = loyalty_tbl.cust_id
		WHERE customer_tbl.cust_id= ${customerId}`
		db.query(query,(err,out) =>{
			res.render("customer/selectDate",{
				customers: out,
				customerId,
				restype, male,female,date
			})
		})
})

// SELECT TIME
router.get('/customerTime',mid.guestistnauthed,(req,res)=>{
  const query = `SELECT customer_tbl.*, loyalty_tbl.* FROM customer_tbl
  JOIN loyalty_tbl ON customer_tbl.cust_id = loyalty_tbl.cust_id 
  WHERE customer_tbl.cust_id = ${req.session.user.cust_id};
  SELECT * FROM utilities_tbl`
  db.query(query,(err,out)=>{
    req.session.utilities = out[1]
    res.render('customer/customerTime',{
      customers: out,
      date:req.query,
      reqSession : req.session
  })
  console.log(out)
  })
})
router.post('/customerTime/query',(req, res) => {
  const query = `select * from room_tbl where delete_stats=0 and room_availability=0`
  db.query(query,(err, out) => {
    res.send(out)
  })
})

router.post('/customerTime/queryRoom',(req,res)=>{
  const query = `SELECT * FROM room_tbl where delete_stats = 0 AND room_availability=0`

  router.get('/custHome',(req, res) => {
      res.render('customer/custHome')
    })
  db.query(query,(err,out)=>{
    res.send(out)
  })
})

router.post('/customerTime/queryCommon',(req, res) => {
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
  })
})
router.post('/customerTime/addResource/Multiple', mid.guestistnauthed,(err,res)=>{
  var date = req.query.date
  console.log(date)
  const query =`SELECT SUM(bed_occupied_boys) AS boys_occupied,SUM(bed_occupied_girls) AS girls_occupied, 
  walkin_queue_tbl.*, room_in_service_tbl.* , room_tbl.*
  FROM walkin_queue_tbl JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_date = '${date}' AND walkin_queue_tbl.delete_stats = 0  AND walkin_queue_tbl.walkin_indicator != 2
  GROUP BY walkin_queue_tbl.walkin_start_time , room_tbl.room_name
  ORDER BY walkin_queue_tbl.walkin_start_time`

  db.query(query,(err,out)=>{
    res.send(out)
  })
})
router.post('/customerTime/addResource', mid.guestistnauthed,(req,res)=>{
  console.log(req.body.date)
  console.log('ID: '+req.body.id)
  const query =`SELECT SUM(bed_occupied_boys) AS boys_occupied,SUM(bed_occupied_girls) AS girls_occupied, 
  walkin_queue_tbl.*, room_in_service_tbl.* , room_tbl.*
  FROM walkin_queue_tbl JOIN room_in_service_tbl ON walkin_queue_tbl.walkin_id = room_in_service_tbl.walkin_id
  JOIN room_tbl ON room_tbl.room_id = room_in_service_tbl.room_id
  WHERE walkin_queue_tbl.walkin_date = '${req.body.datePicked}' AND room_tbl.room_id= ?
  AND walkin_queue_tbl.delete_stats= 0 
  AND walkin_queue_tbl.walkin_indicator != 2
  GROUP BY walkin_queue_tbl.walkin_start_time , room_tbl.room_name
  ORDER BY walkin_queue_tbl.walkin_start_time `

  db.query(query,[req.body.id],(err,out)=>{
    res.send(out)
    console.log(query)
  })
})



// BOOK RESERVATION
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
            res.render('customer/book',{
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
            res.render('customer/book',{
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
            res.render('customer/book',{
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
            res.render('customer/book',{
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
            res.render('customer/book',{
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
            res.render('customer/book',{
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
    const query = `SELECT * FROM room_tbl WHERE room_id ="${req.body.room_id}"`
  
    db.query(query,(err,out)=>{
      res.send(out[0])
    })

  }
}) 

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

router.post('/roomCheck',(req,res)=>{
  if(req.body.room_id == 'Common'){
    const query = `SELECT * FROM room_tbl WHERE room_fee = "0"`
    db.query(query,(err,out)=>{
      res.send({out})
    })
  } else{
    const query = `SELECT * FROM room_tbl WHERE room_id = "${req.body.room_id}"`
    db.query(query,(err,out)=>{
      res.send({out})
    })
  }

  
})






exports.customer = router;