Template.FinancialRecord.onCreated(function() {
  // Set the value of the visited season to 1 for the langholding record, if not yet created
  if(typeof Session.get('documents-landhold-season') === 'undefined'){
    Session.set('documents-landhold-season', 1);
  };
  var self = this;
  self.autorun(function(){
    self.subscribe('financialRecord', Session.get('documents-player'), Session.get('documents-landhold-season'));
    self.subscribe('crops');
    self.subscribe('productionSeason', Session.get('documents-landhold-season'));
    self.subscribe('villageSpecified', Session.get('documents-player'));
    //get the fields for this player and this season
    self.subscribe('landholdingFields', Session.get('documents-player'), Session.get('documents-landhold-season'));
  });
});

Template.FinancialRecord.helpers({
  isStage0: function(){
    var presentAction = TimeLine.findOne({});
    return(Session.get('documents-landhold-season') === presentAction.season && presentAction.stage === 0);
  },
  fefFields: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 0, village:villageNumber });
    var arrayFef = [];
    fields.forEach(function(field){
      arrayFef[field.field - 1] = field.fef;
    });
    return arrayFef;
  },
  cropGrown: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 0, village:villageNumber });
    var arrayCrops = [];
    fields.forEach(function(field){
      arrayCrops[field.field - 1] = field.crop;
    });
    return arrayCrops;
  },
  subsistence: function(){
    var subsistenceDoc = Transactions.findOne({ motive: 'subsistence' });
    var subsistence = 0;
    if(typeof subsistenceDoc !== 'undefined'){
      subsistence = subsistenceDoc.quantity;
    }
    return subsistence;
  },
  cropCosts: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 0, village:villageNumber });
    var arrayCropsPrice = [];
    fields.forEach(function(field){
      var crop = Crops.findOne({crop:field.crop});
      var price = crop.buy.price;
      arrayCropsPrice[field.field -1] = price;
    });
    return arrayCropsPrice;
  },
  maintenanceCosts: function(){
    var maintenanceArray = Transactions.find({what:'money', motive:'maintenance' , who: Session.get('documents-player') });
    var sumMaintenance = 0;
    maintenanceArray.forEach(function(maintenanceDoc){
      sumMaintenance += maintenanceDoc.quantity;
    });
    return sumMaintenance;
  },
  sumOtherExpenses: function(){
    var otherExpensesArray = Transactions.find({what:'money', motive:{$nin:['subsistence', 'seeds soybean', 'seeds rice', 'seeds maize', 'maintenance']} , who: Session.get('documents-player') });
    var sumOtherExpenses = 0;
    if(typeof otherExpensesArray !== 'undefined'){
      otherExpensesArray.forEach(function(doc){
        sumOtherExpenses += doc.quantity
      });
    };
    return sumOtherExpenses;
  },
  totalCosts: function(){
    //find all transactions that the village did. who = village
    expensesArray = Transactions.find({ what:'money', who: Session.get('documents-player') });
    var sumAllExpenses = 0;
    if(typeof expensesArray !== 'undefined'){
      expensesArray.forEach(function(expenseDoc){
        sumAllExpenses += expenseDoc.quantity;
      });
    };
    return sumAllExpenses;
  },
  finalCropYield: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 3, village:villageNumber  });
    var yieldArray = [];
    fields.forEach(function(field){
      yieldArray[field.field -1] = field.yield;
    });
    return yieldArray;
  },
  cropPrice: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 3, village:villageNumber  });
    var priceArray = [];
    fields.forEach(function(field){
      var price = 0;
      if(field.crop !== 'fallow'){
        var productionDoc = Production.findOne({crop:field.crop});
        price = productionDoc.localMarketPrice;
      } else {
        price = 0;
      };
      priceArray[field.field - 1] = price;
    });
    return priceArray;
  },
  cropRevenue: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 3, village:villageNumber  });
    var cropRevenueArray = [];
    fields.forEach(function(field){
      var yieldField = field.yield;
      var price = 0;
      if(field.crop !== 'fallow'){
        var productionDoc = Production.findOne({crop:field.crop});
        price = productionDoc.localMarketPrice;
      } else {
        price = 0;
      };
      cropRevenueArray[field.field -1] = yieldField * price;
    });
    return cropRevenueArray;
  },
  sumOtherIncome: function(){
    var otherIncomesArray = Transactions.find({what:'money', motive:{$nin:['harvest soybean', 'harvest rice', 'harvest maize']} , toWhom: Session.get('documents-player') });
    var sumOtherIncomes = 0;
    if(typeof otherIncomesArray !== 'undefined'){
      otherIncomesArray.forEach(function(doc){
        sumOtherIncomes += doc.quantity;
      });
    };
    return sumOtherIncomes;
  },
  grossReturn: function(){
    var allIncomesArray = Transactions.find({ what:'money', toWhom: Session.get('documents-player') });
    var sumAllIncomes = 0;
    if(typeof allIncomesArray !== 'undefined'){
      allIncomesArray.forEach(function(doc){
        sumAllIncomes += doc.quantity;
      });
    };
    return sumAllIncomes;
  },
  netReturn: function(){
    //get total costs
      expensesArray = Transactions.find({ what:'money', who: Session.get('documents-player') });
      var sumAllExpenses = 0;
      if(typeof expensesArray !== 'undefined'){
        expensesArray.forEach(function(expenseDoc){
          sumAllExpenses += expenseDoc.quantity;
        });
      };
      var totalCosts = sumAllExpenses;
    //get gross return
      var allIncomesArray = Transactions.find({ what:'money', toWhom: Session.get('documents-player') });
      var sumAllIncomes = 0;
      if(typeof allIncomesArray !== 'undefined'){
        allIncomesArray.forEach(function(doc){
          sumAllIncomes += doc.quantity;
        });
      };
      var grossReturn = sumAllIncomes;
    // get net return
    return grossReturn - totalCosts;
  },
  cashAssets: function(){
    //get the money of the village at the end of last season
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var village = Villages.findOne({village:villageNumber});
    if(typeof village !== 'undefined'){
      var moneyEndPreviousSeason = village.moneyEnd[Session.get('documents-landhold-season') - 1].value;
      return moneyEndPreviousSeason;
    };
  },
  totalAssets: function(){
    //get cash assets
      var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
      var village = Villages.findOne({village:villageNumber});
      if(typeof village !== 'undefined'){
          var moneyEndPreviousSeason = village.moneyEnd[Session.get('documents-landhold-season') - 1].value;
          var cashAssets = moneyEndPreviousSeason;
        //get total costs
          expensesArray = Transactions.find({ what:'money', who: Session.get('documents-player') });
          var sumAllExpenses = 0;
          if(typeof expensesArray !== 'undefined'){
            expensesArray.forEach(function(expenseDoc){
              sumAllExpenses += expenseDoc.quantity;
            });
          };
          var totalCosts = sumAllExpenses;
        //get gross return
          var allIncomesArray = Transactions.find({ what:'money', toWhom: Session.get('documents-player') });
          var sumAllIncomes = 0;
          if(typeof allIncomesArray !== 'undefined'){
            allIncomesArray.forEach(function(doc){
              sumAllIncomes += doc.quantity;
            });
          };
          var grossReturn = sumAllIncomes;
        // get net return
          var netReturn = grossReturn - totalCosts;
        //get total assets
        return cashAssets + netReturn;
      };
  }
});

Template.FinancialRecord.events({
});
