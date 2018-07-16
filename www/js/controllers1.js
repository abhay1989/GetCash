angular.module('starter.controllers', ['starter.services', 'ngOpenFB', , 'ngCordova','ngCordovaOauth', 'ngStorage', 'base64', 'ngIdle'])


.controller('EventsCtrl', function($scope, $ionicPopup, $timeout, Idle, AuthService) {

  $scope.events = [];
        $scope.idle = 60;
        $scope.timeout = 1000;
        $scope.$on('IdleStart', function() {
          addEvent({event: 'IdleStart', date: new Date()});
          if (!window.localStorage.getItem('startTime'))
          {
              window.localStorage.setItem('startTime',new Date());
          }
          else
          {

                               alert('Auto Session Ends...!');
                               window.localStorage.removeItem('user_data');
                               AuthService.logout();
                               window.localStorage.clear();
                               window.location.reload();
                               $state.go($state.current, {}, {reload: true});
                               $state.go('login', {}, {reload: true});
                               window.location.reload();

          }
        });
        $scope.$on('IdleEnd', function() {
          addEvent({event: 'IdleEnd', date: new Date()});
          //alert('Idle Ended after...!');
        });
        $scope.$on('IdleWarn', function(e, countdown) {
          addEvent({event: 'IdleWarn', date: new Date(), countdown: countdown});
        });
        $scope.$on('IdleTimeout', function() {
          addEvent({event: 'IdleTimeout', date: new Date()});

          //var diff = ((new Date() - new Date(window.localStorage.getItem('startTime')))  % 60);
          //alert ('Session Ended Minutes : ',diff);          
          //alert('Going to End the Session..!');

        });
        $scope.$on('Keepalive', function() {
          addEvent({event: 'Keepalive', date: new Date()});
        });
        function addEvent(evt) {
          $scope.$evalAsync(function() {
            $scope.events.push(evt);
          })
        }
        $scope.reset = function() {
          Idle.watch();
        }
        $scope.$watch('idle', function(value) {
          if (value !== null) Idle.setIdle(value);
        });
        $scope.$watch('timeout', function(value) {
          if (value !== null) Idle.setTimeout(value);
        });
      })
      .config(function(IdleProvider, KeepaliveProvider) {
        KeepaliveProvider.interval(10);
        IdleProvider.windowInterrupt('focus');
      })
      .run(function($rootScope, Idle, $log, Keepalive){
        Idle.watch();
        $log.debug('app started.');
})


.controller('homeCtrl', function($scope, $state,AuthService, p_const, ngFB, $ionicLoading, $ionicPopup, $timeout) {

  //Checking the Apps Installed by this User
  console.log('User Data Stored in Memory for Session is ',JSON.parse(window.localStorage.getItem('user_data'))); 
  if( window.localStorage.getItem('user_data') ){
    //$state.go('app.tab.home');
  }else{
    $state.go('login');
  }
   
})


.controller('contactUsCtrl', function($scope, $state,AuthService, p_const, ngFB, $cordovaOauth, $ionicLoading,  $ionicHistory, $cordovaAppAvailability, $filter, $localStorage, $ionicPopup, $timeout) 

{


   $scope.contactus_data = {
        user_name:'',
        user_email:'',
        user_mobile:'',
        user_message:''
      }


    $scope.sendContactMessage = function()
    {

        console.log('Data sending from Contact Us Controller is : ',$scope.contactus_data); 

           $scope.errormsg="";

             AuthService.contatUsMsg($scope.contactus_data).then(function(contactus_data)
             {
                console.log( 'User Contact us result..!', contactus_data );

                if( user_data.rescode == 100 )
                  {
                      $scope.msg=contactus_data.message;
                      console.log( 'User Contactus Message sending Unsuccessfull..!', $scope.msg );
                      // $ionicLoading.hide();
                  } else 
                       {
                          console.log( 'User Contactus Message sent Successfull..!', contactus_data );
                          //alert("Contact us user message successfully...!");

                  $ionicPopup.alert({
                       title: 'Contact Us',
                       template: 'Your message sent successfully...!',
                   })  

                          $state.go('app.tab.home');
                          // $ionicLoading.hide();
                       }

              }, function(err)
                  {
                    // console.log(err);
                    $scope.message = err.message;
                    // $ionicLoading.hide();
                  });
    }

    $scope.reset_form = function()
    {

        $scope.contactus_data = 
              {
                user_name:'',
                user_email:'',
                user_mobile:'',
                user_message:''
              }            
    }  


})


.controller('rateusCtrl', function($scope, $state,AuthService, p_const, ngFB, $ionicLoading, $ionicPopup, $timeout) {

        var filter = {
            box : 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            
            // following 4 filters should NOT be used together, they are OR relationship
            read : 0, // 0 for unread SMS, 1 for SMS already read
            _id : 0, // specify the msg id
            address : '', // sender's phone number
            body : '', // content to match
            
            // following 2 filters can be used to list page up/down
            indexFrom : 0, // start from index 0
            maxCount : 10, // count of SMS to return each time
          };

          if(SMS) SMS.listSMS(filter, function(data){
              updateStatus('sms listed as json array');
              updateData( JSON.stringify(data) );
          
                if(Array.isArray(data)) {
                    for(var i in data) {
                        var sms = data[i];
                    }
                  }
                }, function(err){
                  updateStatus('error list sms: ' + err);
          });
   
})

.controller('myappNewCtrl', function($scope, $state,AuthService, p_const, ngFB, $cordovaAppAvailability, $ionicLoading, $ionicPopup, $timeout) {

$scope.appOptions= 
{
  appStoreUrl:'https://itunes.apple.com/us/app/app_name/idXXX',
  iosUrlScheme:'app_name://launchedfromthisappwiththeseoptions',
  androidAppID:'com.XXX.app_name',
  appName:'App Name'
}

  $scope.openMarket = function(src){
     // window.open = cordova.InAppBrowser.open(src, '_blank', 'location=yes');

      var appId = 'com.ionicframework.demoapp862762';
      var appLink = 'com.ionicframework.demoapp862762&hl=en';

      $cordovaAppAvailability.check('com.ionicframework.demoapp862762').then(function() 
      {
             console.log('App is available on your device...!');
      }, function () 
      {
              console.log('App is not available on your device, launching download page from AppStore...!!');

              cordova.plugins.market.open(appLink, 
              {
                  success: function() {
                  // Your stuff here
                  console.log('Installed app successfully...!');
              },
                error: function() 
                {
                  console.log('App Installtion was not successfull..!');
                }
              })     

            // not available
       });

      // cordova.plugins.market.open(appId, {
      //   success: function() {
      //     // Your stuff here
      //     console.log('Installed app successfully...!');
      //   },
      //     error: function() {
      //       console.log('App Installtion was not successfull..!');
      //     }
      // })     

  }
   
})


.controller('couponsCtrl', function($scope, $state,AuthService, p_const, ngFB, $cordovaAppAvailability, $http, $ionicSlideBoxDelegate, $ionicLoading, $ionicPopup, $timeout) 
{
        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

        console.log('Entered HotOffers Page controller..!');
        var apiKey='9deb-cbcf-917a-02bd'; 
        var format = "json"
        var couponStoreUrl='https://www.coupomated.com/apiv3/' + apiKey + '/getOnlyCoupons/' + format ;

        $http.get(couponStoreUrl)
             .success(function(data) {

                  $scope.couponData=data;

                  console.log('Coupon Data Recd ', $scope.couponData);
                  $ionicLoading.hide();

              })
              .error(function(data) {
                  console.log("ERROR: " + data);
                  $ionicLoading.hide();
              });


          $scope.getCouponsList = function(){

                $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
                });        

              var apiKey='9deb-cbcf-917a-02bd'; 
              var format = "json"
              var couponStoreUrl='https://www.coupomated.com/apiv3/' + apiKey + '/getOnlyCoupons/' + format ;

              $http.get(couponStoreUrl)
                   .success(function(data) {

                        $scope.couponData=data;
                        console.log('Coupon Data Recd ' + $scope.couponData[0].COUPON);
                        console.log('Coupon Data Recd XML' + data);
                        $ionicLoading.hide();
                    })
                    .error(function(data) {
                        console.log("ERROR: " + data);
                        $ionicLoading.hide();
                    });
          }

          $scope.getOfferCouponsList = function(){

                $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
                });        

              var apiKey='9deb-cbcf-917a-02bd'; 
              var format = "xml"
              // http://demo.coupomated.com/browse-coupons/0/discount/0
              var couponStoreUrl='https://www.coupomated.com/apiv3/' + apiKey + '/getdiscount/' + format ;

              console.log("Entered Hot Offers Coupons List 111 ..!" + couponStoreUrl);

              $http.get(couponStoreUrl)
                   .success(function(data) {

                        $scope.offers_data=data;
                        console.log('Coupon Data Recd ' + $scope.offers_data[0]);
                        $ionicLoading.hide();
                    })
                    .error(function(data) {
                        console.log("ERROR: " + data);
                        $ionicLoading.hide();
                    });
          }

          $scope.getMerchantsList = function()
          {

                $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
                });        

              var apiKey='9deb-cbcf-917a-02bd'; 
              var format = "json"
              // https://www.coupomated.com/apiv3/9deb-cbcf-917a-02bd/getStores/Y/json
              console.log("Entered Merchant List Generate..!" + couponStoreUrl);
              var couponStoreUrl='https://www.coupomated.com/apiv3/' + apiKey + '/getStores/Y/' + format ;

              $http.get(couponStoreUrl)
                   .success(function(data) 
                   {

                        $scope.merchant_list=data;
                        // console.log('Coupon Data Recd ' + $scope.couponData[0]);
                        console.log('Coupon Data Recd XML' + $scope.merchant_list[0].STORE_NAME);
                        $ionicLoading.hide();
                    })
                    .error(function(data) 
                    {
                        console.log("ERROR: " + data);
                        $ionicLoading.hide();
                    });
          }


          $scope.startApp = function() {
          $state.go('main');
        };

        //$scope.next = function() {
        //  $ionicSlideBoxDelegate.next();
        //};
        //$scope.previous = function() {
        //  $ionicSlideBoxDelegate.previous();
        //};

        // Called each time the slide changes
        //$scope.slideChanged = function(index) {
        //  $scope.slideIndex = index;
        //};

      var ipObj1 = {
            callback: function (val) {  //Mandatory
              console.log('Return value from the datepicker popup is : ' + val, new Date(val));
              $scope.merchant_list.mindate=$filter('date')(val,'yyyy-MM-dd');
            },
            to: new Date(2009, 12, 30), //Optional
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            closeOnSelect: false,       //Optional
            templateType: 'popup'       //Optional
          };

      var ipObj2 = {
            callback: function (val) {  //Mandatory
              console.log('Return value from the datepicker popup is : ' + val, new Date(val));
              $scope.merchant_list.maxdate=$filter('date')(val,'yyyy-MM-dd');
            },
            to: new Date(2009, 12, 30), //Optional
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            closeOnSelect: false,       //Optional
            templateType: 'popup'       //Optional
          };

          $scope.openDatePickerOne = function()
          {
            ionicDatePicker.openDatePicker(ipObj1);
          };

          $scope.openDatePickerTwo = function()
          {
            ionicDatePicker.openDatePicker(ipObj2);
          };


      var swiper = new Swiper('.swiper-container', {
              pagination: '.swiper-pagination',
              effect: 'coverflow',
              grabCursor: true,
              centeredSlides: true,
              slidesPerView: 'auto',
              coverflow: {
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows : true
              }
          });

   
})


