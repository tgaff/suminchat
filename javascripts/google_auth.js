
var googleAuth = {};
// rootRef must be defined globally, first!

googleAuth.authDataCallback = function(authData) {
    self.authData = authData;
    if (!authData) {
        rootRef.authWithOAuthPopup("google", function (error) {
            console.log("Login Failed!", error);
        });
    }
    else {
        console.log("Authenticated successfully with payload:", authData);
        this.userName = this.getName(authData);
        //this.updateUserName(userName);
        this.setUserID(authData);
        this.saveUser(authData);
    }
}

/* user management */
// we would probably save a profile when we register new users on our site

googleAuth.saveUser = function(authData) {
  if (authData) {
    // save the user's profile into Firebase so we can list users,
    rootRef.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: this.getName(authData)
    });
  }
};

// find a suitable name based on the meta info given by each provider
googleAuth.getName = function(authData) {
  switch(authData.provider) {
     case 'google':
       return authData.google.displayName;
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
};
googleAuth.setUserID = function(authData) {
  this.userID = authData.uid;
};


