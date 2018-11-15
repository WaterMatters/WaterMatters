Template.WeatherDoc.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('waterManager');
  });
});

Template.WeatherDoc.helpers({
  waterManager:function(){
    return WaterManager.findOne({season:this.season});
  },
  isPresentOrSubsequentSeason: function(){
    var presentAction = TimeLine.findOne({});
    console.log(this);
    if (presentAction.season <= this.season){
      return true;
    };
  },
  isSubsequentSeason: function(){
    var presentAction = TimeLine.findOne({});
    if (presentAction.season < this.season){
      return true;
    };
  },
  isPastSeason: function(){
    var presentAction = TimeLine.findOne({});
    if (presentAction.season > this.season){
      return true;
    };
  },
  isNextSeason: function(){
    var presentAction = TimeLine.findOne({});
    if (presentAction.season === this.season-1){
      return true;
    };
  },
  isPresentSeason: function(){
    var presentAction = TimeLine.findOne({});
    if (presentAction.season === this.season){
      return true;
    };
  },
  selection: function(){
    var waterManagerDoc = WaterManager.findOne({season:this.season});
    return waterManagerDoc.villageManager;
  }
});

Template.WeatherDoc.events({
  'input .st1r': function(event, template){
    var newRain = Number(template.find('.st1r').value);
    var season = this.season;
    //Method for collection WeatherCards
    Meteor.call('changeRainStage1', season, newRain);
  },
  'input .st2r': function(event, template){
    var newRain = Number(template.find('.st2r').value);
    var season = this.season;
    //Method for collection WeatherCards
    Meteor.call('changeRainStage2', season, newRain);
  },
  'input .st3r': function(event, template){
    var newRain = Number(template.find('.st3r').value);
    var season = this.season;
    //Method for collection WeatherCards
    Meteor.call('changeRainStage3', season, newRain);
  },
  'input .st1mc': function(event, template){
    var newMainCanal = Number(template.find('.st1mc').value);
    var season = this.season;
    //Method for collection WeatherCards
    Meteor.call('changeMainCanalStage1', season, newMainCanal);
  },
  'input .st2mc': function(event, template){
    var newMainCanal = Number(template.find('.st2mc').value);
    var season = this.season;
    //Method for collection WeatherCards
    Meteor.call('changeMainCanalStage2', season, newMainCanal);
  },
  'input .st3mc': function(event, template){
    var newMainCanal = Number(template.find('.st3mc').value);
    var season = this.season;
    //Method for collection WeatherCards
    Meteor.call('changeMainCanalStage3', season, newMainCanal);
  },
  'change select': function(event, template){
    var newWaterManager = Number(event.target.value);
    var gameId = Meteor.user().profile.game_id;
    var presentAction = TimeLine.findOne({});
    var season = this.season;
    //method for collection waterManager
    Meteor.call('changeWaterManager',gameId, season, newWaterManager);
    if(presentAction.season === this.season){
      Meteor.call('setManagerFalse',gameId, season, () => {
          if(newWaterManager !== 0){
            Meteor.call('setManagerVillage',gameId, newWaterManager);
          };
      });
    };
  },

});
