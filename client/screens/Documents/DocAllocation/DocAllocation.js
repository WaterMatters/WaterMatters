Template.DocAllocation.onCreated(function() {
  // Set the value of the visited season to 1 for the langholding record, if not yet created
  if(typeof Session.get('documents-landhold-season') === 'undefined'){
    Session.set('documents-landhold-season', 1);
  };
  var self = this;
  self.autorun(function(){
    self.subscribe('docAllocation', Session.get('documents-landhold-season'));
    self.subscribe('timeLine');
  });
});

Template.DocAllocation.helpers({
  arrayVillages: function(){
    return [1,2,3,4,5,6,7,8];
  },
  mainCanalObj: function(){
    var mainCanal = {one:0, two:0, three:0};
    var waterDocs = Water.find({season:Session.get('documents-landhold-season')}).fetch();
    mainCanal.one = waterDocs[0].mainCanal;
    mainCanal.two = waterDocs[1].mainCanal;
    mainCanal.three = waterDocs[2].mainCanal;
    return mainCanal;
  },
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
});

Template.DocAllocation.events({
});
