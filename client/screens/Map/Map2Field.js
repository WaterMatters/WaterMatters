Template.Map2Field.onCreated(function() {
  var self = this;
  self.autorun(function() {
  });
});


Template.Map2Field.helpers({
  cropRice:function(){
    if(this.crop==='rice'){
      return true;
    };
  },
  cropMaize:function(){
    if(this.crop==='maize'){
      return true;
    };
  },
  cropSoybean:function(){
    if(this.crop==='soybean'){
      return true;
    };
  },
});
