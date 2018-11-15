Template.LandholdingRecord.onCreated(function() {
  // // Set the value of the visited season to 1 for the langholding record, if not yet created
  // if(typeof Session.get('documents-landhold-season') === 'undefined'){
  //   Session.set('documents-landhold-season', 1);
  // };
  var self = this;
  self.autorun(function(){
    //get the fields for this player and this season
    self.subscribe('landholdingFields', Session.get('documents-player'), Session.get('documents-landhold-season'));
  });
});

Template.LandholdingRecord.helpers({
  //This function renders an array for the visibility of the data of each stage in the table.
  //Useful beacause otherwise all the data would be visible in the table and it would be disturbing for the payer.
  visible: function(){
    var visibilityObject = {stage1:false, stage2:false, stage3:false};
    var presentAction = TimeLine.findOne({});
    if (Session.get('documents-landhold-season') === presentAction.season){
      if(presentAction.stage > 0){ visibilityObject.stage1 = true};
      if(presentAction.stage > 1){ visibilityObject.stage2 = true};
      if(presentAction.stage > 2){ visibilityObject.stage3 = true};
    } else {
      visibilityObject = {stage1:true, stage2:true, stage3:true};
    };
    return visibilityObject;
  },
  cropGrown: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 0, village:villageNumber });
    var arrayCrops = [];
    fields.forEach(function(field){
      arrayCrops[field.field - 1] = field.crop;
    });
    return arrayCrops;
  },
  fefFields: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage: 0, village:villageNumber });
    var arrayFef = [];
    fields.forEach(function(field){
      arrayFef[field.field - 1] = field.fef;
    });
    return arrayFef;
  },
  request: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    //create object request
    requestObject = {
      stage1: [],
      stage2: [],
      stage3: []
    };
    //for each stage select the four fields
    for(var i=1 ; i<4 ; i++){
      var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage:i, village:villageNumber  });
      // get for each of these four fields the requested amount of water
      fields.forEach(function(field){
        requestObject[String("stage" + i)][field.field - 1] = field.request;
      });
    };
    return requestObject;
  },
  supply: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    //create object request
    supplyObject = {
      stage1: [],
      stage2: [],
      stage3: []
    };
    //for each stage select the four fields
    for(var i=1 ; i<4 ; i++){
      var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage:i, village:villageNumber  });
      fields.forEach(function(field){
        supplyObject[String("stage" + i)][field.field - 1] = field.supply;
      });
    };
    return supplyObject;
  },
  supplyCategory: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    //create object request
    supplyCatObject = {
      stage1: [],
      stage2: [],
      stage3: []
    };
    //for each stage select the four fields
    for(var i=1 ; i<4 ; i++){
      var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage:i, village:villageNumber });
      fields.forEach(function(field){
        supplyCatObject[String("stage" + i)][field.field - 1] = field.supplyCategory;
      });
    };
    return supplyCatObject;
  },
  potentialYield: function(){
    var villageNumber = Number(Session.get('documents-player')[Session.get('documents-player').length - 1]);
    //create object request
    yieldObject = {
      stage1: [],
      stage2: [],
      stage3: []
    };
    //for each stage select the four fields
    for(var i=1 ; i<4 ; i++){
      var fields = Fields.find({ season:Session.get('documents-landhold-season'), stage:i, village:villageNumber  });
      fields.forEach(function(field){
        yieldObject[String("stage" + i)][field.field - 1] = field.yield;
      });
    };
    return yieldObject;
  },

});

Template.LandholdingRecord.events({
});
