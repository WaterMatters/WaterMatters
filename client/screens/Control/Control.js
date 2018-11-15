Template.Control.onCreated(function() {
  var self = this;
  self.autorun(function() {
  });
});

Template.Control.helpers({
  selectedTab: function(){
    return Session.get('control-tab');
  },
});

Template.Control.events({
  //open the tabs
  'click .tab': function(event){
    var htagPlace = Number(String(event.target).indexOf('#'));
    var tabName = String(event.target).slice(htagPlace+1);
    Session.set('control-tab', tabName);
  },
  'click .links-control div': function(event){
    var startNamePlace = Number(String(event.target.parentNode.id).indexOf('-')) + 1;
    var selectedName = String(event.target.parentNode.id).slice(startNamePlace);
    Session.set('control-tab', selectedName);
  },
  'click .new-game-button': () => {
    Session.set('createNewGame',true);
  },
});
