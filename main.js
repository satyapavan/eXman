// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart', 'table']});

function formatDate(t_expense_date) {
  // To modify YYYY-MM-DD format to DD-MON-YYYY format
  objDate = new Date(Date.parse(t_expense_date));

  const temp = objDate.getDate() + "-" + MONTH_NUM_TO_MMM[objDate.getMonth()] + "-" + objDate.getFullYear();

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
      handleTxAlert("append", "");
    }, function (reason) {
      console.error('error: ' + reason.result.error.message);
      handleTxAlert("error", reason.result.error.message);
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
      handleTxAlert("update", "");
    }, function (reason) {
      console.error('error: ' + reason.result.error.message);
      handleTxAlert("error", reason.result.error.message);
    });
  }
}

function handleTxAlert(status, message) {

  if (status === "append") {
    console.log("Entered into " + status);
    $('#tx-alert-content').html("<strong>Added</strong> <br> transaction successfully");
    $(".tx-alert").addClass("alert-success");
    $(".tx-alert").removeClass("alert-primary");
    $(".tx-alert").removeClass("alert-danger");
  } else if (status === "update") {
    console.log("Entered into " + status);
    $('#tx-alert-content').html("<strong>Updated</strong> <br> transaction successfully");
    $(".tx-alert").removeClass("alert-success");
    $(".tx-alert").addClass("alert-primary");
    $(".tx-alert").removeClass("alert-danger");
  } else if (status === "error") {
    console.log("Entered into " + status);
    $('#tx-alert-content').html("<strong>ERROR!! </strong> <br> " + message);
    $(".tx-alert").removeClass("alert-success");
    $(".tx-alert").removeClass("alert-primary");
    $(".tx-alert").addClass("alert-danger");
  } else
    $('#tx-alert-content').html("Thank you for utilizing the services");

  $(".tx-alert").show();
  if(status !== "error") {
      setTimeout(function () {
        $(".tx-alert").hide();
      }, 3000);
  }
}

