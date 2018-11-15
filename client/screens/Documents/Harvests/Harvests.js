import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Template.Harvests.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('crops');
    self.subscribe('landholdingFields', Session.get('documents-player'), Session.get('documents-landhold-season'));
    self.subscribe('villages');
    self.subscribe('production');
    self.subscribe('waterManager');
    self.subscribe('transactions');
  });
});

Template.Harvests.helpers({
  showHarvest: function(){
    var presentAction = TimeLine.findOne({});
    return(Session.get('documents-landhold-season')<presentAction.season || presentAction.stage === 4);
  },
  productionCrops:function(){
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    //
    var presentAction = TimeLine.findOne({});
    return Production.find({game_id:gameId, season: Session.get('documents-landhold-season')});
  },
  priceAvailable:function(){
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    //
    var presentAction = TimeLine.findOne({});
    var productionDoc = Production.findOne({game_id:gameId, season: Session.get('documents-landhold-season')});
    if(productionDoc.localMarketPrice !== 0){
      return true;
    };
  },
  villageRevenues: function(){
    var villageRevenues = 0;
    var gameId = Meteor.user().profile.game_id;
    var presentAction = TimeLine.findOne({});
    var productionDocs = Production.find({game_id:gameId, season: Session.get('documents-landhold-season')})
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    productionDocs.forEach(function(productionDoc){
        var cropRevenue = productionDoc.villageRevenue[villageNumber-1].value;
        villageRevenues += cropRevenue;
    });
    return villageRevenues
  },
  totalRevenues: function(){
    var totalRevenues = 0;
    var gameId = Meteor.user().profile.game_id;
    var presentAction = TimeLine.findOne({});
    var productionDocs = Production.find({game_id:gameId, season: Session.get('documents-landhold-season')});
    productionDocs.forEach(function(productionDoc){
      totalRevenues += productionDoc.totalCropRevenue;
    });
    return totalRevenues
  },
  arrayHarvestVillagesThisSeason: function(){
    var presentAction = TimeLine.findOne({});
    var waterManagerDoc = WaterManager.findOne({"season":Session.get('documents-landhold-season')});
    var arrayVillages = waterManagerDoc.villages;
    //sorting the villages in descending scores
    arrayVillages.sort(function(a, b) {
    return  parseFloat(b.harvestRevenues) - parseFloat(a.harvestRevenues);
    });
    return arrayVillages;
  },
  arrayNetReturnVillagesThisSeason: function(){
    var arrayNetReturn = [];
    for (var v=1 ; v<9 ; v++){
      //get total costs
        var expensesArray = Transactions.find({
          what:'money',
          who: String('village' + v),
          season: Number(Session.get('documents-landhold-season'))
      });
        var sumAllExpenses = 0;
        if(typeof expensesArray !== 'undefined'){
          expensesArray.forEach(function(expenseDoc){
            sumAllExpenses += expenseDoc.quantity;
          });
        };
        var totalCosts = sumAllExpenses;
      //get gross return
        var allIncomesArray = Transactions.find({ what:'money', toWhom: String('village' + v), season:Session.get('documents-landhold-season') });
        var sumAllIncomes = 0;
        if(typeof allIncomesArray !== 'undefined'){
          allIncomesArray.forEach(function(doc){
            sumAllIncomes += doc.quantity;
          });
        };
        var grossReturn = sumAllIncomes;
      // get net return
      var netReturnVillage = grossReturn - totalCosts;
      // push in array
      arrayNetReturn.push({village:v, netReturn:netReturnVillage});
    };
    //sorting the villages in descending scores
    arrayNetReturn.sort(function(a, b) {
    return  parseFloat(b.netReturn) - parseFloat(a.netReturn);
    });
    return arrayNetReturn;
  },
  waterManagersDocs: function(){
    var presentAction = TimeLine.findOne({});
    return WaterManager.find({"season":{$lt:Session.get('documents-landhold-season') + 1}});
  },
  isController: function(){
    if(Meteor.user().roles[0] === 'controller'){
      return true;
    };
  }
});

Template.Harvests.events({
  'click .links-harvests div': function(event){
    var startNamePlace = Number(String(event.target.id).indexOf('-')) + 1;
    var selectedName = String(event.target.id).slice(startNamePlace);
    Session.set('harvest-tab', selectedName);
  },
});
