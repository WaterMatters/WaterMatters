import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Template.FormTransaction.onCreated(function(){
  this.editMode = new ReactiveVar(false);
  var self = this;
  self.autorun(function() {
    self.subscribe('transactions');
    self.subscribe('villages');
  });
});

Template.FormTransaction.helpers({
  selectedTransaction: function(){
    var idTransaction = Session.get('transactionTreated');
    return Transactions.findOne({_id:idTransaction});
  },
  nameUser: function(){
    var nameUser = Meteor.user().roles[0];
    if(nameUser === "village"){
      var villageNumber = Meteor.user().roles[1];
      nameUser = String("village " + villageNumber)
    }
    return nameUser;
  },
  toWhomOptions:function(){
    var destinatairesArray = [];
    var villagesArray = [];
    for ( var i=1 ; i<9 ; i++ ){
      villagesArray.push({label:String("Village " + i), value:String("village" + i)});
    };
    var controllerArray = [];
    if(Meteor.user().roles[0]==='controller'){
      destinatairesArray = villagesArray.concat(controllerArray);
      return destinatairesArray;
    };
    if(Meteor.user().roles[0]==='village'){
      for( i=1 ; i<9 ; i++ ){
        if(i !== Number(Meteor.user().roles[1])){
          destinatairesArray.push({label:String("Village " + i), value:String("village" + i)});
        };
      };
      destinatairesArray.push({label:"Controller", value:"controller"});
      return destinatairesArray;
    };
  },
  whatOptions: function(){
    var whatArray = [];
    if(Meteor.user().roles[0]==='village'){
      var villageDoc = Villages.findOne({village:Number(Meteor.user().roles[1])});
      if(villageDoc.money > 0){
        whatArray.push({label:'Money', value:'money'});
      };
      if (villageDoc.waterCredit > 0){
        whatArray.push({label:'Water', value:'waterCredit'});
      };
    } else if(Meteor.user().roles[0] === 'controller'){
      whatArray.push({label:'Money', value:'money'});
      whatArray.push({label:'Water', value:'waterCredit'});
    };
    return whatArray;
  }
});

var hooksObject = {
  onSuccess: function(insert, result) {
    //find which game we're playing
    var gameId = Meteor.user().profile.game_id;

    //Set motive of transaction (result is the id of the transaction)
    var motive = 'transaction';
    Meteor.call('setMotiveTransaction', result, motive);
    //Set who did the transaction
    var who = "";
    if(Meteor.user().roles[0] === 'controller'){
      who = 'controller';
    } else {
      who = 'village' + Meteor.user().roles[1];
    };
    Meteor.call('setWhoTransaction', result, who);

    Session.set('newTransaction',false);
    var transactionDoc = Transactions.findOne(result);
    // Action the methods so that the transaction takes effect
    // method for collection Villages
    Meteor.call('ImplementTransactionVillages', gameId, transactionDoc);
  },
};

AutoForm.addHooks('TransactionForm', hooksObject);
