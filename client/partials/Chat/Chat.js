import { Channels } from '../../../imports/api/channels.js';

Template.Chat.events({
	'click .ChatBubble' : function(e){ //Create or update the "Global chat" channel
		var allids = [];
	    var allusers = Meteor.users.find({"profile.game_id" : Meteor.user().profile.game_id}).fetch();
	    var gl = Channels.findOne({"gameId" : Meteor.user().profile.game_id, "name" : "Global chat"});

	    for(var i=0; i < allusers.length ; i++)
	    {
	      allids.push(allusers[i]._id);
	    }

	    if(gl === undefined)
	    {
	      gl = Channels.insert({
	        name : "Global chat",
	        users : allids,
	        gameId : Meteor.user().profile.game_id,
	        owner : "Default"
	      });

	     var ch = Channels.findOne({"_id" : Session.get("activeRoom")});
          $("#chName").html(ch.name); 

          var tmp = '';

          for(var j=0; j<ch.users.length; j++)
          {
            var u = Meteor.users.findOne({_id : ch.users[j]});
            if(u !== undefined) {
              if(j == ch.users.length-1)
                tmp += u.profile.name;
              else
                tmp += u.profile.name + ', ';
            }
          }
          $("#chUsers").attr('title', tmp); 

	    } else {
	      Channels.update({"_id" : gl._id}, {$set: {"users" : allids}});
	    }
	    Session.set('activeRoom', gl._id); //Définition du channel sur "Global Chat"

	    return gl._id;
	}
});