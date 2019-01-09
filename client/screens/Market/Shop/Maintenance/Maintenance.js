Template.Maintenance.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('fields');
    self.subscribe('timeLine');
  });
  Session.set('marketPath', '/market/shop/maintenance');
});

Template.Maintenance.helpers({
  fields: function(){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var villageNumber = village.village;
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    //console.log(village.crops);
    return Fields.find({village: Number(villageNumber),season:Number(season),stage:Number(stage)});
  },
  maintenanceActive: function(){
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage === 0 && presentAction.season >= 2 && presentAction.paidSubsistence[Number(Meteor.user().roles[1]) - 1].done === true){
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
});

Template.Maintenance.events({
  'click .close-action':function(){
    Session.set('marketPath', '/market');
  },
});
