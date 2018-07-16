var express = require('express');
var router = express.Router();
const utils = require('./utils');
var environment = require('./dbconnection');
const sql =require('mssql');
const nodemailer = require('nodemailer');
var crypto=require('crypto');
var CRUD = require('mysql-crud');
var notificationCRUD = CRUD(environment.connection , 'notifications');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('./flow-node.js')('tmp');
var sanitize = require("sanitize-filename");
var mkdirp = require('mkdirp');
var fs = require('fs');

var usersCRUD = CRUD(environment.connection , 'ManageUsers');

// api calls

 router.post('/get_user',function(req,res){
  // this is post call
    var user_id=req.body.user_id;
    var query="select * from ManageUsers where UserId = '"+user_id+"'";
    // var query1="select CityName, StateId, CountryId from ManageCity,ManageUsers where ManageUsers.CityId=ManageCity.CityId and  UserId = '"+user_id+"'";
    // var query2 = "select StateName from ManageStates,ManageCity,ManageUsers where ManageCity.CountryId=ManageStates.CountryId and UserId = '"+user_id+"'";
    // var query3 = "select CountryName from ManageCountry,ManageStates,ManageUsers where ManageStates.CountryId=ManageCountry.CountryId and UserId= '"+user_id+"'";
     console.log(query);
    environment.connection.request().query(query,function(error,rows){
      	console.log(rows);
          if (error) {
            utils.responseError( res, error );
          } else{
            utils.responseSuccess( res, {
                data : rows.recordset[0],
                });
      	}
      });
});

    // this is login api
  router.post('/sign_in',function(req,res){
  // this is post call

  var user_name = req.body.user_name;
  var user_pass = req.body.user_pass;
  //var user_imei = req.body.imei;

  console.log('req.body',req.body);
  if(utils.checkvalidemail(user_name))
  {
    var query = "select * from ManageUsers where EmailId='"+user_name+"' and Password='"+user_pass+"' ";
    //var query = "select a.*, b.imeino from ManageUsers a, ManageUIMEI b where a.EmailId=b.EmailId and a.EmailId='"+user_name+"' and a.Password='"+user_pass+"' and b.imeino='"+user_imei +"'";

  }else{
    var query = "select * from ManageUsers where MobileNo='"+user_name+"' and Password='"+user_pass+"' ";
    //var query = "select a.*, b.imeino from ManageUsers a, ManageUIMEI b where a.MobileNo='"+user_name+"' and a.Password='"+user_pass+"' and b.imeino='"+user_imei +"'";

  }
   // var query = "select * from ManageUsers where UserName='"+user_name+"' and Password='"+user_pass+"' ";
   console.log(query);
      environment.connection.request().query(query,function(error,rows){

          if (error) {
            utils.responseError( res, "Login Fail" );
          } else {

            if( rows.recordset.length != 0 ){

              utils.responseSuccess( res, { message : "Login succesfully.", data : rows.recordset[0] } );
            }else{
              utils.responseSuccess( res, { message : 'Wrong user name or password', data : '' } );
            }
        }
      });
});

   // this is sign_up api
  router.post('/sign_up',function(req,res){
    var user_name = req.body.user_name;
    var user_email = req.body.user_email;
    var user_mobile = req.body.user_mobile;
    var user_pass = req.body.user_pass;
    var confirm_pass=req.body.confirm_pass;
    var refer_id = req.body.refer_id;
    //var user_imei = req.body.imei; //FOR imei number

   // if (user_name && user_email && user_mobile && user_pass && confirm_pass && refer_id) {

    //1st check 10 user for this ref_id
    check_refrences(refer_id,function(rid){
      console.log('return rid-->',rid);
        var email_exists_query = "select * from ManageUsers where UserId='"+refer_id+"'";
            console.log('Entered to check whether the new user emailid is regd or not..!');
            environment.connection.request().query(email_exists_query,function(error,records){
                if(error)
                {
                   // console.log('1');
                    utils.responseError( res, error );
                }else
                    {
                      if(records.recordset.length > 0)
                      {
                        var email_exists_query = "select * from ManageUsers where EmailId='"+user_email+"'";
                        environment.connection.request().query(email_exists_query,function(error,records){
                            if(error)
                            {
                             // console.log('1');
                              utils.responseError( res, error );
                            }else{
                                    if(records.recordset.length > 0)
                                    {
                                      // console.log('2');
                                       utils.responseSuccess( res, { message:'Email address already exists',rescode:'100'} );
                                    }else
                                        {
                                          //console.log('3');
                                          var query = "INSERT INTO ManageUsers(UserName,EmailId,MobileNo,Password,TrnPassword,ReferenceId,DeviceId) VALUES ( '"+user_name+"', '"+user_email+"','"+ user_mobile+"', '"+user_pass+"','"+confirm_pass+"', '"+rid+"','0')";
                                          console.log(query);
                                          environment.connection.request().query(query,function(error,records){
                                          utils.sendPushNote(user_name, 'Facebook Login', 'Congrats, your Facebook Login was successfull...!');
                                          //console.log(rows);
                                          //console.log( fields );
                                           if( error )
                                           {
                                             utils.responseError( res, error );
                                           }else
                                               {

                                                  //var query1 = "INSERT INTO ManageUIMEI(IMEINo,EmailId,IsActive) VALUES ('"+user_imei+"', '"+user_email+"' ,1)";
                                                  //environment.connection.request().query(query1,function(error1,records1)
                                                  //{
                                                  //   if( error1 )
                                                  //     {
                                                  //       utils.responseError( res, error1 );
                                                  //     }
                                                  //     else
                                                  //        {
                                                  //          utils.responseSuccess( res, {message:'Sign up and IMEI inserted succesfully.'});
                                                  //        }   
                                                  //})                                                  

                                                  utils.responseSuccess( res, {message:'Signup succesfully.'});
                                                  //utils.sendPushNote(user_name, 'Facebook Login', 'Congrats, your Facebook Login was successfull...!');
                                               }
                                      });
                                  }
                                }
                              });
                        }else
                          {
                            utils.responseSuccess( res, { message:'Reference Id does not exists',rescode:'100'} );
                          }
                   }
                  });


    });

     // if(check_refrences(refer_id)){
     //    }else{
     //      utils.responseError(res, {message:'Registration failed.'});
     //    }

});

