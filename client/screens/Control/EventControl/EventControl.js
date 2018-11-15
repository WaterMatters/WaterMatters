Template.EventControl.onCreated(function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('weatherCards');
  });
  Session.set('eventView', 'normal');
});

Template.EventControl.helpers({
  weatherCards: function(){
    return WeatherCards.find({});
  },
  seasons: function(){
    return [1,2,3,4,5,6,7,8,9,10];
  },
});

Template.EventControl.events({
  //'click .btn-add': function(event,template){
  'click .add-event': function(event,template){
    Session.set('eventView', 'new');
  },
  'click .close': function(){
    Session.set('eventView', 'normal');
  },
});
