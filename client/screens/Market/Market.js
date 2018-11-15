Template.Market.onCreated(function() {
  var self = this;
  self.autorun(function() {
  });
  Session.set('marketPath', '/market');
});

Template.Market.helpers({

});

Template.Market.events({
  'click .market-link-trade':function(){
    Session.set('newTransaction',false);
  }
});
