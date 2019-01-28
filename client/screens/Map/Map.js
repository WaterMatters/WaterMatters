

Template.Map.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('crops');
    self.subscribe('events');
    self.subscribe('fields');
  });
});


Template.Map.helpers({
  villages: function(){
    return Villages.find();
  },
  displayEye: function(){
    if(Meteor.user().roles[0]==='controller'){
      return true;
    };
  },
  eventsCanalActive: function(){
    var gameId = Meteor.user().profile.game_id;
    //return the events that are active on this stage (timing:0) and that are a dammage to the canal (modification lower than 0)
    return Events.find({game_id:gameId, active:true, timing:0, event:{$in:['changeMainCanal', 'changeSecondaryCanal']}});
  },
  setVillagePosition: function(){
    var xSize = 10;
    var ySize = 10;
    var mult = 5;
    var mult2 = 15;
    //$("#V8").css({'top':'150px'});
    for (var i = 1; i < 9; i++) 
    {
      var tmp = "V"+i;

      if(i<5)
      {
        $('#'+tmp).css('top', ySize*mult); // Y
        $('#'+tmp).css('left', xSize*i); // X
      }
      else
      {
        $('#'+tmp).css('top', ySize*mult2);
        $('#'+tmp).css('left', xSize*(i%4));
      }
      
    }
  }
});

Template.Map.events({
  //event to turn off modal (see MaintenanceModal)
  'click .eye-closed': function(){
    Session.set('see-map-toggle','opened');
  },
  'click .eye-opened': function(){
    Session.set('see-map-toggle','closed');
  },
});

