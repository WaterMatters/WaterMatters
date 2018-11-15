import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

//functions
//####################################################################################
//window.scrollTo(0, 0);


// function that updates Supply Category and Yield given a new Supply
updateSupplyCat_yand_Yield = function(gameId, village, field, fef, crop, season, stage, newSupply){
        if(crop==='fallow'){}
        else {
    // Part dealing with the supply Category
              var cropObject = Crops.findOne({crop:crop});
              var fefString = "fef" + String(fef).slice(0,1) + String(fef).slice(2);
              var supplyObject = cropObject.supply[stage-1];
              var fefObject = supplyObject[fefString];
              var newSupplyCategory = "D"; // initial value of the supplyCat
              for(i=2;i>-1;i--){
                if(newSupply >= fefObject[i].water){
                  var newSupplyCategory = fefObject[i].supplyCategory;
                };
              };

    // Part dealing with the yield
              if(newSupplyCategory==="D"){
                var newYield = 0;
              }
              else{
                var previousStage = stage - 1;
                var fieldPast = Fields.findOne({season:season, village:village, field:field, stage:previousStage});
                var yieldPast = fieldPast.yield;
                if(yieldPast!==0){
                    var cropObject = Crops.findOne({crop:crop});
                    var yieldResponseObject = cropObject.yieldResponse[stage-1];
                    var yieldBeforeString = "yieldBefore" + String(yieldPast);
                    var supplyCategoryString = "supplyCategory" + newSupplyCategory; // which is the letter
                    var yieldBeforeObject = yieldResponseObject[yieldBeforeString];
                    var newYield = yieldBeforeObject[supplyCategoryString].yieldAfter;
                }else{
                    newSupplyCategory = "D";
                    var newYield = 0;
                }
              };
              //methods for collection Fields
              Meteor.call('changeSupplyCategory', gameId, village, field, season, stage, newSupplyCategory);
              Meteor.call('changeYield', gameId, village, field, season, stage, newYield);
        };
}


//Calculate the price of the crops on the Market and return an object
/////////////////////////////////////////////////////////////////////////
getLocalMarketPrices = function(areaCrops, productionArray){
  var localMarketPrices = {"maize":0, "rice":0, "soybean":0};
  var cropDocs = Crops.find({});
  cropDocs.forEach(function(cropDoc){
    var cropSellPrice = 0;
    if(cropDoc.crop !=='fallow'){
      // get special values for production and price of crops
        var sellArray = cropDoc.sell;
        var i = 0;
        var priceArray = [];
        var prodArray = [];
        var plantedAreaArray = [];
        sellArray.forEach(function(obj){
          prodArray[i] = Number(obj.production);
          priceArray[i] = Number(obj.price);
          i += 1;
        });
        var minArea = Math.min.apply(null, plantedAreaArray);
        var maxArea = Math.max.apply(null, plantedAreaArray);
        var minProd = Math.min.apply(null, prodArray);
        var maxProd = Math.max.apply(null, prodArray);
        var minPrice = Math.min.apply(null, priceArray);
        var maxPrice = Math.max.apply(null, priceArray);
      //Compute crop price (Pz/t) from production
        if(productionArray[0][cropDoc.crop] <= minProd){
          cropSellPrice = maxPrice;
        } else if(productionArray[0][cropDoc.crop] >= maxProd){
          cropSellPrice = minPrice;
        } else if(productionArray[0][cropDoc.crop] > minProd && productionArray[0][cropDoc.crop] < maxProd){
          var slope = (maxPrice-minPrice)/(minProd-maxProd);
          cropSellPrice = Math.floor(minPrice + (productionArray[0][cropDoc.crop] - maxProd) * slope);
        };
        localMarketPrices[cropDoc.crop] = cropSellPrice;
    };
  });
  return localMarketPrices;
};