.controller('socialLoginCtrl', function($scope, $state,AuthService, p_const, ngFB, $ionicLoading, $ionicPopup, $timeout) {

    $scope.fbregister_data = {
        user_name:'',
        user_email:'',
        user_mobile:'',
        user_pass:'',
        confirm_pass:'',
        refer_id:'',
        imei: window.localStorage.getItem('imeino'),
        user_image:''     
    }


      //Adding New code for Facebook Social Login

      $scope.fbsign_up = function(){


             console.log('Entered Facebook save page : ');
             console.log($scope.fbregister_data);
             AuthService.fbregisterApp($scope.fbregister_data).then(function(user_data1){
             console.log( 'user_data', user_data1);
             //console.log("Entered Facebook details signup page"+$scope.fbregister_data);
             if( user_data1.rescode != 100 )
               {             
                  $scope.msg=user_data1.message;
                  console.log('Fb Signup failed..!');
               } 
               else 
                  {             
                    $scope.msg=user_data1.message;
                    console.log('Fb Signup Pass..!');

                    utils.sendPushNote(localStorage.getItem('userid'), 'Facebook Login', 'Congrats, your Facebook Login was successfull...!');

                    //$state.go('login');
                  }
                 });
        }


      $scope.fbLoginNew = function () {

            ngFB.login({scope: 'email,publish_actions'}).then(
            function (response) {
              //console.login(ngFB); 
            if (response.status === 'connected') {

              ngFB.api({
                  path: '/me',
                  params: {fields: 'id,name,email,birthday, picture'}
              }).then(
                  function (user) {
                  $scope.user = user;
                  //console.log($scope.user);
                  //alert($scope.user.email + $scope.user.id + $scope.user.name);

                  $scope.fbregister_data.user_name = $scope.user.name;
                  $scope.fbregister_data.user_email=$scope.user.email;
                  $scope.fbregister_data.user_mobile='';
                  $scope.fbregister_data.user_pass='123456';
                  $scope.fbregister_data.confirm_pass='123456';
                  $scope.fbregister_data.refer_id='10039';
                  // $scope.fbregister_data.user_image=$scope.user.picture.type(large);
                  $scope.fbregister_data.imei=window.localStorage.getItem('imeino');

                  $scope.userImage = $scope.user.picture;
                  console.log('User Image :' + $scope.userImage);

                  console.log("Entered FB Signup save function..!");
                  console.log($scope.fbregister_data);

                  AuthService.fbregisterApp($scope.fbregister_data).then(function(user_data1){
                  console.log( 'user_data', user_data1);
                  if( user_data1.rescode == 100 )
                    {             
                        $scope.msg=user_data1.message;
                        console.log('Fb Signup failed..!');
                    } 
                else 
                    {             
                      $scope.msg=user_data1.message;
                      $scope.sendPushNote($scope.user.name, 'Facebook Login', 'Congrats, your Facebook Login was successfull...!');  

                      console.log('Fb Signup Pass..!');
                   
                      //$state.go('login');
                    }
                 });                  

                // $scope.fbsign_up();

                },
                  function (error) {
                  alert('Facebook error: ' + error.error_description);



                });

                $state.go("app.tab.home");

            } else {
                alert('Facebook login failed');
                console.log('Facebook login failed');
            }
        });
      }       
   
})


.controller('loginCtrl', function($scope, $state,AuthService, p_const, ngFB, $cordovaOauth, $ionicLoading,  $ionicHistory, $cordovaAppAvailability, $filter, $localStorage, $ionicPopup, $timeout) {

   //console.log("session IMEI No is : '",sessionStorage.getItem("imeino"))
   if (sessionStorage.getItem("imeino")==null)
   {
      sessionStorage.setItem('imeino',window.localStorage.getItem('imeino'));
   }
   //window.sessionStorage.getItem('imeino'));

   console.log('IMEI No recd in controller is 1: ', window.localStorage.getItem('imeino'));
   console.log('IMEI No recd in controller is 2: ', window.localStorage.getItem("userimeino"));
   console.log('IMEI No recd in controller is 3: ', window.sessionStorage.getItem('imeino'));

   //console.log('IMEI No recd in controller is 1: ', localStorage.getItem('imeino'));
   //console.log('IMEI No recd in controller is 2: ', localStorage.getItem("userimeino"));
   //console.log('IMEI No recd in controller is 3: ', sessionStorage.getItem('imeino'));

   $scope.DeviceDetails=window.cordova;
   //$scope.DeviceDetails=JSON.parse(JSON.stringify(window.cordova.plugins));
   console.log('IMEI No recd in controller is 5: ', window.cordova.plugins);
   console.log('IMEI No recd in controller is 6: ', $scope.DeviceDetails);
   console.log('IMEI No recd in controller is 7: ', $localStorage.message);


   $scope.login_data = {
      user_name:'',
      user_pass:'',
      imei: sessionStorage.getItem("imeino")
      //imei: '911502750187836'
    }

    $scope.fbregister_data = {
        user_name:'',
        user_email:'',
        user_mobile:'',
        user_pass:'',
        confirm_pass:'',
        refer_id:'',
        imei: ''     
    }

    console.log( 'user_data sending in controller for login : ', $scope.login_data);

    $scope.reset_form = function(){
         //this.loginform.reset();
         //document.getElementById("loginform").reset();
        $scope.login_data = {
            user_name:'',
            user_pass:'',
            imei: sessionStorage.getItem("imeino")
            //imei: window.localStorage.getItem('imeino')
        }         
    }

    $scope.sign_in = function(){
       AuthService.loginApp($scope.login_data).then(function(user_data){

              //$ionicLoading.show({
              //content: 'Loading',
              //animation: 'fade-in',
              //showBackdrop: true,
              //maxWidth: 200,
              //showDelay: 0
              //});
            
             console.log( 'user_data recd from API in controller : ', user_data.data );
             if(user_data.data != 0)
             {
              $scope.userid = user_data.data.UserId;
              console.log($scope.userid);
              $scope.usrDetails=user_data;  
              window.localStorage.setItem('userid',user_data.data.UserId);
              window.localStorage.setItem('idemail',$scope.EmailId);
              window.localStorage.setItem('idmobile',$scope.MobileNo);
              console.log("User Total Amount is : "+ $scope.usrDetails.data.TotalEarning);

              //$ionicLoading.hide();
              $state.go("otplogin");

              //$state.go("app.tab.home");
              //$ionicLoading.hide();

           }else
           {

            $scope.message="";
            $scope.message=user_data.message;

            $ionicPopup.alert({
                         title: 'Login',
                         template: $scope.message,
                     })                  
            //$ionicLoading.hide();

           }

        });
      }

      //Adding New code for Facebook Social Login

      $scope.fbsign_up = function(){
             console.log('Entered Facebook save page : ');
             console.log($scope.fbregister_data);
             AuthService.fbregisterApp($scope.fbregister_data).then(function(user_data1){
             console.log( 'user_data', user_data1);
             //console.log("Entered Facebook details signup page"+$scope.fbregister_data);
             if( user_data1.rescode == 100 )
               {             
                  $scope.msg=user_data1.message;
                  console.log('Fb Signup failed..!');
               } 
               else 
                  {             
                    $scope.msg=user_data1.message;
                    console.log('Fb Signup Pass..!');
                    //$state.go('login');
                  }
                 });
        }


      $scope.fbLogin = function () {

            ngFB.login({scope: 'email,publish_actions'}).then(
            function (response) {
              //console.login(ngFB); 
            if (response.status === 'connected') {

              ngFB.api({
                  path: '/me',
                  params: {fields: 'id,name,email,birthday, picture'}
              }).then(
                  function (user) {
                  $scope.user = user;
                  //console.log($scope.user);
                  //alert($scope.user.email + $scope.user.id + $scope.user.name);

                  $scope.fbregister_data.user_name = $scope.user.name;
                  $scope.fbregister_data.user_email=$scope.user.email;
                  $scope.fbregister_data.user_mobile='';
                  $scope.fbregister_data.user_pass='123456';
                  $scope.fbregister_data.confirm_pass='123456';
                  $scope.fbregister_data.refer_id='12345';
                  $scope.fbregister_data.imei=window.localStorage.getItem('imeino');

                  console.log("Entered FB Signup save function..!");
                  console.log($scope.fbregister_data);

                  AuthService.fbregisterApp($scope.fbregister_data).then(function(user_data1){
                  console.log( 'user_data', user_data1);
                  if( user_data1.rescode == 100 )
                    {             
                        $scope.msg=user_data1.message;
                        console.log('Fb Signup failed..!');
                    } 
                else 
                    {             
                      $scope.msg=user_data1.message;
                      console.log('Fb Signup Pass..!');
                      //$state.go('login');
                    }
                 });                  

                // $scope.fbsign_up();

                },
                  function (error) {
                  //alert('Facebook error: ' + error.error_description);

                  $ionicPopup.alert({
                         title: 'Facebook Login',
                         template: 'Facebook error: ' + error.error_description,
                     })                                    
                });

                $state.go("app.tab.home");

            } else {
                //alert('Facebook login failed');

                $ionicPopup.alert({
                         title: 'Facebook Login',
                         template: 'Facebook login failed',
                     })   

                console.log('Facebook login failed');
            }
        });
      }       

 })

