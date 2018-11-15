Template.TransactionDoc.onCreated(function() {
  var self = this;
  self.autorun(function() {
  });
});


Template.TransactionDoc.helpers({
  receiver: function(){
    var playerName = '';
    if(Meteor.user().roles[0] !== 'village'){
      playerName = Meteor.user().roles[0];
    } else {
      playerName = String(Meteor.user().roles[0]+Meteor.user().roles[1]);
    };
    if(this.toWhom === playerName && this.quantity >=0 || this.who === playerName && this.quantity < 0){
      return true;
    };
  },
  season: function(){
    return String('season ' + this.season);
  },
  stage: function(){
    return String('stage ' + this.stage);
  },
  hour: function(){
    var hour =  this.createdAt.getHours();
    var minutes = this.createdAt.getMinutes();
    return String(hour + ":" + minutes);
  },
  textTransaction: function(){
    var whatText = '';
    if(this.what === 'waterCredit'){
      whatText = "water unit";
    } else if(this.what === 'money'){
      whatText = "Pz.";
    };
    // adding "s" for plural
    if(Math.abs(this.quantity) > 1 && this.what === 'waterCredit'){
      whatText += "s";
    };
    // function to change the toWHom and who values into correct text
    var formatName = function(name){
      if (name ==='controller'){
        return 'the controller';
      } else if(name.indexOf('village') !== -1){
        var numberVillage = name.match(/\d+/)[0];
        return String('village ' + numberVillage);
      };
    }
    //Get PlayerName to see if receiver or sender
    var playerName = '';
    if(Meteor.user().roles[0] !== 'village'){
      playerName = Meteor.user().roles[0];
    } else {
      playerName = String(Meteor.user().roles[0]+Meteor.user().roles[1]);
    };

    var text = '';

    //if the transaction is normal, that is to say the transaction is positive
    if(this.quantity >= 0){
      // if you are receiver
      if(this.toWhom === playerName){
        text = String('you received ' + this.quantity + ' ' + whatText + ' from ' + formatName(this.who));
      };
      // if you are sender
      if(this.who === playerName){
        text = String('you sent ' + this.quantity + ' ' + whatText + ' to ' + formatName(this.toWhom));
      };

    // in the other case you took something from a player, privilege of the controller
    } else {
      // if you are the taker (controller)
      if(this.who === playerName){
        text = String('you took ' + Math.abs(this.quantity) + ' ' + whatText + ' from ' + formatName(this.toWhom));
      };
      // if someone (the controller) took something from you
      if(this.toWhom === playerName){
        text = String(formatName(this.who) + ' took ' + Math.abs(this.quantity) + ' ' + whatText + ' from you' );
      };
    };
    var textTransaction = text.charAt(0).toUpperCase() + text.slice(1);
    return textTransaction;
  }
});
