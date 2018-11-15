Template.Games.onCreated(function(){
  var self = this;
  self.autorun(function() {
      self.subscribe('games');
  });
});

Template.Games.helpers({
  games: function(){
    return Games.find({}, {sort : ['name' : 'asc']});
  },
});

Template.Games.events({
  'click .reset-all-button': function(event){
    if( ! confirm("Do you want to reset the game to its original state? (this will delete all the users exept you and the predefined users)") ){
      event.preventDefault(); // ! => don't want to do this
    } else {
      // delete all data related to any game
      Meteor.call('deleteAllWater');
      Meteor.call('deleteAllTransactions');
      Meteor.call('deleteAllProduction');


      // Erase all and insert for game 'one'
      ////////////////////////////////////////

      //villages
      Meteor.call('deleteAllVillages', () => {
          Meteor.call('newGameVillages', 'one');
      });
      //fields
      Meteor.call('deleteAllFields', () => {
          Meteor.call('newGameFields', 'one');
      });
      //waterManager
      Meteor.call('deleteAllWaterManager', () => {
          Meteor.call('newGameWaterManager', "one");
      });
      //waterManager
      Meteor.call('deleteAllWeatherCards', () => {
          Meteor.call('newGameWeatherCards', "one");
      });
      //timeLine
      Meteor.call('deleteAllTimeLine', () => {
          Meteor.call('newGameTimeLine', 'one');
      });
      //game
      Meteor.call('deleteAllGame', () => {
          Meteor.call('insertGameInit');
      });
      //Transparency
      Meteor.call('deleteAllTransparency', () => {
          Meteor.call('newGameTransparency', 'one');
      });
      //Events
      Meteor.call('deleteAllEvents', () => {
          Meteor.call('newGameEvents', 'one');
      });
      //Subsistences
      Meteor.call('deleteAllSubsistences', () => {
          Meteor.call('newGameSubsistences', 'one');
      });
      //Users
      Meteor.call('deleteAllUsers', () => {
          Meteor.call('linkControllerToThisGame', 'one', Meteor.userId(), () => {
              Meteor.call('insertInitUsers');
          });
      });

      document.location.reload();
    };
  },
});
