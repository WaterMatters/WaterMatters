import { Channels } from '../../../imports/api/channels.js';
import { Notifications } from '../../../imports/api/notifications.js';
Meteor.subscribe("channels");

var actualWM = [];
var uid = "";
var gid = "";

Template.UsersList.onCreated(function(){

});

Template.UsersList.helpers({
  usersOnline:function(){
      var users = Meteor.users.find({ "status.online": true, "profile.game_id" : Meteor.user().profile.game_id }).fetch();
      $.each(users, function(key, value){
        if(value.roles[0]=== "village"){
          var village = Villages.find({village : Number(value.roles[1])});
          if((typeof village !== 'undefined') && village.waterManager === true){
            actualWM['WM'] = getName(value.roles);
            actualWM['user'] = value._id;
          }
        }
        
      });
      return users;  
  },
  usersOnlineCount:function(){
   //event a count of users online too.
   return Meteor.users.find({ "status.online": true }).count();
  },
  channelsList:function(){
      return Channels.find({"users" : String(Meteor.user()._id), "gameId" : Meteor.user().profile.game_id}).map(function(doc){
        return doc
      });
  },
   name : function(id) {
     return getName(id);
  },
 id : function(roles) {
   let value = -1;
    switch(roles[1])
        {
          case '1' : 
               if(roles[0] == "controller")
                    value += 0;
               else 
                    value += 1;
            break;
          case '2' : value += 2;
            break;
          case '3' : value += 3;
            break;
          case '4' : value += 4;
            break;
          case '5' : value += 5;
            break;
          case '6' : value += 6;
            break;
          case '7' : value += 7;
            break;
          case '8' : value += 8;
            break;
          default : value += 'Village ?' ;
            break;
        }
 	return value;
 },

 createChannelPerso : function(roles)
 {
  var player = Meteor.users.findOne({"profile.game_id" : Meteor.user().profile.game_id, "roles" : roles[1]});
  var def = DefaultChannels.findOne({'gameId' : Meteor.user().profile.game_id, 'name' : getName(roles[1]), 'owner' : Meteor.user()._id, 'recipient' : player._id});

  if(!def)
  {
    def = DefaultChannels.findOne({'gameId' : Meteor.user().profile.game_id, 'name' : getName(roles[1]), 'owner' : player._id, 'recipient' : Meteor.user()._id})
    if(!def)
    {
      def = DefaultChannels.insert({
        name : getName(roles[1]),
        gameId : Meteor.user().profile.game_id,
        owner : Meteor.user()._id,
        recipient : player._id
      });
    }
  }

  return {def, roles};
 },
 isWM : function(role)
 {
    /*  console.log('passe isWM ====================');*/
    if(role[0] === "village"){
      //console.log("isWM : " +role[1]);
      var village = Villages.findOne({village:Number(role[1])});
      if(village.waterManager === true){
        return true;
      };
    };
    return false;
 },
 isWMCh : function(name)
 {
   var id = getIdFromName(name);

    var village = Villages.findOne({village:Number(id)});
    if(village && village.waterManager === true){
      return true;
    };
    return false;
 },
 userChannels : function(id, roles)
 {
    return Channels.find({"gameId" : Meteor.user().profile.game_id, users : "all"});
 },
 createChannel : function(id_user, roles)
 {
    
    let game = Meteor.user().profile.game_id;
    let aname = getName(roles);
    let ch = Channels.find({"name" : aname, "gameId" : game}).fetch();

    if(ch.length == 0)
    {
      Channels.insert({
        name : aname,
        users: ["all"],
        gameId : game,
        owner : Meteor.user()._id
      });
    }  
  },
  createGlobal : function() {
    var gl = Channels.findOne({"gameId" : Meteor.user().profile.game_id, "name" : "Global", "users" : "all"});
    console.log(gl);
    if(!gl)
    {
      gl = Channels.insert({
        name : "Global",
        users : 'all',
        gameId : Meteor.user().profile.game_id,
        owner : "Default"
      });
    }

    Session.set('activeRoom', gl._id); //Définition du channel sur "Global Chat"
    return gl._id;
  } 
});

Template.UsersList.events({
     'click .btn-users' : function(event){

     },
     'click .users-item' : function(event){
      Session.set('activeRoom', event.target.id);
     },
     'click .player-choice' : function(event){

     },
     'click .btn-chat-newChannel' : function(event){
          var val = $('#newChannel').css("visibility");
          if(val == "hidden")
          {
               $("#newChannel").css("visibility", "visible");
          }
          else
          {
               $("#newChannel").css("visibility", "hidden");
          }
     },
     'click .btn-chat-channel' : function(event){
      console.log('passe');
        var id = event.currentTarget.id;
        var query = $("#n-"+id)
        var isShown = query.is(":visible");
        if(isShown == true)
        {
          var notif = Notifications.findOne({"channel" : id, "gameId" : Meteor.user().profile.game_id});
          if(notif)
          {
            var arr = notif.saw;
            if($.inArray(String(Meteor.user()._id), arr) == -1)
              Notifications.update({"_id" : notif._id}, {$push: {"saw" : Meteor.user()._id}}); 
          }          
        }
        $('.media-list').scrollTop($('.media-list').height());
     }
});


function getName(id)
{
  var name = '';
  id[1] = String(id[1]);
        switch(id[1])
        {
          case '1' : 
               if(id[0] == "controller")
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

function getIdFromName(name)
{
  var id = -1;
    switch(name)
    {
      case 'Rivergate': id=1;
        break;
      case 'Suncreek': id=2;
        break;
      case 'Clearwater': id=3;
        break;
      case 'Blueharvest': id=4;
        break;
      case 'Starfields': id=5;
        break;
      case 'Aquarun': id=6;
        break;
      case 'Greenbounty': id=7;
        break;
      case 'Moonbanks': id=8;
        break;
      default : 
        break;
    }
    return id;
}