var check_refrences = function(refer_id, callback){
  var query ="select UserId from ManageUsers where ReferenceId = '"+refer_id+"'";
    console.log('one-->',query);
      environment.connection.request().query(query,function(error,rows){
        if( error ){
          callback(0);
        }else{
          console.log('length',rows.recordset.length);
          if(rows.recordset.length<2){
            callback (refer_id);
          }else{
            //callback (0);
            for(let i= 0; i<rows.recordset.length; i++){
              console.log(rows.recordset[i].UserId);
              // if( check_child_refrences(rows.recordset[i].UserId)){
              //   console.log('in if');
              //   callback (rows.recordset[i].UserId);
              //   break;
              // }
              //var ressult = check_child_refrences(rows.recordset[0].UserId);
               //  console.log('in if', check_child_refrences(rows.recordset[0].UserId));
                var ref = rows.recordset[i].UserId;
                var query ="select UserId from ManageUsers where ReferenceId = '"+rows.recordset[i].UserId+"'";
                  console.log('three-->',query);
                    environment.connection.request().query(query,function(error,rows){
                      if( error ){
                        callback (0);
                      }else{
                        if(rows.recordset.length<2){
                          console.log('length',rows.recordset.length);
                          callback (ref);
                          // break;
                        }else{
                          callback (0);
                        }
                      }
                    });
                 
                
              //console.log('in loop UserId-->',rows.recordset[i].UserId);
              //callback(rows.recordset[i].UserId);
            }

          }
        }
      });

}

function check_child_refrences(refer_id){
  var query ="select UserId from ManageUsers where ReferenceId = '"+refer_id+"'";
    console.log('three-->',query);
      environment.connection.request().query(query,function(error,rows){
        if( error ){
          return 0;
        }else{
          //if(rows.recordset.length<2){
            console.log('length',rows.recordset.length);
            return refer_id;
          //}else{
          //  callback (0);
          //}
        }
      });
}
   //this is forget_password api
