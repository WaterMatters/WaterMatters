import { Timer } from '../../../../imports/api/timer.js';

Template.Game.onCreated(function(){
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('games');
    self.subscribe('villages');
    self.subscribe('transactions');
    self.subscribe('fields');
    self.subscribe('water');
    self.subscribe('production');
  });
});

Template.Game.helpers({
  gameActive: function(){
    //find which game we're playing
    //find the game to which the player is subscribed to
    var gameId = Meteor.user().profile.game_id;
    //compare to the id of the game in Template
    if(gameId===this._id){
        return true;
    };
  },
  notInitialGame: function(){
    return(this._id !== 'one')
  },
  createdWhen: function(){
    var date = String(this.createdAt.getDate() + '/' + this.createdAt.getMonth() + '/' + this.createdAt.getFullYear());
    return date;
  },
  seasonTime:function(){
    return this.seasonTime;
  }
});

Template.Game.events({
  //'click .fa-trash' : function() {
  'click .del-game-button' : function() {
    if( ! confirm("Delete this game? (includes all users of this game)") ){
      event.preventDefault(); // ! => don't want to do this
    } else {
        if(confirm("You are going to delete this game. Do you want to export the database before executing this action ?"))
        {
          var gameCode = this.code;
          var name = this.name;
          exportDatabase(name, gameCode);
        }
        //delete game-related documents in all collections
        var gameId = this._id;
        Meteor.call('deleteGameEvents', gameId);
        Meteor.call('deleteGameFields', gameId);
        Meteor.call('deleteGameProduction', gameId);
        Meteor.call('deleteGameSubsistences', gameId);
        Meteor.call('deleteGameTimeLine', gameId);
        Meteor.call('deleteGameTransactions', gameId);
        Meteor.call('deleteGameTransparency', gameId);
        Meteor.call('deleteGameVillages', gameId);
        Meteor.call('deleteGameWeatherCards', gameId);
        Meteor.call('deleteGameWater', gameId);
        Meteor.call('deleteGameWaterManager', gameId);
        Meteor.call('deleteGameUsers', gameId);
        //method for collection Games to finally delete the game
        Meteor.call('deleteGame', this._id);
      
    };
  },
  'click .activate-game-button':function(){
    //method for collection Users
    Meteor.call('linkControllerToThisGame', this._id, Meteor.userId());
    Meteor.flush();
  },
  'click .reset-game-button': function(){
    if( ! confirm("Do you really want to reset this game?") ){
      event.preventDefault(); // ! => don't want to do this
    } else {
      var gameId = this._id;

      //Reset the timer associated to this game
      var tid = Timer.findOne({"gameId" : gameId});
      if(tid)
        Timer.update({"_id" : tid._id},{$set:{"ellapsed" : 0, "needle" : 1, "fill" : 0, "ready" : []}});
      
      // delete all data related to this game
      Meteor.call('deleteGameWater', gameId);
      Meteor.call('deleteGameTransactions', gameId);
      Meteor.call('deleteGameProduction', gameId);

      // Erase all and insert for this game
      ////////////////////////////////////////

      //villages
      Meteor.call('deleteGameVillages', gameId, () => {
          Meteor.call('newGameVillages', gameId);
      });
      //fields
      Meteor.call('deleteGameFields', gameId, () => {
          Meteor.call('newGameFields', gameId);
      });
      //waterManager
      Meteor.call('deleteGameWaterManager', gameId, () => {
          Meteor.call('newGameWaterManager', gameId);
      });
      //timeLine
      Meteor.call('deleteGameTimeLine', gameId, () => {
          Meteor.call('newGameTimeLine', gameId);
      });
      //Transparency
      Meteor.call('deleteGameTransparency', gameId, () => {
          Meteor.call('newGameTransparency', gameId);
      });
      //Events
      Meteor.call('deleteGameEvents', gameId, () => {
          Meteor.call('newGameEvents', gameId);
      });
      //Subsistences
      Meteor.call('deleteGameSubsistences', gameId, () => {
          Meteor.call('newGameSubsistences', gameId);
      });
      //I do not do that for weatherCards because the controller could like the settings he/she chose

      document.location.reload();
    };
  },
  'click .export-data': function ( ) {
    var gameId = this.code;
    var name = this.name;
    exportDatabase(name, gameId);
  }
});

