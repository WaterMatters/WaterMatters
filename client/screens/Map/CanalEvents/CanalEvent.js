var tempID;

Template.CanalEvent.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('events');
  });

  tempID = Math.floor(Math.random() * 255);
});


Template.CanalEvent.helpers({
  styleWhere:function(){
    var text = '';
    var width = $(window).width();   // returns width of browser viewport
    //alert(width);
    var positions = []; //[top]-[left]
    { //Positions array
      positions[0] = [];
      positions[1] = [];
      positions[2] = [];
      positions[3] = [];
      positions[4] = [];
      positions[5] = [];
      positions[6] = [];
      positions[7] = [];
    }

    if(width>300 && width <=1280) {//Tablets
            positions[0][0] = 300; //Top
            positions[0][1] = 15; //Left
            positions[1][0] = 285;
            positions[1][1] = 100;
            positions[2][0] = 250;
            positions[2][1] = 220;
            positions[3][0] = 280;
            positions[3][1] = 310;
            positions[4][0] = 250;
            positions[4][1] = 500;
            positions[5][0] = 310;
            positions[5][1] = 610;
            positions[6][0] = 260;
            positions[6][1] = 790;
            positions[7][0] = 380;
            positions[7][1] = 850;
    }
    if (width> 1280 && width <=1600) { //Medium screens
            positions[0][0] = 335;
            positions[0][1] = 10;
            positions[1][0] = 320;
            positions[1][1] = 100;
            positions[2][0] = 270;
            positions[2][1] = 250;
            positions[3][0] = 320;
            positions[3][1] = 360;
            positions[4][0] = 280;
            positions[4][1] = 600;
            positions[5][0] = 350;
            positions[5][1] = 720;
            positions[6][0] = 290;
            positions[6][1] = 920;
            positions[7][0] = 430;
            positions[7][1] = 1020;
      }
      if (width>1600) { //Large screens
            positions[0][0] = 450;
            positions[0][1] = 20;
            positions[1][0] = 425;
            positions[1][1] = 150;
            positions[2][0] = 370;
            positions[2][1] = 330;
            positions[3][0] = 425;
            positions[3][1] = 480;
            positions[4][0] = 370;
            positions[4][1] = 750;
            positions[5][0] = 470;
            positions[5][1] = 920;
            positions[6][0] = 390;
            positions[6][1] = 1170;
            positions[7][0] = 560;
            positions[7][1] = 1270;
      }
    //alert(this.event + ' / ' + this.modification + ' / ' + this.where);
    //alert(positions[0][0]);
    if(this.event === 'changeMainCanal' && this.modification < 0){
      text = String("top:" + positions[this.where-1][0] + "px ; left:" + positions[this.where-1][1] + "px;");
        /*  if(this.where === 1){
            text = String("top:" + positions[7][0] + "px ; left:" + positions[7][1] + "px;");
          } else if(this.where === 2){
            text = String("top:285px ; left:20px;");
          } else if(this.where === 3){
            text = String("top:315px ; left:100px;");
          } else if(this.where === 4){
            text = String("top:350px ; left:200px;");
          } else if(this.where === 5){
            text = String("top:345px ; left:300px;");
          } else if(this.where === 6){
            text = String("top:325px ; left:375px;");
          } else if(this.where === 7){
            text = String("top:315px ; left:455px;");
          } else if(this.where === 8){
            text = String("top:305px ; left:552px;");
          };*/
    } else if(this.event === 'changeMainCanal' && this.modification > 0){
      text = String("top:" + positions[this.where-1][0] + "px ; left:" + positions[this.where-1][1] + "px;");
         /* if(this.where === 1){
            text = String("top:240px ; left:-5px;");
          } else if(this.where === 2){
            text = String("top:275px ; left:20px;");
          } else if(this.where === 3){
            text = String("top:305px ; left:100px;");
          } else if(this.where === 4){
            text = String("top:340px ; left:200px;");
          } else if(this.where === 5){
            text = String("top:335px ; left:300px;");
          } else if(this.where === 6){
            text = String("top:315px ; left:375px;");
          } else if(this.where === 7){
            text = String("top:305px ; left:455px;");
          } else if(this.where === 8){
            text = String("top:295px ; left:552px;");
          };*/
    } else if(this.event === 'changeSecondaryCanal'){
      text = String("top:" + positions[this.where-1][0] + "px ; left:" + positions[this.where-1][1] + "px;");
          /*if(this.where === 1){
            text = String("top:235px ; left:23px;");
          } else if(this.where === 2){
            text = String("top:350px ; left:35px;");
          } else if(this.where === 3){
            text = String("top:280px ; left:192px;");
          } else if(this.where === 4){
            text = String("top:410px ; left:220px;");
          } else if(this.where === 5){
            text = String("top:270px ; left:360px;");
          } else if(this.where === 6){
            text = String("top:360px ; left:380px;");
          } else if(this.where === 7){
            text = String("top:270px ; left:539px;");
          } else if(this.where === 8){
            text = String("top:365px ; left:560px;");
          };*/
    };
    return text;
  },
  eventModal : function(){
    var cardId = Session.get('event-opened-id');
    return Events.findOne({_id: cardId});
  },
  total:function(){
    var cardId = Session.get('event-opened-id');
    var event = Events.findOne({_id: cardId});
    var total = 0;
    event.participation.forEach(function(villageParticipation){
      total += villageParticipation.value;
    });
    return total;
  },
  btnInactive:function(){
    var response = "";
    var cardId = Session.get('event-opened-id');
    var event = Events.findOne({_id: cardId});
    var total = 0;
    event.participation.forEach(function(villageParticipation){
      total += Number(villageParticipation.value);
    });
    if( total < Number(event.priceReparation)){
      response = "btn-inactive";
    };
    return response;
  },
  isEnough:function(){
    var cardId = Session.get('event-opened-id');
    var event = Events.findOne({_id: cardId});
    var total = 0;
    event.participation.forEach(function(villageParticipation){
      total += Number(villageParticipation.value);
    });
    if( total >= Number(event.priceReparation)){
      var response = true;
    }else {
      var response = false;
    };
    return response;
  },
  player:function(){
    return Meteor.user().roles[1];
  },
  waterManager:function(){
    if(Meteor.user().roles[0] === 'village'){
      var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
      return village.waterManager;
    } else {
      return false;
    };
  },
  genID:function(){
    return tempID;
  }
});


Template.CanalEvent.events({
  'click .dot-event': function(event){
    Session.set('map-event-toggle.state','open');
    Session.set('event-opened-id', this._id);
    var device_info = window.navigator.userAgent;
    if (device_info.indexOf("Safari") >= 0)
    {
      var mid = event.target.parentNode.dataset.target;
      $(mid).modal("show");
      $(mid).appendTo("body");
    }
    
  },
  'click .close-map-event': function(){
    Session.set('map-event-toggle.state','closed');
    Session.set('event-opened-id', '');
  },
  'click': function(event){
    if(event.target.className === 'map-event-modal open'){
      Session.set('map-event-toggle.state','closed');
      Session.set('event-opened-id', '');
    };
  },
  'click .repair': function(){
      var idEvent = Session.get('event-opened-id');
      //find which game we're playing
      var gameId = Meteor.user().profile.game_id;
      // Create the transaction doc for each village for the financial records
      Meteor.call('insertTransactionsRepairEvent', gameId, idEvent);
      //method for collection "Events"
      Meteor.call('setActivityEvent', idEvent, false);

      Session.set('map-event-toggle.state','closed');
  }
});
