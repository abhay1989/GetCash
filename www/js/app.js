// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ionic-datepicker','flow', 'ngOpenFB', 'ngCordova','ngCordovaOauth', 'ngStorage', 'ngIdle'])


.run(function($ionicPlatform, ngFB, $localStorage, $state, $ionicHistory, $ionicPopup, $cordovaAppAvailability, $ionicPopup, $timeout, $http, AuthService) {



  //, $cordovaSms, $rootScope, $timeout, $ionicHistory, $ionicPopup
  //$rootScope.$on('$StateChangeSuccess', function (event, toState, toParams, fromState, fromParams)
  //{
  //
  //    window.localStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
  //    window.localStorage.setItem('userimeino',window.cordova.plugins.uid.IMEI);
  //    window.sessionStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
  //
  //});
  
  ngFB.init({appId: '1391959974217960'});

  $ionicPlatform.ready(function($scope) {


  
                


               

        $ionicPlatform.on('pause', function(){
            //alert('App is Back on Top...!');

        })

        $ionicPlatform.on('resume', function(){
            //alert('App is Back on Top...!'); 
        })

        window.localStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
        window.localStorage.setItem('userimeino',window.cordova.plugins.uid.IMEI);
        window.sessionStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
        var lastTimeBackPress = 0;
        //911502750187836

        //cookieMaster.setCookieValue('http://<some host>:<some port>', '<cookie name>', '<cookie value>',
        //    function() {
        //        console.log('A cookie has been set');
        //    },
        //    function(error) {
        //        console.log('Error setting cookie: '+error);
        //    });        
        
        //window.localStorage.setItem('user_data'
        localStorage.setItem('imeino',cordova.plugins.uid.IMEI);
        localStorage.setItem('userimeino',cordova.plugins.uid.IMEI);
        sessionStorage.setItem('imeino',cordova.plugins.uid.IMEI);

        //window.localStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
        //window.localStorage.setItem('userimeino',window.cordova.plugins.uid.IMEI);
        //window.sessionStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
       
        //localStorage.setItem('imeino','911502750187836');
        //localStorage.setItem('userimeino','911502750187836');
        //sessionStorage.setItem('imeino','911502750187836');

        localStorage.setItem('myname','');
        $localStorage.message="Hello World";


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


          $ionicPlatform.registerBackButtonAction(function () 
          {
                //alert('Current Page is : '+$state.current.name);
                
                //if ($state.current.name == "signIn")
                //$scope.lastView = $ionicHistory.backView();
                //$ionicHistory.backView().stateName; 

                lastTimeBackPress = lastTimeBackPress + 1;
                //alert("Button Pressed No. of Times : "+ (new Date().getTime() - lastTimeBackPress));
                //alert($ionicHistory.backView().stateName + " : " + window.localStorage.getItem('userid'));

                

                 if (lastTimeBackPress>=2)
                 {
                    //alert('Back button tapped twice...!');

                    //alert("User id when Back key pressed is : "+window.localStorage.getItem('userid'));
                    console.log('User Data in App.JS is ',window.localStorage.getItem('userid'));
                    lastTimeBackPress = 0;  
                    //console.log('Press Back Last Page visited is :',$ionicHistory.backView().stateName);

                                  $ionicPopup.confirm({
                                      content: '<center><img ng-src="img/logo.jpg" style="width:150px;height:125px;"></center>',
                                      title: 'Do you want to Exit ?',
                                      buttons: [
                                      {
                                          text: 'Cancel',
                                          onTap: function(e) 
                                          {
                                              lastTimeBackPress = 0;  
                                          }
                                      },
                                         {
                                            text: 'Exit',
                                            onTap: function(e) 
                                            {
                                                    
                                                if(window.localStorage.getItem('userid'))
                                                {
                                                 
                                                  // $scope.login_data = {
                                                  //     user_name:'',
                                                  //     user_pass:'',
                                                  //     imei: sessionStorage.getItem("imeino"),
                                                  //     user_otp: ''
                                                  // }  

                                                   window.localStorage.removeItem('user_data');
                                                   window.localStorage.removeItem('userid');

                                                   AuthService.logout();
                                                   window.localStorage.clear();
                                                   $state.go($state.current, {}, {reload: true});
                                                   $state.go('login', {}, {reload: true});
                                                   window.location.reload();
                                                   //navigator.app.exitApp();
                                                   //console.log('User Data After Logout...!', window.localStorage.getItem('user_data'));
                                               }
                                               else
                                               {
                                                  navigator.app.exitApp();
                                               }


                                            }  

                                          }                 
                                       ]
                                  })                    
                 } 

                 else
                    {    
                        
                        // if(window.localStorage.getItem('userid'))
                        // {
                        //   console.log('User Data in App.JS is ',window.localStorage.getItem('userid'));
                        //   //console.log('Press Back Last Page visited is :',$ionicHistory.backView().stateName);

                        //   //lastTimeBackPress = 0;
                        //   var lastStateName = $ionicHistory.backView();
                        //   console.log('lastStateName name is ',lastStateName);

                        //   if(window.localStorage.getItem('userid')!=null) 
                        //   {

                        //        if (lastStateName!=null)
                        //        {
                                      
                        //               if ($ionicHistory.backView().stateName!='login' || $ionicHistory.backView().stateName!='app.tab.home' || $ionicHistory.backView().stateName!='challenges')
                        //               {
                        //                 navigator.app.backHistory();

                        //               }  
                        //               else
                        //               {
                        //                 //navigator.app.exitApp();
                        //               }

                        //        }
                        //   }
                        //   else
                        //   {
                        //     navigator.app.exitApp();
                        //   }
                          

                        // } else 
                        // {
                        //   navigator.app.exitApp();
                        // }

                    }

            }, 100);
          // console.log(' SMS status..' + SMS);
          // (SMS)

          //if(window.SMS) window.SMS.listSMS({},data=>
          //{
            
          //    setTimeout(()=>
          //    {

          //        console.log('Entered SMS reading function :' +data[0].body);
          //        this.smses=data;

          //        if(Array.isArray(data)) 
          //        {
          //           for(var i in data) 
          //           {
          //               var sms = data[i];
          //               console.log(data[i]);
          //           }
          //        }

          //    },error=>{
          //    console.log(error);
          //  });
          //});

           //if (SMS.listSMS(filter, function(data){
           //   
           //    // updateStatus('sms listed as json array');
           //    // updateData( JSON.stringify(data) );
           //     console.log('Entered SMS reading function..!' +data);
          
           //      if(Array.isArray(data)) {
           //          for(var i in data) {
           //              var sms = data[i];
           //              console.log(data[i]);
           //          }
           //        }
           //      }, function(err){
           //        console.log('Error reading device SMS');
           //        updateStatus('error list sms: ' + err);
           //}));

    //     $scope.sendSMS = function() {

    //       $cordovaSms
    //       .send('09270126687', 'This is some dummy text', options)
    //       .then(function() {
    //         alert('Success');
    //         // Success! SMS was sent
    //     }, function(error) {
    //       alert('Error');
    //       // An error occurred
    //     });
    // }            

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

   //Trying Pushnotification message

    // var push = new Ionic.Push({
    //     "debug": true
    //   });
 
    //   push.register(function(token) {
    //     alert('Device token:',token.token);
    //   });   

    // AppRate.promptForRating(true);
    
   //First Checking whether Internet is connected or not, if yes enter app or else display msg to connect to internet and exit
   console.log(window.Connection);
   if(window.Connection) 
     {

      if(navigator.connection.type == Connection.NONE) 
        {
           alert('Internet is Disconnected, please turn on the internet and then retry again..!');

                    $ionicPopup.alert({
                         title: 'Internet Connection',
                         template: 'Internet is Disconnected, please turn on the internet and then retry again..!',
                     })                    
           ionic.Platform.exitApp();

        }else
            {
               //alert('Internet is connected..!');
            }

     }
     else
        {
          //alert('Internet is Disconnected, please turn on the internet and then login again..!');

                    $ionicPopup.alert({
                         title: 'Internet Connection',
                         template: 'Internet is Disconnected, please turn on the internet and then login again..!',
                     })                              
          ionic.Platform.exitApp();
        }



    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {

        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

        //Finding the device IMEI Number.
        //window.localStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
        //window.localStorage.setItem('userimeino',window.cordova.plugins.uid.IMEI);
        //window.sessionStorage.setItem('imeino',window.cordova.plugins.uid.IMEI);
      
        console.log('Device IMEI No 11 : '+ window.localStorage.getItem('imeino'));
        console.log('Device IMEI No 12 : '+ window.sessionStorage.getItem('imeino'));
        console.log("New Storage Message : ", $localStorage.message);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive('convertToNumber', function() {
  console.log('Entered convertToNumber function..!');
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        console.log('Number 1:' + val);
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        console.log('Number 2:' + val);
        return '' + val;
      });
    }
  };
})


.factory('loader', function( $ionicLoading ) {
  return {
    show: function() {
      $ionicLoading.show({
        template:'<ion-spinner icon="android"></ion-spinner>'

      })
    },
    hide: function() {
      $ionicLoading.hide();
    }
  }
})

.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      // from: new Date(2012, 8, 1),
      // to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })



.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider , $httpProvider) 
{
  $ionicConfigProvider.tabs.position('bottom'); // other values: top
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    cache : false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'

  })
  // // setup an abstract state for the tabs directive

