Template.ParticipationEvent.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('villages');
    self.subscribe('events');
  });
});


Template.ParticipationEvent.helpers({
  player:function(){
    if(Meteor.user().roles[0] === 'controller'){
      return 99
    }else{
      return Number(Meteor.user().roles[1]);
    };
  },
  name: function(){
      var name = '';
        switch(this.village)
        {
          case 1 : name = "Rivergate";
            break;
          case 2 : name = "Suncreek";
            break;
          case 3 : name = "Clearwater";
            break;
          case 4 : name = "Blueharvest";
            break;
          case 5 : name = "Starfields";
            break;
          case 6 : name = "Aquarun";
            break;
          case 7 : name = "Greenbounty";
            break;
          case 8 : name = "Moonbanks";
            break;
          default : name = 'Village ' + this.village;
            break;
        }
      return name;
    }
});


Template.ParticipationEvent.events({
    'input input':function(event){
      //find which game we're playing
      var gameId = Meteor.user().profile.game_id;
      //find event
      var cardId = Session.get('event-opened-id');
      var eventInPlay = Events.findOne({_id:cardId});
      var village = Villages.findOne({village:Number(Meteor.user().roles[1])});

      // calculate total before new participation
      var total = 0;
      eventInPlay.participation.forEach(function(villageParticipation){
        total += villageParticipation.value;
      });
      //calculate total after newParticipation
      total = total - this.value + Number(event.target.value);//notaBene: this.value is the old participation
      //Creating variable newParticipation
      var newParticipation = 0;

      // If the total collected is bigger than the price of price needed to repair
      // And if the player raised his participation
      // Then adjust his participation to the value that meets the needed amount
      /////////////////////////////////////////////////////////////////////////////
      if ( total >= eventInPlay.priceReparation && event.target.value > this.value) {
          newParticipation = Number(event.target.value) - (total - eventInPlay.priceReparation);
      } else {
          newParticipation = Number(event.target.value);
      };

      if(Number(event.target.value) < 0){
        newParticipation = 0;
      };

      //if the new participation is bigger than all the money of the village then set this amount as the maximum
      if( newParticipation > village.money + this.value){
        newParticipation = village.money + this.value;
      };

      //if in the end the new participation is under 0 set it to 0
      if( newParticipation < 0){
        newParticipation = 0;
      };


      // if after all that there is a change in the actual paticipation of the village
      ////////////////////////////////////////////////////////////////////////////////
      if(newParticipation !== this.value){
          //participation change
          var changeMoney = Number(this.value) - Number(newParticipation);
          var newMoney = Number(village.money) + Number(changeMoney);

          //change the credit accordingly
          //method for collection 'villages'
          Meteor.call('changeMoney',gameId, village.village, newMoney);

          //change the participation into the event in play
          Meteor.call('changeParticipationVillage', cardId, this.village, newParticipation);
      };

      //set value to the element
      event.target.value = newParticipation;
    },

});
