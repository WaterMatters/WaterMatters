Template.MaintenanceSlot.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('villages');
  });
});

Template.MaintenanceSlot.helpers({
  btnInactive: function(){
    // get your village
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var price = 1000;
    var btnInactive = false;
    if(village.money < price || this.fef === 0.9){
      btnInactive = true;
    }
    return btnInactive;
  },
  fefMax: function(){
    return(this.fef === 0.9);
  },
  fieldContent: function(field){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    var result = '';
    switch (village.crops[field-1].crop)
    {
      case 'fallow' :
            result = 'Crop_fallow';
          break;
      case 'maize' :
            result = 'Crop_corn';
          break;
      case 'rice' :
            result = 'Crop_Rice';
          break;
      case 'soybean' :
            result = 'Crop_beans';
          break;
    }
    return result;
  }
});

Template.MaintenanceSlot.events({
  'click .pay-maintenance' : function(event, template){
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    // Find your village
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
    // get presentAction
    var presentAction = TimeLine.findOne({});
    // get the price for the choice
    var price = 1000;
    // Get the new money of the village and the new FEF of the field
    var newMoney = Math.round(village.money - price);
    var newFEF = Math.round(10 * (this.fef + 0.1))/10;
    // Take the money from village
    //Method for collection Transactions - write for record
    Meteor.call('maintenanceTransaction', price, village.village, presentAction.season, presentAction.stage, gameId)
    //Method for collection 'Villages' - take the money
    Meteor.call('changeMoney', gameId, village.village, newMoney);
    //Method for collection fields - change the
    Meteor.call('changeFEF', gameId, presentAction.season, village.village, this.field, newFEF);
  }
});
