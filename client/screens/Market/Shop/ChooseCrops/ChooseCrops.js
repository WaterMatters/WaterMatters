Template.ChooseCrops.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('fields');
    self.subscribe('timeLine');
    self.subscribe('crops');
  });
  Session.set('marketPath', '/market/shop/crops');
});

Template.ChooseCrops.helpers({
  fields: function(){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var villageNumber = village.village;
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    return Fields.find({village: Number(villageNumber),season:Number(season),stage:Number(stage)});
  },
  fieldsSt1: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    return Fields.find({season:Number(season),stage:1});
  },
  fieldsSt2: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    return Fields.find({season:Number(season),stage:2});
  },
  fieldsSt3: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    return Fields.find({season:Number(season),stage:3});
  },
  stagesRequests: function(){
    var stagesRequestsObject = {};
    var presentAction = TimeLine.findOne({});
    var sumStage = 0;
    var fieldsStageOne = Fields.find({season:Number(presentAction.season),stage:1});
    var fieldsStageTwo = Fields.find({season:Number(presentAction.season),stage:2});
    var fieldsStageThree = Fields.find({season:Number(presentAction.season),stage:3});
    //for stage 1
    fieldsStageOne.forEach(function(field){
      sumStage += field.request;
    });
    stagesRequestsObject.stageOne = sumStage;
    sumStage = 0;
    //for stage 2
    fieldsStageTwo.forEach(function(field){
      sumStage += field.request;
    });
    stagesRequestsObject.stageTwo = sumStage;
    sumStage = 0;
    //for stage 3
    fieldsStageThree.forEach(function(field){
      sumStage += field.request;
    });
    stagesRequestsObject.stageThree = sumStage;
    return stagesRequestsObject;
  },
  fieldsRequests: function(){
    var fieldsRequestsArray = [0,0,0,0];
    var fieldsRequestsObject = {field1:0, field2:0, field3:0, field4:0};
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var fields = Fields.find({season:Number(season)});
    fields.forEach(function(field){
      fieldsRequestsArray[Number(field.field-1)] += field.request;
      fieldsRequestsObject[String('field' + field.field)] += field.request;
    });
    return fieldsRequestsObject;
  },
  totalRequest: function(){
    var totalRequest = 0;
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    for(var s=1;s<4;s++){
      var fields = Fields.find({season:Number(season),stage:s});
      fields.forEach(function(field){
        totalRequest = totalRequest + field.request;
      });
    };
    return totalRequest;
  },
  fieldsPrices: function(){
    var fieldsPricesArray = [];
    var fieldsPricesObject = {field1:0, field2:0, field3:0, field4:0};
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var fields = Fields.find({season:Number(season), stage:Number(presentAction.stage)});
    fields.forEach(function(field){
      var crop = Crops.findOne({crop:field.crop});
      fieldsPricesArray[field.field-1] += crop.buy.price;
      fieldsPricesObject[String('field' + field.field)] += crop.buy.price;
    });
    return fieldsPricesObject;
  },
  totalPrice: function(){
     var presentAction = TimeLine.findOne({});
     var season = presentAction.season;
     var stage = presentAction.stage;
     var fields = Fields.find({season:season, stage:stage});
     var totalPrice = 0;
     fields.forEach(function(field){
       var cropField = field.crop;
       var cropDB = Crops.findOne({crop:cropField});
       totalPrice = totalPrice + cropDB.buy.price;
     });
     return totalPrice;
  },
  cropsActive: function(){
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage === 0){
      if(presentAction.paidSubsistence[Number(Meteor.user().roles[1]) - 1].done === true){
        return true;
      } else {
        Session.set('marketPath', '/market/shop');
        FlowRouter.go('market/shop');
        return false;
      };
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

Template.ChooseCrops.events({
  'input input': function(){ // change data base in function of the input
        var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
        var playerNumber = village.village;
        var gameId = Meteor.user().profile.game_id;
        var fieldId = String("s"+this.stage+"f"+this.field);
        var newRequest = Number(document.getElementById(fieldId).value);
        var fieldsOfThisStageDocs = Fields.find({game_id:gameId, season:this.season, stage:this.stage});
        var stageRequest = 0;
        var fieldNumber = this.field;
        //Compute the water request for this village for this stage
        fieldsOfThisStageDocs.forEach(function(field){
          if(field.field === fieldNumber){
            stageRequest += newRequest;
          } else {
            stageRequest += field.request;
          };
        });
        // method for collection Fields - put the request for the field for the stage
        Meteor.call('changeRequest', gameId, this.village, this.field, this.season, this.stage, newRequest);
        //method for collection Water - put the request for the stage for the village (necessary for allocation)
        Meteor.call('ChangeWaterRequest', gameId, playerNumber, this.season, this.stage, stageRequest);
  },
  'click .close-action':function(){
    Session.set('marketPath', '/market');
  }
});
