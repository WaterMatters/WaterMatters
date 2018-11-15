Template.Trade.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('transactions');
  });
  Session.set('marketPath', '/market/trade');
});

Template.Trade.helpers({
  transactionDocs: function(){
    var playerName = '';
    if(Meteor.user().roles[0] !== 'village'){
      playerName = Meteor.user().roles[0];
    } else {
      playerName = String( Meteor.user().roles[0]+Meteor.user().roles[1] );
    };
    var allTransactions = Transactions.find({ motive:'transaction', $or : [ { who : playerName }, { toWhom : playerName } ] }, {sort: {"createdAt": -1 }});
    return allTransactions;
  }
});

Template.Trade.events({
  'click .btn-add': function(){
    Session.set('newTransaction',true);
  },
  'click .close-new-t': function(){
    Session.set('newTransaction',false);
  },
  'click .close-action':function(){
    Session.set('marketPath', '/market');
  }
});
