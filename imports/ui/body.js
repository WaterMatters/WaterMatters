import { Template } from 'meteor/templating';
import './body.html';
import './message.js';
import { Messages } from '../api/messages.js';
import { Channels } from '../api/channels.js';
import { Notifications } from '../api/notifications.js';
import { Timer } from '../api/timer.js';

var newChannel = [];
newChannel['name'] = '';
newChannel['ids'] = [];

var btnDown = "/Chat/Chat_village_button_down.png";
var btnUp = "/Chat/Chat_village_button_up.png";



 Template.ChatBox.helpers({
	messages() {
    if(Meteor.user())
    {
      var ch = Session.get("activeRoom");
  		return Messages.find({"gameId" : Meteor.user().profile.game_id, "channel": ch});
    }
	},
  getUsers() {
    return Meteor.users.find({});
  },
  isMe(id) {
    if(id == Meteor.user()._id){
      newChannel['ids'][0] = Meteor.user()._id;
      return true;
    }

    return false;
  },
  isController: function(player){
    return(player.profile.role === 'controller');
  }
     
});

 Template.ChatBox.events({
   'submit .new-message'(event) {
     // Prevent default browser form submit
     event.preventDefault();
     // Get value from form element
     const target = event.target;
     const text = target.text.value;
     // Insert a message into the collection
     Messages.insert({
          text,
          createdAt: new Date(), // current time
          owner: String(Meteor.userId()), 
          username: String(name(Meteor.user().roles[0], Meteor.user().roles[1])),
          channel: String(Session.get('activeRoom')),
          gameId : String(Meteor.user().profile.game_id)
	     }
     );

     var exists = Notifications.findOne({"channel" : String(Session.get('activeRoom')), "gameId" : String(Meteor.user().profile.game_id)});
     if(exists)
     {
        Notifications.update(exists._id, { $set:{"createdAt" : new Date(),"saw" : [String(Meteor.user()._id)]}});
     }
     else 
     {
        Notifications.insert({
          createdAt: new Date(), // current time
          channel: String(Session.get('activeRoom')),
          gameId : String(Meteor.user().profile.game_id),
          saw : [String(Meteor.user()._id)]
       });
     }

     // Clear form
     target.text.value = '';
     // scroll to last message
     $('#ChatBox-Body').scrollTop($('.media-list').height());
	},
     'click .btn-create' : function(event, template){
        let room = Session.get('activeRoom');
        let game = Meteor.user().profile.game_id;

        Channels.insert({
          name : newChannel['name'],
          users: newChannel['ids'],
          gameId : game
        });
        
        for (var i = 0; i < newChannel['ids'].length; i++) {
          $('#'+newChannel['ids'][i]).css({"background-image" : 'url('+btnUp+')'});
        }
        
        resetNewChannel();

        $("#newChannel").css("visibility", "hidden"); //Close window new channel
     },
     'click .close-newChannel' : function(event){
      $("#newChannel").css("visibility", "hidden"); //Close window new channel
      resetNewChannel();
     },
     'focusout .iptChName' : function(event){
        newChannel['name'] = event.currentTarget.value; //Set the new channel name
     },
     'click .btn-select' : function(event) { 
        var id = event.currentTarget.id;
        if(!alreadyChoosen(id))
        {
          newChannel['ids'].push(id); //Add player to conversation
          $('#'+id).css({"background-image" : 'url('+btnDown+')'}); //Set btn down if choosen
        }
        else 
        {
          newChannel['ids'] = removeA(newChannel['ids'], id);
          $('#'+id).css({"background-image" : 'url('+btnUp+')'}); //Set btn up if not
        }

        //console.log(newChannel['ids']);
     }
 });


 Notifications.find().observe({
  added : function(doc) //Check if user is in channel. Then, check if he already saw the message
  {
    
    var ch = Channels.findOne({"_id" : doc.channel, "gameId" : Meteor.user().profile.game_id}); 
    var inChannel = false;
    var sawMsg = false;

    if(ch)
    {
      for (var i = 0; i < ch.users.length; i++) {
        if(Meteor.user()._id == ch.users[i])
          inChannel = true;
      }

      if(inChannel)
      {
        for (var i = 0; i < doc.saw.length; i++) {
          if(Meteor.user()._id == doc.saw[i])
            sawMsg = true;
        }

        if(!sawMsg)
          showNotif(ch._id, true);
        else
          showNotif(ch._id, false)
      }
      BubbleChatNotif();
    }
    
  },
  changed : function(newDoc, oldDoc)
  {
    var ch = Channels.findOne({"_id" : newDoc.channel, "gameId" : Meteor.user().profile.game_id}); 
    var inChannel = false;
    var sawMsg = false;
    if(ch)
    {
      for (var i = 0; i < ch.users.length; i++) {

        if(Meteor.user()._id == ch.users[i])
          inChannel = true;
      }

      if(inChannel)
      {
        for (var i = 0; i < newDoc.saw.length; i++) {
          if(Meteor.user()._id == newDoc.saw[i])
            sawMsg = true;
        }

        if(!sawMsg)
          showNotif(ch._id, true);
        else
          showNotif(ch._id, false);
      }
      BubbleChatNotif();
    }
  }
 });

 function BubbleChatNotif()
 {
  var notifs = Notifications.find({"gameId" : Meteor.user().profile.game_id}).fetch();
  var flag = false;
  //console.log(notifs);
  for(var i =0; i < notifs.length ; i++)
  {
    if($.inArray(String(Meteor.user()._id), notifs[i].saw) == -1)
      flag = true;
  }
  //console.log(flag);
  if(flag)
  {
    $(".CB-dot-notifs").css({"visibility" : "visible"});
  }
  else
  {
    $(".CB-dot-notifs").css({"visibility" : "hidden"});
  }
 }

 function showNotif(id, value)
 {
  if(value)
  {
    $("#n-"+id).css({"visibility" : "visible"});
  }
  else
  {
    $("#n-"+id).css({"visibility" : "hidden"});
  }
 }
 function name(fonc, id) {
     var name = '';
        switch(id)
        {
          case '1' : 
               if(fonc == "controller")
                    name+= "Controller";
               else 
                    name += "Rivergate";
            break;
          case '2' : name += "Suncreek";
            break;
          case '3' : name += "Clearwater";
            break;
          case '4' : name += "Blueharvest";
            break;
          case '5' : name += "Starfields";
            break;
          case '6' : name += "Aquarun";
            break;
          case '7' : name += "Greenbounty";
            break;
          case '8' : name += "Moonbanks";
            break;
          default : name += 'Village ?' ;
            break;
        }
     return name;
 }

//Say if id is already in newChannel's array
function alreadyChoosen(id) {
  for (var i = 0; i < newChannel['ids'].length; i++) {
    if(newChannel['ids'][i] == id)
      return true;
  }
  return false
}


//Remove an element from an array
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function resetNewChannel() {
  $('#iptChName').val("");
  newChannel['name'] = "";
  newChannel['ids'] = [];
  newChannel['ids'][0] = Meteor.user()._id;
}