const CC_LL_II_EE_NN_TT_II_DD = '505396211486-7rr7ipgf9l86ai9q2vdaum7mnpsb49ih';
const AA_PP_II_KK_EE_YY = 'AIzaSyA7ILQmN8Z2c4bIxLw-UQcKAqVLw3RIoWc';
const SS_HH_EE_EE_TT_II_DD = '1I9xBLU7LZ3ZRO6pe0DdtUGgvgNrBF3sRPxbOVQiSFpE';

// 1DueNTkz7YAAWurv--t0hTmeEOtFxJOUUqPUEHCSZz24

const ARRAY_TX_TYPE = [ 'Cash', 'Credit Card', 'ICICI', 'PayTm', 'Sodexo', 'BHIM'];
const ARRAY_TX_CATEGORY = ['Daily Needs', 'Transport', 'Home Maintainance', 'Health', 'Eating Out', 'Entertainment', 'Clothing', 'Office', 'Binami', 'Others'];
const MONTH_NUM_TO_MMM = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TX_CATEGORY_ICONS = [
    '<i class="icon-tx-category mx-1 my-1 icon-daily-needs fas fa-utensils"></i>'   , // Daily Needs
    '<i class="icon-tx-category mx-1 my-1 icon-transport fas fa-car"></i>'        , // Transport
    '<i class="icon-tx-category mx-1 my-1 icon-home-maintainance fas fa-home"></i>'       , // Home Maintainance
    '<i class="icon-tx-category mx-1 my-1 icon-health fas fa-heartbeat"></i>'  , // Health
    '<i class="icon-tx-category mx-1 my-1 icon-eating-out fas fa-cocktail"></i>'   , // Eating out
    '<i class="icon-tx-category mx-1 my-1 icon-entertainment fas fa-theater-masks"></i>'  , // Entertainment
    '<i class="icon-tx-category mx-1 my-1 icon-clothing fas fa-tshirt"></i>'     , // Clothing
    '<i class="icon-tx-category mx-1 my-1 icon-office fas fa-briefcase"></i>'  , // Office
    '<i class="icon-tx-category mx-1 my-1 icon-binami fas fa-exchange-alt"></i>', // Binami
    '<i class="icon-tx-category mx-1 my-1 icon-others fas fa-usd-circle"></i>'   // Others
];

const TX_TYPE_ICONS = [
    '<img src="icon-cash.png" class="icon-tx-type icon-cash">',
    '<img src="icon-citibank.png" class="icon-tx-type icon-citi">',
    '<img src="icon-icici.png" class="icon-tx-type icon-icici">',
    '<img src="icon-paytm.png" class="icon-tx-type icon-paytm">',
    '<img src="icon-sodexo.png" class="icon-tx-type icon-sodexo">',
    '<img src="icon-bhim.png" class="icon-tx-type icon-bhim">'
];

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4",
                      "https://people.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "profile https://www.googleapis.com/auth/spreadsheets";


// https://www.googleapis.com/auth/drive.file 
// https://www.googleapis.com/auth/spreadsheets.readonly 