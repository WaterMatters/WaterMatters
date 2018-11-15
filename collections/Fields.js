import { Mongo } from 'meteor/mongo';

Fields = new Mongo.Collection('fields');

export default Fields;


Fields.allow({
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
  newGameFields: function(gameId){
    for( var v=1; v<9; v++){
      Fields.insert({game_id:gameId, village: v, field:1, season:0, fef:0.7});
      Fields.insert({game_id:gameId, village: v, field:2, season:0, fef:0.5});
      Fields.insert({game_id:gameId, village: v, field:3, season:0, fef:0.5});
      Fields.insert({game_id:gameId, village: v, field:4, season:0, fef:0.4});
    };
  },
  //in StartNewSeason
  insertFieldsNewSeason: function(gameId, newSeason, fefArray, supplyArray){
    for(var v=1; v<9; v++){
      for(var f=1; f<5; f++){
        for(var s=0; s<4; s++){
          Fields.insert(
            {game_id:gameId, village: v, field:f, season:newSeason, stage:s, fef:fefArray[v][f-1], crop:'fallow', request:0, supply:supplyArray[s], supplyCategory:"D", yield:0}
          );
        };
      };
    };
  },
  changeCropSeason: function(gameId, village, field, season, newCrop){
    Fields.update(
      { game_id:gameId,
        village: Number(village),
        field: Number(field),
        season: Number(season),
      },
      {$set:{crop:newCrop}},
      { multi: true }
    );
  },
  changeRequest: function(gameId, village, field, season, stage, newRequest){
    Fields.update(
      { game_id:gameId,
        village: Number(village),
        field: Number(field),
        season: Number(season),
        stage: Number(stage)
      },
      {$set:{request:Number(newRequest)}}
    );
  },
  incrementSupplyEventRain: function(gameId, village, season, stage, increment){
    Fields.update(
      { game_id:gameId,
        village: Number(village),
        season: Number(season),
        stage: Number(stage)
      },
      {$inc:{supply:Number(increment)}},
      { multi: true }
    );
  },
  changeSupply: function(gameId, village, field, season, stage, newSupply){
    Fields.update(
      { game_id:gameId,
        village: Number(village),
        field: Number(field),
        season: Number(season),
        stage: Number(stage)
      },
      {$set:{supply:Number(newSupply)}}
    );
  },
  changeSupplyCategory: function(gameId, village, field, season, stage, newSupplyCategory){
    Fields.update(
      { game_id:gameId,
        village: Number(village),
        field: Number(field),
        season: Number(season),
        stage: Number(stage)
      },
      {$set:{supplyCategory:newSupplyCategory}}
    );
  },
  changeYield: function(gameId, village, field, season, stage, newYield){
    Fields.update(
      { game_id:gameId,
        village: Number(village),
        field: Number(field),
        season: Number(season),
        stage: Number(stage)
      },
      {$set:{yield:Number(newYield)}}
    );
  },
  changeFEF: function( gameId, season, village, field, newFEF){
    Fields.update(
      { game_id:gameId,
        village: Number(village),
        field: Number(field),
        season: Number(season),
      },
      {$set:{fef:Number(newFEF)}},
      {multi:true}
    );
  },
  deleteGameFields: function(gameId){
    Fields.remove({ game_id:gameId });
  },
  deleteAllFields: function(){
    Fields.remove({});
  },
});
