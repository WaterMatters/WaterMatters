import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Fields.onCreated(function(){
  var self=this;
  self.autorun(function(){
    self.subscribe('villages');
    self.subscribe('fields');
    self.subscribe('timeLine');
  });
});

Template.Fields.helpers({
  village: ()=> {
    return Villages.findOne({village:Number(Meteor.user().roles[1])});
  },
  fields: function(){
    var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
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
