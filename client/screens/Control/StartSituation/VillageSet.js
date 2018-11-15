Template.VillageSet.onCreated(function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('fields');
  });
});

Template.VillageSet.helpers({
  fields: function(){
    return Fields.find({season:0, village:this.village});
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

Template.VillageSet.events({
 'input .money': function(event){
   var newMoney = Number(event.target.value);
   var gameId = Meteor.user().profile.game_id;
   //Method for collection villages
   Meteor.call('changeMoney', gameId, this.village, newMoney);
 }
});
