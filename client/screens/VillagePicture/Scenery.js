Meteor.subscribe('userStatus');

Template.Scenery.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('water');
    self.subscribe('timeline');
    self.subscribe('events');
    self.subscribe('villages');
    self.subscribe('fields');
  });
});

Template.Scenery.helpers({
  email: function(){
    return Meteor.user().emails[0].address;
  },
  name: function(){
    if(typeof Meteor.user() !== 'undefined'){
      var name = 'name';
      if(Meteor.user().roles[0] === 'controller'){
        name = 'Controller';
      } else {
        switch( Meteor.user().roles[1])
        {
          case '1' : name = "Rivergate";
            break;
          case '2' : name = "Suncreek";
            break;
          case '3' : name = "Clearwater";
            break;
          case '4' : name = "Blueharvest";
            break;
          case '5' : name = "Starfields";
            break;
          case '6' : name = "Aquarun";
            break;
          case '7' : name = "Greenbounty";
            break;
          case '8' : name = "Moonbanks";
            break;
          default : name = 'Village ' + Meteor.user().roles[1];
            break;
        }        
      };
      return name;
    };
  },
  showRainAndCanal:function(){
    var presentAction = TimeLine.findOne({});
    if(typeof presentAction !== 'undefined'){
      if(presentAction.stage !== 0 && presentAction.stage!==4){
        return true;
      };
    };
  },
  thereIsARainEvent: function(){
    var presentAction = TimeLine.findOne({});
    var village = Meteor.user().roles[1];
    var eventRain = Events.findOne({game_id : Meteor.user().profile.game_id, season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
    var thereIsARainEvent = false;

    //console.log(eventRain);
    
    if(eventRain !== undefined && String(eventRain.where).indexOf(String(village)) !== -1 ){
      thereIsARainEvent = true;
    };
    //console.log("RESULT =" + thereIsARainEvent);

    if(!thereIsARainEvent)
    {
      var waterDoc = Water.findOne({season:presentAction.season,stage:presentAction.stage});
      if(waterDoc.rain > 0)
        thereIsARainEvent = true;
    }

    console.log(thereIsARainEvent);


    return thereIsARainEvent;
  },
  rainEvent: function(){
      var presentAction = TimeLine.findOne({});
      var village = Meteor.user().roles[1];
      var eventRain = Events.find({season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
      var rainEvent = {};
      eventRain.forEach(function(doc){
        if(String(doc.where).indexOf(String(village)) !== -1 ){
          rainEvent = doc;
        };
      });

      return rainEvent;
  },
  isARainEvent : function(){
     /*var presentAction = TimeLine.findOne({});
      var village = Meteor.user().roles[1];
      var eventRain = Events.find({season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
      var rainEvent = {};
      eventRain.forEach(function(doc){
        if(String(doc.where).indexOf(String(village)) !== -1 ){
          rainEvent = doc;
        };
      });
      //console.log(jQuery.isEmptyObject(rainEvent));
      return !jQuery.isEmptyObject(rainEvent);*/
      return true;
  },
  rain: function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    var waterDoc = Water.findOne({season:season,stage:stage});
    var rain = waterDoc.rain;
    // But you have to check for events relative to rain!
    // And increment their value if your village is concerned
    var village = Meteor.user().roles[1];
    var eventRain = Events.find({season:presentAction.season, stage:presentAction.stage, event:'changeRain'});
    eventRain.forEach(function(doc){
      if(String(doc.where).indexOf(String(village)) !== -1 ){
        rain += doc.modification;
      };
    });
    return rain;
  },
  storage: function(){
    var village = Villages.findOne({village: Number(Meteor.user().roles[1])});
    return village.storage;
  },
  fieldState : function(){
    var presentAction = TimeLine.findOne({});
    var season = presentAction.season;
    var stage = presentAction.stage;
    var village = Meteor.user().roles[1];
    var field = Fields.findOne({game_id:Meteor.user().profile.game_id, season:presentAction.season, stage:presentAction.stage});
  }
});

Template.Scenery.events({
  'mouseenter .trigger-modal':function(event){
    Session.set('info-modal', event.target.id);
  },
  'mouseleave .trigger-modal':function(){
    Session.set('info-modal', '')
  }/*,
  'click .cloud' : function(){
    var tmp = $('.cloud-panel').css("display");
    if(tmp == "none")
      $('.cloud-panel').css("display", "block");
    else
      $('.cloud-panel').css("display", "none");
  }*/
});
