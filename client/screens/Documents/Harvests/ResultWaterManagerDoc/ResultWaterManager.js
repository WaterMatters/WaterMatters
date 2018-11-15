Template.ResultWaterManager.onCreated(function() {
  var self = this;
  self.autorun(function() {
  });
});

Template.ResultWaterManager.helpers({
  giniIndex: function(){
    var arrayVillages = this.villages;
    //sorting the villages in ascending scores
    arrayVillages.sort(function(a, b) {
    return  parseFloat(a.harvestRevenues) - parseFloat(b.harvestRevenues);
    });
    //get array of all the revenues for the gini calculation
    var arrayForGini = [];
    arrayVillages.forEach(function(village){
      arrayForGini.push(village.harvestRevenues);
    });
    //get gini index
    var result = gini(arrayForGini);
    return result.toFixed(2);
  },
  name: function(village){
    var name = '';
      switch(village)
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

Template.ResultWaterManager.events({

});