.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.tab', {
    url: '/tab',
    views: {
      'menuContent': {
        templateUrl: 'templates/tabs.html'
      }
    }
  })

  // Each tab has its own nav history stack:


  .state('app.tab.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('app.tab.recharge', {
      url: '/recharge',
      views: {
        'recharge': {
          templateUrl: 'templates/recharge.html',
          controller: ''
        }
      }
    })
    // .state('app.app.tab.chat-detail', {
    //   url: '/chats/:chatId',
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatDetailCtrl'
    //     }
    //   }
    // })


  .state('app.tab.invite', {
    url: '/invite',
    views: {
      'invite': {
        templateUrl: 'templates/invite.html',
        controller: 'socialShareCtrl'
      }
    }
  })
  // .state('app.tab.redeem', {
  //   url: '/redeem',
  //   views: {
  //     'redeem': {
  //       templateUrl: 'templates/redeem.html',
  //       controller: ''
  //     }
  //   }
  // })
  .state('app.tab.offer', {
    url: '/offer',
    views: {
      'offers': {
        templateUrl: 'templates/offer.html',
        controller: ''
      }
    }
  })
  .state('app.tab.passbook', {
    url: '/passbook',
    views: {
      'passbook': {
        templateUrl: 'templates/passbook.html',
        controller: 'passbookCtrl'
      }
    }
  })

  .state('app.tab.profile', {
    url: '/profile',
    cache : false,
    views: {
      'profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })


  .state('statement', {
    url: '/statement',
        templateUrl: 'templates/statement.html',
        controller: ''
  })

  .state('sendmoney', {
    url: '/sendmoney',
        templateUrl: 'templates/sendmoney.html',
        controller: ''
  })


  .state('register', {
    url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
    })

  .state('contactus', {
    url: '/contactus',
        templateUrl: 'templates/contactus.html',
        controller: 'contactUsCtrl'
    })


  .state('forgot', {
    url: '/forgot',
    templateUrl: 'templates/forgot.html',
    controller: 'fpassCtrl'

  })

  .state('otplogin', {
    url: '/otplogin',
    templateUrl: 'templates/optlogin.html',
    controller: 'otploginCtrl'

  })

  .state('change_device', {
    url: '/change_device',
    templateUrl: 'templates/change_device.html',
    controller: 'changeDeviceCtrl'

  })
  .state('reset', {
    url: '/reset',
        templateUrl: 'templates/reset.html',
        controller: 'resetpassCtrl'
  })
  .state('refer', {
    url: '/refer',
        templateUrl: 'templates/refer.html',
        controller: 'resetpassCtrl'
  })

  .state('installapp', {
    url: '/installapp',

    params: {
      Id: null,
    },
    cache: false, 

        templateUrl: 'templates/installapp.html',
        // controller: 'myappNewCtrl'
         controller: 'EventsCtrl'
        // controller: 'searchChallenge'
  })


   .state('challenges', {
    url: '/challenges',
    templateUrl: 'templates/challenges.html',
    controller: 'challengesCtrl'
        // controller: 'myappCtrl'
        // controller: 'myappNewCtrl'

  })

  .state('app.recharge', {
    url: '/recharge',
    views: {
      'menuContent': {
        templateUrl: 'templates/recharge.html'
      }
    }
  })

  .state('search_offers', {
    url: '/search_offers',

        templateUrl: 'templates/search_offers.html',
        controller: 'couponsCtrl'

  })

   .state('rateus', {
    url: '/rateus',
        templateUrl: 'templates/rateus.html',
        controller: 'rateusCtrl'

  })


    .state('terms', {
      url: '/terms',
          templateUrl: 'templates/terms.html',
          controller: 'termsCtrl'
    })

    .state('terms1', {
      url: '/terms1',
          templateUrl: 'templates/terms1.html',
          controller: 'termsCtrl'
    })


  .state('mobile', {
    url: '/mobile',
        templateUrl: 'templates/mobile.html',
        controller: 'mobileRechargeCtrl'
  })
 
  .state('dth', {
    url: '/dth',
        templateUrl: 'templates/dth.html',
        controller: 'dthCtrl'
  })

  .state('datacard', {
    url: '/datacard',
        templateUrl: 'templates/datacard.html',
        controller: 'datacardCtrl'
  })

.state('earn_payout', {
    url: '/earn_payout',
        templateUrl: 'templates/earn_payout.html',
        controller: 'earnPayCtrl'

  })


  .state('edit_profile', {
    url: '/edit_profile',
    cache : false,
        templateUrl: 'templates/edit_profile.html',
        controller: 'EditProfileCtrl'
  })

  .state('user_setting', {
    url: '/user_setting',
        templateUrl: 'templates/user_setting.html',
        controller: ''
  })
  .state('security_settings', {
    url: '/security_settings',
        templateUrl: 'templates/security_settings.html',
        controller: 'ctrlSecurity'
  })

  .state('change_pass', {
    url: '/change_pass',
        templateUrl: 'templates/change_pass.html',
        controller: 'change_passCtrl'
  })

  .state('gas', {
    url: '/gas',
        templateUrl: 'templates/gas.html',
        controller: ''
  })

  .state('insurance', {
    url: '/insurance',
        templateUrl: 'templates/insurance.html',
        controller: ''
  })

  .state('notification', {
    url: '/notification',
    templateUrl: 'templates/notification.html'

  })

  .state('hot_offers', {
    url: '/hot_offers',
    templateUrl: 'templates/hot_offers.html',
    //controller: 'hot_offersCtrl'
    controller: 'couponsCtrl'

  })

  .state('top_ranker', {
    url: '/top_ranker',
    templateUrl: 'templates/top_ranker.html',
    controller: 'toprankersCtrl'
  })

  .state('support', {
    url: '/support',
    templateUrl: 'templates/support.html',
    controller: 'supportCtrl'
  })

  .state('help', {
    url: '/help',
    templateUrl: 'templates/help.html',
    controller: 'helpCtrl'
  })

  .state('member_tree', {
    url: '/member_tree',
    templateUrl: 'templates/member_tree.html',
    controller: 'membersTreeCtrl'

  })

  .state('electricity', {
    url: '/electricity',
        templateUrl: 'templates/electricity.html',
        controller: ''
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/tab/home');
  if (window.localStorage.getItem('userid'))
  {
    $urlRouterProvider.otherwise('/app/tab/home');
  }
  else
  {
    $urlRouterProvider.otherwise('login');
  }
  
  $httpProvider.interceptors.push('validatesession');
})

.factory('validatesession', function( $injector ) {
    

    var validatesession = {
        request: function(config) {
          if (config.url.substr(config.url.length - 5) == '.html') {
             //console.log(config.url);
          } else if (window.localStorage.getItem('user_data') ) {
            var userdata = JSON.parse(JSON.stringify(window.localStorage.getItem('user_data')));
            config.headers.authorization = userdata.UserId;
          }
          return config;
        },
        responseError : function(response) {
            if( response.status == 401 ){
              $state = $injector.get('$state');
              //$state.go($state.current, {}, {reload: true});
              $state.go('login')

            } else  {
              return response;
            }
        }
    };
    return validatesession;
});
