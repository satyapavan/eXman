// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart', 'table']});

function formatDate(t_expense_date) {
  // To modify YYYY-MM-DD format to DD-MON-YYYY format
  objDate = new Date(Date.parse(t_expense_date));

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

  const temp = objDate.getDate() + "-" + month[objDate.getMonth()] + "-" + objDate.getFullYear();

  console.log("Input:" + t_expense_date + " :: Output:" + temp);
  return temp;
}

function resetModalData() {
    console.log("Entered into resetModalData");

    document.getElementById('f_expense_date').valueAsDate = new Date();
    document.getElementById('f_expense_amount').value = "";
    document.getElementById('f_expense_vendor').value = "";
    document.getElementById('f_expense_tx_type').value = 0;
    document.getElementById('f_expense_category').value = -1;
    document.getElementById('f_expense_append_or_update').value = '-1';
}

function handleExpenseForm() {
    console.log("Entered into handleExpenseForm()");

    console.log(document.getElementById('f_expense_date').value);
    console.log(document.getElementById('f_expense_amount').value);
    console.log(document.getElementById('f_expense_vendor').value);
    console.log(document.getElementById('f_expense_tx_type').value);
    console.log(document.getElementById('f_expense_category').value);    
    console.log(document.getElementById('f_expense_append_or_update').value);

    const t_expense_date=document.getElementById('f_expense_date').value;
    const t_expense_amount=document.getElementById('f_expense_amount').value;
    const t_expense_vendor=document.getElementById('f_expense_vendor').value;
    const t_expense_tx_type=ARRAY_TX_TYPE[document.getElementById('f_expense_tx_type').value];
    const t_expense_category=ARRAY_TX_CATEGORY[document.getElementById('f_expense_category').value];
    const t_expense_append_or_update=document.getElementById('f_expense_append_or_update').value;

    // Perform data validation

    $('#add_expense_Modal').modal('hide');

    inserOrUpdateCells(
        t_expense_date, 
        t_expense_amount, t_expense_vendor, 
        t_expense_tx_type, t_expense_category, 
        t_expense_append_or_update);

    // update the screen after each data update with server to make sure our records are accurate
    // TODO
}

function inserOrUpdateCells(t_expense_date, t_expense_amount, t_expense_vendor, t_expense_tx_type, t_expense_category, index) {

  console.log(t_expense_date, t_expense_amount, t_expense_vendor, t_expense_tx_type, t_expense_category, index);

  var values = [
    [
      t_expense_date,
      t_expense_amount, t_expense_vendor, t_expense_tx_type, t_expense_category
    ]
  ];
  var body = {
    values: values
  };

  console.log(values);

  if(index == -1 ) {
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SS_HH_EE_EE_TT_II_DD,
      range: deriveLatestSheetName() + '!A2:E',
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'USER_ENTERED',
      resource: body
    }).then(function (response) {
      console.log("sheets.append->", response.result);
    }, function (reason) {
      console.error('error: ' + reason.result.error.message);
    });
  } else {
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SS_HH_EE_EE_TT_II_DD,
      range: deriveLatestSheetName() + '!A' + index + ':E',
      valueInputOption: 'USER_ENTERED',
      includeValuesInResponse: false,
      resource: body
    }).then(function (response) {
      console.log("sheets.update->", response.result);
    }, function (reason) {
      console.error('error: ' + reason.result.error.message);
    });
  }
}

