
///  CODE ADAPTED FROM https://github.com/touhid55/GaussianPlume

//      "wd" is wind direction, 
//     "ws" is wind speed from meteorological tower, [Uref]
//     "Q" is amount of material released, [source strength of contaminant I, μg/s]
//     "mw" is molecular weight, 
//     "sc" is stability class and 
//     "lat","lon" are latitude and longitude respectively.
//      "h" is physical height of the stack
//      Xmax is the max range of distance from plume to assess
//      Z1 is height of meteorological tower
//      "Vs" is vertical stack gas velocity (m/sec)
//      "ds": inside diameter of stack (m)
//      "Ts": temp of exhaust gas stream at stack outlet (K)
//      "Ta": temp of the atmosphere at stack outlet (K)
//      "Pa": atmospheric pressure at ground level (mb)
//      "z": is level of measuring concentration at (either ground or plume height)

var defaults = {
  "wd": 180, // it's wd-90 
  "ws":4,
  "Q": 250000000,
  "sc": "ud",
  "lat": 53.5253, // Edmonton, Alberta U of A
  "lon": -113.5257,
  "h": 50,
  "Xmax": 10000,
  "Z1": 10,
  "Vs": 20,
  "ds": 2,
  "Ts": 400,
  "Ta": 283,
  "Pa": 1032,
  "z": "plume"
};       
// all values that have slider changeable values
var all_sliders = ["Q","Xmax","ws","wd","Z1","Pa","h","ds","Vs","Ts","Ta"];

// COLOR CODES FOR REGIONS
//each colored area with so much μg/m^3 concentration
// level in μg/m^3
// var polution_max = 100;
// var polution_min = 5;
var polution_levels = {
    0: {color: '#9FFF33', level: 5},
    1: {color: '#fbe37f', level: 20},
    2: {color: '#ffcd00', level: 35},
    3: {color: '#fb740c', level: 50},
    4: {color: '#f32a2a', level: 65},
    5: {color: '#5d0404', level: 100}
}

// API key from https://github.com/touhid55/GaussianPlume
var config = {
  apiKey: "AIzaSyBuqgAHTym57lDY8g6e8Xuf80E2s8mw-9A",
  authDomain: "gauss-54e5b.firebaseapp.com",
  databaseURL: "https://gauss-54e5b.firebaseio.com",
  projectId: "gauss-54e5b",
  storageBucket: "gauss-54e5b.appspot.com",
  messagingSenderId: "1039094609006"
};

//SETUP Globals
firebase.initializeApp(config);
//var event = firebase.database().ref('TR')
var wd = defaults["wd"]-90;
var ws = defaults["ws"];
var Q = defaults["Q"];
var sc= defaults["sc"];
var latitude = defaults["lat"];
var longitude = defaults["lon"];
var h = defaults["h"];
var Xmax = defaults["Xmax"];
var Z1 = defaults["Z1"];
var Vs = defaults["Vs"];
var ds = defaults["ds"];
var Ts = defaults["Ts"];
var Ta = defaults["Ta"];
var Pa = defaults["Pa"];
var z = defaults["z"];
// setup map
var map;
var zoom = 14;
var center= {lat: latitude, lng: longitude};
var infoWindow;
var RADIANS =57.2957795;

// P is function of atmospheric stability (A to F) 
// and surface roughness (urban vs rural (also called open country) environment
var P = {
    "ua": 0.15,
    "ub": 0.15,
    "uc": 0.20,
    "ud": 0.25,
    "ue": 0.30,
    "uf": 0.30,
    "ra": 0.07,
    "rb": 0.07,
    "rc": 0.10,
    "rd": 0.15,
    "re": 0.35,
    "rf": 0.55
}

// CAN REFACTOR THIS INTO A GET CURRENT WEATHER ROUTINE AND OPTION FOR USER LATER
// d3.json("https://f.stdlib.com/thisdavej/weather/current/?loc=22.234076,91.8249187", function(data) {
//     // console.log(data.iss_position.latitude);
//     var cws = JSON.stringify(data.windspeed);
//     cws = cws.match(/\d/g);
//     cws = cws.join("");
//     // THIS DOESNT LOOK RIGHT FOR GETTING WIND DIRECTION?? HARDCODED
//     var cwd = JSON.stringify(data.winddisplay);
//     // var myString = cwd;
//     var cwd = cwd.split("6 mph");
//     cwd = cwd[1];

