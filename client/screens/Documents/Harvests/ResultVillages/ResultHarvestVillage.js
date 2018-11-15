Template.ResultHarvestVillage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('waterManager');
  });
});

Template.ResultHarvestVillage.helpers({
  scoreInPourcent: function(){
    var presentAction = TimeLine.findOne({});
    var waterManagerDoc = WaterManager.findOne({"season":Session.get('documents-landhold-season')});
    var maximum = 0;
    waterManagerDoc.villages.forEach(function(village){
      if(maximum < village.harvestRevenues){
        maximum = village.harvestRevenues;
      };
    });
    var procent = this.harvestRevenues/maximum*100;
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

Template.ResultHarvestVillage.events({

});