//the array must be sorted ascendingly
gini = function(arrayForGini){
  //number of elements
  var n = arrayForGini.length;
  //sum of elements
  var s = 0;
  for (var i = 0; i < n; i++) {
  s += arrayForGini[i];
  };
  //sum rank by values (numerator of the operation)
  var sumNum = 0;
  i = 1;
  arrayForGini.forEach(function(value){
    var rank = i;
    sumNum += value * rank;
    i += 1;
  });
  var giniBiased = 2*sumNum/(n*s) - (1 + 1/n);
  var giniUnbiased = giniBiased * n / (n-1);
  //return the gini Coefficient
  return giniUnbiased;
};

// function used in PlayerInfo.js
nextStage = function(presentAction){
  //find which game we're playing
  var gameId = Meteor.user().profile.game_id;
  //var gameId = Meteor.users.findOne({ "status.online": true }).profile.game_id;

  function allTheStuffBeforeChangingStage(presentAction){
                          // STAGE 0 - Each Village Pay the price of their crops. The villages that didn't pay the subsistence must pay it by force
                          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          if( presentAction.stage === 0 ){
                                    //the presentAction is the subsistence action
                                    var subsistenceAction = presentAction;
                                    //go through the paidSubsistence array
                                    subsistenceAction.paidSubsistence.forEach(function(villageDoc){
                                      //if didn't pay subsistence
                                      if(villageDoc.done === false){
                                        var subsistencePrice = 12000;
                                        var villageConcerned = Villages.findOne({village:villageDoc.village});
                                        var money = villageConcerned.money;
                                        var newMoney = money-subsistencePrice;
                                        Meteor.call('changeMoney', gameId, villageDoc.village, newMoney);
                                        //Insert the money transfer into Transactions
                                        var toWhom = 'game';
                                        var quantity = subsistencePrice;
                                        var who = 'village' + villageDoc.village;
                                        var season = presentAction.season;
                                        var stage = presentAction.stage;
                                        var game_id = gameId;
                                        Meteor.call('subsistenceTransaction', toWhom, quantity, who, season, stage, game_id);
                                      // if paid the subsistence, then insert the transactions relative to each field
                                      } else {
                                        var season = presentAction.season;
                                        var stage = presentAction.stage;
                                        Meteor.call('insertTransactionsSeeds', villageDoc.village, presentAction.season, presentAction.stage, gameId);
                                      };
                                    });
                          };

                          // STAGES < 3
                          // - Rain events
                          // - Main Canal events
                          // - Water distribution
                          //- Find Events Main Canal (timing 1 = Next Stage) and play their action on the distribution + allocate
                          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          if( presentAction.stage < 3 ){
                                    // If there is a RAIN EVENT, change SUPPLY FIELDS of NEXT STAGE
                                    /////////////////////////////////////////////////////////////////////////
                                    for(var orderRain = 1; orderRain < 3; orderRain++){
                                      if(orderRain === 1){
                                            var eventRain = Events.find({game_id:gameId, season:presentAction.season, stage:presentAction.stage + 1, event:'changeRain'});
                                            eventRain.forEach(function(doc){
                                              for (var i=0;i<3;i++){
                                                var village = Number(String(doc.where)[i]);
                                                var increment = doc.modification;
                                                //method collection fields
                                                Meteor.call('incrementSupplyEventRain',gameId, village, presentAction.season, presentAction.stage + 1, increment);
                                              };
                                            });
                                      };
                                      // THEN update the supplyCategory of all the fields of next stage
                                      if(orderRain === 2){
                                        fieldDocs = Fields.find({game_id:gameId, season:presentAction.season, stage:presentAction.stage + 1});
                                        fieldDocs.forEach(function(doc){
                                          updateSupplyCat_yand_Yield(gameId, doc.village, doc.field, doc.fef, doc.crop, doc.season, doc.stage, doc.supply);
                                        });
                                      };
                                    }

                                    // Calculate the sum of losses through the canal (collection events) - timing 0 because already counted
                                    /////////////////////////////////////////////////////////////////////////
                                      var eventsMainCanalImmediate = Events.find({game_id:gameId, event:'changeMainCanal', timing:0, active:true});
                                      var sumLosses = 0;
                                      eventsMainCanalImmediate.forEach(function(event){
                                          sumLosses += event.modification;
                                      });
                                    // Get the sum of the water allocated to the villages and construct the allocationArray
                                    //////////////////////////////////////////////////////////////////////////////////////////////
                                      var waterDoc = Water.findOne({season:presentAction.season, stage:presentAction.stage + 1});
                                      allocationArray = [];
                                      var sumAllocations = 0;
                                      for(i=1;i<9;i++){
                                          allocationArray[i] = waterDoc.allocation[i-1].value;
                                          sumAllocations += waterDoc.allocation[i-1].value;
                                      };
                                    // Calculate the water left in the canal after village 8, counting already the losses
                                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                                      var waterLeftInMainCanal = waterDoc.mainCanal - sumAllocations + sumLosses;
                                    // If the water left in the canal is negative, too much water has been allocated
                                    // take out the excess by moving from village 8 to 1 until there is 0 excess.
                                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                                      var v = 8;
                                      while(waterLeftInMainCanal < 0){
                                        var difference = allocationArray[v] + waterLeftInMainCanal;
                                        if(difference <= 0){
                                          allocationArray[v] = 0;
                                          waterLeftInMainCanal = difference;
                                        } else {
                                          allocationArray[v] = difference;
                                          waterLeftInMainCanal = 0;
                                        };
                                        v -= 1;
                                      };
                                    // Play the main canal events that are active, if they are timing 1 (Next Stage)
                                    ////////////////////////////////////////////////////////////////////////////////
                                      var eventsMainCanalActive = Events.find({game_id:gameId, event:'changeMainCanal', timing:1, active:true});
                                      eventsMainCanalActive.forEach(function(event){
                                        //the village upstream of the break is one village less than the 'where'
                                        var villageUpstreamOfBreak = event.where-1;
                                        var modification = event.modification;
                                        //take out the water from the remaining water downstream of village 8
                                        waterLeftInMainCanal = waterLeftInMainCanal + modification;
                                        if(waterLeftInMainCanal >= 0){
                                          modification = 0;
                                        } else {
                                          modification = waterLeftInMainCanal;
                                          waterLeftInMainCanal = 0;
                                        };
                                        //take out the water from downstream to upstream, stopping at the value of the last village downstream of the breach
                                        for(i=8;i>villageUpstreamOfBreak;i--){
                                            var initialAllocation = allocationArray[i];
                                            allocationArray[i] = initialAllocation + modification;
                                            //the modification is transmitted upstream if it surpasses the water that was allocated to the village downstream
                                            if(allocationArray[i] >= 0){
                                              modification = 0;
                                            } else {
                                              modification = allocationArray[i];
                                              allocationArray[i] = 0;
                                            };
                                        };
                                      });
                                    // Take the last value of water left in main canal and set the waterLeftInMC
                                    /////////////////////////////////////////////////////////////////////////////
                                      //Collection Water
                                      Meteor.call('changeLeftInMC', gameId, presentAction.season, presentAction.stage + 1, waterLeftInMainCanal);
                                    // Set the water credit of the villages for the stage to come, and write it in collection Water-received
                                    ///////////////////////////////////////////////////////////////////////////
                                      for ( i=1 ; i<9 ; i++ ) {
                                        var village = i;
                                        //Collection Villages
                                        Meteor.call('changeWaterCredit', gameId, village, allocationArray[i]);
                                        //collection Water
                                        Meteor.call('changeWaterReceived', gameId, presentAction.season, presentAction.stage+1, village, allocationArray[i]);
                                      };
                          };

                          // STAGE = 3 - Annulate water credit & Get Final Production to display harvest
                          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          if ( presentAction.stage === 3 ){
                                    // Set the water credit of the villages to 0 for the stage to come
                                    ///////////////////////////////////////////////////////////////////////////
                                      for ( i=1 ; i<9 ; i++ ) {
                                        var village = i;
                                        Meteor.call('changeWaterCredit', gameId, village, 0);
                                      };
                                    // Create the arrays for storing the production datas
                                    /////////////////////////////////////////////////////
                                      var productionArray = []; //Array Production: [0] = all villages production: maize, rice and soybean; [1] = production of village 1: maize, rice and soybean; ...
                                      var revenuesArray = [];   //Array revenues: [0] = all villages revenues: total, maize, rice and soybean; [1] = revenues for village 1: total, maize, rice and soybean...
                                      var arrayForGini = [];    //Array where I put the incomes related to harvests to calculate gini index
                                      var areaCrops = {"maize":0, "rice":0, "soybean":0};
                                      for(i=0;i<9;i++){
                                        productionArray[i]={"maize":0, "rice":0, "soybean":0};
                                        revenuesArray[i]={"total":0, "maize":0, "rice":0, "soybean":0};
                                      };
                                    // Populate the production Array and the area from the fields
                                    /////////////////////////////////////////////////////////////
                                      var fields = Fields.find({season:presentAction.season, stage:presentAction.stage});
                                      fields.forEach(function(fieldDoc){
                                        if (fieldDoc.crop !== 'fallow'){
                                          //increment de production of each field to corresponding object of productionArray
                                          productionArray[0][fieldDoc.crop] += fieldDoc.yield;
                                          productionArray[fieldDoc.village][fieldDoc.crop] += fieldDoc.yield;
                                          areaCrops[fieldDoc.crop] += 10;
                                        };
                                      });
                                    // Get the local market price
                                    /////////////////////////////////////////////////////////////
                                      var localMarketPrices = getLocalMarketPrices(areaCrops, productionArray);
                                    // Populate the revenuesArray
                                    /////////////////////////////////////////////////////////////
                                      for(i=0;i<9;i++){
                                        revenuesArray[i]["maize"] = productionArray[i]["maize"] * localMarketPrices["maize"];
                                        revenuesArray[i]["rice"] = productionArray[i]["rice"] * localMarketPrices["rice"];
                                        revenuesArray[i]["soybean"] = productionArray[i]["soybean"] * localMarketPrices["soybean"];
                                        revenuesArray[i]["total"] = revenuesArray[i]["maize"] + revenuesArray[i]["rice"] + revenuesArray[i]["soybean"];
                                        if ( i !== 0 ) {
                                          arrayForGini.push(revenuesArray[i]["total"]);
                                        };
                                      };
                                    //Get the gini coefficient of this Season for the Harvest Revenues
                                    //////////////////////////////////////////////////////////////////
                                      arrayForGini = [1,0,0,0,0,0,0,0];
                                      arrayForGini.sort(function(a, b) { // sort the array in ascending order
                                      return  parseFloat(a) - parseFloat(b);
                                      });
                                      var resultGini = gini(arrayForGini);// Apply the gini function (see index.js)

                                    //Write in collections Production and Water Manager.
                                    /////////////////////////////////////////////////////
                                      Meteor.call('writeProduction', gameId, presentAction.season, areaCrops, localMarketPrices, productionArray, revenuesArray);
                                      Meteor.call('writeWaterManagerHarvest', gameId, presentAction.season, revenuesArray);
                                    //Collection Villages - Add the revenues to the Villages
                                    ///////////////////////////////////
                                      Meteor.call('addRevenuesVillagesHarvest', gameId, presentAction.season, revenuesArray);
                                    //Collection Transactions - Write the revenues of each crop into the transactions for each village
                                    ////////////////////////////////////////////////////////////////////////
                                      Meteor.call('writeTransactionsHarvest', gameId, presentAction.season, revenuesArray);
                                    //write the gini coefficient with two decimals (collection waterManager)
                                    /////////////////////////////////////////////////////////////////////////
                                      Meteor.call('writeGini', gameId, presentAction.season, resultGini.toFixed(2));
                          };
                          return 'finished';
  };
  function effectivelyChangeStage(presentAction){
    // CHANGE STAGE EVENTS - method for collection events
    //////////////////////////////////////////////////////
        Meteor.call('changeStageEvents', gameId, presentAction);

    // CHANGE STAGE - method for collection TimeLine
    ////////////////////////////////////////////////////
        if( presentAction.stage === 4 || presentAction.stage === 9999 ){
          startNewSeason(presentAction, gameId);
        } else {
          Meteor.call('changeStage', gameId, presentAction.season, presentAction.stage);
        };
  };

  // Asynchronous function to do 'allTheStuffBeforeChangingStage' before running 'effectivelyChangeStage'
  async function operationsInOrder(presentAction){
    await allTheStuffBeforeChangingStage(presentAction);
    effectivelyChangeStage(presentAction);
  };

  operationsInOrder(presentAction);

};

