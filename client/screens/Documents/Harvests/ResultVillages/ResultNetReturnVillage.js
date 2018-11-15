Template.ResultNetReturnVillage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('waterManager');
    self.subscribe('transactions');
  });
});

Template.ResultNetReturnVillage.helpers({
  scoreInPourcent: function(){
    // Recalculate the arrayNetReturn
    var arrayNetReturn = [];
    for (var v=1 ; v<9 ; v++){
      //get total costs
        expensesArray = Transactions.find({ what:'money', who: String('village' + v), season:Session.get('documents-landhold-season') });
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
    // find the maximum between the villages in this array
    var maximum = 0;
    arrayNetReturn.forEach(function(village){
      if(maximum < village.netReturn){
        maximum = village.netReturn;
      };
    });
    var procent = this.netReturn/maximum*100;
    // Set negative values to 0 on the graph
    if(procent < 0){
      procent = 0;
    };
    return procent;
  },
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
    }
});

Template.ResultNetReturnVillage.events({

});
