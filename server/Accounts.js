var postSignUp = function(userId,info) {
  // Assign a role to a user
      var string = info.profile.role;

      //create a condition to see idf the code of the game
      //corresponds to the code of any game
      var gamesDocs = Games.find({});
      var correspondsToGame = false;
      gamesDocs.forEach(function(doc){
        if(doc.code === info.profile.gameCode){
          correspondsToGame = true;
        };
      });

      if(correspondsToGame === true){
            //find the corresponding game
            var game = Games.findOne({code:info.profile.gameCode});
            var gameId = game._id;
            console.log(game);
            //add that id to the user
            Meteor.users.update(
              {_id:userId},
              {$set:{
                "profile.game_id":gameId,
                /*"profile.villageName":*/
              }}
            );

            // add user to role and insert the village in collection 'Villages'
            if (string.indexOf('village') !== - 1){
              var nbVillage = string.substr(string.length - 1);
              Roles.addUsersToRoles(userId, ['village',nbVillage]);
            }
            else{
              Roles.addUsersToRoles(userId, [info.profile.role,'1']);
            };
      //if the game code is not correct just remove the newly created user
      } else {
        Meteor.users.remove({ _id:userId}, function (error, result) {
         if (error) {
           console.log("Error removing user: ", error);
         } else {
           console.log("Number of users removed: " + result);
         }
       })
      };
}

AccountsTemplates.configure({
  postSignUpHook: postSignUp
});
/*
Accounts.onLogin(function(test) {
  console.log('Login complete!');
  if(test.user.profile.role == "controller") {
    gameId = test.user.profile.game_id;
    Meteor.call("setTime", gameId, function (error, result) {
        console.log("maj");
    });
  }
});
*/
