import { Mongo } from 'meteor/mongo';

Water = new Mongo.Collection('water');

export default Water;

Water.allow({
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
  insertWaterDoc: function(gameId, season, stage, rain, mainCanal){
      Water.insert({game_id:gameId, "season":season, "stage":stage, "rain":rain, "mainCanal":mainCanal,
      //left in MC is the value of the water left in the canal after allocation. It doesn't count the water that might be given back to the canal by villages.
      "leftInMC":0,
      "request":[
        { "village":1,"value":0},
        { "village":2,"value":0},
        { "village":3,"value":0},
        { "village":4,"value":0},
        { "village":5,"value":0},
        { "village":6,"value":0},
        { "village":7,"value":0},
        { "village":8,"value":0}
      ],
      "allocation":[
        { "village":1,"value":0},
        { "village":2,"value":0},
        { "village":3,"value":0},
        { "village":4,"value":0},
        { "village":5,"value":0},
        { "village":6,"value":0},
        { "village":7,"value":0},
        { "village":8,"value":0}
      ],
      "received":[
        { "village":1,"value":0},
        { "village":2,"value":0},
        { "village":3,"value":0},
        { "village":4,"value":0},
        { "village":5,"value":0},
        { "village":6,"value":0},
        { "village":7,"value":0},
        { "village":8,"value":0}
      ],
      "stored": [
        { "village":1,"value":0},
        { "village":2,"value":0},
        { "village":3,"value":0},
        { "village":4,"value":0},
        { "village":5,"value":0},
        { "village":6,"value":0},
        { "village":7,"value":0},
        { "village":8,"value":0}
      ],
      "backInMC": [
        { "village":1,"value":0},
        { "village":2,"value":0},
        { "village":3,"value":0},
        { "village":4,"value":0},
        { "village":5,"value":0},
        { "village":6,"value":0},
        { "village":7,"value":0},
        { "village":8,"value":0}
      ]
    });
  },
  playWeatherCard: function(gameId, season, rainArray, mainCanalArray){
    for (var s=1;s<4;s++){
      Water.update(
        {game_id:gameId,
         season: season,
         stage: s
        },
        {$set:{rain:rainArray[s-1], mainCanal:mainCanalArray[s-1]}}
      );
    };
  },
  ChangeRain: function(gameId, season, stage, newRain){
    Water.update(
      {game_id:gameId,
        season: season,
       stage: stage},
       {$set:{rain:newRain}}
    );
  },
  ChangeMainCanal: function(gameId, season, stage, newMainCanal){
    Water.update(
      {game_id:gameId,
       season: season,
       stage: stage},
       {$set:{mainCanal:newMainCanal}}
    );
  },
  changeLeftInMC: function(gameId, season, stage, newLeftInMC){
    Water.update(
      {game_id:gameId,
       season: season,
       stage: stage},
       {$set:{leftInMC:newLeftInMC}}
    );
  },
  ChangeWaterRequest: function(gameId, playerNumber, season, stage, stageRequest){
    Water.update(
      { game_id:gameId,
        season:season,
        stage:stage,
        "request.village":Number(playerNumber)
      },
      {$set:{"request.$.value":stageRequest}}
    );
  },
  changeAllocation: function(gameId, season, stage, village, allocationVillage){
    Water.update(
      {game_id:gameId,
       season: season,
       stage:stage,
       "allocation.village":Number(village)},
       {$set:{"allocation.$.value": allocationVillage}}
    );
  },
  changeWaterReceived: function(gameId, season, stage, village, waterReceivedVillage){
    Water.update(
      {game_id:gameId,
       season: season,
       stage:stage,
       "received.village":Number(village)},
       {$set:{"received.$.value": waterReceivedVillage}}
    );
  },
  changeWaterStored: function(gameId, season, stage, village, waterStored){
    Water.update(
      {game_id:gameId,
       season: season,
       stage:stage,
       "backInMC.village":Number(village)},
       {$set:{"stored.$.value": waterStored}}
    );
  },
  changeWaterBackInMC: function(gameId, season, stage, village, waterBackInMC){
    Water.update(
      {game_id:gameId,
       season: season,
       stage:stage,
       "backInMC.village":Number(village)},
       {$set:{"backInMC.$.value": waterBackInMC}}
    );
  },
  prewriteAllocation: function(gameId, season, stage, preWriteArray){
    for(var v=1; v<9; v++){
      Water.update(
        {game_id:gameId,
         season: season,
         stage:stage,
         "allocation.village":v},
         {$set:{"allocation.$.value": preWriteArray[v-1]}}
      );
    };
  },
  deleteGameWater: function(gameId){
    Water.remove({ game_id:gameId });
  },
  deleteAllWater: function(){
    Water.remove({});
  }
});
