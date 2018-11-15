import { Mongo } from 'meteor/mongo';

Subsistences = new Mongo.Collection('subsistences');

export default Subsistences;


Subsistences.allow({
  insert: function(userId) {
    return !!userId;// Insert in data base is allowed if userId exists (signed in), returns true
  },
  update: function(userId) {
    return !!userId;// Same for update data base
  },
  remove: function(userId) {
    return !!userId;// Same for update data base
  }
});

Meteor.methods({
  newGameSubsistences: function(gameId){
    for(var i=1;i<11;i++){
      Subsistences.insert({game_id:gameId, "season":i, value:12000});
    };
  },
  changeSubsistence: function(gameId, season, newSubsistence){
    Subsistences.update(
      { game_id:gameId,
        season: Number(season)
      },
      {$set:{"value":Number(newSubsistence)}}
    )
  },
  deleteGameSubsistences: function(gameId){
    Subsistences.remove({ game_id:gameId });
  },
  deleteAllSubsistences: function(){
    Subsistences.remove({});
  }
})
