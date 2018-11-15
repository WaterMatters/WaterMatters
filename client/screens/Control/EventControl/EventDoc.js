Template.EventDoc.onCreated(function() {
  var self = this;
  self.autorun(function() {
  });
});

Template.EventDoc.helpers({
  eventName: function(){
    var event = this.event;
    if(event === 'changeMainCanal'){
      return {'name':'MC', 'title':'main canal'};
    } else if(event === 'changeSecondaryCanal'){
      return {'name':'sc', 'title':'secondary canal'};
    } else if(event === 'changeRain'){
      return {'name':'Rain', 'title':''};
    };
  },
  eventWhere: function(){
    var event = this.event;
    var object = {};
    if(event === 'changeMainCanal' || event === 'changeSecondaryCanal'){
      object = {'where':this.where, 'title':'Upstream of village ' + this.where};
    } else if (event === 'changeRain'){
      // String('On villages ' + String(event.where)[0] + ', ' + String(event.where)[1] + ' and ' + String(event.where)[2])
      object = {'where':this.where, 'title':String('On villages ' + String(this.where)[0] + ', ' + String(this.where)[1] + ' and ' + String(this.where)[2])};
    };
    return object;
  }
});

Template.EventDoc.events({
  'click .edit': function(){
    Session.set('eventView', 'edit');
    Session.set('eventEditId', this._id);
  },
  'click .delete':function(){
    Meteor.call('deleteEvent', this._id);
  },
});
