Meteor.subscribe('timer');
Meteor.subscribe("channels");
Meteor.subscribe("notifications");
import { Timer } from '../../imports/api/timer.js';
import { Channels } from '../../imports/api/channels.js';
import { Notifications } from '../../imports/api/notifications.js';
import 'select2';
import 'select2/dist/css/select2.css';



Template.MainLayout.events({
  // the two functions concern all inputs of the game where the player will have to write an amount manually.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // This first event says that you can only enter numbers in these inputs
  'keypress .input-manual': function(event){ // Prevent from writing anything other than numbers
        var allowedChars = '0123456789';
        function contains(stringValue, charValue) {return stringValue.indexOf(charValue) > -1;}

        var invalidKey = event.key.length === 1 && !contains(allowedChars, event.key)
                || event.key === '.' && contains(event.target.value, '.');
        invalidKey && event.preventDefault();
  },
  // You cannot paste anything into these inputs
  'paste .input-manual': function(event){ // Prevent from pasting anything
        event.preventDefault();
  },
  // prevent writing in input (for example in maintenance I want only to use the arrows)
  'keydown .input-prevented': function(event){ // Prevent from writing anything other than numbers
       event.preventDefault();
  },
  'keyup .input-prevented': function(event){ // Prevent from writing anything other than numbers
       event.preventDefault();
  },
  // When you close one of the action windows you go back to the village playerView (click on the cross)
  'click .close-action-village': function(){
    Session.set('view', 'village');
    FlowRouter.go('village-home');
  },
  'click .close-action-manager': function(){
    Session.set('view', 'map');
    FlowRouter.go('map');
  }
});

