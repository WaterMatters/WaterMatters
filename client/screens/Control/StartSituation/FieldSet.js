Template.FieldSet.onCreated(function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('fields');
  });
});

Template.FieldSet.helpers({
});

Template.FieldSet.events({
 'input .fefInput': function(event){
   var newFEF = Number(event.target.value);
   //Method for collection fields - change the FEF in the collection for all stages
   Meteor.call('changeFEF', this.game_id, this.season, this.village, this.field, newFEF);
 }
});