router.post('/forget_password',function(req,res){
  // this is post call
  var user_email=req.body.user_email;
  var activation_code = utils.getRandomNumber();
  //console.log(req.body.user_email);

     var query = "select * from ManageUsers where EmailId='"+user_email+"'";
    environment.connection.request().query(query,function(error,records){
      if(error){
        console.log(error);
        utils.responseError( res, { message:'This email address does not exists',rescode:'100'} );
      } else {
          if( records.recordset.length > 0 ){
              var query_one="update ManageUsers set OTP = '"+activation_code+"' where EmailId='"+user_email+"'";
                //console.log(query_one);
                environment.connection.request().query(query_one , function(error,records){
                  console.log(records);
                  if ( records.rowsAffected == 1 ) {

                    var mailOptions={
                      from : "GetCash <support@init.solutions>",
                      to : user_email,
                      subject : "Reset Password",
                      //html : '<h3>Your activation code For Reset Password is </h3>'+activation_code
                      html : ' <body> <table style="width:100%;border-spacing: 0px;"> <tr style="background: grey;color: #fff;"> <th style="padding-left:10%; text-align:left;"><h2>GetCash</h2></th> <th style="padding-right:10%;text-align:right;"><h3>24/7 Support: 9898989898</h3></th> </tr> <tr> <th colspan="2" style="padding:30px;background:#f4f4f4;"> <h1> Forgot your password?</h1> </th> </tr>  <tr> <td colspan="2" style="font-size:14px;padding-left:10%;padding-right:10%;padding-top:50px;padding-bottom:50px;"> <h4>Dear user, </h4><p>Your activation code for Reset Password is - <strong style="color:black">'+activation_code+'</strong></p><br><p>Thank you.</p></td> </tr> <tr> <td colspan="2" style="background:#BEBEBE;font-size:12px;padding-left:10%;padding-right:10%;padding-top:20px;padding-bottom:20px;"> Please do not reply to this email. Emails sent to this address will not be answered.<br><br> Copyright © 2017 GetCash. 137 1st Floor, K C Road, Pune. All rights reserved. </tr> </td> </table> </body>'
                    }
                    //<tr> <td colspan="2" style="text-align:center;background:#FD8050;color:#fff;"> <h3>Lorem ipsum dolor sit amet consectetur</h3> </td> </tr>
                      console.log(mailOptions);
                      environment.transporter.sendMail(mailOptions, function(error, response){
                        if(error){
                          console.log(error);
                          utils.responseError( res, { message : 'Activation code not sent, please contact to admin.'});
                        }else{
                          //console.log("Message sent: " + response.message);
                          //res.end("sent");
                          utils.responseSuccess( res, { message : 'Sent activation code .'});
                        }
                      });
                  } else{
                    utils.responseError( res, { message :"please enter valid email"} );
                  }
                });
          }else{
            utils.responseError( res, { message:'This email address does not exists',rescode:'100'} );
          }
      }
    });

});
     //this is reset_password api
router.post('/reset_password',function(req,res){
  // this is post call
  var password = req.body.user_pass;
  var activation_code = req.body.activation_code;
  var user_email=req.body.user_email;
  console.log(req.body);
      var query="update ManageUsers set Password ='"+password+"' where OTP='"+activation_code+"' ";
      console.log(query);
      environment.connection.request().query(query , function(error,records){
        //console.log(rows.affectedRows);
      if (error) {
        //console.log(error);
          utils.responseError( res , { message : "Please enter valid Activation Code"} );
        } else{
          //console.log(records.rowsAffected);
          if(records.rowsAffected == 1){
            utils.responseSuccess( res, "Reset Password succesfully.");
          }else{
            utils.responseError( res , { message : "Please enter valid Activation Code"} );
          }
        }
      });


});

//api call to update profile image
router.post('/uploadprofileimage', multipartMiddleware, function(req, res, next) {
  flow.post(req, function(status, filename, original_filename, identifier) {

    console.log('status: '+ status, filename, original_filename, identifier);
      if( status==='done' && req.body.flowChunkNumber == req.body.flowTotalChunks ){
        console.log( 'user_id=', req.body);
        //var filePath = environment.uploadPath +'profileimages/'+ req.body.user_id+'/' ;
        var filePath = environment.uploadPath +'profileimages/'+req.body.user_id+'/' ;
        console.log('dasddsad');
        console.log( filePath );
          // create folder
          mkdirp(filePath, function(err) {
              if (err){
                console.log( 'projectimages error');
                throw err;
              }
          });

        filename = sanitize(filename);
        var getRandomno = Math.floor((Math.random() * 99999999999) + 1);
        filename = filename.replace(/\s+/g, '_').replace(/(\.[^\.]*)?$/, ""+getRandomno+"$1");
        var s = fs.createWriteStream( filePath + filename);
        s.on('finish', function() {
           readFile( filePath + filename);
               res.status(200).send({
                  status : true,
                  msg : 'File uploaded successfully',
                  filename : filename
                });
        });
        flow.write(identifier, s, {end: true});
      } else {
        res.status(200).send({ status : 'partiallyUploaded', });
      }
  });
  function readFile(filename) {
   console.log('filename',filename);
    //fs.unlinkSync(filename);
  }
});//API end

