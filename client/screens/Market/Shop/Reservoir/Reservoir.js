Template.Reservoir.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('timeLine');
  });
  Session.set('marketPath', '/market/shop/reservoir');
});

Template.Reservoir.helpers({
  storage: function(){
    var village = Villages.findOne({village: Number(Meteor.user().roles[1])});
    return village.storage;
  },
  money: function(){
    var village = Villages.findOne({village: Number(Meteor.user().roles[1])});
    return village.money;
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
});

Template.Reservoir.events({
  'click .close-action':function(){
    Session.set('marketPath', '/market');
  },
  'click .addCapacity': function(){
    var presentAction = TimeLine.findOne({});
    var gameId = Meteor.user().profile.game_id;
    var storageIncrement = 5;
    var price = 2000;
    var motive = 'reservoir';
    var village = Villages.findOne({village: Number(Meteor.user().roles[1])});
    var newMoney = village.money - price;
    var newStorageCapacity = village.storage.capacity + storageIncrement;
    //take out money from village
    Meteor.call('changeMoney', gameId, village.village, newMoney);
    //Insert a Transaction
    Meteor.call('reservoirTransaction', price, Number(Meteor.user().roles[1]), presentAction.season, presentAction.stage, gameId);
    //Change the storage capacity
    Meteor.call('changeStorageCapacity', gameId, Number(Meteor.user().roles[1]), newStorageCapacity)
  }
});
