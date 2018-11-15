import 'select2';
import 'select2/dist/css/select2.css';

Template.HomeLayout.events({
	'click .at-signup' : function() {
		$('.formLogin').css("margin-top", "1%");
	},
	'click #at-signin' : function(){
		$('.formLogin').css("margin-top", "7%");
	}
});