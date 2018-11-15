Template.DocAllocVillage.onCreated(function() {
  var self = this;
  self.autorun(function(){
    self.subscribe('docAllocation', Session.get('documents-landhold-season'));
    self.subscribe('timeLine');
  });
});

Template.DocAllocVillage.helpers({
  allocationObj: function(){
    var allocation = {one:0, two:0, three:0};
    var village = this;
    var waterDocs = Water.find({season:Session.get('documents-landhold-season')}).fetch();
    allocation.one = waterDocs[0].allocation[village - 1].value;
    allocation.two = waterDocs[1].allocation[village - 1].value;
    allocation.three = waterDocs[2].allocation[village - 1].value;
    return allocation;
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
  name: function(nb){
      var name = '';
        switch(nb)
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

Template.DocAllocVillage.events({
});