function initScreen() {
  console.log("Entered into initScreen()");

  paintUserInformation();
  surveyScreenDimensions();
  drawTxTypeChart();

  $('#add_expense_btn').onclick = handleExpenseForm;

  // Make our expense details button visible after the user login
  $('#div_total_exp').show();

  $('#add_expense_Modal').on('hidden.bs.modal', resetModalData);

  // same here too
  $('#add_expense').show();

  // modal operations
  $('#add_expense_Modal').on('hide.bs.modal', resetModalData());
  resetModalData();

  var varSelect = document.querySelector("#f_expense_tx_type");

  ARRAY_TX_TYPE.forEach(function(value, index) {
    var option = document.createElement("option");
    option.text = value;
    option.value = index;
    varSelect.add(option); 
  });

  varSelect = document.querySelector("#f_expense_category");

  ARRAY_TX_CATEGORY.forEach(function(value, index) {
    var option = document.createElement("option");
    option.text = value;
    option.value = index;
    varSelect.add(option); 
  });
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


function deriveLatestSheetName() {
  const objDate = new Date();

  // +1 because javascript is yuck ;-)
  const temp = objDate.getFullYear() + "-" + ('0' + String(parseInt(objDate.getMonth()) + 1) ).slice(-2) ;

  return temp;
}

function drawTxTypeChart() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SS_HH_EE_EE_TT_II_DD,
    range: deriveLatestSheetName() + '!A2:E',
  }).then(function (response) {
    var expDetailsDataTable = new google.visualization.DataTable();
    expDetailsDataTable.addColumn('string', 'Date');
    expDetailsDataTable.addColumn('number', 'Amount');
    expDetailsDataTable.addColumn('string', 'Vendor');
    expDetailsDataTable.addColumn('string', 'Tx Type');
    expDetailsDataTable.addColumn('string', 'Category');
    expDetailsDataTable.addColumn('number', 'Index');

    var total_expense = 0;

    var range = response.result;
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.

        var amount = parseInt((row[1]).replace(',', ''));
        var txtype = row[3];

        total_expense = total_expense + amount;

        // we are adding 2 because, +1 for header row and another +1 as current array is begining from 0
        expDetailsDataTable.addRow([row[0], amount, row[2], row[3], row[4], i + 2]);
      }

      var chartDataTable = google.visualization.data.group(expDetailsDataTable, [4],
        [{ 'column': 1, 'aggregation': google.visualization.data.sum, 'type': 'number' }]);

      document.getElementById('btn_total_exp').innerHTML = '<i class="fas fa-rupee-sign"></i> ' + total_expense;

      const chartOptions = {
        chartArea: { width: '100%', height: '85%' },
        // pieHole: 0.4,
        is3D: true,
        legend: { position: 'bottom', alignment: 'center'},
        reverseCategories: true
      };

      ///////////////////////////////////////////////////////////////////////////////////////////
      var chart = new google.visualization.PieChart(document.getElementById('tx_type_pie_chart_div'));
      chart.draw(chartDataTable, chartOptions);
      
      ///////////////////////////////////////////////////////////////////////////////////////////
      var expDetailsTable = new google.visualization.Table(document.getElementById('expense_details'));

      // Important: Formatters can only be used with a DataTable; they cannot be used with a DataView (DataView objects are read-only). 
      var formatter_date = new google.visualization.DateFormat({pattern: 'dd-MMM'});
      formatter_date.format(expDetailsDataTable, 0); // at date is in 0th position

      
      var expDetailsDataView = new google.visualization.DataView(expDetailsDataTable);
      expDetailsDataView.hideColumns([5]); // Hide the cell index using view, but retain the date in table

      expDetailsTable.draw(expDetailsDataView, { showRowNumber: true, width: '90%', height: '100%' });

      /////////////////////////////////////////////////////////////////////////////////////////

      google.visualization.events.addListener(expDetailsTable, 'select', function() {
        var row = expDetailsTable.getSelection()[0].row;
        console.log('You selected ' + expDetailsDataTable.getValue(row, 0));
        console.log('You selected ' + expDetailsDataTable.getValue(row, 1));
        console.log('You selected ' + expDetailsDataTable.getValue(row, 2));
        console.log('You selected ' + expDetailsDataTable.getValue(row, 3));
        console.log('You selected ' + expDetailsDataTable.getValue(row, 4));
        console.log('You selected ' + expDetailsDataTable.getValue(row, 5));

        console.log(new Date(Date.parse(expDetailsDataTable.getValue(row, 0))));

        document.getElementById('f_expense_date').value = expDetailsDataTable.getValue(row, 0);
        document.getElementById('f_expense_amount').value = expDetailsDataTable.getValue(row, 1);
        document.getElementById('f_expense_vendor').value = expDetailsDataTable.getValue(row, 2);
        document.getElementById('f_expense_tx_type').value = ARRAY_TX_TYPE.indexOf(expDetailsDataTable.getValue(row, 3));
        document.getElementById('f_expense_category').value = ARRAY_TX_CATEGORY.indexOf(expDetailsDataTable.getValue(row, 4));
        document.getElementById('f_expense_append_or_update').value = expDetailsDataTable.getValue(row, 5);

        $('#add_expense_Modal').modal('show');

      });

      
    } else {
      console.log('No data found.');
    }
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}