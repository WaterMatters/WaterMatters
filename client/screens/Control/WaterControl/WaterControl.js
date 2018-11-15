Template.WaterControl.onCreated(function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('weatherCards');
  });
});

Template.WaterControl.helpers({
  weatherCards: function(){
    return WeatherCards.find({});
  },
});

Template.WaterControl.events({

});
