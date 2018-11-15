import { Mongo } from 'meteor/mongo';

WeatherCards = new Mongo.Collection('weatherCards');

export default WeatherCards;

WeatherCards.allow({
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
  newGameWeatherCards: function(gameId){
    WeatherCards.insert({game_id:gameId, season:1, rain1:9, rain2:15, rain3:8, mainCanal1:970, mainCanal2:1420, mainCanal3:695});
    WeatherCards.insert({game_id:gameId, season:2, rain1:7, rain2:12, rain3:7, mainCanal1:755, mainCanal2:1106, mainCanal3:540});
    WeatherCards.insert({game_id:gameId, season:3, rain1:10, rain2:17, rain3:9, mainCanal1:1080, mainCanal2:1580, mainCanal3:770});
    WeatherCards.insert({game_id:gameId, season:4, rain1:12, rain2:18, rain3:10, mainCanal1:1190, mainCanal2:1738, mainCanal3:850});
    WeatherCards.insert({game_id:gameId, season:5, rain1:13, rain2:20, rain3:10, mainCanal1:1300, mainCanal2:1896, mainCanal3:925});
    WeatherCards.insert({game_id:gameId, season:6, rain1:7, rain2:10, rain3:5, mainCanal1:650, mainCanal2:948, mainCanal3:460});
    WeatherCards.insert({game_id:gameId, season:7, rain1:10, rain2:17, rain3:9, mainCanal1:1080, mainCanal2:1580, mainCanal3:770});
    WeatherCards.insert({game_id:gameId, season:8, rain1:13, rain2:20, rain3:10, mainCanal1:1300, mainCanal2:1896, mainCanal3:925});
    WeatherCards.insert({game_id:gameId, season:9, rain1:9, rain2:15, rain3:8, mainCanal1:970, mainCanal2:1420, mainCanal3:695});
    WeatherCards.insert({game_id:gameId, season:10, rain1:7, rain2:12, rain3:7, mainCanal1:755, mainCanal2:1106, mainCanal3:540});
  },
  changeRainStage1: function(season, newRain){
      WeatherCards.update({season:season},{$set:{"rain1":Number(newRain)}});
  },
  changeRainStage2: function(season, newRain){
      WeatherCards.update({season:season},{$set:{"rain2":Number(newRain)}});
  },
  changeRainStage3: function(season, newRain){
      WeatherCards.update({season:season},{$set:{"rain3":Number(newRain)}});
  },
  changeMainCanalStage1: function(season, newMainCanal){
      WeatherCards.update({season:season},{$set:{"mainCanal1":Number(newMainCanal)}});
  },
  changeMainCanalStage2: function(season, newMainCanal){
      WeatherCards.update({season:season},{$set:{"mainCanal2":Number(newMainCanal)}});
  },
  changeMainCanalStage3: function(season, newMainCanal){
      WeatherCards.update({season:season},{$set:{"mainCanal3":Number(newMainCanal)}});
  },
  deleteCard: function(id) {
    WeatherCards.remove(id);
  },
  deleteGameWeatherCards: function(gameId){
    WeatherCards.remove({ game_id:gameId });
  },
  deleteAllWeatherCards: function(){
    WeatherCards.remove({});
  }
});
