import { Mongo } from 'meteor/mongo';

Transparency = new Mongo.Collection('transparency');

export default Transparency;


Meteor.methods({
  //called from control
  newGameTransparency: function(id){
    Transparency.insert({
     game_id:id,
     waterManagement: false,
     lockedGates: true,
     villages:[
       {village:1, lineAlloc:false},
       {village:2, lineAlloc:false},
       {village:3, lineAlloc:false},
       {village:4, lineAlloc:false},
       {village:5, lineAlloc:false},
       {village:6, lineAlloc:false},
       {village:7, lineAlloc:false},
       {village:8, lineAlloc:false},
     ]});
  },
  toggleAllocLine: function(gameId, village, lineAlloc){
    Transparency.update(
      {game_id:gameId, "villages.village":village},
      {$set:{"villages.$.lineAlloc":!lineAlloc}}
    );
  },
  toggleWaterManagement: function(gameId, transpWaterManag){
    Transparency.update(
      {game_id:gameId},
      {$set:{waterManagement:!transpWaterManag}}
    );
  },
  toggleLockedGates: function(gameId, transpLockedGates){
    Transparency.update(
      {game_id:gameId},
      {$set:{lockedGates:!transpLockedGates}}
    );
  },
  deleteGameTransparency: function(gameId){
    Transparency.remove({ game_id:gameId });
  },
  deleteAllTransparency: function(){
    Transparency.remove({});
  }
});
