Template.Water.onCreated(function() {
  var self = this;
  self.autorun(function(){
    self.subscribe('timeLine');
    self.subscribe('transparency');
    self.subscribe('waterManager');
  });
});

Template.Water.helpers({
  seasons: function(){
    var presentAction = TimeLine.findOne({});
    if(typeof presentAction !== 'undefined'){
      var arraySeasons = [];
      for ( var i=1 ; i<presentAction.season + 1 ; i++){
        var selected = false;
        if (Session.get('documents-landhold-season') === i){
          selected = true;
        };
        arraySeasons.push({season:i, selected:selected});
      };
      return arraySeasons;
    };
  },
  // Determine if you can access the water management table
  managementAccessible: function(){
    var transparencyDoc = Transparency.findOne({});
    var waterManagerDoc = WaterManager.findOne({});
    var presentAction = TimeLine.findOne({});
    var yourVillage = Villages.findOne({village:Number(Meteor.user().roles[1])});
    if(yourVillage.waterManager && presentAction.stage<3 || waterManagerDoc.villageManager === 0 && presentAction.stage<3 || waterManagerDoc.villageManager !== 0 && transparencyDoc.waterManagement === true && presentAction.stage<3 ){
      return true;
    } else {
    };
  },
  noIrrigation: function(){
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage < 4 && presentAction.stage > 0){
      return false;
    } else {
      return true;
    };
  },
});

Template.Water.events({
  'click .links-water div': function(event){
    var startNamePlace = Number(String(event.target.id).indexOf('-')) + 1;
    var selectedName = String(event.target.id).slice(startNamePlace);
    if(event.target.className.indexOf('inactive') === -1){
      Session.set('water-tab', selectedName);
      if(selectedName === 'irrigation'){
        Session.set('view', 'village');
      } else {
        Session.set('view', 'map');
      };
    };
  },
});
