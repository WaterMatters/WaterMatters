import { Mongo } from 'meteor/mongo';

WaterManager = new Mongo.Collection('waterManager');

export default WaterManager;

WaterManager.allow({
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
  newGameWaterManager: function(gameId){
    for(var i=1;i<11;i++){
      WaterManager.insert({ game_id:gameId, "season":i, "villageManager" : 1,
       "totalRevenuesSeason":0, "giniIndex":0,
       "villages":[
         {"village":1, "harvestRevenues":0},
         {"village":2, "harvestRevenues":0},
         {"village":3, "harvestRevenues":0},
         {"village":4, "harvestRevenues":0},
         {"village":5, "harvestRevenues":0},
         {"village":6, "harvestRevenues":0},
         {"village":7, "harvestRevenues":0},
         {"village":8, "harvestRevenues":0},
       ]
      });
    };
  },
  writeWaterManagerHarvest: function( gameId, season, revenuesArray){
    for(var i=0;i<9;i++){
      if(i===0){
        WaterManager.update({game_id:gameId, "season":season},{$set:{"totalRevenuesSeason":revenuesArray[0]["total"]}});
      } else{
        WaterManager.update({game_id:gameId, "season":season, "villages.village":i},{$set:{"villages.$.harvestRevenues":revenuesArray[i]["total"]}});
      };
    };
  },
  writeGini: function( gameId, season, giniCoef){
    WaterManager.update(
      {
        game_id:gameId, "season":season
      },
      {$set:
        {
          "giniIndex":giniCoef
        }
      }
    );
  },
  //mthod called from control-weatherCards
  changeWaterManager: function( gameId, season, newWaterManager){
    WaterManager.update(
      {
        game_id:gameId, "season":season
      },
      {$set:
        {
          "villageManager": newWaterManager
        }
      }
    );
  },
  //method called from controls
  deleteGameWaterManager: function(gameId){
    WaterManager.remove({ game_id:gameId });
  },
  deleteAllWaterManager: function(){
    WaterManager.remove({});
  }
});
