import { Mongo } from 'meteor/mongo';
import { Messages } from '../imports/api/messages.js';
import { Channels } from '../imports/api/channels.js';
import { Notifications } from '../imports/api/notifications.js';
import { Timer } from '../imports/api/timer.js';

Games = new Mongo.Collection('games');

export default Games;

Games.allow({
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

GamesSchema = new SimpleSchema({
  name:{
    type: String,
    label: 'Name'
  },
  code:{
    type: String,
    label: 'Access Code'
  },
  description:{
    type: String,
    label: 'Description',
  },
  createdAt: {
        type: Date,
        label: 'Created At',
        autoValue: function(){
          return new Date()
        },
        autoform:{
          type: 'hidden'
        }
  },
  seasonTime : {
    type : Number,
    label : 'seasonTime' 
  }
});

Meteor.methods({
  insertGameInit: function(){
    Games.insert({ _id : 'one', code:'oNe', name : 'initial game', description : 'game initiated when meteor refreshes', createdAt : new Date(), seasonTime : 15 });
  },
  deleteGame: function(id) {
      Games.remove(id);  
      Channels.remove({"gameId" : id});
      Notifications.remove({"gameId" : id});
      Timer.remove({"gameId" : id});
      Messages.remove({"gameId" : id});
  },
  deleteAllGame: function() {
    Games.remove({});
    Channels.remove({});
    Notifications.remove({});
    Timer.remove({});
    Messages.remove({});
  }
});

Games.attachSchema(GamesSchema);