.controller('registerCtrl', function($scope, $state,AuthService, p_const, $ionicLoading, $ionicPopup, $timeout) {

  $scope.register_data = {
      user_name:'',
      user_email:'',
      user_mobile:'',
      user_pass:'',
      confirm_pass:'',
      refer_id:'',
      imei: window.localStorage.getItem('imeino')
    }

    $scope.sign_up = function()
    {

        console.log('Data sending from Register Controller is : ',$scope.register_data); 

        if($scope.register_data.user_pass == $scope.register_data.confirm_pass)
        {
           $scope.errormsg="";

             AuthService.registerApp($scope.register_data).then(function(user_data)
             {
                console.log( 'User Data result..!', user_data );
                 //$scope.errormsg=user_data.message;

                if( user_data.rescode == 100 )
                  {
                     $scope.msg=user_data.message;
                      console.log( 'User Regd Unsuccessfull..!', $scope.msg );
                      //alert("User Regd Unsuccessfull..!");

                  $ionicPopup.alert({
                       title: 'Registration',
                       template: $scope.msg,
                   })  

                      // $ionicLoading.hide();
                  } else 
                       {
                          console.log( 'User Regd Successfull..!', user_data );
                          //alert("You have Registered on GetCash successfully...!");

                          $ionicPopup.alert({
                               title: 'Registration',
                               template: 'You have Registered with GetCash successfully...!',
                           })  

                          $state.go('login');
                          // $ionicLoading.hide();
                       }

              }, function(err)
                  {
                    // console.log(err);
                    $scope.message = err.message;
                    // $ionicLoading.hide();
                  });
        }
        else{
               $scope.errormsg="Confirm password field doesn't match the password";
               //$scope.errormsg=user_data.message;

                $ionicPopup.alert({
                       title: 'Registration',
                       template: $scope.errormsg,
                   })                 
               // $ionicLoading.hide();
            }
    }

        $scope.reset_form = function(){

          $scope.register_data = {
                user_name:'',
                user_email:'',
                user_mobile:'',
                user_pass:'',
                confirm_pass:'',
                refer_id:'',
                imei: window.localStorage.getItem('imeino')
              }            
        }       

   })

.controller('fpassCtrl', function($scope, $stateParams,  $http, p_const, $state, AuthService, $ionicLoading, $ionicPopup, $timeout) 
{

   console.log('IMEI No recd in controller is 1: ', window.localStorage.getItem('imeino'));
   console.log('IMEI No recd in controller is 2: ', localStorage.getItem("userimeino"));
   console.log('IMEI No recd in controller is 3: ', sessionStorage.getItem("imeino"));
   //console.log('My Name is : ', $localStorage.message);

   $scope.user_data = {
         user_email:'',
         imei: sessionStorage.getItem("imeino")         
    }

 $scope.fpass = function()
 {

        //$ionicLoading.show({
        //content: 'Loading',
        //animation: 'fade-in',
        //showBackdrop: true,
        //maxWidth: 200,
        //showDelay: 0
        //});        

      //Finding the Correct Email Id for this Device IMEI Number for the user.
   
      localStorage.setItem('email',$scope.user_data.user_email);
      AuthService.fpassApp($scope.user_data).then(function(user_data)
             {
                console.log( 'User Data result..!', user_data );
                if( user_data.rescode == 'Internal Server Error' )
                  {
                      $scope.message=x.message;
                      console.log( 'User Reset Password Unsuccessfull..!', $scope.message );
                      // $ionicLoading.hide();
                  } else 
                       {
                          console.log( 'User Reset Password Successfull..!', user_data );
                          $state.go('reset');
                          // $ionicLoading.hide();
                       }

              }, function(err)
                  {
                    console.log(err);
                    $scope.message = 'This email id is not registered with this Device IMEI number, please contact Administrator..!';
                    // $ionicLoading.hide();
                  });


   };
})


.controller('otploginCtrl', function($scope, $stateParams,  $http, p_const, $state, AuthService, $ionicLoading, $ionicPopup, $timeout) {

  $scope.reset_data = {
         user_id:'',
         activation_code:'',
         user_email:localStorage.getItem('email'),
         imei: sessionStorage.getItem("imeino")
    }
  
   $scope.otppass = function(){

        $scope.reset_data = {
         activation_code:$scope.reset_data.activation_code,
         user_pass:$scope.reset_data.activation_code,
         user_email:localStorage.getItem('email'),
         userid:localStorage.getItem('userid'),
         imei: sessionStorage.getItem("imeino")
        }           
 
      console.log( 'user_data in the Local User Storage is : ', localStorage.getItem('user_data'));
      console.log('Data Recd in $scope.reset_data  is : '+$scope.reset_data.activation_code);

      AuthService.otppassApp($scope.reset_data).then(function(otp_data)
      {
            console.log( 'otp_data', otp_data.data );

             if(otp_data.data != 0)
             {
                console.log('Success Data Recd Data in controller is : ',otp_data.data)
             }
             else
             {
                console.log('Failure Data Recd Data in controller is : ',otp_data.data)
             }

             
             if(otp_data.data != 0)
             {
              $scope.userid = otp_data.data.UserId;
              console.log($scope.userid);
              $scope.usrDetails=otp_data;  
              localStorage.setItem('userid',otp_data.data.UserId);
              localStorage.setItem('idemail',$scope.usrDetails.data.EmailId);
              localStorage.setItem('idmobile',$scope.usrDetails.data.MobileNo);
              console.log("User Total Amount is : "+ $scope.usrDetails.data.TotalEarning);

              //$ionicLoading.hide();
              //$state.go("otplogin");

              //$state.go("app.tab.home");
              $state.go("challenges");

              //$ionicLoading.hide();

           }else
           {

            
            $scope.message="";
            $scope.message=user_data.message;
            console.log($scope.message);

            $ionicPopup.alert({
                         title: 'Internet Connection',
                         template: 'Internet is Disconnected, please turn on the internet and then login again..!',
                     })      
            //alert("Wrong OTP Password...!");




            //$ionicLoading.hide();

           }

      });     

    };

    $scope.otppassresend = function(){

        $scope.reset_data = {
         activation_code:'',
         user_pass:'',
         user_email:localStorage.getItem('email'),
         userid:localStorage.getItem('userid'),
         imei: sessionStorage.getItem("imeino")
        }           
 
      console.log('Data Recd in $scope.reset_data  is : '+$scope.reset_data.activation_code);

      AuthService.otppassAppResend($scope.reset_data).then(function(otp_data){
            console.log( 'otp_data', otp_data.data );

             if(otp_data.data != 0)
             {
                console.log('Success Data Recd Data in controller is : ',otp_data.data)
                $scope.message = x.message;
             }
             else
             {
                console.log('Failure Data Recd Data in controller is : ',otp_data.data)
                $scope.message = x.message;
             }

        });     

    };


})

.controller('resetpassCtrl', function($scope, $stateParams,  $http, p_const, $state, AuthService, $ionicLoading, $ionicPopup, $timeout) {
    
    $scope.reset_data = {
         activation_code:'',
         user_pass:'',
         user_email:localStorage.getItem('email'),
         user_mobile:'',
         imei: sessionStorage.getItem("imeino")
    }

    $scope.resetpass = function()
    {

        //$ionicLoading.show({
        //content: 'Loading',
        //animation: 'fade-in',
        //showBackdrop: true,
        //maxWidth: 200,
        //showDelay: 0resetpassCtrl
        //});        
      //AuthService.loginApp($scope.login_data).then(function(user_data){

      AuthService.resetpassApp($scope.reset_data).then(function(x)
      {
        console.log( 'reset_data recd from API in controller : ', x);
        console.log('Message status is : ',x.status_code);
        console.log('Message is : ',x.message);

        if(x.rescode)
        {
           if (x.rescode==500)
           {
            console.log('Reset Data Recd X not exist : ',x);
            $scope.message = x.message;
           }
           else
              {
                console.log('Reset Data Recd X exist : ',x);
                $scope.message = x.message;
              }
        }    
        else
           {  
              console.log('User Mobile Number is : ',x.data);
              $state.go('login');
           }  

       //console.log('Reset Data Recd 1 : ',$scope.reset_data);
       //console.log('Reset Data Recd 2 : ',x.message);
       //$scope.message = x.message;
       //$state.go('login');
       
       //   //$state.go('reset');
          //$ionicLoading.hide();
          // localStorage.removeItem('email');
       })

       //, function(err){
       //    console.log('Entered reset pwd in controller failed...!',err);
       //    //console.log('Reset Pwd Error : ',err.message);
       //    //$state.go('reset');
       //    $scope.message = err;
       //    //$scope.message=user_data.message;
       //    //$ionicLoading.hide();
       //});
    };
})

.controller('DashCtrl', function($scope, $ionicPopup, $timeout) {})


.controller('changeDeviceCtrl', function($scope, $ionicPopup, $timeout) {

$scope.user_data = {
         user_email:localStorage.getItem('email'),
         user_mobile:'',
         imei_old:'',
         imei_new: sessionStorage.getItem("imeino")
    }
if (sessionStorage.getItem("imeino")==null)
   
   {
      sessionStorage.setItem('imeino',window.localStorage.getItem('imeino'));
   }

   console.log('IMEI No recd in controller is 1: ', window.localStorage.getItem('imeino'));
   console.log('IMEI No recd in controller is 2: ', window.localStorage.getItem("userimeino"));
   console.log('IMEI No recd in controller is 3: ', window.sessionStorage.getItem('imeino'));

   

})

.controller('ChatsCtrl', function($scope, Chats, $ionicPopup, $timeout) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $ionicPopup, $timeout) {
  $scope.chat = Chats.get($stateParams.chatId);
})


