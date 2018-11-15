import { Mongo } from 'meteor/mongo';

Villages = new Mongo.Collection('villages');

export default Villages;


Villages.allow({
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
  //called from NewGame
  newGameVillages: function(gameId){
    Villages.insert({game_id:gameId, "village" : 1, "waterManager":true, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
    Villages.insert({game_id:gameId, "village" : 2, "waterManager":false, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
    Villages.insert({game_id:gameId, "village" : 3, "waterManager":false, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
    Villages.insert({game_id:gameId, "village" : 4, "waterManager":false, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
    Villages.insert({game_id:gameId, "village" : 5, "waterManager":false, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
    Villages.insert({game_id:gameId, "village" : 6, "waterManager":false, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
    Villages.insert({game_id:gameId, "village" : 7, "waterManager":false, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
    Villages.insert({game_id:gameId, "village" : 8, "waterManager":false, "money" : 25000, "waterCredit" : 0, "storage" : { capacity : 0, value : 0 }, "crops": [], "moneyEnd":[]});
  },
  setManagerFalse: function(gameId){
    Villages.update({'game_id':gameId}, {$set:{'waterManager':false}}, {multi:true});
  },
  setManagerVillage: function(gameId, newWaterManager){
    Villages.update({'game_id':gameId, 'village':newWaterManager}, {$set:{'waterManager':true}});
  },
  changeWaterCredit: function(gameId, village, newWaterCredit){
    Villages.update(
      { game_id:gameId,
        village: Number(village)
      },
      {$set:{waterCredit:Number(newWaterCredit)}}
    );
  },
  incrementWaterCredit: function(gameId, village, newWaterCredit){
    Villages.update(
      { game_id:gameId,
        village: Number(village)
      },
      {$inc:{waterCredit:Number(newWaterCredit)}}
    );
  },
  changeStorageCapacity: function(gameId, village, newStorageCapacity){
    Villages.update(
      { game_id:gameId,
        village: Number(village),
      },
      {$set:{"storage.capacity":Number(newStorageCapacity)}}
    );
  },
  changeStorageValue: function(gameId, village, newStorageValue){
    Villages.update(
      { game_id:gameId,
        village: Number(village),
      },
      {$set:{"storage.value":Number(newStorageValue)}}
    );
  },
  changeCropVillage: function(gameId, village, field, newCrop){
    Villages.update(
      { game_id:gameId,
        village: Number(village),
        "crops.field":field
      },
      {$set:{"crops.$.crop":newCrop}}
    );
  },
  resetCropsAllVillages: function(gameId){
    var cropsArray = [{"field":1, "crop":"fallow"}, {"field":2, "crop":"fallow"}, {"field":3, "crop":"fallow"}, {"field":4, "crop":"fallow"}];
    for(var v=1;v<9;v++){
      Villages.update({game_id:gameId, village:v}, {$set:{crops:cropsArray}});
    };
  },
  writeMoneyEndAllVillages: function(gameId, season){
    for(var v=1;v<9;v++){
      var village = Villages.findOne({game_id:gameId, village:v});
      var money = village.money;
      var moneyEndObject = {
        season: season,
        value: money
      };
      Villages.update({game_id:gameId, village:v}, {$push:{moneyEnd:moneyEndObject}});
    };
  },
  addRevenuesVillagesHarvest: function( gameId, season, revenuesArray){
    for(var i=1;i<9;i++){
        Villages.update({game_id:gameId, village:i},{$inc:{money:revenuesArray[i]["total"]}});
    };
  },
  changeMoney: function(gameId, village, newMoney){
    Villages.update(
      { game_id:gameId,
        village: Number(village)
      },
      {$set:{money:Number(newMoney)}}
    );
  },
  ImplementTransactionVillages: function(gameId, transactionDoc){
    if(transactionDoc.who.indexOf('village') !== -1){
      var villageNumber = transactionDoc.who.match(/\d+/)[0];
      if(transactionDoc.what === 'waterCredit'){
        Villages.update({ game_id: gameId, village: Number(villageNumber)}, {$inc:{waterCredit:-1*transactionDoc.quantity}});
      } else if(transactionDoc.what === 'money'){
        Villages.update({ game_id: gameId, village: Number(villageNumber)}, { $inc:{ money:-1*transactionDoc.quantity} } );
      };
    };
    if(transactionDoc.toWhom.indexOf('village') !== -1){
      var villageNumber = transactionDoc.toWhom.match(/\d+/)[0];
      if(transactionDoc.what === 'waterCredit'){
        Villages.update({ game_id: gameId, village: Number(villageNumber)}, {$inc:{waterCredit:transactionDoc.quantity}});
      } else if(transactionDoc.what === 'money'){
        Villages.update({ game_id: gameId, village: Number(villageNumber)}, {$inc:{money:transactionDoc.quantity}});
      };
    };
  },
  deleteGameVillages: function(gameId){
    Villages.remove({ game_id:gameId });
  },
  deleteAllVillages: function(){
    Villages.remove({});
  },
});
