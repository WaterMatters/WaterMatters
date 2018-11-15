Template.OptionSeeds.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('crops');
    self.subscribe('timeLine');
    self.subscribe('fields');
    self.subscribe('villages');
  });
});

Template.OptionSeeds.helpers({
  crops: function(){
     return Crops.find({});
  },
  price: function(){
    var fieldDoc = Fields.findOne({season: this.season, stage: this.stage, field: this.field});
    var crop = fieldDoc.crop;
    var cropDoc = Crops.findOne({crop:crop});
    return cropDoc.buy.price;
  }
});

Template.OptionSeeds.events({
  'input select': function(event){
      var gameId = Meteor.user().profile.game_id;

      // Check price difference between old and new crop against money available
      var village = Villages.findOne({village:Number(Meteor.user().roles[1])});
      var money = village.money;
      var newCrop = event.target.value;
      var newCropDoc = Crops.findOne({crop:newCrop});
      var priceNewCrop = newCropDoc.buy.price;
      var oldCrop = this.crop;
      var oldCropDoc = Crops.findOne({crop:oldCrop});
      var priceOldCrop = oldCropDoc.buy.price;

      // if the choices exceeds the money --> do nothing and get back to old crop choice
      if(money < priceNewCrop - priceOldCrop){
            var idSelect = String("select"+this.field);
            event.target.value = oldCrop;

      // if enough money then make the changes
      } else {
            // Insert the new crop into both collection Fields and Villages
            //Method for collection Fields
            Meteor.call('changeCropSeason', gameId, this.village, this.field, this.season, newCrop);
            //Method for collection Villages
            Meteor.call('changeCropVillage', gameId, this.village, this.field, newCrop);
            var cropDB = Crops.findOne({crop:newCrop});
            var newYield = cropDB.buy.yield;
            //Method for collection Fields
            Meteor.call('changeYield', gameId, this.village, this.field, this.season, this.stage, newYield);

            //Already sets the water request when you choose another crop
            ///////////////////////////////////////////////////////////////
            for (stage=1; stage<4; stage++){
                var goodSupplyValue = 0;
                if(newCrop === "fallow"){
                  Meteor.call('changeRequest', gameId, this.village, this.field, this.season, stage, goodSupplyValue);
                } else {
                  // Set all requests of the field to the good value for the irrigation and the FEF, in order to already display
                  // the correct values in the WaterRequest form.
                  ////////////////////////////////////////////////
                  //Search the good water value in the Crops collection
                  var fefString = "fef" + String(this.fef).slice(0,1) + String(this.fef).slice(2);
                  var supplyObject = cropDB.supply[stage-1];
                  var fefObject = supplyObject[fefString];
                  fefObject.forEach(function(suppCatDoc){
                    if(suppCatDoc.supplyCategory==="G"){
                      goodSupplyValue = suppCatDoc.water;
                    };
                  });
                  //set this goodSupplyValue as the suggested request in the water request form.
                  // method for collection Fields
                  Meteor.call('changeRequest', gameId, this.village, this.field, this.season, stage, goodSupplyValue);
                };

                // For each stage I want also to change the water request for this village in the collection water.
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                var sumRequestStage = goodSupplyValue;
                var fieldChanged = this.field;
                //Sum up this to the supply values of the other 3 fields.
                var fieldDocs = Fields.find({game_id:gameId, season:this.season, stage:stage});
                fieldDocs.forEach(function(fieldDoc){
                  if( Number(fieldDoc.field) !== Number(fieldChanged) ){
                    sumRequestStage += fieldDoc.request;
                  };
                });
                //method for collection Water - put the request for the stage for the village (necessary for allocation)
                Meteor.call('ChangeWaterRequest', gameId, this.village, this.season, stage, sumRequestStage);
            };

            //Change already your money in function of the crop you chose
            /////////////////////////////////////////////////////////////
            var village = Villages.findOne({game_id:gameId, village:Number(Meteor.user().roles[1])});
            var money = village.money;
            var newMoney = money + priceOldCrop - priceNewCrop;
            //change money collection Villages
            Meteor.call('changeMoney', gameId, village.village, newMoney);
      };

  }
});
