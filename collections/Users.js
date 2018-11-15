import { Mongo } from 'meteor/mongo';

Meteor.users.allow({
  update: function(userId) {
    return !!userId;// Same for update data base
  },
  insert: function(userId) {
    return !!userId;// Same for update data base
  },
  remove: function(userId) {
    return !!userId;// Same for update data base
  }
});

Meteor.methods({
  //Method called from init.js and Games
  insertInitUsers: function(){
    if(typeof Meteor.users.findOne({_id:'jYvfCjFrfRmSxumK5'}) === 'undefined'){ Meteor.users.insert({_id : 'jYvfCjFrfRmSxumK5', services : { password : { bcrypt : '$2a$10$zEyT/xHKfi5kxuNRwzMAXugBOJBVasQfdx7Qy1D7gbjKJDheKUE9u' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v1@g.com', verified : false } ], profile : { role : 'village1', gameCode:'oNe', game_id:'one', name : 'Rivergate' }, roles : [ 'village', '1' ]})};
    if(typeof Meteor.users.findOne({_id:'r6m6BGjiRTh6xE5Zn'}) === 'undefined'){ Meteor.users.insert({_id : 'r6m6BGjiRTh6xE5Zn', services : { password : { bcrypt : '$2a$10$u1Hq21HmUwlMvmyy.dw6aesZVnLXsxab/.OFxBQ5myrg00LmY/Vhq' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v2@g.com', verified : false } ], profile : { role : 'village2', gameCode:'oNe', game_id:'one', name : 'Suncreek' }, roles : [ 'village', '2' ]})};
    if(typeof Meteor.users.findOne({_id:'eP3R2JiafviLDqH7X'}) === 'undefined'){ Meteor.users.insert({_id : 'eP3R2JiafviLDqH7X', services : { password : { bcrypt : '$2a$10$4XqnQNQjCYUVgqC3g.Rb2uOX64OVEQfpcEDAD24Nc.iKhcJqdQOgm' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v3@g.com', verified : false } ], profile : { role : 'village3', gameCode:'oNe', game_id:'one', name : 'Clearwater' }, roles : [ 'village', '3' ]})};
    if(typeof Meteor.users.findOne({_id:'kYvfCjFrfRmSxumK5'}) === 'undefined'){ Meteor.users.insert({_id : 'kYvfCjFrfRmSxumK5', services : { password : { bcrypt : '$2a$10$zEyT/xHKfi5kxuNRwzMAXugBOJBVasQfdx7Qy1D7gbjKJDheKUE9u' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v4@g.com', verified : false } ], profile : { role : 'village4', gameCode:'oNe', game_id:'one', name : 'Blueharvest' }, roles : [ 'village', '4' ]})};
    if(typeof Meteor.users.findOne({_id:'l6m6BGjiRTh6xE5Zn'}) === 'undefined'){ Meteor.users.insert({_id : 'l6m6BGjiRTh6xE5Zn', services : { password : { bcrypt : '$2a$10$u1Hq21HmUwlMvmyy.dw6aesZVnLXsxab/.OFxBQ5myrg00LmY/Vhq' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v5@g.com', verified : false } ], profile : { role : 'village5', gameCode:'oNe', game_id:'one', name : 'Starfields' }, roles : [ 'village', '5' ]})};
    if(typeof Meteor.users.findOne({_id:'mP3R2JiafviLDqH7X'}) === 'undefined'){ Meteor.users.insert({_id : 'mP3R2JiafviLDqH7X', services : { password : { bcrypt : '$2a$10$4XqnQNQjCYUVgqC3g.Rb2uOX64OVEQfpcEDAD24Nc.iKhcJqdQOgm' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v6@g.com', verified : false } ], profile : { role : 'village6', gameCode:'oNe', game_id:'one', name : 'Aquarun' }, roles : [ 'village', '6' ]})};
    if(typeof Meteor.users.findOne({_id:'n6m6BGjiRTh6xE5Zn'}) === 'undefined'){ Meteor.users.insert({_id : 'n6m6BGjiRTh6xE5Zn', services : { password : { bcrypt : '$2a$10$u1Hq21HmUwlMvmyy.dw6aesZVnLXsxab/.OFxBQ5myrg00LmY/Vhq' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v7@g.com', verified : false } ], profile : { role : 'village7', gameCode:'oNe', game_id:'one', name : 'Greenbounty' }, roles : [ 'village', '7' ]})};
    if(typeof Meteor.users.findOne({_id:'oP3R2JiafviLDqH7X'}) === 'undefined'){ Meteor.users.insert({_id : 'oP3R2JiafviLDqH7X', services : { password : { bcrypt : '$2a$10$4XqnQNQjCYUVgqC3g.Rb2uOX64OVEQfpcEDAD24Nc.iKhcJqdQOgm' }, resume : { loginTokens : [ ] } }, emails : [ { address : 'v8@g.com', verified : false } ], profile : { role : 'village8', gameCode:'oNe', game_id:'one', name : 'Moonbanks' }, roles : [ 'village', '8' ]})};
    if(typeof Meteor.users.findOne({_id:'akdoGrGZzsiGCkDJy'}) === 'undefined'){ Meteor.users.insert({_id : 'akdoGrGZzsiGCkDJy', services : { password : { bcrypt : '$2a$10$g4rDPm5JzZzjSjWbiwrz6eoSafD7PxJBHt4jYYjh/WsS0vUxiV7CG' }, resume : { loginTokens : [ ] } }, emails : [ { address :  'c@g.com', verified : false } ], profile : { role : 'controller', gameCode:'oNe', game_id:'one', name : 'Controller' }, roles : [ 'controller', '1' ]})};
  },
  // Method called from games
  linkControllerToThisGame: function(gameId, userId){
    var game = Games.findOne({_id:gameId});
    Meteor.users.update(
      {_id:userId},
      {$set:
        {
          "profile.game_id":gameId,
          "profile.gameCode":game.code
        }
      }
    )
  },
  //called from games/game.js
  deleteGameUsers: function(gameId){
    Meteor.users.remove({ "profile.game_id":gameId });
  },
  //called from games/games.js
  deleteAllUsers: function(){
    //delete all the users except the one that clicked on 'reset all'
    Meteor.users.remove({_id: {$ne: Meteor.userId()}});
  },
});
