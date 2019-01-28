import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Session } from 'meteor/session'

Template.Map1Village.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('timeLine');
    self.subscribe('fields');
  });
});

Template.Map1Village.helpers({
    displayFields: function(){
      var display = false;
      //if the stage 0 is over then display all fields to everybody
      var presentAction = TimeLine.findOne({});
      if (presentAction.stage !== 0){
        display = true;
      } else {
          //if the player is a controller
          if(Meteor.user().roles[0]==='controller'){
            if (Session.get('see-map-toggle')==='opened') {
              display =  true;
            };
          //if the player is a village
          } else {
            var gameId = Meteor.user().profile.game_id;
            var player = Villages.findOne({game_id:gameId, village:Number(Meteor.user().roles[1])});
            if(player.waterManager === true || player.village === this.village){
              display =  true;
            };
          };
      };
      return display;
    },
    name: function(){
      var name = '';
        switch(this.village)
        {
          case 1 : name = "Rivergate";
            break;
          case 2 : name = "Suncreek";
            break;
          case 3 : name = "Clearwater";
            break;
          case 4 : name = "Blueharvest";
            break;
          case 5 : name = "Starfields";
            break;
          case 6 : name = "Aquarun";
            break;
          case 7 : name = "Greenbounty";
            break;
          case 8 : name = "Moonbanks";
            break;
          default : name = 'Village ' + this.village;
            break;
        }
      return name;
    },
    setLeft: function(village){
      var lLeft = 5;
      var mult = 0;
      switch(village)
      {
        case 1 : 
              mult = 0.7;
            break;
        case 2 :  
              mult = 1;
            break;
        case 3 :  
              mult = 5.7;
            break;
        case 4 :  
              mult = 6;
            break;
        case 5 :  
              mult = 10.7;
            break;
        case 6 :  
              mult = 11;
            break;
        case 7 :  
              mult = 15.7;
            break;
        case 8 :  
              mult = 16;
            break;
      }
      
      return (mult*lLeft) +'%';
    },
    setTop: function(village){

      var lTop = 5;
      var mult = 0;
      switch(village)
      {
        case 1 : 
              mult = 1;
            break;
        case 2 :  
              mult = 10;
            break;
        case 3 :  
              mult = 1;
            break;
        case 4 :  
              mult = 10;
            break;
        case 5 :  
              mult = 1;
            break;
        case 6 :  
              mult = 10;
            break;
        case 7 :  
              mult = 1;
            break;
        case 8 :  
              mult = 10;
            break;
      }

      return (mult * lTop) + '%';
    },
    waterManager: function(nb)
    {
        var village = Villages.findOne({village:Number(nb)});
        return village.waterManager;
    },
    isController : function()
    {
      if(Meteor.user().roles[0]==='controller')
        return true;

      return false;
    },
  storage: function(id){
    var village = Villages.findOne({village: Number(id)});
    if(village.storage.capacity > 0)
      return true;

    return false;
  },
  isWM : function(v)
  {
    return v.waterManager;
  },
  checkIdle : function(v)
  {
    var user = Meteor.users.findOne({"profile.game_id" : Meteor.user().profile.game_id, "profile.role" : "village"+v.village});
    var result = false;

    if(user.status.idle == false)
    {
      result = true; //Online and active
    }

    //console.log("Village " + v.village + " : " + result);
    return result;
  },
  isConnected : function(v)
  {
    var user = Meteor.users.findOne({"profile.game_id" : Meteor.user().profile.game_id, "profile.role" : "village"+v.village});
    var result = false;
    if(user !== undefined)
    {
      result = true;
    }
    return result;
  },/*
  isRegistered : function(v) {
    var result = true;
    var user = Meteor.users.findOne({"profile.game_id" : Meteor.user().profile.game_id, "profile.role" : "village"+v.village});
    console.log(user);
    if(user == undefined)
    {
      result = false;
    }
    return result;
  },*/
  villageNb : function(v){
    return v.village;
  },
  fields: function(d){
    var village = Villages.findOne({village:Number(d.village)});
    if(typeof village !== 'undefined'){
      var villageNumber = village.village;
      var presentAction = TimeLine.findOne({});
      if(typeof presentAction !== 'undefined'){
        var season = presentAction.season;
        var stage = presentAction.stage;
        if(stage < 4){
          var fields = Fields.find({village: Number(villageNumber),season:Number(season),stage:Number(stage)});
        } else {
          var fields = Fields.find({village: Number(villageNumber),season:Number(season),stage:Number(stage-1)});
        }
        return fields;
      };
    };
  }
});