.controller('AccountCtrl', function($scope, $ionicPopup, $timeout) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('AppCtrl', function($scope, $state, AuthService, $ionicLoading, $ionicPopup, $timeout) {

 $scope.logout=function(){
       //delete localStorage.user_name;
       //localStorage.removeItem('userid');

                $ionicPopup.confirm({
                    content: '<center><img ng-src="img/logo.jpg" style="width:150px;height:125px;"></center>',
                    title: 'Do you want to Exit ?',
                    buttons: [
                    {
                        text: 'Cancel',
                        onTap: function(e) 
                        {
                                  
                        }
                    },
                       {
                          text: 'Exit',
                          onTap: function(e) 
                          {
                                  
                               //window.localStorage.removeItem('user_data');
                               //AuthService.logout();
                               //window.localStorage.clear();
                               //window.location.reload();
                               //$state.go($state.current, {}, {reload: true});
                               //$state.go('login');   


                               window.localStorage.removeItem('user_data');
                               AuthService.logout();
                               window.localStorage.clear();
                               window.location.reload();
                               $state.go($state.current, {}, {reload: true});
                               $state.go('login', {}, {reload: true});
                               window.location.reload();

                          }  

                        }                 
                     ]
                })

       //window.localStorage.removeItem('user_data');
       //AuthService.logout();
       //window.localStorage.clear();
       //window.location.reload();
       //$state.go($state.current, {}, {reload: true});
       //$state.go('login');

      }

  $scope.toggleGroup = function(value) {
    if ($scope.isGroupShown(value)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = 1;
    }
  };
  $scope.isGroupShown = function(value) {
    return $scope.shownGroup === value;
  };

})


.controller('EditProfileCtrl', function($scope, $state, ionicDatePicker,$filter, p_const, $http, AuthService,$ionicHistory, loader, $ionicPopup, $timeout) {

  console.log('Entered EditProfileCtrl');
  $scope.user_id = localStorage.getItem('userid');


  console.log('Profile Data of the User is : ',$scope.profile_data);

  $scope.uploadprofileimage = p_const.apiurl+'users/uploadprofileimage';
  $scope.profileimagepath = p_const.uploadPath+'profileimages/'+localStorage.getItem('userid')+'/';
  console.log(localStorage.getItem('userid'));
  console.log("User Image : " +$scope.profileimagepath)

  $scope.afterprofileuploadflowsuccess = function( message , file ){
    //console.log( file);
    // loader.show();
      var message = JSON.parse( message );
      console.log( message );
      $scope.profileimage = message.filename;

  }

  //function to edit the profile picture of a sp
  $scope.afteruploadcomplete = function(){
    console.log('111');
    var imagedata = {
      user_id : localStorage.getItem('userid'),
      profileimage : $scope.profileimage
    }
    
    $scope.profile_data.UPhoto_name = $scope.profileimage;
    console.log('imagedata', imagedata);
    //$state.go('edit_profile', {},{ reload : true });
    $http.post(p_const.apiurl+'users/updateprofileimage', imagedata ).success(function(res, req){
      console.log(res);
      loader.hide();
      if( res.error_code == 200 ){
        console.log( $scope.profileimage );
        
        $scope.message = ' Profile photo updated successfully';
        $scope.msgclass = 'text-success';
        
       // $scope.profileimagepath = p_const.uploadPath+'profileimages/'+localStorage.getItem('userid')+'/';
      } else if( res.error_code == 400 ){
        $scope.message = 'Oops! Something went wrong. Please try again';
        $scope.msgclass = 'text-danger';

      }
    });
    return true;
  }

var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.profile_data.DOB=$filter('date')(val,'yyyy-MM-dd');
      },
      // disabledDates: [            //Optional
      //   new Date(2016, 2, 16),
      //   new Date(2015, 3, 16),
      //   new Date(2015, 4, 16),
      //   new Date(2015, 5, 16),
      //   new Date('Wednesday, August 12, 2015'),
      //   new Date("08-16-2016"),
      //   new Date(1439676000000)
      // ],
     // from: new Date(1947, 1, 1), //Optional
      to: new Date(2009, 12, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      //disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function()
    {
      ionicDatePicker.openDatePicker(ipObj1);
    };

       AuthService.Citylist().then(function(city_data){
            console.log( 'city_data', city_data.data );
            $scope.city_data = city_data.data;

        });
       AuthService.Statelist().then(function(state_data){
            console.log( 'state_data', state_data.data );
            $scope.state_data = state_data.data;

        });
       AuthService.Countrylist().then(function(country_data){
            console.log( 'country_data', country_data.data );
            $scope.country_data = country_data.data;

        });

    $scope.user = {
      user_id:localStorage.getItem('userid')
    }
       AuthService.getuserApp($scope.user).then(function(user_data){
            console.log( 'user_data', user_data.data );
            $scope.profile_data = user_data.data;
            $scope.profile_data.StateId = parseInt($scope.profile_data.StateId);
            $scope.profile_data.CountryId = parseInt($scope.profile_data.CountryId);
            $scope.profile_data.DOB = $filter('date')($scope.profile_data.DOB,'yyyy-MM-dd');
            $ionicHistory.clearCache();
            //console.log($scope.userid);
           // $state.go("edit_profile");

        });



  $scope.edit_profile=function(){
    console.log($scope.profile_data);
    AuthService.profileupdateApp($scope.profile_data).then(function(x){
        console.log(x);
        $state.go("app.tab.profile");
          // localStorage.removeItem('email');
       }, function(err){
        // console.log(err);
          // $scope.message = err.message;
       });
    };


  $scope.profile=function(){
    $scope.uploadprofileimage = p_const.apiurl+'users/uploadprofileimage';
  $scope.profileimagepath = p_const.uploadPath+'profileimages/'+localStorage.getItem('userid')+'/';

  $scope.user = {
      user_id:localStorage.getItem('userid')
    }
     AuthService.getuserApp($scope.user).then(function(user_data){
          console.log( 'user_data', user_data.data );
          $scope.profile_data = user_data.data;
          $ionicHistory.clearCache();
          $state.go('app.tab.profile',{},{ reload : true });
      });
    
  };

})

.controller('ProfileCtrl', function($scope, $state, ionicDatePicker,$filter, p_const, AuthService,$ionicHistory, $ionicLoading, $ionicPopup, $timeout) {
  $scope.uploadprofileimage = p_const.apiurl+'users/uploadprofileimage';
  $scope.profileimagepath = p_const.uploadPath+'profileimages/'+localStorage.getItem('userid')+'/';

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

  $scope.user = {
      user_id:localStorage.getItem('userid')
    }
     AuthService.getuserApp($scope.user).then(function(user_data){
          console.log( 'user_data', user_data.data );
          $scope.profile_data = user_data.data;
          $ionicHistory.clearCache();
          $ionicLoading.hide();
      });

})


.controller('passbookCtrl', function($scope, $state, ionicDatePicker,$filter, p_const, AuthService,$ionicHistory, $ionicLoading, $ionicPopup, $timeout) {
  //$scope.uploadprofileimage = p_const.apiurl+'users/uploadprofileimage';
  //$scope.profileimagepath = p_const.uploadPath+'profileimages/'+localStorage.getItem('userid')+'/';

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

  $scope.user = {
      user_id:localStorage.getItem('userid')
    }
     AuthService.getuserApp($scope.user).then(function(user_data){
          console.log( 'user_data', user_data.data );
          $scope.profile_data = user_data.data;
          $ionicHistory.clearCache();
          $ionicLoading.hide();
      });

})

.controller('SearchOfferCtrl', function($scope, $state, ionicDatePicker,$filter, $ionicLoading, $ionicPopup, $timeout) {
var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.mindate = $filter('date')(val,'yyyy-MM-dd');
        $scope.MiniDate = $filter('date')(val,'yyyy, MM, dd').toString();

      },
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
     // disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePickerOne = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };

    var ipObj2 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.maxdate=$filter('date')(val,'yyyy-MM-dd');
        console.log($scope.MiniDate);
      },
      // disabledDates: [            //Optional
      //   new Date(2016, 2, 16),
      //   new Date(2015, 3, 16),
      //   new Date(2015, 4, 16),
      //   new Date(2015, 5, 16),
      //   new Date('Wednesday, August 12, 2015'),
      //   new Date("08-16-2016"),
      //   new Date(1439676000000)
      // ],
       from: new Date($scope.MiniDate), //Optional
      // to: new Date(2020, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
     // disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePickerTwo = function(){
      ionicDatePicker.openDatePicker(ipObj2);
    };
})

.controller('hot_offersCtrl', function($scope, $state,AuthService, p_const,$ionicSlideBoxDelegate, $ionicLoading, $ionicPopup, $timeout) {

    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
    });        

  //   $scope.startApp = function() {
  //   $state.go('main');
  // };

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

})


.controller('ctrlSecurity', function($scope, $state,AuthService, p_const,$ionicSlideBoxDelegate, $ionicLoading, $ionicPopup, $timeout) {

   $scope.showSettings = function(checkStatus){
        //console.log("Entered Toggle option function..!");
        if (checkStatus==true)
        {
           console.log("Checkbox checked is true..!");  
        }
        else
        {
          console.log("Checkbox checked is false..!");  
        }
        // console.log(checkStatus);
        // console.log(e.checked);
  }
})


.controller('membersTreeCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, $ionicLoading, $ionicPopup, $timeout) {

    
    $scope.user_members={}

    $scope.user = {
      user_id:localStorage.getItem('userid')
    }

          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });

       // $ionicLoading.show();

       $scope.uploadprofileimage = p_const.apiurl+'users/uploadprofileimage/';
       $scope.profileimagepath = p_const.uploadPath+'profileimages/';

       AuthService.UserMemberslist($scope.user).then(function(user_data){

            $scope.user_members= user_data.data;
            console.log( 'user_members_data', $scope.user_members);
            $ionicLoading.hide();

        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });

})


.controller('supportCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, $ionicLoading, $ionicPopup, $timeout) {

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

       AuthService.CompInformList().then(function(company_data){
            // console.log( 'company_data', company_data.data );
            $scope.company_data = company_data.data;
            console.log("Company Information : " + company_data.data);  
            $ionicLoading.hide();
        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });


})


.controller('helpCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, $ionicLoading, $ionicPopup, $timeout) {

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

       AuthService.HelpList().then(function(help_data){
            // console.log( 'company_data', company_data.data );
            $scope.help_data = help_data.data;
            console.log("Help Information : " + $scope.help_data);  
            $ionicLoading.hide();
        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });


})

.controller('termsCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, $ionicLoading, $ionicPopup, $timeout) {

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

       console.log('Entered Terms and Condtions controller');
       AuthService.TermsList().then(function(terms_data){
            // console.log( 'company_data', company_data.data );
            $scope.terms_data = terms_data.data;
            console.log("Terms and Conditions Information : " + $scope.terms_data);  
            $ionicLoading.hide();
        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });


})

.controller('toprankersCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, $ionicLoading, $ionicPopup, $timeout) {

       $scope.uploadprofileimage = p_const.apiurl+'users/uploadprofileimage/';
       $scope.profileimagepath = p_const.uploadPath+'profileimages/';

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

       AuthService.topRankersList().then(function(rankers_data){
            // console.log( 'company_data', company_data.data );
            $scope.rankers_data = rankers_data.data;
            console.log("Top Rankers Information : " + rankers_data.data);  
            $ionicLoading.hide();
        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });

})


.controller('earnPayCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, $ionicLoading, $ionicPopup, $timeout) {

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

       console.log('Entered earpay Controller..!'); 
       AuthService.earnPayList().then(function(earnpay_data){
            // console.log( 'company_data', company_data.data );
            $scope.earnpay_data = earnpay_data.data;
            console.log("Earn Pay Information : " + earnpay_data.data);  
            $ionicLoading.hide();
        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });

})