//updateimages profile pic of a service provider profile
router.post('/updateprofileimage', function(req, res){
  var obj = { data:'', error_code:'1' };
  console.log( 'updateprofileimage api', req.body );

  // usersCRUD.update({
  //   'UserId' : req.body.user_id
  //   },{
  //     'UPhoto': req.body.profileimage
  //   },function(err, vals){
  //     console.log( 'edit profileimage',err );
  //     if(err) {
  //       obj.data = err;
  //       obj.error_code = 400;
  //       res.jsonp( obj );
  //     } else {
  //       console.log( vals );
  //       obj.data = vals;
  //       obj.error_code = 200;
  //       res.jsonp( obj );
  //     }
  // });

    var query="update ManageUsers set UPhoto_name = '"+req.body.profileimage+"' where UserId='"+req.body.user_id+"' ";
      console.log(query);
      environment.connection.request().query(query , function(error,records){
        console.log(records.affectedRows);
      if (error) {
        //console.log(error);
          utils.responseError( res );
        } else{
            utils.responseSuccess( res, "Update image succesfully.");
         }
      });
});

  router.post('/edit_img',function(req,res){
  // this is post call

  var user_id = req.body.user_id;
  console.log('req.body',req.body);
    var query = "select CONVERT(varchar(max),UPhoto) as image from ManageUsers where UserId='"+user_id+"'";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset[0]);
              utils.responseSuccess( res, { message : "Get user data succesfully.", data : rows.recordset[0] } );
          }

      });

});

router.get('/city_list',function(req,res){
  // this is post call

    var query = "select * from ManageCity";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Get city data succesfully.", data : rows.recordset } );
          }

      });

});

router.get('/states_list',function(req,res){
  // this is post call

    var query = "select * from ManageStates";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Get state data succesfully.", data : rows.recordset } );
          }

      });

});

router.get('/country_list',function(req,res){
  // this is post call

    var query = "select * from ManageCountry";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Get country data succesfully.", data : rows.recordset } );
          }

      });

});
router.post('/update_profile',function(req,res){
  // this is post call

  var user_fname = req.body.UserName;
  var user_lname = req.body.LastName;
  var user_email = req.body.EmailId;
  var user_mobile = req.body.MobileNo;
  var user_address = req.body.Address;
  var user_gender = req.body.Gender;
  var user_dob = req.body.DOB;
  var user_pan = req.body.PanNo;
  var user_id = req.body.UserId;
  console.log(req.body);
   var query = "update ManageUsers set UserName='"+user_fname+"', LastName='"+user_lname+"', EmailId='"+user_email+"', MobileNo='"+user_mobile+"', Address='"+user_address+"', DOB='"+user_dob+"', PanNo='"+user_pan+"', Gender='"+user_gender+"', CityId='"+req.body.CityId+"', CountryId='"+req.body.CountryId+"', StateId='"+req.body.StateId+"'  where UserId = '"+user_id+"' ";
   console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
           // console.log(rows.recordset[0]);
              utils.responseSuccess( res, { message : "Update user data succesfully."} );
              // var query_one = "update ManageCity set CityName='"+citydata+"' where CityId = '"+req.body.CityId+"' ";
              //  console.log(query_one);
              //     environment.connection.request().query(query_one,function(error,rows){
              //         if (error) {
              //           utils.responseError( res);
              //         } else {
              //             //utils.responseSuccess( res, { message : "Update user data succesfully."} );
              //             var query_two = "update ManageStates set StateName='"+Statedata+"' where StateId = '"+req.body.CityId+"' ";
              //              console.log(query_two);
              //                 environment.connection.request().query(query_two,function(error,rows){
              //                     if (error) {
              //                       utils.responseError( res);
              //                     } else {
              //                         //utils.responseSuccess( res, { message : "Update user data succesfully."} );
              //                     }

              //                 });
              //         }

              //     });
          }

      });
});

