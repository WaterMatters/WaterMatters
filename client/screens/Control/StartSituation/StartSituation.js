Template.StartSituation.onCreated(function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('villages');
      self.subscribe('timeLine');
  });
});

Template.StartSituation.helpers({
  villages: function(){
    return Villages.find({});
  },
  active: function(){
    var presentAction = TimeLine.findOne({});
    return(presentAction.season === 0);
  }
});

Template.StartSituation.events({

});
