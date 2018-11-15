Template.EventSeason.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('eventsControl');
  });
});

Template.EventSeason.helpers({
  isPresentOrSubsequentSeason: function(){
    var presentAction = TimeLine.findOne({});
    if (presentAction.season <= this){
      return true;
    };
  },
  eventsThisSeason: function(){
    var presentAction = TimeLine.findOne({});
    var gameId = Meteor.user().profile.game_id;
    //select the event that are to come or present
    if(presentAction.season < this){
      var events = Events.find({game_id:gameId, season:Number(this)}).fetch();
    } else if(presentAction.season === Number(this)){
      var events = Events.find(
        {$or:
          [
            {$and:
              [
                {game_id:gameId},
                {season:Number(this)},
                {stage:presentAction.stage},
                {active:true}
              ]
            },
            {$and:
              [
                {game_id:gameId},
                {season:Number(this)},
                {stage:{$gt:presentAction.stage}}
              ]
            }
          ]
        }).fetch();
    };
    return events;
  }
});

Template.EventSeason.events({
});
