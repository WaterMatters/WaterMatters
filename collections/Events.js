import { Mongo } from 'meteor/mongo';

Events = new Mongo.Collection('events');

export default Events;

Events.allow({
  insert: function(userId) {
    return !!userId;// Insert in data base is allowed if userId exists (signed in), returns true
  },
  update: function(userId) {
    return !!userId;// Same for update data base
  },
  remove: function(userId) {
    return !!userId;// Same for update data base
  },
});

EventsSchema = new SimpleSchema({
  game_id:{
    type: String,
    label: 'game_id',
    optional: true,
  },
  active:{
    type: Boolean,
    label: 'Active',
    optional: true,
  },
  season:{
    type: Number,
    label: 'Season',
  },
  stage:{
    type: Number,
    label: 'Stage',
  },
  name:{
    type: String,
    label: 'Name',
  },
  description:{
    type: String,
    label: 'Description',
    autoform:{
      rows:3
    }
  },
  event:{
    type: String,
    label: 'Event',
  },
  modification:{
    type:Number,
    label:'Modification',
  },
  where:{
    type: Number,
    label: 'Where',
  },
  priceReparation:{
    type:Number,
    min:0,
    label:'Reparation cost',
    optional: true
  },
  participation:{
    type:Array,
    optional:true,
  },
  'participation.$':{
    type:Object,
    optional:true,
  },
  'participation.$.village':{
    type:Number,
    optional:true
  },
  'participation.$.value':{
    type:Number,
    optional:true
  },
  timing:{
    type: Number,
    label: 'Timing',
  },

});

Meteor.methods({
  newGameEvents: function(gameId){
    Events.insert({
        name : 'Local Drought', event :'changeRain', modification : -7, where : 345, season : 1, stage : 3, timing : 0, description : 'The villages in your aera got 7 units less of rain water that the others!', game_id : gameId, active : false,
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:2, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:2, stage:1, event : 'changeMainCanal', modification : -100, where : 4, priceReparation : 8000, timing : 1, name : 'Main Canal inadequate maintenance', description : 'A breach in the main canal upstream of village 4 causes a loss of 100 units of water.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:2, stage:1, event : 'changeMainCanal', modification : 160, where : 1, priceReparation : 0, timing : 0, name : 'Improved maintenance', description : 'Irrigation Department receives additional funds for maintenance work on the main canal headworks. All villages benefit by increased supply of 160 water units in the canal.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:3, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:4, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:5, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:6, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:7, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:8, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:9, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
    Events.insert({
        game_id:gameId, active:false, season:10, stage:0, event : 'changeMainCanal', modification : -100, where : 1, priceReparation : 3200, timing : 0, name : 'Main canal maintenance', description : 'Silt in the main canal has reduced the canal capacity. A sum of 3200 Pez must be collected in order to clear it. Otherwise 100 water units will be lost during each water distribution.',
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]});
  },
  setActivityEvent: function(result, activityValue){
    Events.update(
      {_id:result},
      {$set: {active: activityValue}}
    );
  },
  setGameIdEvent: function(result, gameId){
    Events.update(
      {_id:result},
      {$set: {game_id: gameId}}
    );
  },
  insertParticipation: function(result){
    Events.update(
      {_id:result},
      {$set: {
        participation: [{village:1, value:0},{village:2, value:0},{village:3, value:0},{village:4, value:0},{village:5, value:0},{village:6, value:0},{village:7, value:0},{village:8, value:0}]
      }}
    )
  },
  changeParticipationVillage: function(idEvent, village, newParticipation){
    Events.update({_id:idEvent, "participation.village":village},
    {$set:{"participation.$.value":newParticipation}}
    );
  },
  changeStageEvents: function(idString, presentAction){
    //Get active events that are bonusses and desactivate them
    var activeBonusEvents = Events.find({game_id:idString, active:true, modification:{$gte:0}});
    activeBonusEvents.forEach(function(eventDoc){
        Events.update({_id:eventDoc._id},
          {$set: {active: false}}
        );
    });
    //Get active events that are rain events and desactivate them
    var activeRainEvents = Events.find({game_id:idString, active:true, event:'changeRain'});
    activeRainEvents.forEach(function(eventDoc){
        Events.update({_id:eventDoc._id},
          {$set: {active: false}}
        );
    });
    //Get active events that are not bonuses (and not rain events) and increment their stage. Because the
    //Reparations are still needed in the watershed
    var activeEvents = Events.find({game_id:idString, active:true, event:{$ne:'changeRain'}});
    activeEvents.forEach(function(eventDoc){
      // Change the stage (and season) of the events
      if(presentAction.stage < 4){
        Events.update(
          {_id:eventDoc._id},
          {$inc:{stage:1}}
        );
      } else {
        Events.update(
          {_id:eventDoc._id},
          {
            $inc:{season:1},
            $set:{stage:0}
          });
      };
      // change the timing of the event 'next stage' (make it 'appear' for the players)
      if(eventDoc.timing === 1){
        Events.update(
          {_id:eventDoc._id},
          {
            $set:{timing:0}
          });
      };
    });
    //Get the future season and the future stage of the next stage
    var futStage = 0;
    var futSeason = 0;
    if(presentAction.stage < 4){
      futSeason = presentAction.season;
      futStage = presentAction.stage + 1;
    } else {
      futSeason = presentAction.season + 1;
      futStage = 0;
    };
    // Activate the events that correspond to this combination season-stage
    Events.update(
      {game_id:idString, season:futSeason, stage:futStage},
      {$set:{active:true}},
      {multi:true}
    );
  },
  deleteEvent: function(id) {
    Events.remove(id);
  },
  deleteGameEvents: function(idString){
    Events.remove({game_id:idString});
  },
  deleteAllEvents: function(){
    Events.remove({});
  }
});

Events.attachSchema(EventsSchema);
