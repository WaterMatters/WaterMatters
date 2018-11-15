import { Mongo } from 'meteor/mongo';

TimeLine = new Mongo.Collection('timeLine');

export default TimeLine;


TimeLine.allow({
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
  subsistencePaid: function(gameId, season, stage, playerNumber){
    TimeLine.update(
      { game_id:gameId,
        season: Number(season),
        stage: Number(stage),
        "paidSubsistence.village":Number(playerNumber)
      },
      {$set:{"paidSubsistence.$.done":true}}
    );
  },
  changeStage: function(gameId, season, stage){
    TimeLine.update(
      { game_id:gameId,
        season: Number(season),
        stage: Number(stage),
      },
      {$set:{over:true}},
    );
  },
  newGameTimeLine: function(gameId){
    TimeLine.insert({game_id : gameId, season:0, stage:9999, over:false});
    for(var i=1;i<11;i++){
      TimeLine.insert({game_id:gameId, season:i, stage:0, paidSubsistence:[{village:1, done:false},{village:2, done:false},{village:3, done:false},{village:4, done:false},{village:5, done:false},{village:6, done:false},{village:7, done:false},{village:8, done:false}], over:false});
      TimeLine.insert({game_id:gameId, season:i, stage:1, over:false});
      TimeLine.insert({game_id:gameId, season:i, stage:2, over:false});
      TimeLine.insert({game_id:gameId, season:i, stage:3, over:false});
      TimeLine.insert({game_id:gameId, season:i, stage:4, over:false});
    };
  },
  deleteGameTimeLine: function(gameId){
    TimeLine.remove({ game_id:gameId });
  },
  deleteAllTimeLine: function(){
    TimeLine.remove({});
  }
});
