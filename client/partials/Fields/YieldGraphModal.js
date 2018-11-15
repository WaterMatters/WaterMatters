import { Session } from 'meteor/session'

Template.YieldGraphModal.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeLine');
    self.subscribe('villages');
    self.subscribe('fields');
    self.subscribe('crops');
  });
});


Template.YieldGraphModal.helpers({
  sessionData: function(){
    var sessionData = Session.get('yieldGraphVariable');
    if(typeof sessionData !== "undefined"){
      return sessionData;
    };
  },
  boxesSupplyObject: function(){
    var sessionData = Session.get('yieldGraphVariable');
    if(typeof sessionData !== "undefined"){
      var cropDoc = Crops.findOne({
        crop:sessionData.crop
      });
      var boxesSupplyObject = {};
      cropDoc.supply.forEach(function(stageObject){
        var fefString = "fef" + String(sessionData.fef).slice(0,1) + String(sessionData.fef).slice(2);
        var fefArray = stageObject[fefString];
        boxesSupplyObject[String("stage"+stageObject.stage)] = {};
        boxesSupplyObject[String("stage"+stageObject.stage)].good = fefArray[0].water;
        boxesSupplyObject[String("stage"+stageObject.stage)].medium = fefArray[1].water;
        boxesSupplyObject[String("stage"+stageObject.stage)].poor = fefArray[2].water;
      });
      return boxesSupplyObject;
    };
  },
  stylesDotsArray: function(){
    var stylesDotsArray = {};
    var presentAction = TimeLine.findOne({});
    var sessionData = Session.get('yieldGraphVariable');
    if(typeof sessionData !== "undefined"){
      var fieldsArray = Fields.find({season:presentAction.season, field:sessionData.field});
      // put the styles of all four dots
      var i = 0;
      fieldsArray.forEach(function(fieldDoc){
        var stage = fieldDoc.stage;
        var cropObject = {};
        //if the stage of the dot it bigger than the present Stage, don't display
        if(fieldDoc.stage > presentAction.stage){
          stylesDotsArray["st"+stage] = "display:none;";
        } else {
          if(fieldDoc.crop === "maize"){
                var maize = {};
                maize.y20="18%";
                maize.y18="22%";
                maize.y17="25%";
                maize.y15="30%";
                maize.y14="33%";
                maize.y11="40%";
                maize.y2="66%";
                maize["y0"]="70.5%";
                cropObject = maize;
          };
          if(fieldDoc.crop === "rice"){
                var rice = {};
                rice.y30="18%";
                rice.y27="22%";
                rice.y22="26%";
                rice.y19="35%";
                rice.y16="40%";
                rice.y5="58.5%";
                rice.y1="66.5%";
                rice["y0"]="70.5%";
                cropObject = rice;
          };
          if(fieldDoc.crop === "soybean"){
                var soybean = {};
                soybean.y10="18%";
                soybean.y5="43%";
                soybean.y3="52%";
                soybean.y1="61.5%";
                soybean["y0"]="70.5%";
                cropObject = soybean;
          };
          var yieldField = fieldDoc.yield;
          stylesDotsArray["st"+stage] = "top:" + cropObject[String("y" + yieldField)]+ ";";

        }
        i += 1;
      });
      console.log(stylesDotsArray);
      return stylesDotsArray;
    };
  },
  topFigSupply: function(){
    var sessionData = Session.get('yieldGraphVariable');
    if(typeof sessionData !== "undefined"){
      var styleTopValue = "";
      if(sessionData.crop === "soybean"){
        styleTopValue = "top:180px;";
      } else {
        styleTopValue = "top:310px;";
      };
      return styleTopValue;
    };
  },
  boxShadow: function(){
    var sessionData = Session.get('yieldGraphVariable');
    if(typeof sessionData !== "undefined"){
      var boxShadow = {};
      if ( sessionData.stage === 1 ){
        boxShadow.stage1 = true;
        boxShadow.stage2 = false;
        boxShadow.stage3 = false;
      } else if ( sessionData.stage === 2 ){
        boxShadow.stage1 = false;
        boxShadow.stage2 = true;
        boxShadow.stage3 = false;
      } else if ( sessionData.stage === 3 ){
        boxShadow.stage1 = false;
        boxShadow.stage2 = false;
        boxShadow.stage3 = true;
      };
      return boxShadow;
    };
  }
});

Template.YieldGraphModal.events({
  'click .close-yield-graph': function(){
    Session.set('yieldGraph-toggle.state','closed');
    /*$("#yieldGraph").modal('hide');
    console.log($("#yieldGraph"));*/
  },
  'click': function(event){
    if(event.target.className === 'yield-graph-modal open'){
      Session.set('yieldGraph-toggle.state','closed');
    };
  },
});
