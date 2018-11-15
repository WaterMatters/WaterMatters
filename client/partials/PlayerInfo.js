import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';


Template.PlayerInfo.onCreated(function() {
  var self = this;
    self.autorun(function() {
      self.subscribe('timeLine');
      self.subscribe('villages');
      self.subscribe('fields');
      self.subscribe('crops');
      self.subscribe('water');
      self.subscribe('waterManager');
      self.subscribe('weatherCards');
      self.subscribe('subsistences');
      self.subscribe('events');
    });
});


Template.PlayerInfo.helpers({
  infoStages: function(){
    var presentAction = TimeLine.findOne({});
    var infoStages = [];
    for (var i=0; i<5; i++){
      var stageObject = {};
      stageObject.stage = i;
      if(presentAction.stage > i){
        stageObject.status = 'past';
      } else if (presentAction.stage === i){
        stageObject.status = 'present';
      } else if (presentAction.stage === i){
        stageObject.status = 'future';
      };
      if(i === 0){
        stageObject.text = 'Start';
      } else if(i < 4){
        stageObject.text = 'Stage ' + i;
      } else if(i === 4){
        stageObject.text = 'Harvest';
      };
      infoStages.push(stageObject);
    };
    return infoStages;
  },
  toDoText: function(){
    var presentAction = TimeLine.findOne({});
    if(typeof presentAction !== 'undefined'){
      var text = "";
      if(presentAction.season === 0){
        if(Meteor.user().roles[0] === 'village'){
          text = "Waiting for the Game to begin...";
        } else {
          text = "Click on the arrow above to start the Game!";
        };
      } else if(presentAction.stage === 0){
        text = "Buy the crops for this season and plan for water for Stage " + 1;
      } else if(presentAction.stage < 3){
        text = "Irrigate your fields and plan for water for Stage " + Number(presentAction.stage + 1);
      } else if(presentAction.stage === 3){
        text = "Irrigate your fields for this final stage";
      } else if(presentAction.stage === 4){
        text = "You just sold your harvest! Check in your documents";
      };
      return text;
    };
  },
  village: () => {
    return Villages.findOne({village:Number(Meteor.user().roles[1])});
  },
  playerName: function(){
    // function to capitalize first letter
    String.prototype.capitalize = function() {return this.charAt(0).toUpperCase() + this.slice(1);}
    if (typeof Meteor.user() !== 'undefined'){
      if (Meteor.user().roles[0] === 'village'){
      return Meteor.user().roles[0].capitalize() + " " + Meteor.user().roles[1];
      } else {
      return Meteor.user().roles[0].capitalize();
      };
    };
  },
  presentAction: function(){
    var presentAction = TimeLine.findOne({});
    return presentAction;
  },
  displayCap:function(){
    if(typeof Meteor.user() !== 'undefined'){
      var display = false;
      if(Meteor.user().roles[0] === "village"){
        var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
        if(village.waterManager === true){
          display = true;
        };
      };
      return display;
    };
  },
  isController: function(){
    return(Meteor.user().roles[0] === 'controller');
  }
});


Template.PlayerInfo.events({
  'click .fa-arrow-alt-circle-right':function(){
    var presentAction = TimeLine.findOne({});
    // call the function nextStage in Index.js
    nextStage(presentAction);
  },
});
