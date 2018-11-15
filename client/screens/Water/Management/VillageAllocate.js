import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Template.VillageAllocate.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('timeLine');
    self.subscribe('fields');
    self.subscribe('water');
    self.subscribe('events');
    self.subscribe('transparency');
    self.subscribe('waterManager');
  });
});


Template.VillageAllocate.helpers({
    name: function(){
      var name = '';
        switch(this.village)
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
          default : name = 'Village ' + this.village;
            break;
        }
      return name;
    },
  managementVisible: function(){
    var transparencyDoc = Transparency.findOne({});
    var waterManagerDoc = WaterManager.findOne({});
    var yourVillage = Villages.findOne({village:Number(Meteor.user().roles[1])});
    if(waterManagerDoc.villageManager === yourVillage.village || waterManagerDoc.villageManager === 0 || waterManagerDoc.villageManager !== 0 && transparencyDoc.waterManagement === true){
      return true;
    } else {
      Session.set('water-tab', '');
    }
  },
  transparentVillage: function(){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var transparencyDoc = Transparency.findOne({});
    var transparency = false;
    //Show the line of allocation if we are in 'one manager' mode or if the line corresponds to your village
    if(village.waterManager === true || Number(Meteor.user().roles[1]) === this.village || transparencyDoc.villages[this.village-1].lineAlloc === true){
      transparency = true;
    };
    return transparency;
  },
  //identifies if the player can change the allocation of this line
  modifAllocPower: function(){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var transparencyDoc = Transparency.findOne({});
    var waterManagerDoc = WaterManager.findOne({});
    var modifAllocPower = false;
    if(waterManagerDoc.villageManager === 0){
      if(Number(Meteor.user().roles[1]) === this.village){
        modifAllocPower = true;
      };
    } else { // if there is a water manager
      if(village.waterManager === true || Number(Meteor.user().roles[1]) === this.village && transparencyDoc.lockedGates === false){
        modifAllocPower = true;
      };
    };
    return modifAllocPower;
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
  //Check if it is your village
  yourVillage: function(){
    var yourVillage = Villages.findOne({village:Number(Meteor.user().roles[1])});
    return(yourVillage.village === this.village);
  },
  // Check if your village's water management is visible for the other players
  yourVillageTransparent: function(){
    var yourVillage = Villages.findOne({village:Number(Meteor.user().roles[1])});
    if(yourVillage.village === this.village){
      var transparencyDoc = Transparency.findOne({});
      return transparencyDoc.villages[yourVillage.village-1].lineAlloc;
    };
  },
  eventWaterUpstream: function(){
    var eventsMainCanal = Events.find({timing:0, active:true, event:'changeMainCanal'});
    var eventUpstream = '';
    var village = this.village;
    eventsMainCanal.forEach(function(event){
        if(Number(event.where) === Number(village) && Number(event.modification)<0){
          eventUpstream = 'loss';
        };
        if(event.where === village && event.modification>0){
          eventUpstream = 'gain';
        };
    });
    return eventUpstream;
  },
  plantedArea: function(){
    var plantedArea = 0;
    this.crops.forEach(function(field){
      if(field.crop!=='fallow'){
        plantedArea = plantedArea + 10;
      };
    });
    return plantedArea;
  },
  waterRequest: function(){
      var presentAction = TimeLine.findOne({});
      var season = presentAction.season;
      var stage = presentAction.stage+1;
      var waterDoc = Water.findOne({season:season, stage:stage});
      return waterDoc.request[this.village-1].value;
  },
  propPlanted: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage+1;
    var villages = Villages.find();
    var totalplantedArea = 0;
    var plantedArea = 0;
    // Calculate planted area of village
    this.crops.forEach(function(field){
      if(field.crop!=='fallow'){
        plantedArea = plantedArea + 10;
      };
    });
    // Calculate total planted area
    villages.forEach(function(village){
        village.crops.forEach(function(field){
          if(field.crop!=='fallow'){
            totalplantedArea = totalplantedArea + 10;
          };
        });
    });
    // Calculate the sum of losses through the canal (collection events)
    var eventsMainCanal = Events.find({timing:0, active:true, event:'changeMainCanal'});
    var sumLosses = 0;
    eventsMainCanal.forEach(function(event){
        sumLosses += event.modification;
    });
    // Get the original amount of water units in the canal and take out the losses
    var waterDoc = Water.findOne({season:season, stage:stage});
    var waterMainCanal = waterDoc.mainCanal + sumLosses;
    //in order to have a 0 and not 'NaN'
    if(totalplantedArea===0){
      totalplantedArea = 1;
    };
    return parseInt(waterMainCanal / totalplantedArea * plantedArea);
  },
  propRequest: function(){
    var presentAction = TimeLine.findOne({});
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
    // Get water requested by the village
    var requestVillage = waterDoc.request[this.village-1].value;
    var totRequest = 0;
    waterDoc.request.forEach(function(doc){
      totRequest += doc.value;
    });
    //in order to have a 0 and not 'NaN'
    if(totRequest===0){
      totRequest=1;
    };
    return parseInt(waterMainCanal / totRequest * requestVillage);
  },
  evenDistribution: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage+1;
    var eventsMainCanal = Events.find({timing:0, active:true, event:'changeMainCanal'});
    var sumLosses = 0;
    eventsMainCanal.forEach(function(event){
        sumLosses += event.modification;
    });
    // Get the original amount of water units in the canal and take out the losses
    var waterDoc = Water.findOne({season:season, stage:stage});
    var waterMainCanal = waterDoc.mainCanal + sumLosses;
    // return this amount of water divided by the number of villages
    return parseInt(waterMainCanal / 8);
  },
  allocation: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage+1;
    var village = this.village;
    var waterDoc = Water.findOne({season:season, stage:stage});
    //take the allocation of the village
    var allocVillage = waterDoc.allocation[village-1].value;
    return allocVillage;
  },
  mainCanal: function(){
    // find eventsMainCanal that happen immediately just upstream of each village
    var eventsMainCanal = Events.find({timing:0, active:true, event:'changeMainCanal'});
    var eventsMainCanalArray = [0,0,0,0,0,0,0,0];
    eventsMainCanal.forEach(function(event){
      // insert the modifications into the array at the correct position (defined from 'where')
      eventsMainCanalArray[event.where-1] += event.modification;
    });
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage+1;
    var village = this.village;
    var waterDoc = Water.findOne({season:season, stage:stage});
    var mainCanalOrigin = waterDoc.mainCanal;
    var mainCanalAfter = mainCanalOrigin;
    var allocArray = waterDoc.allocation;
    for(var i=0; i<village; i++){
        mainCanalAfter = mainCanalAfter - allocArray[i].value
        + eventsMainCanalArray[i];
    };
    var mainCanal = {gainOrLossBefore:'', gainOrLossValue:0, after:mainCanalAfter};
    mainCanal.gainOrLossValue = eventsMainCanalArray[village-1];
    if(mainCanal.gainOrLossValue < 0){
      mainCanal.gainOrLossBefore = 'loss';
    } else if(mainCanal.gainOrLossValue > 0){
      mainCanal.gainOrLossBefore = 'gain';
    };
    return mainCanal;
  },
  lockedSelected: function(){
    if(this.gate==='locked'){
      return true;
    }
  },
  allocated: function(){
    var presentAction = TimeLine.findOne({});
    var village = this.village;
    return presentAction.paidSubsistence[village-1].done;
  },
  firstToAllocate: function(){
    var presentAction = TimeLine.findOne({});
    var village = this.village;
    if(village===1){
      return true;
    }else{
      return presentAction.paidSubsistence[village-2].done; //if it's true for the preceding village then it's his turn
    };
  }
});