function initScreen() {
  console.log("Entered into initScreen()");

  surveyScreenDimensions();
  drawTxTypeChart();
  fetchSheetName();
  paintUserInformation();

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

function fetchSheetName() {

  gapi.client.sheets.spreadsheets.get({
    spreadsheetId: SS_HH_EE_EE_TT_II_DD
  }).then(function (response) {
    var sheets = response.result.sheets;

    var varSelect = document.querySelector("#id_timeline");
    $('#id_timeline').show();

    if (sheets.length > 0) {
      for (i = 0; i < sheets.length; i++) {
        var option = document.createElement("option");
        option.text = (sheets[i].properties.title).substr(0, 4) + ", " + MONTH_NUM_TO_MMM[parseInt((sheets[i].properties.title).substr(-2)) - 1] ;
        option.value = sheets[i].properties.title;
        varSelect.add(option);
      }
    }
  });
  document.getElementById('id_timeline').addEventListener("change", drawTxTypeChart);
}

function deriveLatestSheetName() {
  let sheet_name = document.getElementById('id_timeline').value;

  if( sheet_name == null || sheet_name === "" ) {
    const objDate = new Date();
    // +1 because javascript is yuck ;-)
    sheet_name = objDate.getFullYear() + "-" + ('0' + String(parseInt(objDate.getMonth()) + 1) ).slice(-2) ;
  }

  console.log("[" + sheet_name + "]");

  return sheet_name;

}

function drawTxTypeChart() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SS_HH_EE_EE_TT_II_DD,
    range: deriveLatestSheetName() + '!A2:E',
  }).then(function (response) {
    var expDetailsDataTable = new google.visualization.DataTable();
    expDetailsDataTable.addColumn('date', 'Date');
    expDetailsDataTable.addColumn('number', 'Rs.');
    expDetailsDataTable.addColumn('string', 'Vendor');
    expDetailsDataTable.addColumn('string', 'Tx Type'); // Actual transaction type
    expDetailsDataTable.addColumn('string', 'Category'); // Actual Category
    expDetailsDataTable.addColumn('number', 'Index');
    expDetailsDataTable.addColumn('string', 'Type'); // Icon for the Category
    expDetailsDataTable.addColumn('string', 'Mode'); // Icon for the tx type


    var range = response.result;
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.

        var amount = parseInt((row[1]).replace(',', ''));
        var txtype = row[3];

        const category = (row[4] != undefined) ? row[4] : "Others" ;

        console.log(row[3], TX_TYPE_ICONS[ARRAY_TX_TYPE.indexOf(row[3])]);
        // we are adding 2 because, +1 for header row and another +1 as current array is begining from 0
        expDetailsDataTable.addRow([new Date(Date.parse(row[0])), amount, row[2], row[3], category, i + 2, 
          TX_CATEGORY_ICONS[ARRAY_TX_CATEGORY.indexOf(category)],
          TX_TYPE_ICONS[ARRAY_TX_TYPE.indexOf(row[3])]]);
      }

      ///////////////////////////////////////////////////////////////////////////////////////////

      setTimeout(function() {
          console.log("Started drawing pie chart");

          // This ensures that 'Binami' transactions are not catogerized, but still visible under the data grid transactions.
          var chartDataView = new google.visualization.DataView(expDetailsDataTable);
          chartDataView.hideRows(chartDataView.getFilteredRows([{column: 4, value: 'Binami'}]));

          var chartDataTable = google.visualization.data.group(chartDataView, [4],
            [{ 'column': 1, 'aggregation': google.visualization.data.sum, 'type': 'number' }]);

          const chartOptions = {
            chartArea: { width: '100%', height: '95%' },
            // pieHole: 0.4,
            is3D: true,
            legend: { position: 'none', alignment: 'center' },
            reverseCategories: true,
            pieSliceText: 'label'
          };

          // Setting the total expense details from view

          var total_expense = 0;
          var visible_rows = chartDataView.getViewRows(); // Array of numbers // Returns the rows in this view, in order.

          if (visible_rows.length > 0) {
            for (i = 0; i < visible_rows.length; i++) {

              // Below should be DataTable and not DataView for this to work correctly.
              // else we will get invalid row index error.

              var row = expDetailsDataTable.getValue(visible_rows[i], 1);
              // Print columns A and E, which correspond to indices 0 and 4.

              var amount = parseInt((row)); // .replace(',', ''));
              total_expense = total_expense + amount;
            }
          }
          
          document.getElementById('btn_total_exp').innerHTML = '<i class="fas fa-rupee-sign"></i> ' + total_expense;

          // Invoke the draw method.          
          var chart = new google.visualization.PieChart(document.getElementById('tx_type_pie_chart_div'));
          chart.draw(chartDataTable, chartOptions);

          console.log("Completed drawing pie chart");
      });

      ///////////////////////////////////////////////////////////////////////////////////////////
      setTimeout(function() {
        console.log("Started drawing Table chart");
          var expDetailsTable = new google.visualization.Table(document.getElementById('expense_details'));

          // Important: Formatters can only be used with a DataTable; they cannot be used with a DataView (DataView objects are read-only). 
          var formatter_date = new google.visualization.DateFormat({pattern: "dd-MMM"});
          formatter_date.format(expDetailsDataTable, 0); // as date is in 0th position

          // special formatters to signify higher amount transactions
          var formatter = new google.visualization.ColorFormat();
                            // from, to, color, bgcolor
          formatter.addRange(500, 1000, '#856404', '#fff3cd;');
          formatter.addRange(1000, null, '#721c24', '#f8d7da');
          formatter.format(expDetailsDataTable, 1); // Apply formatter to second column which is amount/rupees

          var expDetailsDataView = new google.visualization.DataView(expDetailsDataTable);
          expDetailsDataView.setColumns([6, 0, 1, 2, 7]);
          // expDetailsDataView.hideColumns([5]); // Hide the cell index using view, but retain the date in table

          expDetailsTable.draw(expDetailsDataView, { 
              // showRowNumber: true, 
              width: '100%', 
              height: '100%',
              allowHtml: true,  
              sortColumn: 1, // sort based on date. this even helped me find a data bug :)
              sortAscending: false // show the latest records first
            });

          console.log("Completed drawing Table chart");
     
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

            document.getElementById('f_expense_date').valueAsDate = expDetailsDataTable.getValue(row, 0);
            document.getElementById('f_expense_amount').value = expDetailsDataTable.getValue(row, 1);
            document.getElementById('f_expense_vendor').value = expDetailsDataTable.getValue(row, 2);
            document.getElementById('f_expense_tx_type').value = ARRAY_TX_TYPE.indexOf(expDetailsDataTable.getValue(row, 3));
            document.getElementById('f_expense_category').value = ARRAY_TX_CATEGORY.indexOf(expDetailsDataTable.getValue(row, 4));
            document.getElementById('f_expense_append_or_update').value = expDetailsDataTable.getValue(row, 5);

            $('#add_expense_Modal').modal('show');

        });
      });

      
    } else {
      console.log('No data found.');
    }
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}


// window.addEventListener('load', async e => {
//   console.log("Entered into 'load' listener for Service Worker registery");

//   if('serviceWorker' in navigator) {
//     try {
//       navigator.serviceWorker.register('sw.js');
//       console.log("Service Worker is registered");
//     } catch (error) {
//       console.error("Service Worker failed to register");
//     }
//   }
// });