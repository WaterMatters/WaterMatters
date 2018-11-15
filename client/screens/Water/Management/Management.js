Template.Management.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('timeLine');
    self.subscribe('water');
    self.subscribe('transparency');
    self.subscribe('events');
  });
});

Template.Management.helpers({
  // Are you the water manager ?
  youAreWaterManager: function(){
    var yourVillage = Villages.findOne({village:Number(Meteor.user().roles[1])});
    return(yourVillage.waterManager);
  },
  // Determine if you can access the water management table
  managementAccessible: function(){
    var transparencyDoc = Transparency.findOne({});
    var waterManagerDoc = WaterManager.findOne({});
    var presentAction = TimeLine.findOne({});
    var yourVillage = Villages.findOne({village:Number(Meteor.user().roles[1])});
    if(yourVillage.waterManager && presentAction.stage<3 || waterManagerDoc.villageManager === 0 && presentAction.stage<3 || waterManagerDoc.villageManager !== 0 && transparencyDoc.waterManagement === true && presentAction.stage<3 ){
      return true;
    } else {
      Session.set('water-tab', '');
      Session.set('view', 'village');
    };
  },
  // Is the table accessible by other villages?
  accessTableAllowed: function(){
    var transparencyDoc = Transparency.findOne({});
    return(transparencyDoc.waterManagement === true);
  },
  // Is the table modifiable by other villages?
  modifTableAllowed: function(){
    var transparencyDoc = Transparency.findOne({});
    return(transparencyDoc.lockedGates === false);
  },
  villages: function(){
      return Villages.find({});
  },
  stage:function(){
    var presentAction = TimeLine.findOne({});
    var stage = presentAction.stage + 1;
    return stage;
  },
  mainCanalOrigin: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage+1;
    var waterDoc = Water.findOne({season:season, stage:stage});
    var mainCanalOrigin = waterDoc.mainCanal;
    return mainCanalOrigin;
  },
  totalPlantedArea: function(){
    var plantedArea = 0;
    var villages = Villages.find({});
    villages.forEach(function(village){
      village.crops.forEach(function(field){
        if(field.crop!=='fallow'){
          plantedArea = plantedArea + 10;
        };
      });
    });
    return plantedArea;
  },
  totalWaterRequest: function(){
      var waterRequest = 0;
      var presentAction = TimeLine.findOne({});
      var season = presentAction.season;
      var stage = presentAction.stage+1;
      var waterDoc = Water.findOne({season:season, stage:stage});
      waterDoc.request.forEach(function(villageRequest){
        waterRequest += villageRequest.value;
      });
      return waterRequest;
  },
  totalVisibility: function(){
    var transparencyDoc = Transparency.findOne({});
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var totalVisibility = true;
    if(village.waterManager !== true){
      transparencyDoc.villages.forEach(function(doc){
        if(doc.lineAlloc === false){
          totalVisibility = false;
        };
      });
    };
    return totalVisibility;
  },
});

Template.Management.events({
  //Toggle the access to the management table
  'click .toggle-visib-table': function(){
    var gameId = Meteor.user().profile.game_id;
    var transparencyDoc = Transparency.findOne({});
    var transpWaterManag = transparencyDoc.waterManagement;
    Meteor.call('toggleWaterManagement', gameId, transpWaterManag);
  },
  //Toggle the modificability to the management table
  'click .toggle-modif-table': function(){
    var gameId = Meteor.user().profile.game_id;
    var transparencyDoc = Transparency.findOne({});
    var transplockedGates = transparencyDoc.lockedGates;
    Meteor.call('toggleLockedGates', gameId, transplockedGates);
  },
  'click .pre-write':function(event){
    var presentAction = TimeLine.findOne({});
    var gameId = Meteor.user().profile.game_id;
    var season = presentAction.season;
    var stage = presentAction.stage+1;
    // Calculate the sum of losses through the canal (collection events)
    var eventsMainCanal = Events.find({timing:0, active:true, event:'changeMainCanal'});
    var sumLosses = 0;
    eventsMainCanal.forEach(function(event){
        sumLosses += event.modification;
    });
    // Get the original amount of water units in the canal and take out the losses
    var waterDoc = Water.findOne({season:season, stage:stage});
    var waterMainCanal = waterDoc.mainCanal + sumLosses;
    // Introducing the array that will be pre-written in the database as the water allocated
    var preWriteArray = [];

    if(event.target.id === 'requests-pre-write'){
          var totRequest = 0;
          waterDoc.request.forEach(function(doc){
            totRequest += doc.value;
          });
          //in order to have a 0 and not 'NaN'
          if(totRequest===0){
            totRequest=1;
          };
          waterDoc.request.forEach(function(doc){
            preWriteArray.push(parseInt(waterMainCanal / totRequest * doc.value));
          });
    } else if(event.target.id === 'planted-area-pre-write'){
          var TotalPlantedArea = 0;
          var plantedAreaVillages = [0,0,0,0,0,0,0,0];
          var villages = Villages.find({});
          villages.forEach(function(village){
            village.crops.forEach(function(field){
              if(field.crop!=='fallow'){
                TotalPlantedArea += 10;
                plantedAreaVillages[village.village - 1] += 10;
              };
            });
          });
          if(TotalPlantedArea===0){
            TotalPlantedArea = 1;
          };
          plantedAreaVillages.forEach(function(area){
            preWriteArray.push(parseInt(waterMainCanal / TotalPlantedArea * area));
          });
    } else if(event.target.id === 'even-pre-write'){
          for ( var i = 0; i<9; i++ ){
            preWriteArray.push(parseInt(waterMainCanal / 8));
          };
    };

    Meteor.call('prewriteAllocation', gameId, season, stage, preWriteArray);
  }
});