.controller('ratingsCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, $ionicLoading, $ionicPopup, $timeout) {

  //     $scope.ratingArr = [{
  //     value: 1,
  //     icon: 'ion-ios-star-outline',
  //     question: 1
  //     }, {
  //        value: 2,
  //        icon: 'ion-ios-star-outline',
  //        question: 2
  //     }, {
  //        value: 3,
  //        icon: 'ion-ios-star-outline',
  //        question: 3
  //     }, {
  //        value: 4,
  //        icon: 'ion-ios-star-outline',
  //        question: 1
  //     }, {
  //        value: 5,
  //        icon: 'ion-ios-star-outline',
  //        question: 'question 5'
  //     }];

  // $scope.setRating = function(question,val) {
  //   var rtgs = $scope.ratingArr;
  //   for (var i = 0; i < rtgs.length; i++) {
  //     if (i < val) {
  //       rtgs[i].icon = 'ion-ios-star';
  //     } else {
  //       rtgs[i].icon = 'ion-ios-star-outline';
  //     }
  //   };
  //   alert(question);
  // }

    $scope.showRatingScreen = function(AppDetails)
    {


      AppRate.preferences.useLanguage = 'en';
 
      // 2

      var appId = 'com.ionicframework.demoapp862762';
      var appUrl = 'https://play.google.com/store/ereview?docId=' + appId;
      var popupInfo = {};

      // popupInfo.title = "Rate YOUR APPTITLE";
      // popupInfo.message = "You like YOUR APPTITLE? We would be glad if you share your experience with others. Thanks for your support!";
      // popupInfo.cancelButtonLabel = "No, thanks";
      // popupInfo.laterButtonLabel = "Remind Me Later";
      // popupInfo.rateButtonLabel = "Rate Now";
      // AppRate.preferences.customLocale = popupInfo;
      // AppRate.preferences.openStoreInApp = true;
      // console.log(appUrl);
      // AppRate.preferences.storeAppURL.android = appUrl;
      // AppRate.promptForRating(true);  

      AppRate.preferences = 
      {
        displayAppName: 'GetCash App',
        usesUntilPrompt: 5,
        promptAgainForEachNewVersion: false,
        inAppReview: true,
        storeAppURL: 
        {
          android: appUrl
        },
        customLocale: 
        {
          title: "Would you mind rating %@?",
          message: "It won’t take more than a minute and helps to promote our app. Thanks for your support!",
          cancelButtonLabel: "No, Thanks",
          laterButtonLabel: "Remind Me Later",
          rateButtonLabel: "Rate It Now",
          yesButtonLabel: "Yes!",
          noButtonLabel: "Not really",
          appRatePromptTitle: 'Do you like using %@',
          feedbackPromptTitle: 'Mind giving us some feedback?',
        },
        callbacks: 
        {
          handleNegativeFeedback: function(){
          window.open('mailto:feedback@example.com','_system');
        },
          onRateDialogShow: function(callback)
          {
            callback(1) // cause immediate click on 'Rate Now' button
          },
          onButtonClicked: function(buttonIndex)
          {
            console.log("onButtonClicked -> " + buttonIndex);
          }
        }
        };

        AppRate.promptForRating();    

  }

})



.controller('challengesCtrl', function($scope, $state,AuthService, p_const, $ionicHistory, ngFB, $cordovaAppAvailability, $ionicLoading, $filter, $http, $base64, $ionicPopup, $timeout, Idle) {


        $scope.uploadprofileimage = p_const.apiurl+'users/uploadprofileimage/';
        $scope.profileimagepath = p_const.uploadPath+'/';                                      

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        


        $scope.arrayBufferToBase64 = function( buffer ) {
            console.log('Binary Data Before Conversion : ', buffer);        
            var binary = '';
            var bytes = new Uint8Array( buffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            console.log('Binary Data After Conversion : ', window.btoa( binary ));
            return window.btoa( binary );
        }        


       AuthService.challengesList().then(function(challenges_data){

            $ionicLoading.hide();

            $scope.challenges_data = challenges_data.data;
            //$scope.challenges_data = JSON.parse(challenges_data.data);
            console.log('All Challenges Recd in the Control are :',$scope.challenges_data);
            //console.log("1st Challenge Details : ",$scope.challenges_data.campaigns[0].payout); 

            var appInstalled = 0
            var appCode ='';
            var binaryCode=''

            if(Array.isArray($scope.challenges_data)) 
            {
               console.log("Recd Data is in array...!");
            }
            else
            {
               console.log("Recd Data is not a array...!");
            }             

            //for (var i = 0; i < $scope.challenges_data.length; i++) 
            //{
            //  binaryCode=$scope.challenges_data[i].AppLogo;
            //  console.log('Mod by 4 : ',binaryCode % 4);
            //  console.log('Data before conversion : ',binaryCode);
            //  $scope.challenges_data[i].AppLogo = $base64.decode(binaryCode);
            //  console.log('Data after conversion : ',binaryCode);
            //}


                console.log('Total Challenged Recd Before Checking Installed are : ',$scope.challenges_data);
                for (var i = 0; i < $scope.challenges_data.length; i++) 
                { 
                        //var base64String = "data:image/jpg;base64," + $scope.challenges_data[i].AppLogo; 
                        //$scope.challenges_data[i].AppCode = base64String;
                         //$scope.challenges_data[i].AppCode =  
                        //Finding the App is already installed on the Device  
                        console.log('Checking for the App Installed is  : ',$scope.challenges_data[i]);
                        //var xyz = findApp($scope.challenges_data[i]);
                        //console.log('Result for searching App :',xyz);
                        if(findApp($scope.challenges_data[i], i))
                        {
                            //$scope.challenges_data[i].Deleted = 1;
                            //$scope.challenges_data[i].Deleted = true;
                        }
                        else
                           {
                             console.log($scope.challenges_data[i].AppName + " is not Installed on the Device..!");
                           }
                }

            //for(var i in data) {
            //            var sms = data[i];
            //        }                             

            //****console.log("New Challenges List : ",$scope.challenges_data.data);  
            
        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });


        function findApp (src, srNo)
        {

                var fappCode = src.AppCode;
                var fappCost = src.AppCost;
                var fappTrnId = src.AppTrnId;
                var chkAppInstall=0;

                $cordovaAppAvailability.check(fappCode).then(function() 
                {
                    console.log('Disabling button for the App : ',fappCode);
                    chkAppInstall = 1;
                    //alert('chkAppInstall Value is : '+chkAppInstall);
                    $scope.challenges_data[srNo].Deleted = 1;
                    $scope.challenges_data[srNo].Deleted = true;

                    $scope.challenges_data[srNo].btnCaption1 = 'Viewed';
                    $scope.challenges_data[srNo].btnCaption2 = 'Installed';

                    return true;
                
                }, function () 
                {

                    //console.log(fappCode + ' is not installed on your device...!');
                    //return 0;
                    //chkAppInstall = 0;
                    return false;

                }); 

        }                 


       $scope.showAppDetails = function(AppDetails)
       {

        
        if (AppDetails)
          {

            localStorage.setItem('sappId', AppDetails.AppId)

            // $scope.appDetails = {
            //   appId: AppDetails.AppId
            // }

            // console.log('Search in Controller for App Id '+ $scope.appDetails.appId);         
            // AuthService.challengeDetails($scope.appDetails).then(function(app_data){
            // // console.log( 'company_data', company_data.data );

            // $scope.appData = app_data.data[0];
            // console.log("Got App details : " + $scope.appData);  
           // });

            $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
            });        

            $state.go('installapp');

            $ionicLoading.hide();

          }
       }


      $scope.openMarket = function(src)
      {

              //Generating a Random Number for SubID

             var rndNumb =  Math.floor(1000 + Math.random() * 999999);
              if (rndNumb.toString().length==4)
              {
                  rndNumb = rndNumb + "00";
              }

              if (rndNumb.toString().length==5)
              {
                  rndNumb = rndNumb + "0";
              }              

              var TransLnk='https://www.cuelinks.com/api/v2/transactions.json?start_date=2018-01-01T02:30:17+05:30&end_date=2018-12-31T02:30:17+05:30&sub_id=gcUserId&page=1&per_page=50';
              TransLnk = TransLnk.replace('gcUserId', rndNumb);
              var TransLink = TransLnk;

              var pos1 =  src.AppCode.indexOf("Dcom");
              var pos2 = src.AppCode.indexOf("%", pos1);

              var appId = src.AppCode;
              var appCode = src.AppCode;

              var appLink = src.AppLink;
              appLink = appLink.replace('gcUserId', rndNumb);
              console.log('App Installation Requestd URL is ',appLink);


              console.log("App Link is 1"+src.AppCode);

              $scope.app_data = {
              AppId:src.AppId,
              AppCode:src.AppCode,
              AppCost:src.AppCost,
              HoldPeriod:src.HoldPeriod,
              HoldType:src.HoldPeriod,
              AppLink:appLink,
              InstDate:$filter('date')(new Date(), 'yyyy/MM/dd hh:mm:ss'),
              CreatedDate:$filter('date')(new Date(), 'yyyy/MM/dd hh:mm:ss'),
              user_id:localStorage.getItem('userid'),
              TransLink: TransLink,
              rndNumber: rndNumb
              }

              console.log('App Details recd for Installation : ',src)

              $cordovaAppAvailability.check(appCode).then(function() 
              {
                  console.log('App is already installed on your device...!');
                  //alert('App is already installed on your device...!');

                  $ionicPopup.alert({
                       title: 'Challenges',
                       template: 'App is already installed on your device...!',
                   })  
                                   
                  return;
              }, function () 
              {
                  
                  var newImeiNo = window.cordova.plugins.uid.IMEI;
                  console.log('New Imei No :',newImeiNo);
                  //var appResult = cordova.plugins.market.open(appLink, 

                  var appResult = window.open(appLink, '_self');
                  if (appResult)
                  {
                      //success: function() 
                      //{
                      //  console.log('Installed app successfully...!');
                      //},
                      //error: function() 
                      //{
                      //console.log('App Installtion was not successfull..!');
                      //}
                      console.log("Result from App Installation is : ",appResult);
                  };              

                       //console.log('App Installtion details in Conrol 1 are : ',$scope.app_data);
                       //console.log('App Installtion details in Conrol 2 src are : ',src);
                       //Inserting Installation Request details of the App for the User
                       AuthService.saveReqAppDetails($scope.app_data).then(function(app_data)
                       {
                          console.log( 'Installation Requested App Details : ', app_data );
                          if( app_data.rescode == 100 )
                            {
                                $scope.msg=app_data.message;
                                console.log( 'User requested for App installation successfully..!', $scope.msg );
                            } else 
                                 {
                                    console.log('Installed app successfully...!');
                                    $state.go('challenges');
                                 }

                        }, function(err)
                            {
                              $scope.message = err.message;
                            });

                  console.log('App Result is : ', appResult);

              }) 

      }


      $scope.openMarketNew = function(src)
      {

              console.log("App Link is 1"+src.AppCode);

              $scope.app_data = {
              AppId:src.AppId,
              AppCode:src.AppCode,
              AppCost:src.AppCost,
              HoldPeriod:src.HoldPeriod,
              HoldType:src.HoldPeriod,
              AppLink: '',
              InstDate:$filter('date')(new Date(), 'yyyy/MM/dd hh:mm:ss'),
              CreatedDate:$filter('date')(new Date(), 'yyyy/MM/dd hh:mm:ss'),
              user_id:localStorage.getItem('userid')
              }

              var pos1 =  src.AppCode.indexOf("Dcom");
              var pos2 = src.AppCode.indexOf("%", pos1);

              var appId = src.AppCode;
              var appCode = src.AppCode;
              var appLink = src.AppLink;
              var userID = localStorage.getItem('userid');

              console.log('App Details recd for Installation : ',src)

                  var headers = new Headers();
                  headers.append("Access-Control-Allow-Origin","*,http://localhost:8100");
                  headers.append("Access-Control-Allow-Headers","X-Requested-With");
                  headers.append('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
                  var headOptions = ({headers: headers});
                  console.log('Headers : ',headOptions);

                  appLink=appLink.replace('gcUserId', userID);
                  console.log('Requesing User Id is : ', userID)
                  console.log('App Installtion Requestd URL is ',appLink);
                 

                  var appInstResult = AuthService.installAppDetails(appLink);
                  //AuthService.installAppDetails(appLink).success(function(data) 
                  if (appInstResult)
                  {

                            $scope.install_result=appInstResult;
                            console.log('App Installation Result Recd in Controller is  : ',$scope.install_result);

                             console.log('App Installtion details in Conrol 1 are : ',$scope.app_data);
                             console.log('App Installtion details in Conrol 2 src are : ',src);

                             $scope.app_data.AppLink=appLink.replace('gcUserId', localStorage.getItem('userid'));
                             
                             //Inserting Installation Request details of the App for the User
                             AuthService.saveReqAppDetails($scope.app_data).then(function(app_data)
                             {
                                console.log( 'Installation Requested App Details : ', app_data );
                                if( app_data.rescode == 100 )
                                  {
                                      $scope.msg=app_data.message;
                                      console.log( 'User requested for App installation successfully..!', $scope.msg );
                                  } else 
                                       {
                                          console.log('Installed app successfully...!');
                                          $state.go('challenges');
                                       }

                             }, function(err)
                                  {
                                    $scope.message = err.message;
                                  });

                  }   //).error(function(error) 
                  else
                        {
                            console.log("ERROR: " + error);
                            //$ionicLoading.hide();
                        };
                  

              //}) 

      }


      $scope.openMarketOld = function(src)
      {

              console.log("App Link is 1"+src.AppCode);

              $scope.app_data = {
              AppId:src.AppId,
              AppCode:src.AppCode,
              AppCost:src.AppCost,
              HoldPeriod:src.HoldPeriod,
              HoldType:src.HoldPeriod,
              InstDate:$filter('date')(new Date(), 'yyyy/MM/dd hh:mm:ss'),
              CreatedDate:$filter('date')(new Date(), 'yyyy/MM/dd hh:mm:ss'),
              user_id:localStorage.getItem('userid')
              }


              var pos1 =  src.AppCode.indexOf("Dcom");
              var pos2 = src.AppCode.indexOf("%", pos1);
              var appId = src.AppCode;
              var appCode = src.AppCode;
              var appLink = src.AppLink;

              $cordovaAppAvailability.check(appCode).then(function() 
              {
                  console.log('App is already installed on your device...!');

                  $ionicPopup.alert({
                       title: 'Challenges',
                       template: 'App is already installed on your device...!',
                   })  

                  //alert('App is already installed on your device...!');


                  return;
              }, function () 
              {
                  
                  var newImeiNo = window.cordova.plugins.uid.IMEI;
                  console.log('New Imei No :',newImeiNo);
                  var appResult = cordova.plugins.market.open(appLink, 
                  {
                      success: function() {

                      console.log('Installed app successfully...!');

                  },
                    error: function() 
                    {
                      console.log('App Installtion was not successfull..!');
                    }
                  });              

                       console.log('App Installtion details in Conrol 1 are : ',$scope.app_data);
                       console.log('App Installtion details in Conrol 2 src are : ',src);
                       AuthService.saveReqAppDetails($scope.app_data).then(function(app_data)
                       {
                          console.log( 'Installation Requested App Details : ', app_data );
                          if( app_data.rescode == 100 )
                            {
                                $scope.msg=app_data.message;
                                console.log( 'User requested for App installation successfully..!', $scope.msg );
                            } else 
                                 {
                                    console.log('Installed app successfully...!');
                                    $state.go('challenges');
                                 }

                        }, function(err)
                            {
                              $scope.message = err.message;
                            });

                  console.log('App Result is : ', appResult);

              }) 

      }


      $scope.events = [];
        $scope.idle = 60;
        $scope.timeout = 1000;
        $scope.$on('IdleStart', function() {
          addEvent({event: 'IdleStart', date: new Date()});
          if (!window.localStorage.getItem('startTime'))
          {
              window.localStorage.setItem('startTime',new Date());
          }
          else
          {

                               alert('Auto Session Ends...!');
                               window.localStorage.removeItem('user_data');
                               AuthService.logout();
                               window.localStorage.clear();
                               window.location.reload();
                               $state.go($state.current, {}, {reload: true});
                               $state.go('login', {}, {reload: true});
                               window.location.reload();

          }
        });
        $scope.$on('IdleEnd', function() {
          addEvent({event: 'IdleEnd', date: new Date()});
          //alert('Idle Ended after...!');
        });
        $scope.$on('IdleWarn', function(e, countdown) {
          addEvent({event: 'IdleWarn', date: new Date(), countdown: countdown});
        });
        $scope.$on('IdleTimeout', function() {
          addEvent({event: 'IdleTimeout', date: new Date()});

          //var diff = ((new Date() - new Date(window.localStorage.getItem('startTime')))  % 60);
          //alert ('Session Ended Minutes : ',diff);          
          //alert('Going to End the Session..!');

        });
        $scope.$on('Keepalive', function() {
          addEvent({event: 'Keepalive', date: new Date()});
        });
        function addEvent(evt) {
          $scope.$evalAsync(function() {
            $scope.events.push(evt);
          })
        }
        $scope.reset = function() {
          Idle.watch();
        }
        $scope.$watch('idle', function(value) {
          if (value !== null) Idle.setIdle(value);
        });
        $scope.$watch('timeout', function(value) {
          if (value !== null) Idle.setTimeout(value);
        });
      })
      .config(function(IdleProvider, KeepaliveProvider) {
        KeepaliveProvider.interval(10);
        IdleProvider.windowInterrupt('focus');
      })
      .run(function($rootScope, Idle, $log, Keepalive){
        Idle.watch();
        $log.debug('app started.');

})


