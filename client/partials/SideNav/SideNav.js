import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Template.SideNav.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('timeLine');
    self.subscribe('production');
    self.subscribe('events');
  });
});

Template.SideNav.helpers({
  village: () => {
    return Villages.findOne({village:Number(Meteor.user().roles[1])});
  },
  isNotSeasonZero: function(){
    var presentAction = TimeLine.findOne({});
    if (presentAction.season !== 0){
      return true;
    };
  },
  manageTime: function(){
    var presentAction = TimeLine.findOne({});
    if (presentAction.stage > 2){
      var manage = false;
    } else{
      manage = true;
    };
    return manage;
  },
  marketPath: function(){
    if(typeof Session.get('marketPath') === 'undefined'){
      return '/market';
    } else {
      return Session.get('marketPath');
    };
  },
  eventsMap: function(){
    var gameId = Meteor.user().profile.game_id;
    var eventsCanalActive = Events.find({game_id:gameId, active:true, timing:0, event:{$in:['changeMainCanal', 'changeSecondaryCanal']}}).fetch();
    return (eventsCanalActive.length);
  },
  thereIsARainEvent: function(){
    var gameId = Meteor.user().profile.game_id;
    var presentAction = TimeLine.findOne({});
    var village = Meteor.user().roles[1];
    var eventRain = Events.find({game_id:gameId, season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
    var thereIsARainEvent = false;
    eventRain.forEach(function(doc){
      if(String(doc.where).indexOf(String(village)) !== -1 ){
        thereIsARainEvent = true;
      };
    });
    return thereIsARainEvent;
  }
})

Template.SideNav.events({
  //event to turn off modal (see MaintenanceModal)
  'click': function(){
    Session.set('yieldGraph-toggle.state','closed');
    Session.set('map-event-toggle.state','closed');
  },
  'click .link-home.active': function(){
    Session.set('view', 'village');
  },
  'click .link-map.active': function(){
    Session.set('view', 'map');
  },
  'click .link-manage.active': function(){
    Session.set('view', 'map');
  },
  'click .link-water.active': function(){
    if(typeof Session.get('water-tab') !== 'undefined'){
      if(Session.get('water-tab') === 'irrigation'){
        Session.set('view', 'village');
      } else {
        Session.set('view', 'map');
      };
    } else {
      Session.set('view', 'village');
    };
  },
  'click .link-market.active': function(){
    Session.set('view', 'village');
    Session.set('marketPath', '/market');
  },
  'click .link-docs.active': function(){
    Session.set('view', 'map');
  },
})
