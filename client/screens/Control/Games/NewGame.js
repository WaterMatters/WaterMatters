import { Meteor } from 'meteor/meteor';

Template.NewGame.onCreated(function(){
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('games');
  });
});

Template.NewGame.events({
  'click .ng-close' : function() {
    //Close the window NewGame
    Session.set('createNewGame',false);
  }
  /*
  'click .fa-times' : function() {
    //Close the window NewGame
    Session.set('createNewGame',false);
  }
  */
});

var hooksObject = {
  onSuccess: function(insert, result) {
    //create the timeLine of the new game
    Meteor.call('newGameTimeLine',result);
    //create the transparency document relative to this new game
    Meteor.call('newGameTransparency', result);
    //create the events for the new game
    Meteor.call('newGameEvents', result);
    //create de water manager docs for the new game
    Meteor.call('newGameWaterManager', result);
    //create the weather cards for the new game
    Meteor.call('newGameWeatherCards', result);
    // Create the 8 Villages in collection Villages
    Meteor.call('newGameVillages', result);
    // Create the Subsistence files for this game
    Meteor.call('newGameSubsistences', result);
    // Create the Fields files for the new game
    Meteor.call('newGameFields', result);

    // Closes the new game window
    Session.set('createNewGame',false);
  },
};

AutoForm.addHooks('insertGameForm', hooksObject);
