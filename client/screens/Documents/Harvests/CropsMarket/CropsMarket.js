Template.CropsMarket.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('production');
  });
});

Template.CropsMarket.helpers({
  stylesDots: function(){
      var presentAction = TimeLine.findOne({});
      var productionArray = Production.find({season:Session.get('documents-landhold-season')});
      var stylesDots = {rice:'', soybean:'', maize:''}
      productionArray.forEach(function(doc){
        var crop = doc.crop;
        var production = doc.totalProduction;
        var price = doc.localMarketPrice;
        var x = 0;
        if(production > 420){
          x = 240;
        } else {
          x = -206 + production * 433 / 400;
        };
        var y = 33 + (1300-(price))*296/1100;

        x +=278; //Added for the offset

        stylesDots[doc.crop] = String('top:' + y + 'px; left:' + x +'px;');
      });
      
      return stylesDots;
  },
});

Template.CropsMarket.events({

});
