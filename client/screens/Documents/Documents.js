Template.Documents.onCreated(function() {
  if( Meteor.user().roles[0] === 'controller'){
    if(typeof Session.get('documents-player') === 'undefined'){
          Session.set('documents-player','village1');
    };
  } else {
    Session.set('documents-player', String('village' + Meteor.user().roles[1]));
  };

  // Set the value of the visited season to 1 for the landholding record, if not yet created
  if(typeof Session.get('documents-landhold-season') === 'undefined'){
    Session.set('documents-landhold-season', 1);
  };
  //Subscribe to the timeLine
  var self = this;
  self.autorun(function(){
    self.subscribe('timeLine');
  });

  $('#iptDocPlayer').val('village2');
});

Template.Documents.helpers({
  seasons: function(){
    var presentAction = TimeLine.findOne({});
    if(typeof presentAction !== 'undefined'){
      var arraySeasons = [];
      for ( var i=1 ; i<presentAction.season + 1 ; i++){
        var selected = false;
        if (Session.get('documents-landhold-season') === i){
          selected = true;
        };
        arraySeasons.push({season:i, selected:selected});
      };
      return arraySeasons;
    };
  }
});

Template.Documents.events({
  'click .links-documents div': function(event){
    var startNamePlace = Number(String(event.target.parentNode.id).indexOf('-')) + 1;
    var selectedName = String(event.target.parentNode.id).slice(startNamePlace);
    Session.set('document-tab', selectedName);
  },
  'change .select-doc-player': function(event){
    if(Session.get('documents-player') === 'controller' && event.target.value !== 'controller' || Session.get('documents-player') !== 'controller' && event.target.value === 'controller' ){
      Session.set('document-tab', '');
    };
    Session.set('documents-player', event.target.value);
  },
  'change .select-landhold-season': function(event, template){
    Session.set('documents-landhold-season', Number(event.target.value));
  }
});
