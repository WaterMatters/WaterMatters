Template.FormEvent.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    //here eventsControl and not events because we must have access to events that have no gameId yet
    self.subscribe('eventsControl');
  });
});

Template.FormEvent.helpers({
  isEventCanal: function(){
    var event = AutoForm.getFieldValue("event","EventForm");
    return (event === 'changeMainCanal' || event === 'changeSecondaryCanal');
  },
  seasonsOptions: function(){
    var optionsArray = [];
    for(var i=1;i<11;i++){
      optionsArray.push({label: String(i), value: i})
    };
    return optionsArray;
  },
  stagesOptions: function(){
    var optionsArray = [];
    var event = AutoForm.getFieldValue("event","EventForm");
    for(var i=0;i<4;i++){
      if(i === 0 && event === 'changeRain'){
      } else {
        optionsArray.push({label: String(i), value: i})
      };
    };
    return optionsArray;
  },
  eventOptions: function(){
    return [
      {label:"Change Main Canal", value:"changeMainCanal"},
      {label:"Change Secondary Canal", value:"changeSecondaryCanal"},
      {label:"Change Rain", value:"changeRain"},
    ];
  },
  whereOptions: function() {
    var optionsArray = [];
    var event = AutoForm.getFieldValue("event","EventForm");
    if(event === 'changeRain'){
      optionsArray[0]= {label: "Villages 1, 2 and 3", value: 123};
      optionsArray[1]= {label: "Villages 3, 4 and 5", value: 345};
      optionsArray[2]= {label: "Villages 6, 7 and 8", value: 678};
    } else if(event === 'changeMainCanal' || event === 'changeSecondaryCanal'){
      for(var i=1;i<9;i++){
        optionsArray[i-1]= {label: "Upstream of village " + i, value: i};
      };
    };
    return optionsArray;
  },
  timingOptions: function() {
    var eventFieldValue = AutoForm.getFieldValue("event","EventForm");
    var optionsArray = [];
    if(eventFieldValue==="changeMainCanal" || eventFieldValue==="changeSecondaryCanal"){
        var modificationFieldValue = AutoForm.getFieldValue("modification","EventForm");
        optionsArray[0] = {label: "Immediately", value: 0};
        if(modificationFieldValue < 0){
          optionsArray[1] = {label: "Next Stage", value: 1};
        };
    } else if (eventFieldValue==="changeRain"){
      optionsArray[0] = {label: "Immediately", value: 0};
    };
    return optionsArray;
  },
  eventEditDoc: function(){
    var idDoc = Session.get('eventEditId');
    return Events.findOne({_id:idDoc});
  }
});

Template.FormEvent.events({
'click .ng-close' : function() {
    //Close the window NewGame
    Session.set('eventView','normal');
  }
});

var hooksObject = {
  onSuccess: function(insert, result) {
    if( Session.get('eventView') != 'normal')
       Session.set('eventView','normal');
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;
    //find presentAction
    var presentAction = TimeLine.findOne({});
    //get eventDoc
    var event = Events.findOne({_id:result});
    //Set the activity true or false
    var activityValue = false;
    if(event.season === presentAction.season && event.stage === presentAction.stage){
      activityValue = true;
    };
    Meteor.call('setGameIdEvent', result, gameId);
    Meteor.call('setActivityEvent', result, activityValue);
    Meteor.call('insertParticipation', result);


    Session.set('eventView', 'normal');
  },
};

AutoForm.addHooks('EventForm', hooksObject);
