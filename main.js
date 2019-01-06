const CC_LL_II_EE_NN_TT_II_DD = '505396211486-7rr7ipgf9l86ai9q2vdaum7mnpsb49ih';
const AA_PP_II_KK_EE_YY = 'AIzaSyA7ILQmN8Z2c4bIxLw-UQcKAqVLw3RIoWc';
const SS_HH_EE_EE_TT_II_DD = '1DueNTkz7YAAWurv--t0hTmeEOtFxJOUUqPUEHCSZz24';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4",
                      "https://people.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "profile https://www.googleapis.com/auth/spreadsheets";

// https://www.googleapis.com/auth/drive.file 
// https://www.googleapis.com/auth/spreadsheets.readonly 

// Client ID and API key from the Developer Console
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart', 'table']});

// --------------------------------------------------------------

var signinButton = document.getElementById('signin_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: AA_PP_II_KK_EE_YY,
    clientId: CC_LL_II_EE_NN_TT_II_DD,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    signinButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    document.getElementById('btn_total_exp').onclick = handleBalanceClick;

  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

$.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };
  
        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));
  
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
  
        if (typeof callback === 'function') callback();
      });
  
      return this;
    },
  });

function handleAddExpense() {
    console.log("Entered into handleAddExpense()");

    console.log(document.getElementById('f_expense_date').value);
    console.log(document.getElementById('f_expense_amount').value);
    console.log(document.getElementById('f_expense_vendor').value);
    console.log(document.getElementById('f_expense_tx_type').value);
    console.log(document.getElementById('f_expense_category').value);

  
    const t_expense_date=document.getElementById('f_expense_date').value;
    const t_expense_amount=document.getElementById('f_expense_amount').value;
    const t_expense_vendor=document.getElementById('f_expense_vendor').value;
    const t_expense_tx_type=document.getElementById('f_expense_tx_type').value;
    const t_expense_category=document.getElementById('f_expense_category').value;
    
    // Perform data validation

    $(".modal-body input").val("");
    $(".modal-body select").val("");
    $('#add_expense_Modal').modal('hide');

    // To modify YYYY-MM-DD format to DD-MON-YYYY format
    objDate = new Date( Date.parse(t_expense_date));

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    console.log(objDate, objDate.toString());
    
      var values = [
        [
            objDate.getDate() + "-" + month[objDate.getMonth()] + "-" + objDate.getFullYear(), 
            
            t_expense_amount, t_expense_vendor, t_expense_tx_type, t_expense_category
        ]
      ];
      var body = {
        values: values
      };
      
      console.log(values);

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SS_HH_EE_EE_TT_II_DD,
        range: '2018-12!A2:E',
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'USER_ENTERED',
        resource: body
      } ).then(function(response) {
        console.log("sheets.append->", response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });

}


function initScreen() {
  console.log("Entered into initScreen()");

  $('#add_expense_btn').onclick = handleAddExpense;

//   document.querySelector("#f_expense_date").valueAsDate = new Date();
}

function handleBalanceClick() {
    console.log("Entered into handleBalanceClick()");
    $('#btn_total_exp').removeClass('active');
    $('#btn_total_exp').animateCss( 'rubberBand' )
//    $('#expense_details').animateCss( 'zoomOut' );
//    $('#expense_details').toggle();
 //   $('#expense_details').toggleClass('zoomIn');
//    $('#tx_type_pie_chart_div').toggleClass('zoomOut');
}

function paintUserInformation() {
    // Make an API call to the People API, and print the user's given name.
    gapi.client.people.people.get({
      'resourceName': 'people/me',
      'requestMask.includeField': 'person.names'
    }).then(function(response) {
      document.getElementById("signInName").innerHTML = response.result.names[0].displayName;
    }, function(reason) {
      console.log('Error: ' + reason.result.error.message);
    });
}

function surveyScreenDimensions() {
  var dimen = 0;

	// Computers are wide screens and mobiles are long screens, so pick the lowest possibility as that there is no scrolling.
	// This is my way of doing it a responsive screen :-)
	if (window.innerWidth > window.innerHeight) {
		dimen = window.innerHeight;
	} else {
		dimen = window.innerWidth;
	}

	// let to 80% of the available window, 100% will be like, "ON YOUR FACE!!"
	dimen = (( dimen * 85 ) / 100 );

	console.log("window.innerWidth[" + window.innerWidth 
	            + "] :: window.innerHeight[" + window.innerHeight 
	            + "] :: dimen[" + dimen + "]");

	document.getElementById("tx_type_pie_chart_div").style.width  =  dimen + 'px';
	document.getElementById("tx_type_pie_chart_div").style.height =  dimen + 'px';

}
/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  
  if (isSignedIn) {
    signinButton.style.display = 'none';
    signoutButton.style.display = 'block';
    paintUserInformation();
    surveyScreenDimensions();
    drawTxTypeChart();
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
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function drawTxTypeChart() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SS_HH_EE_EE_TT_II_DD,
      range: '2018-12!A2:E',
    }).then(function(response) {
  
      var mapTxPivot = new Map([]);
  
      var expDetailsDataTable = new google.visualization.DataTable();
      expDetailsDataTable.addColumn('string', 'Date');
      expDetailsDataTable.addColumn('number', 'Amount');
      expDetailsDataTable.addColumn('string', 'Vendor');
      expDetailsDataTable.addColumn('string', 'Tx Type');
      expDetailsDataTable.addColumn('string', 'Category');

      var range = response.result;
      if (range.values.length > 0) {
        for (i = 0; i < range.values.length; i++) {
          var row = range.values[i];
          // Print columns A and E, which correspond to indices 0 and 4.
            
          var amount = parseInt((row[1]).replace(',', ''));
          var txtype = row[3];

          expDetailsDataTable.addRow([row[0], amount, row[2], row[3], row[4]]);

          if(mapTxPivot.has(txtype)) {
            var current_amount = mapTxPivot.get(txtype);
            mapTxPivot.set(txtype, current_amount + amount)
          } else {
            mapTxPivot.set(txtype, amount)
          }
        }
  
        var chartDataTable = new google.visualization.DataTable();
          // Declare columns
          chartDataTable.addColumn('string', 'Tx Type');
          chartDataTable.addColumn('number', 'Expense');
          
          var total_exp = 0;

        mapTxPivot.forEach(function(value, key) {
          // getting all the keys of the map  
          console.log(key, mapTxPivot.get(key));
          chartDataTable.addRow([key, mapTxPivot.get(key)]);
          total_exp = total_exp + Number(mapTxPivot.get(key));
        });

        document.getElementById('btn_total_exp').innerHTML = '<i class="fas fa-rupee-sign"></i> ' + total_exp ;
        
        const chartOptions = {
          chartArea: {width: '100%', height: '85%' },
          pieHole: 0.4,
          legend: {position: 'bottom', alignment: 'center'},
          reverseCategories: true
        };
          var chart = new google.visualization.PieChart(document.getElementById('tx_type_pie_chart_div'));
          chart.draw(chartDataTable, chartOptions);
  
          var expDetailsTable = new google.visualization.Table(document.getElementById('expense_details'));
          expDetailsTable.draw(expDetailsDataTable, {showRowNumber: true, width: '90%', height: '100%'});

        } else {
          appendPre('No data found.');
        }
      }, function(response) {
        appendPre('Error: ' + response.result.error.message);
      });
}