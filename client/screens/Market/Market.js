Template.Market.onCreated(function() {
  var self = this;
  self.autorun(function() {
  });
  Session.set('marketPath', '/market');
});

Template.Market.helpers({
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

Template.Market.events({
  'click .market-link-trade':function(){
    Session.set('newTransaction',false);
  }
});
