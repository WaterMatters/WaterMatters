Template.Cloud.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('water');
    self.subscribe('timeline');
    self.subscribe('events');
    self.subscribe('villages');
    self.subscribe('fields');
  });
});

Template.Cloud.helpers({
	rainInfos : function() {
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    return waterDoc;
	},
	isRaining : function() {
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    if(waterDoc.rain > 0)
	    	return true;

	    return false;
	},
	rainParticipant : function()
	{
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    var villages = [];
	    if(waterDoc == undefined) {
	    	return;
	    }
	    waterDoc.request.forEach(function(v){
	    	//console.log(v);
	    	villages.push(getName(v.village));
	    });
	    return villages;
	},
	rainRequest : function() {
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    var requests = [];
	    if(waterDoc == undefined) {
	    	return;
	    }
	    waterDoc.request.forEach(function(v){
	    	//console.log(v);
	    	requests.push(v.value);
	    });
	    return requests;
	},
	rainAlloc : function() {
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    var alloc = [];
	    if(waterDoc == undefined) {
	    	return;
	    }
	    waterDoc.allocation.forEach(function(v){
	    	//console.log(v);
	    	alloc.push(v.value);
	    });
	    return alloc;
	},
	rainReceived : function() {
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    var receive = [];
	    if(waterDoc == undefined) {
	    	return;
	    }
	    waterDoc.received.forEach(function(v){
	    	//console.log(v);
	    	receive.push(v.value);
	    });
	    return receive;
	},
	rainStored : function() {
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    var store = [];
	    if(waterDoc == undefined) {
	    	return;
	    }
	    waterDoc.stored.forEach(function(v){
	    	//console.log(v);
	    	store.push(v.value);
	    });
	    return store;
	},
	rainBackInMC : function() {
		var presentAction = TimeLine.findOne({});
	    var season = presentAction.season;
	    var stage = presentAction.stage;
	    var waterDoc = Water.findOne({season:season,stage:stage});
	    var back = [];
	    if(waterDoc == undefined) {
	    	return;
	    }
	    waterDoc.backInMC.forEach(function(v){
	    	//console.log(v);
	    	back.push(v.value);
	    });
	    return back;
	},
	isARainEvent : function(){
      var presentAction = TimeLine.findOne({});
      var village = Meteor.user().roles[1];
      var eventRain = Events.find({season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
      var rainEvent = {};
      eventRain.forEach(function(doc){
        if(String(doc.where).indexOf(String(village)) !== -1 ){
          rainEvent = doc;
        };
      });
      //console.log(jQuery.isEmptyObject(rainEvent));
      return !jQuery.isEmptyObject(rainEvent);
  },
  rainEvent: function(){
      var presentAction = TimeLine.findOne({});
      var village = Meteor.user().roles[1];
      var eventRain = Events.find({season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
      var rainEvent = {};
      eventRain.forEach(function(doc){
        if(String(doc.where).indexOf(String(village)) !== -1 ){
          rainEvent = doc;
        };
      });

      return rainEvent;
  },
  rainModif : function() {
  	var presentAction = TimeLine.findOne({});
    var village = Meteor.user().roles[1];
    var eventRain = Events.findOne({game_id : Meteor.user().profile.game_id, season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
    return eventRain.modification;
  }

});

Template.Cloud.events({

});

function getName(id) {
	name = '';
	switch(id) 
	{
		case 1 : name = "Rivergate";
			break;
		case 2 : name = "Suncreek";
			break;
		case 3 : name = "Clearwater";
			break;
		case 4 : name = "Blueharvest";
			break;
		case 5 : name = "Starfields";
			break;
		case 6 : name = "Aquarun";
			break;
		case 7 : name = "Greenbounty";
			break;
		case 8 : name = "Moonbanks";
			break;
		default : name += 'Not defined';
            break;
	}
	return name;
}