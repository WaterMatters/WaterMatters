Template.Irrigation.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('fields');
    self.subscribe('timeLine');
    self.subscribe('water');
  });
});

Template.Irrigation.helpers({
  fields: function(){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var villageNumber = village.village;
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    return Fields.find({village: Number(villageNumber),season:Number(season),stage:Number(stage)});
  },
  presentAction: function(){
    var presentAction = TimeLine.findOne({});
    return presentAction;
  },
  rain: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    var waterDoc = Water.findOne({season:season,stage:stage});
    var rain = waterDoc.rain;
    // But you have to check for events relative to rain!
    // And increment their value if your village is concerned
    var village = Meteor.user().roles[1];
    var eventRain = Events.find({season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
    eventRain.forEach(function(doc){
      if(String(doc.where).indexOf(String(village)) !== -1 ){
        rain += doc.modification;
      };
    });
    return rain;
  },
  allocation: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    var waterDoc = Water.findOne({season:season,stage:stage});
    var allocation = waterDoc.allocation[Number(Meteor.user().roles[1])-1].value;
    return allocation;
  },
  received: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    var waterDoc = Water.findOne({season:season,stage:stage});
    var received = waterDoc.received[Number(Meteor.user().roles[1])-1].value;
    return received;
  },
  canStayOnIrrigation: function(){
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage < 4 && presentAction.stage > 0){
      return true;
    } else {
      Session.set('view', 'village');
      Session.set('water-tab', '');
      FlowRouter.go('village-home');
      return false;
    };
  },
  backInMC: function(){
    var presentAction = TimeLine.findOne({});
    var waterDoc = Water.findOne({season:presentAction.season,stage:presentAction.stage});
    return waterDoc.backInMC[Number(Meteor.user().roles[1]) - 1].value;
  },
  storage: function(){
    var village = Villages.findOne({village: Number(Meteor.user().roles[1])});
    return village.storage;
  },
});

Template.Irrigation.events({
  'input .backInMC-input': function(event){ // change data base in function of the input
        //find which game we're playing
        var gameId = Meteor.user().profile.game_id;
        //
        var presentAction = TimeLine.findOne({});
        var waterDoc = Water.findOne({season:presentAction.season,stage:presentAction.stage});
        var newValue = Number(event.target.value);
        var oldValue = waterDoc.backInMC[Number(Meteor.user().roles[1]) - 1].value;

        var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
        var newWaterCredit = village.waterCredit + oldValue - newValue;
        // Check if the water credit after the change would be > 0
        if(newWaterCredit < 0){
          newValue = newValue + newWaterCredit;
          event.target.value = Number(newValue);
          newWaterCredit = 0;
        };
        // If after the check the value of the new Supply differs from the old Supply, then proceed the changes
        if(newValue !== oldValue){
          // Collection Water
          Meteor.call('changeWaterBackInMC', gameId, presentAction.season, presentAction.stage, village.village, newValue);
          // Collection Villages
          Meteor.call('changeWaterCredit', gameId, village.village, newWaterCredit);
        };
  },
  'input .storage-input': function(event){ // change data base in function of the input
        //find which game we're playing
        var gameId = Meteor.user().profile.game_id;
        //
        var presentAction = TimeLine.findOne({});
        var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
        var newValue = Number(event.target.value);
        var oldValue = village.storage.value;

        //Check if the new Value doesn't exceed the storage capacity
        if(newValue > village.storage.capacity){
          newValue = village.storage.capacity;
        };
        // Check if the water credit after the change would be > 0
        var newWaterCredit = village.waterCredit + oldValue - newValue;
        if(newWaterCredit < 0){
          newValue = newValue + newWaterCredit;
          newWaterCredit = 0;
        };

        //update the value of the field of the input
        event.target.value = Number(newValue);

        // If after the check the value of the new Supply differs from the old Supply, then proceed the changes
        if(newValue !== oldValue){
          // Collection Villages
          Meteor.call('changeStorageValue',gameId, village.village, newValue);
          // Collection Villages
          Meteor.call('changeWaterCredit', gameId, village.village, newWaterCredit);
          // Collection Water
          Meteor.call('changeWaterStored', gameId, presentAction.season, presentAction.stage, village.village, newValue);
        };
  },
});
