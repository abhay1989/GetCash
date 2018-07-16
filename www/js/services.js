angular.module('starter.services', [])

.constant('p_const', {
  // apiurl:'http://playgreen.in:8086/api/',
  
   //apiurl:'http://115.124.122.229:8084/api/',
   //uploadPath: 'http://115.124.122.229:8084/uploads/'

   apiurl:'http://115.124.97.41:8084/api/',
   uploadPath: 'http://115.124.97.41:8084/uploads/'
   
   // uploadPath:'http://localhost:8084/uploads/',
   // apiurl:'http://localhost:8084/api/'
   
})

.factory('AuthService', function($http,$q,p_const,$state, $ionicPopup) {

  var LOCAL_TOKEN_KEY = "cashapp-user";
  var id = '';

  var isAuthenticated = false;
  var role = '';
  var authToken;

  function loadUserCredentials() {
    
    var user = window.localStorage.getItem('user_data');
    if (user) {
      var user = JSON.parse( user );
      useCredentials( user );
    }
  }

  function storeUserCredentials(user) 
  {
        var xyz = user;
        //alert('Data Recd in User Details to Store is : '+xyz);
        console.log('Data Recd in User Details to Store is : ',user);
        window.localStorage.setItem('user_data', JSON.stringify(user));
        useCredentials(user);
  }

  function useCredentials(user) {
    //alert('Entered to authToken Storing with user Details : ',JSON.stringify(user));
    console.log('Entered to authToken Storing with user Details : ',JSON.stringify(user));
    id       = user.UserId;
    isAuthenticated = true;
    authToken = JSON.stringify(user);

    //$http.defaults.headers.common['X-Auth-Token'] = JSON.stringify(user);
  }

  function destroyUserCredentials() {
    authToken = undefined;

    id       = '';
  
    isAuthenticated = false;
    console.log('logout service');
    //$http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem('user_data');
    localStorage.removeItem('userid');
  }

   var loginApp = function  (login_data) {
      return $q(function(resolve,reject){

     $http.post(p_const.apiurl + "users/sign_in",login_data)
        .success(function(res,req)
        {
          console.log("Response recd for login in Service is : ",res.data);

          //alert("Data recd from Login : " +res);
          //alert("Data recd from Login : " +res.data);
          //Internal Server Error
          if (res=='Internal Server Error')
          {
            //alert('Application not responding, pls close the application and try again..!');
            reject( res );
          }

          else
          {

            if( !res )
              {
                reject( res );
              } else 
                   {
                      console.log('User Credentials in Login Service 1 are : ',res.data);
                      //storeUserCredentials(res.data);
                      resolve ( res );

                   }
           }           
        }).error( function(res,req){
        reject( res );
      });
    });
  };


  var registerApp = function(register_data){
    return $q(function(resolve, reject){
    console.log('Data sending from Register Service is : ',register_data); 
    //$http.post(p_const.apiurl + "users/sign_up", register_data )
    $http.post(p_const.apiurl + "users/sign_up_new", register_data )
      .success(function(res,req){

          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
  };

  var contatUsMsg = function(contactus_data){
    return $q(function(resolve, reject){
    console.log('Data sending from Contact Us Service is : ',contactus_data); 
    $http.post(p_const.apiurl + "users/contactus", contactus_data )
      .success(function(res,req){

          console.log('Data recd from Contact us API in Service is ',res);
          resolve (res);
          

     }).error(function(res,req){
          console.log('Data recd from Contact us API failed in Service is ',res);
          reject (res);
     });
    });
  };


  var saveReqAppDetails = function(app_data){
    return $q(function(resolve, reject){
    console.log('App Installation Req Details Recd in the Service are : ',app_data);
    $http.post(p_const.apiurl + "users/reqAppDetails_Save", app_data)
      .success(function(res,req){

          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
  };


  //function installAppDetails(appLink)

  var installAppDetails = function(appLink)
  {

       var headers = new Headers();
        headers.append("Access-Control-Allow-Origin","*,http://localhost:8100");
        headers.append("Access-Control-Allow-Headers","X-Requested-With");
        headers.append('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');

    return $q(function(resolve, reject)
    {
          console.log('App Installation Req Url Recd in Service is : ',appLink);
          return $http({ method: 'JSONP', url:appLink, headers: headers}).then(function(res)
          {
                console.log('Response returned in Service Success is : ',res);
                return res;

           }, function errorCallback(res)           //.error(function(res,req)
              {
                console.log('Response returned in Service Failed is : ',res);
                return res;
              });
     });      
  };


  var fbregisterApp = function(fbregister_data){
    return $q(function(resolve, reject){

    console.log("Entered FB Service File..!");
    console.log(fbregister_data);
    console.log(p_const.apiurl);
    //sign_up_new
    //$http.post(p_const.apiurl + "users/sign_up", fbregister_data )

    $http.post(p_const.apiurl + "users/sign_up", fbregister_data )
      .success(function(res,req){
       
          resolve (res);
          console.log(res);
          console.log("Fb Signup register success..!",res);

       
     }).error(function(res,req){
          reject (res);
          console.log("Fb Signup register failed..!" + res);
     });
    });
  };


  var fpassApp = function(user_data)
  {
    return $q(function(resolve, reject)
    {
        $http.post(p_const.apiurl + "users/forget_password", user_data )
        .success(function(res,req)
        {
          //console.log("Response recd for login in Service is : ",res);
          //Internal Server Error
          if (res=='Internal Server Error')
          {
            reject( res );
            //resolve ( res );
          }
          else
          {

            if( !res )
              {
                reject( res );
              } else 
                   {
                      resolve ( res );
                   }
           }           
        }).error( function(res,req){
        reject( res );
      });
    });
  };



var otppassApp = function  (reset_data) 
{
      return $q(function(resolve,reject){

    $http.post(p_const.apiurl + 'users/otplogin_password', reset_data)
        .success(function(res,req)
        {
          if( res==='Internal Server Error' )
            {
              console.log('Entered OTP Pwd fail 1 in Service..!', res);
              //reject( res.message);
              reject('Incorrect / Wrong OTP entered...!');
              //alert('Incorrect / Wrong OTP entered...!');

              $ionicPopup.alert({
                   title: 'OTP - Password',
                   template: 'Incorrect / Wrong OTP entered...!',
               })

            } 
            else {
                    console.log('Entered OTP Pwd successful in Service..!',res.data);

                    storeUserCredentials(res.data);
                    resolve ( res );                    
                    //$state.go('app.tab.home');
                  }
        }).error( function(res,req)
                {
                    //console.log('Entered OTP Pwd fail 2in Service..!');
                    reject('Incorrect / Wrong OTP entered...!');
                    
                    $ionicPopup.alert({
                         title: 'OTP - Password',
                         template: 'Incorrect / Wrong OTP entered...!',
                     })

                                    
                });
      });
  };


var otppassAppResend = function  (reset_data) {
      return $q(function(resolve,reject){

    $http.post(p_const.apiurl + 'users/resend_otp', reset_data)
        .success(function(res,req)
        {
          if( res==='Internal Server Error' )
            {
              console.log('Entered OTP Pwd fail 1 in Service..!', res);
              //reject( res.message);
              reject('Could not re-send the OTP...!');
              //alert('Could not re-send the OTP...!');

                    $ionicPopup.alert({
                         title: 'OTP - Password',
                         template: 'Could not re-send the OTP...!',
                     })              
            } 
            else {
                    //console.log('Entered OTP Pwd successful in Service..!',res);
                    //alert('Re-sent the OTP successfully....!');

                    $ionicPopup.alert({
                         title: 'OTP - Password',
                         template: 'Re-sent the OTP successfully....!',
                     })              

                    //$state.go('app.tab.home');
                  }
        }).error( function(res,req)
                {
                    //console.log('Entered OTP Pwd fail 2in Service..!');
                    //alert('Could not re-send the OTP...!');
                    reject('Could not re-send the OTP...!');

                    $ionicPopup.alert({
                         title: 'OTP - Password',
                         template: 'Could not re-send the OTP...!',
                     })              

                });
      });
  };


   var resetpassApp = function  (reset_data) {
      return $q(function(resolve,reject){

     $http.post(p_const.apiurl + "users/reset_password",reset_data)
        .success(function(res,req)
        {
          if( !res )
            {
              reject( res );
              console.log('Reset Pwd 1');
              console.log('1 :',req);
              console.log('2 :',res);

            } else 
                 {

                    console.log('Reset Pwd 2');
                    console.log('1 :',req);
                    console.log('2 :',res);

                    //storeUserCredentials(res.data);
                    resolve ( res );

                 }     
        }).error( function(res,req){
        reject( res );
      });
    });
  };


  var resetpassApp11 = function(reset_data){
    return $q(function(resolve, reject){

    $http.post(p_const.apiurl + 'users/reset_password', reset_data )
    .success(function(res,req){
       if( !res){
          reject( res.message);
       } else {
          
          console.log('1 :',req);
          console.log('2 :',res);

          if (req==500)
          {
            //reject(res.message);
          }
          else
             {
                //$state.go('login');
             }

          //$state.go('login');
       }
     }).error( function(res,req){

        reject( res.message);
      });
    });
  };

  var getUser = function  (user) {
      return $q(function(resolve,reject){

     $http.post(p_const.apiurl + "users/edit_img",user)
        .success(function(res,req){
        if( res.error ){
          reject( res );
        } else {
          resolve ( res );
        }
      }).error( function(res,req){
        reject( res );
      });
    });
  }
  
  var Citylist = function(){
     return $q(function(resolve, reject){
    $http.get(p_const.apiurl + "users/city_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };
  
  var Countrylist = function(){
     return $q(function(resolve, reject){
    $http.get(p_const.apiurl + "users/country_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var Statelist = function(){
     return $q(function(resolve, reject){
    $http.get(p_const.apiurl + "users/states_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };


var CompInformList = function(){
     return $q(function(resolve, reject){
    $http.get(p_const.apiurl + "users/companyinfo_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var topRankersList = function(){
     return $q(function(resolve, reject){
    $http.get(p_const.apiurl + "users/toprankers_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var HelpList = function(){
     return $q(function(resolve, reject){
    $http.get(p_const.apiurl + "users/help_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var TermsList = function(){
     return $q(function(resolve, reject){
    console.log('Entered Terms and Condtions service');
    $http.get(p_const.apiurl + "users/terms_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var earnPayList = function(){
    console.log('Entered earpay Service..!'); 
     return $q(function(resolve, reject){
    $http.get(p_const.apiurl + "users/earnpay_list" )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var challengesList = function(){
     return $q(function(resolve, reject){
      // console.log(req.body.AppId);
    $http.get(p_const.apiurl + "users/challenges_list" )
      .success(function(res,req){
          resolve (res);
          //res=JSON.parse(JSON.stringify(res));
          //console.log(res.data);

     }).error(function(res,req){
          reject (res);
     });
    });
   };


     var canReferMembers = function(user_dets){
     return $q(function(resolve, reject){
    console.log('User Id Rcvd for Apps List in Service is : ',user_dets);
    $http.post(p_const.apiurl + "users/isValidReferMember", user_dets)
      .success(function(res,req){
          
          //res=JSON.parse(JSON.stringify(res));
          console.log('Apps List Data Recd in Service : ',res);
          resolve (res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

     var updateAppCount = function(src){
     return $q(function(resolve, reject){
      // console.log(req.body.AppId);
    //$http.post(p_const.apiurl + "users/sign_up", register_data )

    console.log('App Installed details recd in the service : ',src)
    $http.post(p_const.apiurl + "users/updtUserAppCount", src)
      .success(function(res,req){
          resolve (res);
          //res=JSON.parse(JSON.stringify(res));
          //console.log(res.data);

     }).error(function(res,req){
          reject (res);
     });
    });
   };


  var challengeDetails = function(app){
     return $q(function(resolve, reject){
      console.log("Search for App Id in Services :"+ app.appId);
    $http.post(p_const.apiurl + "users/challenge_details", app)
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var updateAppInstallStatus = function(userapp_data)
  {
     return $q(function(resolve, reject){
    console.log("Updating Installed App Details and Adding Balance to the User A/c :"+ userapp_data);
    $http.post(p_const.apiurl + "users/updateAppInstallStatus", userapp_data)
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };


  var UserMemberslist = function  (user) {
      return $q(function(resolve,reject){
     console.log("Searching Members for User in Service :" + user.user_id);
     $http.post(p_const.apiurl + "users/user_members_list",user)
        .success(function(res,req){
        if( res.error ){
          reject( res );
        } else {
          resolve ( res );
        }
      }).error( function(res,req){
        reject( res );
      });
    });
  };


  var SupportDetails = function  () {
      return $q(function(resolve,reject){
      console.log("Searching for Company information in Service :");
      $http.post(p_const.apiurl + "users/support")
        .success(function(res,req){
        if( !res ){
          console.log("Error in Company Info API " + res);
          reject( res );
        } else {
          console.log("Success in Company Info API " + res);
          resolve ( res );
        }
      }).error( function(res,req){
        console.log("Falied to Run Company Info API " + res);
        reject( res );
      });
    });
  };   

var getuserApp = function(user_id){
     return $q(function(resolve, reject){
    $http.post(p_const.apiurl + "users/get_user", user_id )
      .success(function(res,req){
          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });
   };

  var profileupdateApp = function(profile_data){
     return $q(function(resolve, reject){

    $http.post(p_const.apiurl + "users/update_profile", profile_data )
      .success(function(res,req){

          resolve (res);
          console.log(res);

     }).error(function(res,req){
          reject (res);
     });
    });

  };

  var changePass = function(pass_data)
  {
    return $q(function(resolve, reject){

    $http.post(p_const.apiurl + 'users/change_password', pass_data )
    .success(function(res,req){
       console.log('Service Change Password : ',res);  
       if( res.error){
          reject( res.message);
       } else {
          resolve ( res );
       }
     }).error( function(res,req){

        reject( res.message);
      });
    });
  };

   var logout = function(id, os) 
   {
    destroyUserCredentials();
    //$http.get(API+'logout.php?id='+id+'&os='+os, null, function(){});
   };


  var mbServiceProviderList = function(){
  console.log('Entered Mobile Recharge Service Providers in Service ctrl..!'); 
  return $q(function(resolve, reject){
  $http.get(p_const.apiurl + "users/mb_serviceProviders")
     .success(function(res,req){
     console.log('Mobile Recharge Service Providers Data Recd in Service is :' + res);
     resolve (res);
     }).error(function(res,req){
          console.log('Mobile Recharge Service Providers Data Recd falied in Service is :' + res);
          reject (res);
     });
    });
  };

  var mbServiceProviderCircleList = function(){
  console.log('Entered Mobile Recharge Service Provider Circles in Service ctrl..!'); 
  return $q(function(resolve, reject){
  $http.get(p_const.apiurl + "users/mb_serviceProvidersCircles")
     .success(function(res,req){
     console.log('Mobile Recharge Service Provider Circles Data Recd in Service is :' + res);
     resolve (res);
     }).error(function(res,req){
          console.log('Mobile Recharge Service Provider Circles Data Recd falied in Service is :' + res);
          reject (res);
     });
    });
  };

  var dthServiceProviderList = function(){
  console.log('Entered DTH Card Recharge Service Providers in Service ctrl..!'); 
  return $q(function(resolve, reject){
  $http.get(p_const.apiurl + "users/dth_serviceProviders")
     .success(function(res,req){
     console.log('DTH Card Recharge Service Providers Data Recd in Service is :' + res);
     resolve (res);
     }).error(function(res,req){
          console.log('DTH Card Recharge Service Providers Data Recd falied in Service is :' + res);
          reject (res);
     });
    });
  };

  var dcServiceProviderList = function(){
  console.log('Entered Data Card Service Providers in Service ctrl..!'); 
  return $q(function(resolve, reject){
  $http.get(p_const.apiurl + "users/dc_serviceProviders")
     .success(function(res,req){
     console.log('DataCard Service Providers Data Recd in Service is :' + res);
     resolve (res);
     }).error(function(res,req){
          console.log('DataCard Service Providers Data Recd falied in Service is :' + res);
          reject (res);
     });
    });
  };

  var dth_bookService = function(dth_book_data){
  console.log('Entered DTH booking Service in Service ctrl..1'+ dth_book_data.operator_code); 
  console.log('Entered DTH booking Service in Service ctrl..2'+ dth_book_data.user_mobileno); 
  console.log('Entered DTH booking Service in Service ctrl..3'+ dth_book_data.user_amount); 
  console.log('Entered DTH booking Service in Service ctrl..4'+ dth_book_data.client_transid); 

  return $q(function(resolve, reject){
  $http.post(p_const.apiurl + "users/dth_bookService", dth_book_data)
     .success(function(res,req){
     console.log('DTH booking service data Recd in Service is :',res);
     resolve (res);
     }).error(function(res,req){
          console.log('DTH booking service data Recd in Service falied :',res);
          reject (res);
     });
    });
  };

  var mob_bookService = function(mobsb_data){
  //rcprepaid
  console.log('Entered Mobile Recharge Service in Service, Data sent is : ', mobsb_data);
  return $q(function(resolve, reject){
  $http.post(p_const.apiurl + "users/mob_bookService", mobsb_data)
     .success(function(res,req){
     console.log('Mobile Recharge service data Recd in Service is :' + res);
     resolve (res);
     }).error(function(res,req){
          console.log('Mobile Recharge service data Recd in Service falied :' + res);
          reject (res);
     });
    });
  };

  var dc_bookService = function(dc_book_data){
  console.log('Entered DataCard Recharge Service in Service ctrl..1'+ dc_book_data.operator_code); 
  console.log('Entered DataCard Recharge Service in Service ctrl..2'+ dc_book_data.user_mobileno); 
  console.log('Entered DataCard Recharge Service in Service ctrl..3'+ dc_book_data.user_amount); 
  console.log('Entered DataCard Recharge Service in Service ctrl..4'+ dc_book_data.client_transid); 

  return $q(function(resolve, reject){
  $http.post(p_const.apiurl + "users/dc_bookService", dc_book_data)
     .success(function(res,req){
     console.log('DataCard Recharge service data Recd in Service is :' + res);
     resolve (res);
     }).error(function(res,req){
          console.log('DataCard Recharge service data Recd in Service falied :' + res);
          reject (res);
     });
    });
  };   

    var factory = {};
          factory.logout= logout,
          factory.loginApp = loginApp,
          factory.registerApp = registerApp,
          factory.fpassApp = fpassApp,
          factory.resetpassApp = resetpassApp,
          factory.otppassApp = otppassApp,
          factory.getUser = getUser,
          factory.profileupdateApp = profileupdateApp,
          factory.getuserApp = getuserApp,
          factory.Citylist = Citylist,
          factory.Countrylist = Countrylist,
          factory.Statelist = Statelist,
          factory.fbregisterApp = fbregisterApp,
          factory.UserMemberslist = UserMemberslist,
          factory.SupportDetails = SupportDetails,
          factory.CompInformList = CompInformList,
          factory.topRankersList = topRankersList,
          factory.challengesList = challengesList,
          factory.challengeDetails = challengeDetails,
          factory.earnPayList = earnPayList,
          factory.HelpList = HelpList,
          factory.TermsList = TermsList,
          factory.changePass = changePass,
          factory.otppassAppResend = otppassAppResend,
          factory.saveReqAppDetails = saveReqAppDetails,
          factory.mbServiceProviderList = mbServiceProviderList,
          factory.mbServiceProviderCircleList = mbServiceProviderCircleList,
          factory.dthServiceProviderList = dthServiceProviderList,
          factory.dcServiceProviderList = dcServiceProviderList,
          factory.dth_bookService = dth_bookService,
          factory.mob_bookService = mob_bookService,
          factory.contatUsMsg = contatUsMsg,
          factory.installAppDetails = installAppDetails,
          factory.canReferMembers = canReferMembers,
          factory.updateAppCount = updateAppCount,
          factory.updateAppInstallStatus = updateAppInstallStatus,
          factory.dc_bookService = dc_bookService;

          return factory;
});