startNewSeason = function(presentAction, gameId){
  var season = presentAction.season;
  var newSeason = season + 1;
  var stage = presentAction.stage;
  var villages = Villages.find({});

  // Inserts related to the new season
  ////////////////////////////////////
  var weatherCardDoc = WeatherCards.findOne({season:newSeason});
  Meteor.call('insertWaterDoc', gameId, newSeason, 1, weatherCardDoc.rain1, weatherCardDoc.mainCanal1); // 1,2,3 being the stages
  Meteor.call('insertWaterDoc', gameId, newSeason, 2, weatherCardDoc.rain2, weatherCardDoc.mainCanal2);
  Meteor.call('insertWaterDoc', gameId, newSeason, 3, weatherCardDoc.rain3, weatherCardDoc.mainCanal3);


  //WeatherCards: use the rain data for the next season to fill in the fields
  var weatherCardNewSeason = WeatherCards.findOne({season:newSeason});
  var supplyArray = [0,weatherCardNewSeason.rain1,weatherCardNewSeason.rain2,weatherCardNewSeason.rain3];
  // If season = 0, take the fef value of the fields of season 0
  var fefArray = [];
  if(season === 0){
    villages.map(function(village){
            var v = village.village;
            fefArray[v] = [0,0,0,0];
            for(var f=1;f<5;f++){
              var field = Fields.findOne({village:v, season:0, field:f});
              fefArray[v][f - 1] = field.fef;
            };
    });
  // if other season, calculate the new fef to put
  } else {
    villages.map(function(village){
            var v = village.village;
            fefArray[v] = [0,0,0,0];
            for(var f=1;f<5;f++){
              var field = Fields.findOne({village:v, season:presentAction.season, stage:presentAction.stage-1, field:f});
              if(field.crop === 'fallow'){
                //Add 0,1 unit of FEF if the field was left fallow
                fefArray[v][f - 1] = Math.round(10*(field.fef + 0.1))/10;
              } else {
                if(field.fef !== 0.2){
                    //Take out 0,1 unit of FEF if the field was cultivated
                    fefArray[v][f - 1] = Math.round(10*(field.fef - 0.1))/10;
                } else {
                  fefArray[v][f - 1] = 0.2;
                };
              };
            };
    });
  };

  //Method for collection fields
  Meteor.call('insertFieldsNewSeason',gameId, newSeason, fefArray, supplyArray);


  // Insert new production document
  // Create array with all crops names
  var crops = Crops.find({});
  var cropsArray = [];
  crops.forEach(function(cropDoc){
    if(cropDoc.crop !== 'fallow'){
      cropsArray.push(cropDoc.crop);
    };
  });
  // Collection Production
  Meteor.call('insertProductionDocNewSeason',gameId, newSeason, cropsArray);

  // Modifications related to coming season
  /////////////////////////////////////////
  // Collection Villages - all crops to 'fallow'
  Meteor.call('resetCropsAllVillages', gameId);
  // Collection Villages - Write the money at the end of the past season in the Villages
  Meteor.call('writeMoneyEndAllVillages', gameId, season);
  // Collection villages - Change the water manager according to new season
  var waterManagerDocNewSeason = WaterManager.findOne({season:newSeason});
  var newWaterManager = waterManagerDocNewSeason.villageManager;
  Meteor.call('setManagerFalse', gameId, season);
  if(newWaterManager !== 0){
    Meteor.call('setManagerVillage', gameId, newWaterManager);
  };


  // Collection TimeLine
  Meteor.call('changeStage', gameId, season, stage);

  FlowRouter.go('map');
};
