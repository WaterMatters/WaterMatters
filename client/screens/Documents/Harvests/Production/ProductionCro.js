Template.ProductionCro.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('production');
  });
});

Template.ProductionCro.helpers({
  priceAvailable: function(){
    if(this.localMarketPrice !== 0){
      return true;
    };
  },
  personalProduction: function(){
    var villageDoc = Villages.findOne({village:Number(Session.get('documents-player')[Session.get('documents-player').length - 1])});
    var villageNumber = villageDoc.village;
    return this.villageProduction[villageNumber-1].value;
  },
  personalRevenue: function(){
    var villageDoc = Villages.findOne({village:Number(Session.get('documents-player')[Session.get('documents-player').length - 1])});
    var villageNumber = villageDoc.village;
    var personalRevenue = this.villageRevenue[villageNumber-1].value;
    return personalRevenue;
  }
});

Template.ProductionCro.events({

});
