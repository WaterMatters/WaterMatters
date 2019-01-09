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
                "profile.gameCode":info.profile.gameCode,
                "profile.role":info.profile.role,
                "profile.name": GetName(info.profile.role)
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

Accounts.onCreateUser(function(options, user) {  
  user.profile = {};

  // we wait for Meteor to create the user before sending an email
  Meteor.setTimeout(function() {
    Accounts.sendVerificationEmail(user._id);
  }, 2 * 1000);

  return user; 
});

function GetName(data){
  console.log(data);
  var name = '';
  if(data != 'controller')
  {
    data = data.substr(data.length -1);
    console.log('data =' +data);
    switch(data)
    {
      case '1' : name += "Rivergate";
        break;
      case '2' : name += "Suncreek";
        break;
      case '3' : name += "Clearwater";
        break;
      case '4' : name += "Blueharvest";
        break;
      case '5' : name += "Starfields";
        break;
      case '6' : name += "Aquarun";
        break;
      case '7' : name += "Greenbounty";
        break;
      case '8' : name += "Moonbanks";
        break;
      default : name += 'Village '+ data;
        break;
    }
  } else {
    name = "Controller";
  }
  
  return name;
}
