Template.Repair.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('events');
  });
});

Template.Repair.helpers({
	btnInactive:function(){
	    var response = "";
	    var cardId = Session.get('event-opened-id');
	    var event = Events.findOne({_id: cardId});
	    var total = 0;
	    event.participation.forEach(function(villageParticipation){
	      total += Number(villageParticipation.value);
	    });
	    if( total < Number(event.priceReparation)){
	      response = "btn-inactive";
	    };
	    return response;
	},
	isEnough:function(){
	    var cardId = Session.get('event-opened-id');
	    var event = Events.findOne({_id: cardId});
	    var total = 0;
	    event.participation.forEach(function(villageParticipation){
	      total += Number(villageParticipation.value);
	    });
	    if( total >= Number(event.priceReparation)){
	      var response = true;
	    }else {
	      var response = false;
	    };
	    return response;
	  }
});

Template.Repair.events({
	'click .repair': function(event){
		var tm = setTimeout(function(){
			var idEvent = Session.get('event-opened-id');
			//find which game we're playing
			var gameId = Meteor.user().profile.game_id;
			// Create the transaction doc for each village for the financial records
			Meteor.call('insertTransactionsRepairEvent', gameId, idEvent);
			//method for collection "Events"
			Meteor.call('setActivityEvent', idEvent, false);

			Session.set('map-event-toggle.state','closed');
		}, 500);
     
  }
});