function exportDatabase(name, gameId)
{
  //collection villages example exportation
  var villages = Villages.find({}).fetch();
  var villagesCSV = Papa.unparse(villages);
  var villagesBlob = new Blob([villagesCSV],  {type: "text/csv;charset=utf-8"});
  saveAs(villagesBlob, name + ".csv");

  var transactions = Transactions.find({}).fetch();
  var fields = Fields.find({}).fetch();
  var water = Water.find({}).fetch();
  var waterRequests = [];
  var waterAllocations = [];
  var waterReceived = [];
  var waterStored = [];
  var waterBackInMC = [];
  water.forEach(function(waterDoc){
    waterDoc.request.forEach(function(docRequest){
      docRequest.game_id = gameId;
      docRequest.season = waterDoc.season;
      docRequest.stage = waterDoc.stage;
      waterRequests.push(docRequest);
    });
    waterDoc.allocation.forEach(function(docAllocation){
      docAllocation.game_id = gameId;
      docAllocation.season = waterDoc.season;
      docAllocation.stage = waterDoc.stage;
      waterAllocations.push(docAllocation);
    });
    waterDoc.received.forEach(function(docReceived){
      docReceived.game_id = gameId;
      docReceived.season = waterDoc.season;
      docReceived.stage = waterDoc.stage;
      waterReceived.push(docReceived);
    });
    waterDoc.stored.forEach(function(docStored){
      docStored.game_id = gameId;
      docStored.season = waterDoc.season;
      docStored.stage = waterDoc.stage;
      waterStored.push(docStored);
    });
    waterDoc.backInMC.forEach(function(docBackInMC){
      docBackInMC.game_id = gameId;
      docBackInMC.season = waterDoc.season;
      docBackInMC.stage = waterDoc.stage;
      waterBackInMC.push(docBackInMC);
    });
  });
  var production = Production.find({}).fetch();
  var villagesProduction = [];
  var villagesRevenue = [];
  production.forEach(function(productionDoc){
    productionDoc.villageProduction.forEach(function(docProduction){
      docProduction.game_id = gameId;
      docProduction.crop = productionDoc.crop;
      villagesProduction.push(docProduction);
    });
    productionDoc.villageRevenue.forEach(function(docRevenue){
      docRevenue.game_id = gameId;
      docRevenue.crop = productionDoc.crop;
      villagesRevenue.push(docRevenue);
    });
  });


  var transactionsCSV = Papa.unparse(transactions);
  var fieldsCSV = Papa.unparse(fields);
  // General water file followed by villages
  var waterCSV = Papa.unparse(water);
  var waterRequestsCSV = Papa.unparse(waterRequests);
  var waterAllocationsCSV = Papa.unparse(waterAllocations);
  var waterReceivedCSV = Papa.unparse(waterReceived);
  var waterStoredCSV = Papa.unparse(waterStored);
  var waterBackInMCCSV = Papa.unparse(waterBackInMC);
  // General production file followed by villages
  var productionCSV = Papa.unparse(production);
  var villagesProductionCSV = Papa.unparse(villagesProduction);
  var villagesRevenueCSV = Papa.unparse(villagesRevenue);


  var transactionsBlob = new Blob([transactionsCSV],  {type: "text/csv;charset=utf-8"});
  var fieldsBlob = new Blob([fieldsCSV],  {type: "text/csv;charset=utf-8"});
  var waterBlob = new Blob([waterCSV],  {type: "text/csv;charset=utf-8"});
  var waterRequestsBlob = new Blob([waterRequestsCSV],  {type: "text/csv;charset=utf-8"});
  var waterAllocationsBlob = new Blob([waterAllocationsCSV],  {type: "text/csv;charset=utf-8"});
  var waterReceivedBlob = new Blob([waterReceivedCSV],  {type: "text/csv;charset=utf-8"});
  var waterStoredBlob = new Blob([waterStoredCSV],  {type: "text/csv;charset=utf-8"});
  var waterBackInMCBlob = new Blob([waterBackInMCCSV],  {type: "text/csv;charset=utf-8"});
  var productionBlob = new Blob([productionCSV],  {type: "text/csv;charset=utf-8"});
  var villagesProductionBlob = new Blob([villagesProductionCSV],  {type: "text/csv;charset=utf-8"});
  var villagesRevenueBlob = new Blob([villagesRevenueCSV],  {type: "text/csv;charset=utf-8"});


  saveAs(transactionsBlob, "transactions.csv");
  saveAs(fieldsBlob, "fields.csv");
  saveAs(waterBlob, "water.csv");
  saveAs(waterRequestsBlob, "waterRequests.csv");
  saveAs(waterAllocationsBlob, "waterAllocations.csv");
  saveAs(waterReceivedBlob, "waterReceived.csv");
  saveAs(waterStoredBlob, "waterStored.csv");
  saveAs(waterBackInMCBlob, "waterBackInMC.csv");
  saveAs(productionBlob, "production.csv");
  saveAs(villagesProductionBlob, "villagesProduction.csv");
  saveAs(villagesRevenueBlob, "villagesRevenue.csv");
}
