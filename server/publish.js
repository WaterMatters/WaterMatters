import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import '../imports/api/messages.js';
import { Messages } from '../imports/api/messages.js';

import '../imports/api/channels.js';
import { Channels } from '../imports/api/channels.js';

import '../imports/api/notifications.js';
import { Notifications } from '../imports/api/notifications.js';

import '../imports/api/timer.js';
import { Timer } from '../imports/api/timer.js';

Messages.allow({
  insert:function(userId, doc){
    console.log("userId : " + userId + "\n doc : " + doc);
    return true;    
  }
});

Channels.allow({
  insert:function(userId, doc){
    return true;    
  }
});

Notifications.allow({
  insert:function(userId, doc){
    return true;    
  },
  update:function(userId, doc) {
    return true;
  }
});

Timer.allow({
  insert:function(userId, doc){
    return true;    
  },
  update:function(userId, doc) {
    return true;
  },
  remove:function(userId, doc) {
    return true;
  }
});

Meteor.publish("messages", function() {
    return Messages.find({});
});

Meteor.publish("channels", function() {
    return Channels.find({});
});

Meteor.publish("notifications", function() {
    return Notifications.find({});
});

Meteor.publish("timer", function() {
    return Timer.find({});
});

Meteor.publish('userStatus', function() {
  return Meteor.users.find({"status.online": true});
});

Meteor.publish('games', function(){
  if(Meteor.userId()){
    if(Roles.userIsInRole( this.userId, 'controller')){
      return Games.find({});
    };
  };
});

Meteor.publish('crops', function(){
  if(Meteor.userId()){
    return Crops.find({});
  };
});

Meteor.publish('weatherCards', function(){
  if(Meteor.userId()){
    if(Roles.userIsInRole( this.userId, 'controller')){
      var gameId = Meteor.user().profile.game_id;
      return WeatherCards.find({game_id:gameId},{sort:{season:1}});
    };
  };
});

Meteor.publish('villages', function(){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Villages.find({game_id:gameId});
  };
});

Meteor.publish('transparency', function(){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Transparency.find({game_id:gameId});
  };
});

Meteor.publish('villageSpecified', function(villageString){
  if(Meteor.userId()){
    var villageNumber = Number(villageString[villageString.length - 1]);
    var gameId = Meteor.user().profile.game_id;
    return Villages.find({game_id:gameId, village:villageNumber});
  };
});

Meteor.publish('timeLine', function(){ //publish timeLine of a specific game
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return TimeLine.find({game_id:gameId, over:false},{limit:1});
  };
});

Meteor.publish('fields', function(){ // deliver only the field documents of the village
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    if (Meteor.user().roles[0] === 'village'){
        return Fields.find({game_id:gameId, village:Number(Meteor.user().roles[1])});
    }
    else{
        return Fields.find({game_id:gameId});
    };
  };
});

Meteor.publish('landholdingFields', function(villageString, seasonNumber){
  if(Meteor.userId()){
    var villageNumber = Number(villageString[villageString.length - 1]);
    var gameId = Meteor.user().profile.game_id;
    return Fields.find({game_id:gameId, village:villageNumber, season:seasonNumber});
  };
});

Meteor.publish('water', function(){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Water.find({game_id:gameId});
  };
});

Meteor.publish('docAllocation', function(seasonNumber){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Transactions.find({game_id:gameId, season:seasonNumber},{sort:{stage:1}});
  };
});

Meteor.publish('events', function(){
  if(Meteor.userId()){
      if (Meteor.user().roles[0] === 'village'){
        var gameId = Meteor.user().profile.game_id;
        return Events.find({game_id:gameId, active:true},{sort:{stage:1}});
      } else {
        return Events.find({},{sort:{stage:1}});
      };
  };
});

// To be able to find events that don't have a gameId yet!!! (See formEvent .js)
Meteor.publish('eventsControl', function(){
  if(Meteor.userId()){
      return Events.find({},{sort:{stage:1}});
  };
});


Meteor.publish('transactions', function(){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Transactions.find({game_id:gameId});
  };
});


Meteor.publish('financialRecord', function(playerName, seasonNumber){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Transactions.find({game_id:gameId, season:seasonNumber, $or : [ { who : playerName }, { toWhom : playerName } ]});
  };
});

Meteor.publish('subsistences', function(){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Subsistences.find({game_id:gameId});
  };
});

Meteor.publish('production', function(){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Production.find({game_id:gameId});
  };
});

Meteor.publish('productionSeason', function(seasonNumber){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return Production.find({game_id:gameId, season:seasonNumber});
  };
});

Meteor.publish('waterManager', function(){
  if(Meteor.userId()){
    var gameId = Meteor.user().profile.game_id;
    return WaterManager.find({game_id:gameId},{sort:{season:1}});
  };
});
