Template.MaintenanceControl.onCreated(function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('weatherCards');
  });
});

Template.MaintenanceControl.helpers({
  weatherCards: function(){
    return WeatherCards.find({});
  },
});

Template.MaintenanceControl.events({

});
