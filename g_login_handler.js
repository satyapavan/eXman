// --------------------------------------------------------------

var signinButton = document.getElementById('signin_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  console.log("Entering into handleClientLoad");
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  console.log("Entering into initClient");

  gapi.client.init({
    apiKey: AA_PP_II_KK_EE_YY,
    clientId: CC_LL_II_EE_NN_TT_II_DD,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    console.log("initClient -> After init call ");
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    signinButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;

  }, function(error) {
    console.log("initClient -> Login Error ");
    console.log(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    console.log("Entering into updateSigninStatus ->", isSignedIn);
  
    if (isSignedIn) {
      signinButton.style.display = 'none';
      signoutButton.style.display = 'block';

      initScreen();

    } else {
      signinButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }
  
  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    console.log("Entering into handleAuthClick");
    gapi.auth2.getAuthInstance().signIn();
  }
  
  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    console.log("Entering into handleSignoutClick");
    gapi.auth2.getAuthInstance().signOut();
  }