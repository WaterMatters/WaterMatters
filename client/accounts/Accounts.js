var myLogoutFunc = function() {
  Session.set('nav-toggle','closed');
  FlowRouter.go('home');
}

AccountsTemplates.configure({
    showForgotPasswordLink: true,
    enablePasswordChange: true,
    sendVerificationEmail: true,
    enforceEmailVerification: true,
    confirmPassword: true,
    showResendVerificationEmailLink: true,
    continuousValidation: true,
    privacyUrl: 'privacy',
 });

AccountsTemplates.configure({
  onLogoutHook: myLogoutFunc
});

AccountsTemplates.addFields([
  // {
  //   _id: 'firstName',
  //   type: 'text',
  //   displayName: 'First Name',
  //   required: true,
  //   re: /(?=.*[a-z])(?=.*[A-Z])/,
  //   errStr: '1 lowercase and 1 uppercase letter required'
  // },
  {
    _id: 'role',
    type: 'select',
    displayName: 'Role',
    select:[
      {
        text: 'Controller',
        value: 'controller'
      },{
        text: 'Rivergate',
        value: 'village1'
      },{
        text: 'Suncreek',
        value: 'village2'
      },{
        text: 'Clearwater',
        value: 'village3'
      },{
        text: 'Blueharvest',
        value: 'village4'
      },{
        text: 'Starfields',
        value: 'village5'
      },{
        text: 'Aquarun',
        value: 'village6'
      },{
        text: 'Greenbounty',
        value: 'village7'
      },{
        text: 'Moonbanks',
        value: 'village8'
      }
    ]
  },
  {
    _id: 'gameCode',
    type: 'text',
    displayName: 'Game code',
    required: true,
    // re: /[a-z]{1}[\d]{1}[A-Z]{1}/,
    // errStr: 'not a correct game code'
  }
]);
