import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Session } from 'meteor/session'

Template.Map1Village.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('timeLine');
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
});


