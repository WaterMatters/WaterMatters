Template.Map2Field.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timeline');
    self.subscribe('villages');
    self.subscribe('fields');
  });
});


Template.Map2Field.helpers({
  cropRice:function(data){
    if(data.crop==='rice'){
      return true;
    };
  },
  cropMaize:function(data){
    if(data.crop==='maize'){
      return true;
    };
  },
  cropSoybean:function(data){
    if(data.crop==='soybean'){
      return true;
    };
  }
});
