Meteor.subscribe('userStatus');
Meteor.subscribe('users');
Meteor.subscribe('games');
Meteor.subscribe('timer');
import { Timer } from '../../imports/api/timer.js';

var timer, tm, count, pos, gm, st; //used for timer
var timerHeight = 59;
var isReady = false;

if(Meteor.isClient)
{
  Meteor.startup(function() {
    $('body').addClass('lock-screen');
  });
}

Template.Header.helpers({
  timer : function() {
    if(Meteor.user().profile.role == "controller")
    {
      if(typeof timer == "undefined")
      {
        tm = Timer.findOne({"gameId" : Meteor.user().profile.game_id});
        gm = Games.findOne({"code" : Meteor.user().profile.gameCode});
        st = gm.seasonTime;
        //console.log(tm);
        if(typeof tm !== "undefined")
        {
          count = tm.ellapsed;
          pos = tm.needle;
        }
        else 
        {
          count = 0;
          pos = 1;
          tm = Timer.insert({"gameId" : Meteor.user().profile.game_id, "ellapsed" : count, "needle" : pos, "ready" : []});
        }

        timer = setInterval(function () {
          var nbpl = Meteor.users.find({ "status.online": true, "profile.game_id" : Meteor.user().profile.game_id }).count();
          if(nbpl > 1) //If number of players is bigger than 1 then we can apply timer
          {
            tm = Timer.findOne({"gameId" : Meteor.user().profile.game_id});
            count++;
            pos++
            if(pos >4) {
              pos = 1;
            }
          
            if(count < (st * 60)) 
            {
              var fill = (timerHeight / (st*60)) * count;
              Timer.update({"_id" : tm._id},{$set:{"ellapsed" : count, "needle" : pos, "fill" : fill}});
              
              if(tm.ready.length == nbpl-1 && nbpl > 0)
              {
                Timer.update({"_id" : tm._id},{$set:{"ellapsed" : 0, "needle" : 1, "fill" : 0, "ready" : []}});
                count = 0;
                needle = 1;
                var presentAction = TimeLine.findOne({});
                // call the function nextStage in Index.js
                nextStage(presentAction);
              }
            } 
            else 
            {
              //Passage de saison ici !
              Timer.update({"_id" : tm._id},{$set:{"ellapsed" : 0, "needle" : 1, "fill" : 0, "ready" : []}});
              
              var presentAction = TimeLine.findOne({});
              // call the function nextStage in Index.js
              nextStage(presentAction);
              
              count = 0;
              needle = 1;
            }
          }
        }, 1000);
      }
    }
  },
  email: function(){
    return Meteor.user().emails[0].address;
  },
  name: function(){
    if(typeof Meteor.user() !== 'undefined'){
      var name = 'name';
      if(Meteor.user().roles[0] === 'controller'){
        name = '- Controller' + ' - game: ' + Meteor.user().profile.gameCode;
      } else {
        //name = '- Village ' + Meteor.user().roles[1] + ' - game: ' + Meteor.user().profile.gameCode;
        name = '- ';
        switch( Meteor.user().roles[1])
        {
          case '1' : name += "Rivergate";
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
          default : name += 'Village ' + Meteor.user().roles[1];
            break;
        }
        name += ' - game: ' + Meteor.user().profile.gameCode;
      };
      return name;
    };
  }
});

Template.Header.events({
  'click .login-toggle': () => {
    Session.set('nav-toggle','open');
  },
  'click .logout': () => {
    AccountsTemplates.logout();
  },
  'click .timer-ready' : () => {
    tm = Timer.findOne({"gameId" : Meteor.user().profile.game_id});
    isReady = !isReady;
    if(isReady) {
      $('.timer-ready').attr('src', '/Menu/End_turn_button_yes.png');
      Timer.update({"_id" : tm._id},{$push:{"ready" : Meteor.user()._id}});
    } else {
      $('.timer-ready').attr('src', '/Menu/End_turn_button_no.png');
      Timer.update({"_id" : tm._id},{$pull:{"ready" : Meteor.user()._id}});
    }    
  }
});

Timer.find().observe({
  added : function(newDoc)
  {

  },
  changed : function(newDoc, oldDoc)
  {
    if(newDoc.gameId == Meteor.user().profile.game_id)
    {
      switch(newDoc.needle)
      {
        case 1 :
              $("#timerNeedle").attr('src','/Menu/Clock_needle_right.png');
            break;
        case 2 :
              $("#timerNeedle").attr('src','/Menu/Clock_needle_bottom.png');
            break;

        case 3 :
              $("#timerNeedle").attr('src','/Menu/Clock_needle_left.png');
            break;

        case 4 :
              $("#timerNeedle").attr('src','/Menu/Clock_needle_top.png');
            break;
      }

     /* var max = Games.findOne({"code" : String(Meteor.user().profile.gameCode)});
      if(typeof max !== "undefined")
      {
        var timeLeft = (max.seasonTime*60)-newDoc.ellapsed;
        $('.timeLeft').text(timeLeft+' SEC.');
      }*/

      //console.log(Meteor.user().profile.game_id);
      $("#timerEraser").css('height',newDoc.fill+'px');

      if(newDoc.ready.indexOf(Meteor.user()._id) > -1)
      {
        isReady = true;
        $('.timer-ready').attr('src', '/Menu/End_turn_button_yes.png'); //Set checkbox to true
      }  
      else
      {
        isReady = false;
        $('.timer-ready').attr('src', '/Menu/End_turn_button_no.png'); //Set checkbox to false
      }    
    }
  }
});
