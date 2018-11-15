import { Mongo } from 'meteor/mongo';

Production = new Mongo.Collection('production');

export default Production;


Production.allow({
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
  // method called from StartNewSeason
  insertProductionDocNewSeason: function(gameId, season, cropsArray){
    //cropsArray is an array filled just with crop names - create array of total production
    // create array of the production per village
    var villageProdArray = [];
    for(var i=0;i<8;i++){
          villageProdArray.push({game_id:gameId, season:season , village:i+1, value:0});
    };
    //insert production documents for the new season.
    cropsArray.forEach(function(crop){
      Production.insert({game_id:gameId, "season":season, "crop":crop,
      "totalProduction":0, "totalPlantedArea":0, "totalCropRevenue":0, "localMarketPrice":0, "omcCoefficient":1, "villageProduction":villageProdArray,
      "villageRevenue":villageProdArray
      });
    });
  },
  //method called from Irrigation
  writeProduction: function(gameId, season, areaCrops, localMarketPrices, productionArray, revenuesArray){
    for(i=0;i<9;i++){
      if(i===0){
        //set the production of the crops
        Production.update(
          {"crop": "maize", game_id: String(gameId), "season": Number(season)},
          {$set:{
            "totalPlantedArea":areaCrops["maize"],
            "totalCropRevenue":revenuesArray[0]["maize"],
            "totalProduction":productionArray[0]["maize"],
            "localMarketPrice":localMarketPrices["maize"]
          }});
        Production.update(
          {"crop": "rice", game_id: String(gameId), "season": Number(season)},
          {$set:{
            "totalPlantedArea":areaCrops["rice"],
            "totalCropRevenue":revenuesArray[0]["rice"],
            "totalProduction":productionArray[0]["rice"],
            "localMarketPrice":localMarketPrices["rice"]
          }});
        Production.update(
          {"crop": "soybean", game_id: String(gameId), "season": Number(season)},
          {$set:{
            "totalPlantedArea":areaCrops["soybean"],
            "totalCropRevenue":revenuesArray[0]["soybean"],
            "totalProduction":productionArray[0]["soybean"],
            "localMarketPrice":localMarketPrices["soybean"]
          }});
        // //set the planted area
        // Production.update({"crop": "maize", game_id: String(gameId), "season": Number(season)},{$set:{"totalPlantedArea":areaCrops["maize"]}});
        // Production.update({"crop": "rice", game_id: String(gameId), "season": Number(season)},{$set:{"totalPlantedArea":areaCrops["rice"]}});
        // Production.update({"crop": "soybean", game_id: String(gameId), "season": Number(season)},{$set:{"totalPlantedArea":areaCrops["soybean"]}});
        // //set the total crop revenues
        // Production.update({"crop": "maize", game_id: String(gameId), "season": Number(season)},{$set:{"totalCropRevenue":revenuesArray[0]["maize"]}});
        // Production.update({"crop": "rice", game_id: String(gameId), "season": Number(season)},{$set:{"totalCropRevenue":revenuesArray[0]["rice"]}});
        // Production.update({"crop": "soybean", game_id: String(gameId), "season": Number(season)},{$set:{"totalCropRevenue":revenuesArray[0]["soybean"]}});
        // //set the local market price
        // Production.update({"crop": "maize", game_id: String(gameId), "season": Number(season)},{$set:{"localMarketPrice":localMarketPrices["maize"]}});
        // Production.update({"crop": "rice", game_id: String(gameId), "season": Number(season)},{$set:{"localMarketPrice":localMarketPrices["rice"]}});
        // Production.update({"crop": "soybean", game_id: String(gameId), "season": Number(season)},{$set:{"localMarketPrice":localMarketPrices["soybean"]}});
      } else{
        // set the village production
        Production.update({"crop": "maize", game_id: String(gameId), "season": Number(season), "villageProduction.village":i},
        {$set:{"villageProduction.$.value":productionArray[i]["maize"]}});
        Production.update({"crop": "rice", game_id: String(gameId), "season": Number(season), "villageProduction.village":i},
        {$set:{"villageProduction.$.value":productionArray[i]["rice"]}});
        Production.update({"crop": "soybean", game_id: String(gameId), "season": Number(season), "villageProduction.village":i},
        {$set:{"villageProduction.$.value":productionArray[i]["soybean"]}});
        // set the village revenue
        Production.update({"crop": "maize", game_id: String(gameId), "season": Number(season), "villageRevenue.village":i},
        {$set:{"villageRevenue.$.value":revenuesArray[i]["maize"]}});
        Production.update({"crop": "rice", game_id: String(gameId), "season": Number(season), "villageRevenue.village":i},
        {$set:{"villageRevenue.$.value":revenuesArray[i]["rice"]}});
        Production.update({"crop": "soybean", game_id: String(gameId), "season": Number(season), "villageRevenue.village":i},
        {$set:{"villageRevenue.$.value":revenuesArray[i]["soybean"]}});
      };
    };
  },
  //method called from Irrigation
  writeProductionCrop: function(gameId, season, villageNumber, crop, fieldProduction){
    //update the value of the village Crop Production
    Production.update(
      {game_id: String(gameId),
       "season": Number(season),
       "crop": String(crop),
       "villageProduction.village":Number(villageNumber),
      },
      {$inc:{"villageProduction.$.value":Number(fieldProduction)}}
    );
    //increment the total production of the crop.
    Production.update(
      {game_id: String(gameId),
       "season": Number(season),
       "crop": String(crop),
      },
      {$inc:{"totalProduction":Number(fieldProduction)}}
    );
    //increment the total planted area of the crop by 10ha
    Production.update(
      {game_id: String(gameId),
       "season": Number(season),
       "crop": String(crop),
      },
      {$inc:{"totalPlantedArea":10}}
    );
  },
  //method called from harvest
  setlocalMarketPrice: function(gameId, season, crop, localMarketPrice){
    Production.update(
      {game_id: gameId,
       "season": season,
       "crop": crop,
      },
      {$set:{"localMarketPrice":localMarketPrice}},
    )
  },
  //method called from harvest
  addToVillageCropRevenue: function(gameId, season, crop, villageNumber, cropRevenue){
    Production.update(
      {game_id: gameId,
       "season": season,
       "crop": crop,
       "villageRevenue.village":villageNumber
      },
      {$inc:{"villageRevenue.$.value":cropRevenue}},
    )
  },
  //method called from harvest
  addToTotalCropRevenue: function(gameId, season, crop, cropRevenue){
    Production.update(
      {game_id: gameId,
       "season": season,
       "crop": crop,
      },
      {$inc:{"totalCropRevenue":cropRevenue}},
    )
  },
  deleteGameProduction: function(gameId){
    Production.remove({ game_id:gameId });
  },
  deleteAllProduction: function(){
    Production.remove({});
  },
});
