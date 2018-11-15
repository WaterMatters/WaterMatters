if(Meteor.isClient){
  Accounts.onLogin(function() {
    //console.log('login');
        if ( Roles.userIsInRole( Meteor.userId(), 'village' ) ){
          Session.set('view','village');
          FlowRouter.go('village-home');
        } else if(Roles.userIsInRole( Meteor.userId(), 'controller' )){
          Session.set('view','map');
          FlowRouter.go('map');
        } else {
          Session.set('view','map');
          FlowRouter.go('map');
        };
  });
};

FlowRouter.triggers.enter([function(context, redirect){
    if(!Meteor.userId()){
      FlowRouter.go('home');
    };
}]);

FlowRouter.route('/',{
  name: 'home',
  action (){
    if(Meteor.userId()) {
        if ( Roles.userIsInRole( Meteor.userId(), 'village' ) ){
          FlowRouter.go('village-home');
        } else if(Roles.userIsInRole( Meteor.userId(), 'controller' )){
          FlowRouter.go('map');
        } else {
          FlowRouter.go('map');
        };
    };
    BlazeLayout.render('HomeLayout');
  }
});

FlowRouter.route('/village-home', {
  name: 'village-home',
  action() {
    BlazeLayout.render('MainLayout', {screen:'Scenery'}); // landscape if not harvest time
  }
});

FlowRouter.route('/map', {
  name: 'map',
  action() {
    BlazeLayout.render('MainLayout', {screen:'Map'});
  }
});

FlowRouter.route('/water',{
  name: 'water',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Water'});
  }
});

FlowRouter.route('/market',{
  name: 'market',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Market'});
  }
});

FlowRouter.route('/market/trade',{
  name: 'market/trade',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Trade'});
  }
});
/*
FlowRouter.route('/market/shop',{
  name: 'market/shop',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Shop'});
  }
});
*/
FlowRouter.route('/market/shop/maintenance',{
  name: 'market/shop/maintenance',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Maintenance'});
  }
});

FlowRouter.route('/market/shop/reservoir',{
  name: 'market/shop/reservoir',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Reservoir'});
  }
});

FlowRouter.route('/market/shop/crops',{
  name: 'market/shop/crops',
  action (){
    BlazeLayout.render('MainLayout',{screen:'ChooseCrops'});
  }
});

FlowRouter.route('/market/shop/food&housing',{
  name: 'market/shop/food&housing',
  action (){
    BlazeLayout.render('MainLayout',{screen:'PaySubsistence'});
  }
});

FlowRouter.route('/documents',{
  name: 'documents',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Documents'});
  }
});


FlowRouter.route('/control',{
  name: 'control',
  action (){
    BlazeLayout.render('MainLayout',{screen:'Control'});
  }
});
