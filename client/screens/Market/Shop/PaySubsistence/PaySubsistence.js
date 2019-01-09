import { Meteor } from 'meteor/meteor';

Template.PaySubsistence.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('subsistences');
    self.subscribe('timeLine');
    self.subscribe('villages');
  });
  Session.set('marketPath', '/market/shop/food&housing');
});

Template.PaySubsistence.helpers({
  subsistence: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var subsistenceDoc = Subsistences.findOne({"season":season});
    return subsistenceDoc.value;
  },
  enoughToPay: function(){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var money = village.money;
    var presentAction = TimeLine.findOne({});
    var subsistenceDoc = Subsistences.findOne({"season":presentAction.season});
    var subsistenceCost = subsistenceDoc.value;
    if(money>=subsistenceCost){
      return true;
    };
  },
  stage0Time: function(){
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage === 0){
      return true;
    } else {
      Session.set('marketPath', '/market/shop');
      FlowRouter.go('market/shop');
      return false;
    };
  },
  subsistenceActive: function(){
    var presentAction = TimeLine.findOne({});
    return(presentAction.stage === 0 && presentAction.paidSubsistence[Number(Meteor.user().roles[1]) - 1].done === false);
  },
  cropsActive: function(){
    var presentAction = TimeLine.findOne({});
    return(presentAction.stage === 0 && presentAction.paidSubsistence[Number(Meteor.user().roles[1]) - 1].done === true);
  },
  maintenanceActive: function(){
    var presentAction = TimeLine.findOne({});
    return(presentAction.stage === 0 && presentAction.season >= 2 && presentAction.paidSubsistence[Number(Meteor.user().roles[1]) - 1].done === true);
  },
  reservoirActive: function(){
    var presentAction = TimeLine.findOne({});
    return(presentAction.season >= 2);
  },
})

Template.PaySubsistence.events({
  'click .pay-subsistence-button': function(){
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    //
    var presentAction = TimeLine.findOne({});
    var playerNumber = Meteor.user().roles[1];
    var subsistenceDoc = Subsistences.findOne({"season":presentAction.season});
    var subsistenceCost = subsistenceDoc.value;
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var money = village.money;
    if(money>=subsistenceCost){
      var newMoney = money - subsistenceCost;
      //Insert the money transfer into Transactions
      var toWhom = 'game';
      var quantity = Number(subsistenceCost);
      var who = 'village' + Meteor.user().roles[1];
      var season = presentAction.season;
      var stage = presentAction.stage;
      var game_id = gameId;
      Meteor.call('subsistenceTransaction', toWhom, quantity, who, season, stage, game_id);
      //Method for collection 'Villages'
      Meteor.call('changeMoney', gameId, playerNumber, newMoney);
      //Method for collection 'TimeLine'
      Meteor.call('subsistencePaid', gameId, presentAction.season, presentAction.stage, playerNumber);
      Session.set('marketPath', '/market');
      FlowRouter.go('market');
    };
  },
  'click .close-action':function(){
    Session.set('marketPath', '/market');
  }
})
