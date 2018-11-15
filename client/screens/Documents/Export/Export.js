Template.Export.onCreated( function(){
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('transactions');
    self.subscribe('fields');
    self.subscribe('water');
    self.subscribe('production');
  });
});

Template.Export.events({
  'click .export-data': function ( ) {
    var gameId = Meteor.user().profile.game_id;

    //collection villages example exportation
    var villages = Villages.find({}).fetch();
    var villagesCSV = Papa.unparse(villages);
    var villagesBlob = new Blob([villagesCSV],  {type: "text/csv;charset=utf-8"});
    saveAs(villagesBlob, "Villages.csv");

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
  },
});
