import { Session } from 'meteor/session';

Template.Field.onCreated(function() {
  Session.set('yieldGraph-toggle.state', 'open'); //Added to prevent empty click
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('crops');
    self.subscribe('fields');
  });
});


Template.Field.helpers({
  
  isStageZero: function(){
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage===0){
      return true;
    };
  },
  isStageFour: function(){
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage===4){
      return true;
    };
  },
  fieldPast: function(){
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    //
    var previousStage = this.stage - 1;
    var fieldPast = Fields.findOne({field:this.field, season:this.season, stage:previousStage, game_id:gameId});
    return fieldPast;
  },
  cropNameText: function(){
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    //
    var presentAction = TimeLine.findOne({});
    if(presentAction.stage === 0 || presentAction.stage === 4){
      var previousStage = this.stage;
    } else {
      var previousStage = this.stage - 1;
    };
    var fieldPast = Fields.findOne({field:this.field, season:this.season, stage:previousStage, game_id:gameId});
    if(fieldPast.supplyCategory === "D" && fieldPast.stage !== 0 && fieldPast.crop !== 'fallow'){
      var text = "Dead";
    } else {
      var text = this.crop;
    };
    return text;
  },
  cropRice:function(){
    if(this.crop==='rice'){
      return true;
    };
  },
  cropMaize:function(){
    if(this.crop==='maize'){
      return true;
    };
  },
  cropSoybean:function(){
    if(this.crop==='soybean'){
      return true;
    };
  },
  fitToField: function(){
    if(this.supply >= 100){
      return true;
    };
  }
})

Template.Field.events({
  'click .yield-graph': function(){
    Session.set('yieldGraph-toggle.state', 'open');
    Session.set('yieldGraph-toggle.crop', this.crop);
    Session.set('yieldGraphVariable', this);
    var device_info = window.navigator.userAgent;
    if (device_info.indexOf("Safari") >= 0)
    {
      var mid = "#yieldGraph";
      $(mid).modal("show");
      $(mid).appendTo("body");
    }
    else {
      $("#yieldGraph").modal('toggle');
    }
  }
})