.controller('searchChallenge', function($scope, $state, AuthService, p_const, $ionicHistory, $http, $ionicLoading, $ionicPopup, $timeout) {
       
       if (localStorage.getItem('sappId'))
       {

            console.log("Entered new SearchChallenge..: "+ localStorage.getItem('sappId'));
            $scope.appDetails = {
              appId: localStorage.getItem('sappId')
            }

            $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
            });        

            console.log('Search in Controller for App Id '+ $scope.appDetails.appId);         
            AuthService.challengeDetails($scope.appDetails).then(function(app_data){
            // console.log( 'company_data', company_data.data );

            $scope.appData = app_data.data[0];
            console.log("Got App details : " + $scope.appData);  
            // localStorage.removeItem('sappId');
            $ionicLoading.hide();

            $state.go('installapp');
           }, function(err){
        // console.log(err);
           $scope.message = err.message;
           $ionicLoading.hide();
       });

        }  

       // AuthService.challengeDetails(req.body.AppId).then(function(challenge_data){
       //      console.log( 'APP_data', challenge_data.data );
       //      $scope.challenges_data = challenge_data.data;
       //      console.log("APP Details : " + challenge_data.data);  
       //  });
       // var abcd =req.body.AppId;
       // console.log('Reqest body in Controller ' + abcd); 

       // console.log('Search in Controller for App Id '+ $scope.appDetails.appId);         
       // AuthService.challengeDetails($scope.appDetails).then(function(challenge_data){
       //      // console.log( 'company_data', company_data.data );
       //      $scope.challenge_data = challenge_data.data;
       //      console.log("Got App details : " + challenge_data.data);  
       //      $state.go('installapp');
       //  });

       // $scope.showAppDetails = function(AppDetails)
       // {

       //    $scope.appDetails = {
       //      appId:AppDetails.AppId
       //    }

       // console.log('Search in Controller for App Id '+ $scope.appDetails.appId);         
       // AuthService.challengeDetails($scope.appDetails).then(function(challenge_data){
       //      // console.log( 'company_data', company_data.data );
       //      $scope.challenge_data = challenge_data.data;
       //      console.log("Got App details : " + challenge_data.data);  
       //      $state.go('installapp');
       //  });

       // }


})