router.post('/user_members_list',function(req, res){
  // this is post call
var user_id=req.body.user_id;
console.log("Seraching members for the User in API " + user_id);
    var query121 = "select a.Userid, a.UserName, (select count(b.referenceid) from manageusers b where b.referenceid=a.userid group by b.referenceid) as members,  c.pervalue as permember,  ((select count(b.referenceid) from manageusers b where b.referenceid=a.userid group by b.referenceid) * c.pervalue) as total, a.uphoto_name, a.levelid,  a.membercount, a.totalearning, (select distinct d.username from manageusers d where d.userid=a.referenceid) as fusername, (select distinct e.uphoto_name from manageusers e where e.userid=a.referenceid) as fuserphoto, (select distinct f.userid from manageusers f where f.userid=a.referenceid) as fuserid  from manageusers a, managelevel c where a.levelid=c.levelid and a.referenceid=" + user_id;

      console.log(query121);
      environment.connection.request().query(query121,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Get user members list succesfully.", data : rows.recordset } );
          }

      });

});

router.get('/companyinfo_list',function(req,res){
  // this is post call

    var query = "select * from CompanyInfo";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Get Company info data succesfully.", data : rows.recordset } );
          }

      });

});

router.get('/terms_list',function(req,res){
  // this is post call

    console.log('Entered Terms and Condtions API');
    var query = "select * from ManageTerms";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Got Terms and Conditions info data succesfully.", data : rows.recordset } );
          }

      });

});


router.get('/toprankers_list',function(req,res){
  // this is post call

    var query = "select TOP 10 * FROM ManageUsers order by MemberCount desc";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Get Company info data succesfully.", data : rows.recordset } );
          }

      });

});


router.get('/help_list',function(req,res){
  // this is post call

    var query = "select * FROM ManageHelp";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Got Help info data succesfully.", data : rows.recordset } );
          }

      });

});


router.get('/earnpay_list',function(req,res){
  // this is post call

    var query = "select LevelId, LevelName, MaxMembers, InPercentage, PerValue,(MaxMembers*PerValue) as TotalEarn FROM ManageLevel order by LevelId";
       console.log(query);
      environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Got Earning Levels data succesfully.", data : rows.recordset } );
          }

      });

});

router.get('/challenges_list',function(req,res){
  // this is post call

    var query = "select * FROM ManageApps where IsActive=1 order by AppId";
        console.log(query);
        environment.connection.request().query(query,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            // console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Got Challenges List succesfully.", data : rows.recordset } );
          }

      });

});

// router.get('/challenge_details',function(req,res){

//         var app_id = req.body.AppDetails;
//         var query = "select * FROM ManageApps where AppId=" + req.data;
//         console.log(query);

//         environment.connection.request().query(query,function(error,rows){
//           if (error) {
//             utils.responseError( res, { message : "Got Challenge Details Failed."} );
//           } else {
//             console.log(rows.recordset);
//               utils.responseSuccess( res, { data : rows.recordset } );
//               // message : "Got Challenge Details succesfully.",
//           }

//       });

// });

router.post('/challenge_details',function(req, res){
  // this is post call app.appId
    
    var appId=req.body.appId;

    console.log("Entered Find App Details API function..!");
    console.log('Searching for App details in API New :' + appId);    

    var query121 = "select * FROM ManageApps where AppId=" + appId;

      console.log(query121);
      environment.connection.request().query(query121,function(error,rows){
          if (error) {
            utils.responseError( res);
          } else {
            console.log(rows.recordset);
              utils.responseSuccess( res, { message : "Got App details succesfully.", data : rows.recordset } );
          }

      });

});

router.post('/change_password',function(req,res){
  // this is post call
  var old_pass = req.body.old_pass;
  var user_pass = req.body.user_pass;
  var confirm_pass=req.body.confirm_pass;
  var user_id=req.body.user_id;
  
  console.log(req.body);
      var query="select * from ManageUsers where Password='"+old_pass+"' and UserId='"+user_id+"'";
      console.log(query);
      environment.connection.request().query(query , function(error,records){
        //console.log(rows.affectedRows);
      if (error) {
        //console.log(error);
          utils.responseError( res);
        } else{
          //console.log(records.rowsAffected);
          if(records.recordset.length==0){
            utils.responseError( res, { message :"Please enter valid Old password"});
          }else{
            //utils.responseError( res , { message : "Please enter valid Activation Code"} );
               var query = "update ManageUsers set Password='"+user_pass+"', TrnPassword='"+confirm_pass+"' where UserId = '"+user_id+"' ";
               console.log(query);
                  environment.connection.request().query(query,function(error,rows){
                      if (error) {
                        utils.responseError( res);
                      } else {
                          utils.responseSuccess( res, { message : "Update password succesfully."} );
                      }

                  });
          }
        }
      });


});


module.exports= router;
