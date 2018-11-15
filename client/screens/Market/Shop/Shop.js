Template.Shop.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
  });
  Session.set('marketPath', '/market/shop');
});

Template.Shop.helpers({
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

Template.Shop.events({
  'mouseenter .trigger-modal':function(event){
    Session.set('info-modal', event.target.id);
  },
  'mouseleave .trigger-modal':function(){
    Session.set('info-modal', '')
  },
  'click .close-action':function(){
    Session.set('marketPath', '/market');
  }
});