.controller('socialShareCtrl', function($scope, $state,AuthService, p_const, $cordovaSocialSharing, $cordovaBluetoothSerial, $ionicLoading, $cordovaAppAvailability, $ionicPopup, $timeout, $http) {

       //Checking all the Apps are installed on the User Machine..
       
       console.log( 'user_data in the Local User Storage is 1 : ', window.localStorage.getItem('user_data'));
       var usrData = JSON.parse(window.localStorage.getItem('user_data'));
       //alert('User Id Sending is : ',localStorage.getItem('userid'));
       console.log( 'user_data in the Local User Storage is 2 : ', usrData);
       console.log( 'user_data in the Local User Storage is 3 : ', usrData.data);
       
       $scope.user_dets = {
         user_id: usrData.UserId
       }
       $scope.appFind=0;
       $scope.appCounts=0;
       var apCnt = 0;
       $scope.TotAppsCount = 0;
       $scope.InstallAppsCount = 0;


       console.log( 'user_data in the Local User Storage is 4 : ', usrData.UserId);

        AuthService.canReferMembers($scope.user_dets).then(function(challenges_data)
        {

                var appCode='';
                var appsInstalled = 0;
                var appExist = 0;
                var MaxAppsCount = 0;

                
                //var appFind=0;


                

                //Selecting Challenges List from User Requested download for apps Start*****
                console.log('Challenges Data Recd : ',challenges_data);
                
                if (challenges_data!='Internal Server Error')
                {

                      MaxAppsCount = challenges_data.data.MinApps;
                      console.log('Total User Requested for Apps Download are : ',challenges_data);
                      console.log('Total User Requested for Apps Download count : ',challenges_data.data.length);

                      if (challenges_data.data[0].appcount<challenges_data.data[0].MinApps)
                        {
                           $scope.TotAppsCount = challenges_data.data[0].MinApps;
                           $scope.InstallAppsCount = (challenges_data.data[0].MinApps-challenges_data.data[0].appcount); 

                           console.log('Total Apps Count : ',  $scope.TotAppsCount);
                           console.log('Total Installed Count : ',  $scope.InstallAppsCount); 

                           $scope.message="YOU STILL NEED TO COMPLETE "+ $scope.InstallAppsCount +" CHALLENGES TO GET YOUR REFERENCE CODE..!"; 
                        }
                      else
                         {
                           $scope.TotAppsCount = challenges_data.data[0].MinApps;
                           $scope.InstallAppsCount = 0; 

                            console.log('Total Apps Count : ',  $scope.TotAppsCount);
                            console.log('Total Installed Count : ',  $scope.InstallAppsCount);  

                            $scope.message="CONGRATS - YOU HAVE COMPLETED THE ALL THE CHALLEGES REQUIRED..!";

                         }      


                      //$scope.appCounts=1;

                      for (var i = 0; i < challenges_data.data.length; i++) 
                      { 

                              
                              appCode = '';
                              appCode = challenges_data.data[i].AppCode;
                              console.log('For Loop Number : ',i, appCode);
                              console.log('App Code is : ', challenges_data.data[i]);
                              findApp(challenges_data.data[i]);

                      }

                      //Selecting Challenges List from User Requested download for apps End*******

                      console.log('Min Apps to be Installed : ',MaxAppsCount);
                      console.log('Total Apps Installed by the User are : ',appsInstalled);






                      

                }

                else
                {
                  $scope.appCounts=0;
                  //$scope.message="PLEASE COMPLETE ALL THE CHALLENGES TO GET YOUR REFERENCE CODE..!";
                }



        }, function(err)
                  {
                     // console.log(err);
                     $scope.message="PLEASE COMPLETE ALL THE CHALLENGES TO GET YOUR REFERENCE CODE..!";
                     //$ionicLoading.hide();
                  });




                $scope.profileimagepath = p_const.uploadPath+'profileimages/cash.png';

                $scope.whatsupShare = function()
                {

                  //var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ';
                  var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ' + ' Download Now: https://play.google.com/store/apps/details?id=com.ionicframework.getcash567648'; 

                  $cordovaSocialSharing
                  .shareViaWhatsApp((shareString), $scope.profileimagepath)
                  .then(function(result) {
                  // Success!
                  }, function(err) {
                  // An error occurred. Show a message to the user
                  });


                }

                $scope.facebookShare = function()
                {
                  
                  //var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ';
                  var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ' + ' Download Now: https://play.google.com/store/apps/details?id=com.ionicframework.getcash567648'; 
                  $cordovaSocialSharing
                  .shareViaFacebook((shareString), $scope.profileimagepath)
                  //.shareViaFacebook("Get Cash Reference Member No :" + localStorage.getItem('userid'), $scope.profileimagepath, "")
                  .then(function(result) {
                   // Success!
                  }, function(err) {
                    // An error occurred. Show a message to the user
                  });

                }

                $scope.smsShare = function()
                {
                  
                  //var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ';
                  var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ' + ' Download Now: https://play.google.com/store/apps/details?id=com.ionicframework.getcash567648'; 
                  $cordovaSocialSharing
                    //.shareViaSMS("Get Cash Reference Member No :" + localStorage.getItem('userid'), "9270126687")
                    .shareViaSMS((shareString), $scope.profileimagepath)
                    .then(function(result) {
                    // Success!
                    }, function(err) {
                    // An error occurred. Show a message to the user
                  });


                }

                $scope.tweetShare = function()
                {
                    
                    //var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ';    
                    var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ' + ' Download Now: https://play.google.com/store/apps/details?id=com.ionicframework.getcash567648'; 
                    $cordovaSocialSharing
                      //.shareViaTwitter("Get Cash Reference Member No :" + localStorage.getItem('userid'), $scope.profileimagepath, "")
                      .shareViaTwitter((shareString), $scope.profileimagepath)
                      .then(function(result) {
                      // Success!
                     }, function(err) {
                    // An error occurred. Show a message to the user
                    });

                }

                $scope.emailShare = function()
                {
                    
                    var shareString = 'Just invited you to Getcash and sent Rs.25. Join in 24 hours and get more up to Rs. 1 Lakh free in your Wallet. ' + ' Download Now: https://play.google.com/store/apps/details?id=com.ionicframework.getcash567648'; 
                    $cordovaSocialSharing
                      //.shareViaEmail("Get Cash Reference Member No :" + localStorage.getItem('userid'), "Get Cash Membership Reference ID", "", "", "", "")
                      .shareViaEmail((shareString), $scope.profileimagepath)
                      .then(function(result) {
                      // Success!
                      }, function(err) {
                      // An error occurred. Show a message to the user
                    });
                 } 


        //checkvalidemail : function( email ){
        //    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //    return re.test( email );
        //  }

      function findApp (src)
      {

              var fappCode = src.AppCode;
              var fappCost = src.AppCost;
              var fappTrnId = src.AppTrnId;
              
              $scope.user_details ={
                appId: src.AppCode,
                appCost: src.AppCost,
                appTrnId: src.AppTrnId, 
                user_id: localStorage.getItem('userid')
              }

              $cordovaAppAvailability.check(src.AppCode).then(function() 
              {
                  //console.log(fappCode + ' is already installed on your device...!');
                  //alert('App installed on your device is : '+$scope.user_details.appId);

                  $ionicPopup.alert({
                       title: 'Challenges',
                       template: 'App installed on your device is : '+$scope.user_details.appId,
                   })  

                  console.log('App Details recd for Installation in controller : ',$scope.user_details);

                  $scope.appCounts = $scope.appCounts + 1;
                  apCnt = (apCnt + 1);
                  console.log( 'App Installation count is : ',apCnt);


                  AuthService.updateAppCount(src).then(function(app_data)
                             {
                                console.log( 'App Installation count added to users a/c : ',app_data);
                                //if( app_data.rescode == 100 )
                                //  {
                                //      $scope.msg=app_data.message;
                                //      console.log( 'User requested for App installation successfully..!', $scope.msg );
                                //  } else 
                                //       {
                                 //         console.log('Installed app successfully...!');
                                //          $state.go('challenges');
                                //      }

                             }, function(err)
                                  {
                                    //$scope.message = err.message;
                                    console.log( 'App Installation count not added to users a/c : ',err);
                                  });
              }, function () 
              {

                  console.log(fappCode + ' is not installed on your device...!');

              }); 

      }   

      function gotoGooglePlay()
      {
        
        alert('Entered Invite Link ...!');
        var couponStoreUrl='https://play.google.com/store/apps/details?id=com.ionicframework.getcash567648';

        $cordovaAppAvailability.check(couponStoreUrl).then(function() 
              {
                     console.log('App is available on your device...!');
              }, function () 
              {
                      console.log('App is not available on your device, launching download page from AppStore...!!');

                      cordova.plugins.market.open(appLink, 
                      {
                          success: function() {
                          // Your stuff here
                          console.log('Installed app successfully...!');
                      },
                        error: function() 
                        {
                          console.log('App Installtion was not successfull..!');
                        }
                      })     

                    // not available
               });


      }              

    

})


.controller('change_passCtrl', function($scope, $state,AuthService, p_const, $ionicLoading, $ionicPopup, $timeout) {

   $scope.password_data = {
      old_pass:'',
      user_pass:'',
      confirm_pass:'',
      user_id:localStorage.getItem('userid')
    }
    $scope.change_password = function(){
      if($scope.password_data.user_pass == $scope.password_data.confirm_pass){
        $scope.errormsg='';

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });        

       AuthService.changePass($scope.password_data).then(function(message){

            console.log( 'message', message );

            if ($scope.msg = 'Please enter valid Old password')
            {
              $ionicLoading.hide();
              $ionicPopup.alert({
                         title: 'Change Password',
                         template: $scope.msg,
                     });
              return;
            }            
            $scope.msg=message.message;
            $state.go("app.tab.home");
            $ionicLoading.hide();
        }, function(err){
        // console.log(err);
           $scope.message = err.message;

            $ionicPopup.alert({
                         title: 'Change Password',
                         template: 'Please enter your correct old password...!',
                     });                    
           $ionicLoading.hide();
       });
       }else{
        $scope.errormsg="Confirm password field doesn't match the password";

        $ionicPopup.alert({
                         title: 'Change Password',
                         template: 'Confirm password field does not match the password..!',
                     });           
        $ionicLoading.hide();
       }
      }

 })

 .controller('hot_offersCtrl', function($scope, $state, AuthService, p_const,$ionicSlideBoxDelegate, $ionicPopup, $timeout) 
 {

    $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

//  var swiper = new Swiper('.swiper-container', {
//        pagination: '.swiper-pagination',
//        effect: 'coverflow',
//        grabCursor: true,
//        centeredSlides: true,
//        slidesPerView: 'auto',
//        coverflow: {
//            rotate: 50,
//            stretch: 0,
//            depth: 100,
//            modifier: 1,
//            slideShadows : true
//        }
//    });

})


