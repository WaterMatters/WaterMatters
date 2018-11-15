Template.SupplySlot.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('timeLine');
    self.subscribe('fields');
    self.subscribe('crops');
    self.subscribe('events');
  });
});

Template.SupplySlot.helpers({
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
  village: () => {
    return Villages.findOne({village:Number(Meteor.user().roles[1])});
  },
  season: function(){
    var presentAction = TimeLine.findOne({});
    return presentAction.season;
  },
  stage: function(){
    var presentAction = TimeLine.findOne({});
    return presentAction.stage;
  },
  yieldPast: function(){
    var previousStage = this.stage - 1;
    var fieldPast = Fields.findOne({field:this.field, stage:previousStage});
    return fieldPast.yield;
  },
  clickable: function(){
    var clickable = {good:false, medium:false, poor:false};
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var cropObject = Crops.findOne({crop:this.crop});
    if (this.crop !== "fallow"){
      var cropSupplyStage = cropObject.supply[this.stage - 1];
      var supplyArray = cropSupplyStage[String("fef0" + 10*this.fef)];
      var presentSupplyCat = this.supplyCategory;
      var presentSupply = this.supply;
      var clickable = {good:false, medium:false, poor:false};
      //test for category good
      if(supplyArray[0].water - presentSupply <= village.waterCredit){
        clickable.good = true;
      };
      //test for category medium
      if(supplyArray[1].water - presentSupply <= village.waterCredit){
        clickable.medium = true;
      };
      //test for category poor
      if(supplyArray[2].water - presentSupply <= village.waterCredit){
        clickable.poor = true;
      };
    };
    return clickable;
  }
})


Template.SupplySlot.events({
  'input .form-supply': function(event, template){ // change data base in function of the input
        //find which game we're playing
        var gameId = Meteor.user().profile.game_id;
        //
        var newSupply = Number(template.find('input').value);
        var oldSupply = this.supply;
        var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
        var newWaterCredit = village.waterCredit + oldSupply - newSupply;
        // Check if the water credit after the change would be > 0
        if(newWaterCredit < 0){
          newSupply = newSupply + newWaterCredit;
          template.find('input').value = Number(newSupply);
          newWaterCredit = 0;
        };
        // If after the check the value of the new Supply differs from the old Supply, then proceed the changes
        if(newSupply !== oldSupply){
          // Collection Fields
          Meteor.call('changeSupply', gameId ,this.village, this.field, this.season, this.stage, newSupply);
          updateSupplyCat_yand_Yield(gameId, this.village, this.field, this.fef, this.crop, this.season, this.stage, newSupply); // see index.js
          // Collection Villages
          Meteor.call('changeWaterCredit', gameId, this.village, newWaterCredit);
        };
  },
  'change .form-supply': function(event,template){
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    //
    var newSupply = Number(template.find('input').value);
    var oldSupply = this.supply;
    var waterDoc = Water.findOne({season:this.season,stage:this.stage});
    //Rain, but check if there is an event rain!
    var rain = waterDoc.rain;
    var village = Meteor.user().roles[1];
    var presentAction = TimeLine.findOne({});
    var eventRain = Events.find({season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
    eventRain.forEach(function(doc){
      if(String(doc.where).indexOf(String(village)) !== -1 ){
        rain += doc.modification;
      };
    });

    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});

    if(newSupply < rain){
      var newWaterCredit = village.waterCredit + newSupply - rain;
      newSupply = rain;
      // Collection Fields
      Meteor.call('changeSupply', gameId, this.village, this.field, this.season, this.stage, newSupply);
      updateSupplyCat_yand_Yield(gameId, this.village, this.field, this.fef, this.crop, this.season, this.stage, newSupply); // see index.js
      // Collection Villages
      Meteor.call('changeWaterCredit', gameId, this.village, newWaterCredit);
    }
  },
  'click .clickable': function(event,template){
    console.log("passe");
    var gameId = Meteor.user().profile.game_id;
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var supplyCatDesired = event.target.id;
    var cropObject = Crops.findOne({crop:this.crop});
    var cropSupplyStage = cropObject.supply[this.stage - 1];
    var supplyArray = cropSupplyStage[String("fef0" + 10*this.fef)];
    var newSupply = supplyArray.find(x => x.supplyCategory === event.target.id).water;
    var newWaterCredit = village.waterCredit - (newSupply - this.supply);
    // Collection Fields
    Meteor.call('changeSupply', gameId, this.village, this.field, this.season, this.stage, newSupply);
    updateSupplyCat_yand_Yield(gameId, this.village, this.field, this.fef, this.crop, this.season, this.stage, newSupply); // see index.js
    // Collection Villages
    Meteor.call('changeWaterCredit', gameId, this.village, newWaterCredit);
  }
});