//     if (cwd===undefined){
//       cwd=1;
//     }
// });  

// Us is wind speed at height h (at stack opening)
// h is stack height
// Z1 is height of meteorological tower
// P is function of atmospheric stability
// ws is wind speed from measured tower
function calculateUs(){
    var Us = ws*(Math.pow((h/Z1),P[sc]));
    return Us
};

//  deltaH is the Plume Rise in meters
//  "Vs": vertical stack gas velocity (m/sec)
//  "ds": inside diameter of stack (m)
//  "Ts": temp of exhaust gas stream at stack outlet (K)
//  "Ta": temp of the atmosphere at stack outlet (K)
//  "Pa": atmospheric pressure at ground level (mb)
function calculateDeltaH(Us){
    var deltaH = ((Vs*ds)/Us)*(1.5+ 0.00268*Pa*ds*((Ts-Ta)/Ts));
    return deltaH
}

//set and display defaults for sliders
function setSliderValues(sliders){
    for (i in sliders){
        $("#"+sliders[i]+"Range").val(defaults[sliders[i]]);
        //$("#"+sliders[i]+"Out").html(defaults[sliders[i]]);
        $("#"+sliders[i]+"Out").val(defaults[sliders[i]]);
    }
}

$( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 2,
      max: 500,
      values: [ 5, 100 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.values[ 0 ] +" - "+  ui.values[ 1 ] ); 
        },
      change: function( event, ui ){
        var levels = Object.keys(polution_levels);   
        var vmin = ui.values[ 0 ];
        var vmax = ui.values[ 1 ];
        var multiplier = Math.floor((vmax-vmin)/(levels.length+1));
        for (var i=0; i<levels.length/2 ;i++){
             polution_levels[i]['level']=vmin+(i*multiplier);
        }
        for (var i=levels.length-1, j=0; i>=levels.length/2; i--){
             polution_levels[i]['level']=vmax-(j*multiplier);
             j = j+1;
        }
        drawNewMap();
        }
    });
    $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 )); // initially
  } );


$( document ).ready(function() {

    setSliderValues(all_sliders);
    labelWindDirection();
    console.log( "ready!" );
    // Update from user input changes
    $("input[name='ws']").on('change', function(){
        ws = parseInt($(this).val());
        drawNewMap();
    });
    $("input[name='Q']").on('change', function(){
        Q = parseInt($(this).val());
        drawNewMap();
    });
    $("input[name='h']").on('change', function(){
        h = parseInt($(this).val());
        drawNewMap();
    });
    $("input[name='Xmax']").on('change', function(){
        Xmax = $(this).val();
        drawNewMap();
    });
    $("input[name='Z1']").on('change', function(){
        Z1 = $(this).val();
        drawNewMap();
    });
    $("input[name='Vs']").on('change', function(){
        Vs = $(this).val();
        drawNewMap();
    });
    $("input[name='ds']").on('change', function(){
        ds = $(this).val();
        drawNewMap();
    });
    $("input[name='Ts']").on('change', function(){
        Ts = $(this).val();
        drawNewMap();
    });
    $("input[name='Ta']").on('change', function(){
        Ta = $(this).val();
        drawNewMap();
    });
    $("input[name='Pa']").on('change', function(){
        Pa = $(this).val();
        drawNewMap();
    });
    $("input[name='wd']").on('change', function(){
        wd = $(this).val()-90;
        labelWindDirection();
        drawNewMap();
    });
    $("#lat").on('change', function(){
        latitude = parseFloat($(this).val());
        map.setCenter({lat: latitude, lng: longitude});
        drawNewMap();
    });
    $("#lon").on('change', function(){
        longitude = parseFloat($(this).val());
        map.setCenter({lat: latitude, lng: longitude});
        drawNewMap();
    });
    $("#sclass").on('change', function(){
        var cl = $(this).val();
        var sloc = $("#sloc").val();
        sc = sloc+cl;
        //console.log(sc);
        drawNewMap();
    });
    $("#sloc").on('change', function(){
        var sloc = $(this).val();
        var cl = $("#sclass").val();
        sc = sloc+cl;
        //console.log(sc);
        drawNewMap();
    });
    $("#z").on('change', function(){
        z = $(this).val();
        //console.log(sc);
        drawNewMap();
    });

});