.controller('mobileRechargeCtrl', function($scope, $http, AuthService, $ionicLoading, $state, $ionicPopup, $timeout) 
{

     console.log('Entered Mobile Recharge controller..!');

     $scope.user_id = localStorage.getItem('userid');


     $scope.mobsb_data = {
      rcprepaid:0,
      rcpostpaid:0,
      mobileno:'',
      operator_code:0,
      circle_code:0,
      amount:0,
      user_id:localStorage.getItem('userid')
    }     

     $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
     });

     AuthService.mbServiceProviderList().then(function(mbsp_data)
     {

             if (mbsp_data.toString().search("ErrorCode") === 0)
             {
                console.log("Errocode result recd in the Mobile Recharge controller..!");
             }

             console.log('mbsp_data' + mbsp_data);

             $scope.sproviders_list=mbsp_data;

             if(mbsp_data)
             {
                //console.log($scope.userid);

                // $state.go("mobile");
                $ionicLoading.hide();

             }
             else
             {
                //$scope.message=dcsp_data.message;
                console.log('No Data recd from Mobile Recharge API..!');
                $ionicLoading.hide();
             }

     });


     AuthService.mbServiceProviderCircleList().then(function(mbspc_data)
     {

             if (mbspc_data.toString().search("ErrorCode") === 0)
             {
                console.log("Errocode result recd in the Mobile Recharge cirlce controller..!");
             }

             console.log('mbspc_data' + mbspc_data);

             $scope.sprovidercircles_list=mbspc_data;

             if(mbspc_data)
             {

               $ionicLoading.hide();
               $state.go("mobile");

             }
             else
             {
                //$scope.message=dcsp_data.message;
                console.log('No Data recd from Mobile Recharge circle API..!');
                $ionicLoading.hide();
             }

    });


        //Function for Mobile Recharging

    // https://api.goprocessing.in/serviceTrans.go?goid=<GOID>&apikey=<API key>&rtype=json&custid=<Customer Id> 
    // &operator_code=<Operator Code>&amount=<Amount>&client_trans_id=<Your Transaction ID>&service_family=2 &apimode=live"; 

    $scope.getMobRechargeBookStatus = function() 
    {

          // console.log('Entered DTH Booking control page...1 :' + $scope.dth_book_data.operator_code);
          // console.log('Entered DTH Booking control page...2 :' + $scope.dth_book_data.user_mobileno);
          // console.log('Entered DTH Booking control page...3 :' + $scope.dth_book_data.user_amount);
          // console.log('Entered DTH Booking control page...4 :' + $scope.dth_book_data.client_transid);

          //dth_bookService

          //$scope.dth_book_data.operator_code=$scope.dth_book_data.operator_code;
          //$scope.dth_book_data.user_mobileno=$scope.dth_book_data.user_mobileno;
          //$scope.dth_book_data.user_mobileno=$scope.dth_book_data.user_amount;
          //$scope.dth_book_data.client_transid=1;
          //dth_bookService

           AuthService.mob_bookService($scope.mobsb_data).then(function(mobsb_data)
           {

                  // $ionicLoading.show({
                  // content: 'Loading',
                  // animation: 'fade-in',
                  // showBackdrop: true,
                  // maxWidth: 200,
                  // showDelay: 0
                  // });
           
                 if (mobsb_data.toString().search("ErrorCode") === 0)
                 {
                    console.log("Errocode result recd in the Mobile Recharge controller..!");
                 }

                 console.log('mobsb_data' + mobsb_data);

                 $scope.dthproviders_list=mobsb_data;

                 // console.log('First Service Provider Code:' + $scope.sproviders_list[0].operator_code);
                 // console.log('First Service Provider Name:' + $scope.sproviders_list[0].operator_name);

                 if(mobsb_data)
                 {
                    
                    //console.log($scope.userid);
                    console.log('Mobile Recharge successfull..!');
                    $state.go("app.tab.home");
                    //$state.go("home");
                    //$ionicLoading.hide();

                 }
                 else
                 {
                    //$scope.message=dcsp_data.message;
                    console.log('No Data recd from Mobile Recharge API..!');
                    //$ionicLoading.hide();
                 }

           });          


    }         

})


.controller('dthCtrl', function($scope, $http, AuthService, $ionicLoading, $state, $ionicPopup, $timeout) {

     console.log('Entered DTH Recharge controller..!');

     $scope.dth_book_data = {
      operator_code:'',
      user_mobileno:'',
      user_amount:'',
      client_transid:''
    }

    $scope.setmaxlen=0;

    $scope.showSelectValue = function(){

      console.log("Entered dropdown select func..." + $scope.dth_book_data.operator_code);

      if ($scope.dth_book_data.operator_code==5)
      {
          //console.log('Selected Operator Code is : ' + operatorCode);
          $scope.setmaxlen=10;
      }

      if ($scope.dth_book_data.operator_code==2)
      {
          //console.log('Selected Operator Code is : ' + operatorCode);
          $scope.setmaxlen=11;
      }

      if ($scope.dth_book_data.operator_code==3)
      {
          //console.log('Selected Operator Code is : ' + operatorCode);
          $scope.setmaxlen=12;
      }

      if ($scope.dth_book_data.operator_code==6)
      {
          //console.log('Selected Operator Code is : ' + operatorCode);
          $scope.setmaxlen=11;
      }

      if ($scope.dth_book_data.operator_code==1)
      {
          //console.log('Selected Operator Code is : ' + operatorCode);
          $scope.setmaxlen=10;
      }

      if ($scope.dth_book_data.operator_code==4)
      {
          //console.log('Selected Operator Code is : ' + operatorCode);
          $scope.setmaxlen=12;
      }

      console.log("Max Text Lenghth is " + $scope.setmaxlen);

    }


    $scope.chktxtLen= function() {

      //dth_book_data.user_mobileno
      //console.log('Entered Text Legth is :'+ $scope.dth_book_data.user_mobileno.toString().length);

      if ($scope.dth_book_data.user_mobileno.toString().length > $scope.setmaxlen)
      {
          //alert('Mobile Number length can be more than ' + $scope.setmaxlen);

                  $ionicPopup.alert({
                       title: 'Mobile Number',
                       template: 'Mobile Number length can be more than ' + $scope.setmaxlen,
                   })  

          //$scope.dth_book_data.user_mobileno=$scope.dth_book_data.user_mobileno.toString().substr(0, $scope.setmaxlen);
      }

    }

    $scope.dth_book_data.client_transid=1;

    // https://api.goprocessing.in/serviceTrans.go?goid=<GOID>&apikey=<API key>&rtype=json&custid=<Customer Id> 
    // &operator_code=<Operator Code>&amount=<Amount>&client_trans_id=<Your Transaction ID>&service_family=2 &apimode=live"; 

    $scope.getDataCardBookStatus = function() {

          console.log('Entered DTH Booking control page...1 :' + $scope.dth_book_data.operator_code);
          console.log('Entered DTH Booking control page...2 :' + $scope.dth_book_data.user_mobileno);
          console.log('Entered DTH Booking control page...3 :' + $scope.dth_book_data.user_amount);
          console.log('Entered DTH Booking control page...4 :' + $scope.dth_book_data.client_transid);

          //dth_bookService

          //$scope.dth_book_data.operator_code=$scope.dth_book_data.operator_code;
          //$scope.dth_book_data.user_mobileno=$scope.dth_book_data.user_mobileno;
          //$scope.dth_book_data.user_mobileno=$scope.dth_book_data.user_amount;
          //$scope.dth_book_data.client_transid=1;
          //dth_bookService

           AuthService.dth_bookService($scope.dth_book_data).then(function(dthsb_data){

              // $ionicLoading.show({
              // content: 'Loading',
              // animation: 'fade-in',
              // showBackdrop: true,
              // maxWidth: 200,
              // showDelay: 0
              // });
       
             if (dthsb_data.toString().search("ErrorCode") === 0)
             {
                console.log("Errocode result recd in the DTH Recharge controller..!");
             }

             console.log('dthsb_data' + dthsb_data);

             $scope.dthproviders_list=dthsb_data;

             // console.log('First Service Provider Code:' + $scope.sproviders_list[0].operator_code);
             // console.log('First Service Provider Name:' + $scope.sproviders_list[0].operator_name);

             if(dthsb_data)
             {
                
                //console.log($scope.userid);
                console.log('DTH booking Recharge API successfull..!');
                $state.go("app.tab.home");
                //$state.go("home");
                //$ionicLoading.hide();

             }
             else
             {
                //$scope.message=dcsp_data.message;
                console.log('No Data recd from DTH Recharge API..!');
                //$ionicLoading.hide();
             }

        }, function(err){
        // console.log(err);
           $scope.message = err.message;
           // $ionicLoading.hide();
       });          

    }


     $scope.user_id = localStorage.getItem('userid');

     AuthService.dthServiceProviderList().then(function(dthsp_data){

              $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
              });
       

             if (dthsp_data.toString().search("ErrorCode") === 0)
             {
                console.log("Errocode result recd in the DTH Recharge controller..!");
             }

             console.log('dthsp_data' + dthsp_data);

             $scope.dthproviders_list=dthsp_data;

             // console.log('First Service Provider Code:' + $scope.sproviders_list[0].operator_code);
             // console.log('First Service Provider Name:' + $scope.sproviders_list[0].operator_name);

             if(dthsp_data)
             {
                console.log($scope.userid);

               $state.go("dth");
                $ionicLoading.hide();

             }
             else
             {
                //$scope.message=dcsp_data.message;
                console.log('No Data recd from DTH Recharge API..!');
                $ionicLoading.hide();
             }

        });

})


.controller('datacardCtrl', function($scope, $http, AuthService, $ionicLoading, $state, $ionicPopup, $timeout) {


     console.log('Entered Data Card Recharge controller..!');

     $scope.user_id = localStorage.getItem('userid');

     $scope.dc_book_data = {
      operator_code:'',
      user_mobileno:'',
      user_amount:'',
      client_transid:'',
      user_id:0
    }


     AuthService.dcServiceProviderList().then(function(dcsp_data){

              $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
              });

             if (dcsp_data.toString().search("ErrorCode") === 0)
             {
                console.log("Errocode result recd in the Data Card controller..!");
             }

             console.log('dcsp_data' + dcsp_data);

             $scope.sproviders_list=dcsp_data;

             if(dcsp_data)
             {
              
                console.log($scope.userid);

                $state.go("datacard");
                $ionicLoading.hide();

             }
             else
             {
                //$scope.message=dcsp_data.message;
                console.log('No Data recd from dataCard API..!');
                $ionicLoading.hide();
             }

        });

        $scope.showDropdown = function(){
             console.log('Entered Autodropdown func..!');
             $scope.dropDown = true;
        };


        //Function for Mobile Recharging

        // https://api.goprocessing.in/serviceTrans.go?goid=<GOID>&apikey=<API key>&rtype=json&custid=<Customer Id> 
        // &operator_code=<Operator Code>&amount=<Amount>&client_trans_id=<Your Transaction ID>&service_family=2 &apimode=live"; 

        $scope.getDtCardRechargeBookStatus = function() {


           AuthService.dc_bookService($scope.dc_book_data).then(function(dcsb_data){

             if (dcsb_data.toString().search("ErrorCode") === 0)
             {
                console.log("Errocode result recd in the Mobile Recharge controller..!");
             }

             console.log('dcsb_data' + dcsb_data);

             $scope.dthproviders_list=dcsb_data;


             if(dcsb_data)
             {
                console.log('Datacard Recharge successfull..!');
                $state.go("app.tab.home");
             }
             else
             {
                console.log('No Data recd from Datacard Recharge API..!');
             }

        });          


        }                 

});
