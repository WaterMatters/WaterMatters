import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Transactions = new Mongo.Collection('transactions');

export default Transactions;


Transactions.allow({
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


TransactionsSchema = new SimpleSchema({
  who:{
    type: String,
    label: "Who",
    optional: true,
  },
  toWhom:{
    type: String,
    label: "To whom?"
  },
  what: {
    type: String,
    label: "What?",
  },
  quantity:{
    type: Number,
    min:function(){
      if(Meteor.user().roles[0]=== 'controller'){
        return -50000;
      } else {
        return 0;
      };
    },
    max:function(){
      if (Meteor.isClient){
        var what = AutoForm.getFieldValue("what","TransactionForm");
        if(Meteor.user().roles[0] === 'village'){
          var villageDoc = Villages.findOne({village:Number(Meteor.user().roles[1])});
          if(what === "waterCredit"){
            return villageDoc.waterCredit;
          } else if(what === "money"){
            return villageDoc.money;
          };
        } else {
          return 50000;
        }
      };
    },
    label: "How much?"
  },
  motive:{
    type: String,
    label: 'Motive',
    optional: true,
  },
  createdAt: {
        type: Date,
        label: "Created At",
        autoValue: function(){
          return new Date()
        },
        autoform:{
          type: "hidden"
        }
  },
  season: {
    type: Number,
    label: "Season",
    autoValue: function(){
        var gameId = Meteor.user().profile.game_id;
        var presentAction = TimeLine.findOne({game_id:gameId, over:false});
        return presentAction.season;
    },
    autoform:{
      type: "hidden"
    }
  },
  stage: {
    type: Number,
    label: "Stage",
    autoValue: function(){
        var gameId = Meteor.user().profile.game_id;
        var presentAction = TimeLine.findOne({game_id:gameId, over:false});
        return presentAction.stage;
    },
    autoform:{
      type: "hidden"
    }
  },
  game_id:{
        type: String,
        label: 'game_id',
        autoValue: function(){
          var gameId = Meteor.user().profile.game_id;
          return gameId;
        },
        autoform:{
          type: "hidden"
        }
  }
});


Transactions.attachSchema(TransactionsSchema);

Meteor.methods({
  subsistenceTransaction: function(toWhom, quantity, who, season, stage, game_id){
    Transactions.insert(
      {toWhom:toWhom, what:'money', quantity:quantity, who:who, createdAt:new Date(), season:season, stage:stage, game_id:game_id, motive:'subsistence'}
    )
  },
  maintenanceTransaction: function(quantity, villageNumber, season, stage, gameId){
    Transactions.insert(
      { toWhom:'game', what:'money', quantity:quantity, who:String('village'+villageNumber), createdAt:new Date(), season:season, stage:stage, game_id:gameId, motive:'maintenance' }
    )
  },
  reservoirTransaction: function(quantity, villageNumber, season, stage, gameId){
    Transactions.insert(
      { toWhom:'game', what:'money', quantity:quantity, who:String('village'+villageNumber), createdAt:new Date(), season:season, stage:stage, game_id:gameId, motive:'reservoir' }
    )
  },
  insertTransactionsSeeds: function(village, season, stage, game_id){
    var villageDoc = Villages.findOne({game_id:game_id, village:village});
    villageDoc.crops.forEach(function(field){
      if(field.crop !== 'fallow'){
        var cropDoc = Crops.findOne({crop:field.crop});
        var price = cropDoc.buy.price;
        Transactions.insert(
          {toWhom:'game', what:'money', quantity:price, who:String('village'+village), createdAt:new Date(), season:season, stage:stage, game_id:game_id, motive:String('seeds ' + field.crop)}
        )
      }
    });
  },
  insertTransactionsRepairEvent: function(gameId, idEvent){
    var gameId = Meteor.user().profile.game_id;
    var presentAction = TimeLine.findOne({game_id:gameId, over:false});
    var eventDoc = Events.findOne({_id:idEvent});
    //set motive transaction (main canal or secondary canal)
    var motive = '';
    if(eventDoc.event === 'changeMainCanal'){
      motive = 'repair main canal';
    } else if(eventDoc.event === 'changeSecondaryCanal'){
      motive = 'repair secondary canal';
    };
    //insert the transactions for each village
    eventDoc.participation.forEach(function(doc){
      if(doc.value > 0){
        Transactions.insert(
          {
            toWhom: 'game',
            what:'money',
            quantity: doc.value,
            who: String('village' + doc.village),
            createdAt:new Date(),
            season: presentAction.season,
            stage: presentAction.stage,
            game_id:gameId,
            motive: motive
          }
        )
      };
    })
  },
  writeTransactionsHarvest: function( gameId, season, revenuesArray){
    var crops = ['maize', 'rice', 'soybean'];
    for(var i=1;i<9;i++){
      crops.forEach(function(crop){
        Transactions.insert(
          {
            toWhom: String('village'+i),
            what:'money',
            quantity: revenuesArray[i][crop],
            who: 'game',
            createdAt:new Date(),
            season: season,
            stage: 4,
            game_id:gameId,
            motive: String('harvest ' + crop)
          }
        )
      });
    };
  },
  setCreatedAt: function(result){
    Transactions.update(
      {_id:result},
      {$set: {createdAt: new Date()}}
    )
  },
  setWhoTransaction: function(result, who){
    Transactions.update(
      {_id:result},
      {$set: {who: who}}
    )
  },
  setMotiveTransaction: function(result, motive){
    Transactions.update(
      {_id:result},
      {$set: {motive:motive}}
    )
  },
  deleteGameTransactions: function(gameId){
    Transactions.remove({ game_id:gameId });
  },
  deleteAllTransactions: function(){
    Transactions.remove({});
  }
});