Template.VillageAllocate.events({
  'input .inputAlloc': function(event, template){ // change data base in function of the input
        // Important about allocation: I consider that even if there is a problem in the main canal,
        // event the most remote village must at least receive 1 water unit. That's fitter to reality,
        // and otherwize I should allow the possibility of giving all the water to the Villages
        // that don't have the problem, allowing them to bypass after that with transactions. I won't allow it.
        //find which game we're playing
        var gameId = Meteor.user().profile.game_id;
        //
        var presentAction = TimeLine.findOne({});
        var season = presentAction.season;
        var stage = presentAction.stage+1;
        var village = this.village;
        var numberVillages = Villages.find().count();
        var allocationVillage = Number(template.find('input').value);

        // find eventsMainCanal that happen immediately just upstream of each village
        var eventsMainCanal = Events.find({timing:0, active:true, event:'changeMainCanal'});
        var eventsMainCanalArray = [0,0,0,0,0,0,0,0];
        eventsMainCanal.forEach(function(event){
          // insert the modifications into the array at the correct position (defined from 'where')
          eventsMainCanalArray[event.where-1] = event.modification;
        });


        // Get the quantity of water in the main canal after village
        var waterDoc = Water.findOne({season:season, stage:stage});
        var mainCanalOrigin = Number(waterDoc.mainCanal);
        var mainCanalAfter = mainCanalOrigin;
        var allocArray = waterDoc.allocation;
        mainCanalAfter =mainCanalAfter - allocationVillage
                        + eventsMainCanalArray[this.village-1]; // use new input value for this village
        for(i=0;i<numberVillages;i++){
          if(i!==village-1){
            mainCanalAfter = mainCanalAfter - Number(allocArray[i].value)// use old input value for other villages
                                + eventsMainCanalArray[i];
          };
        };

        template.find('input').value = allocationVillage;
        //Method Collection Water
        Meteor.call('changeAllocation', gameId, season, stage, village, Number(allocationVillage));
  },
  'click button': function(){
        //find which game we're playing
        var gameId = Meteor.user().profile.game_id;
        //
        var presentAction = TimeLine.findOne({});;
        var season = presentAction.season;
        var stage = presentAction.stage + 1;
        var waterDoc = Water.findOne({season:season, stage:stage});
        // Set the water credit of the villages.
        var villageDocs = Villages.find({game_id:gameId});
        villageDocs.forEach(function(village){
          var newWaterCredit = waterDoc.allocation[village.village-1].value;
          //Methods collection Villages
          Meteor.call('incrementWaterCredit', gameId, village.village, newWaterCredit);
        });
  },
  'click .toggle-visibility': function(){
    //Collection Transparency
    var yourVillage = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var gameId = Meteor.user().profile.game_id;
    var transparencyDoc = Transparency.findOne({});
    var lineAlloc = transparencyDoc.villages[yourVillage.village-1].lineAlloc;
    Meteor.call('toggleAllocLine', gameId, yourVillage.village, lineAlloc);
  },
});
