
//     "Q" is amount of material released, [source strength of contaminant I, μg/s]
//     "mw" is molecular weight, 
//     "sc" is stability class and 
//      "h" is physical height of the stack
//      Xmax is the max range of distance from plume to assess
//      Z1 is height of meteorological tower
//      "Vs" is vertical stack gas velocity (m/sec)
//      "ds": inside diameter of stack (m)
//      "Ts": temp of exhaust gas stream at stack outlet (K)
//      "Ta": temp of the atmosphere at stack outlet (K)
//      "Pa": atmospheric pressure at ground level (mb)

var defaults = { 
  "wd": 180, // it's wd-90 
  "ws":5,
  "Q": 25000000,
  "sc": "ud",
  "lat": 53.5253, // Edmonton, Alberta U of A
  "lon": -113.5257,
  "h": 50,
  "Xmax": 1000,
  "Z1": 10,
  "Vs": 20,
  "ds": 2,
  "Ts": 400,
  "Ta": 283,
  "Pa": 1032,
  "z": "plume",
  "Cmin" : 5,
  "Cmax": 250
};       

var all_sliders = ["Q","Xmax","ws", "wd","Z1","Pa","h","ds","Vs","Ts","Ta"]; //wd

// COLOR CODES FOR MAPVIEW EGIONS
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
var Cmin = defaults["Cmin"];
var Cmax = defaults["Cmax"];
var Zmax = 500; 

// setup map
var map;
var zoom = 14;
var center= {lat: latitude, lng: longitude};
var infoWindow;
var RADIANS =57.2957795;


//setup chart data
var chart;
var to_plot = [[ 'ID', 'X', 'Z', 'Concentration']];
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
    $( "#topslider-range" ).slider({
      range: true,
      min: 1,
      max: 800,
      values: [ Cmin, Cmax ],
      slide: function( event, ui ) {  
        $( "#topamount" ).val( ui.values[ 0 ] +" - "+  ui.values[ 1 ] +"+");
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
    $( "#topamount" ).val( $( "#topslider-range" ).slider( "values", 0 ) +
      " - " + $( "#topslider-range" ).slider( "values", 1 )+"+") ; // initially
  });

$( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 1,
      max: 800,
      values: [ Cmin, Cmax ],
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.values[ 0 ] +" - "+  ui.values[ 1 ] +"+");   
        },
        change: function( event, ui ){
            if ($(".sideview").css("display")!="none"){
                Cmin = ui.values[ 0 ];
                Cmax = ui.values[ 1 ];
                drawChart();
            }
        }
    });
    $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 )+"+") ; // initially
  });

function show_Topview(){
    $(".sideview").css("display", "none");
    $(".about").css("display", "none");
    $(".plots").css("display", "block");
    $('.topview').css("display", "block");
    if (top_update == true){
        top_update = false;
        drawNewMap();
    } 
}

function show_Sideview(){ 
    $('.topview').css("display", "none");
    $("#about").css("display", "none");
    $(".plots").css("display", "block");
    $(".sideview").css("display", "block");
    if (side_update == true) {
        side_update = false;
        initPlot();
    } 
}

function load_model(){
    $("#about").css("display", "block");
    $(".plots").css("display", "none");
    //$("#about").load("model.html");
}


var top_update = true;
var side_update = true;

$( document ).ready(function() {
    $('.topview').css("display", "block");
    $(".sideview").css("display", "none");
    $("#about").css("display", "none");
    setSliderValues(all_sliders); // including wd for topview
    labelWindDirection(); /// for topview
    initPlot();
    console.log( "ready!" );
    // Update from user input changes

    $(".nav").click(function() {
        $(".nav").removeClass("active");
        tis = $(this);
        $(this).closest("a").addClass("active");
    });

    $('#data').on('change', 'input', function () {
        ws = parseInt($("input[name='ws']").val());
        Q = parseInt($("input[name='Q']").val());
        h = parseInt($("input[name='h']").val());
        Xmax = $("input[name='Xmax']").val();
        Z1 = $("input[name='Z1']").val();
        Vs = $("input[name='Vs']").val();
        ds = $("input[name='ds']").val();
        Ts = $("input[name='Ts']").val();
        Ta = $("input[name='Ta']").val();
        Pa = $("input[name='Pa']").val();    
        var sloc = $("#sloc").val();
        var cl = $("#sclass").val();
        sc = sloc+cl;
   

        // only for topview
        if ($(".topview").css("display")!="none"){
            wd = $("input[name='wd']").val()-90;
            labelWindDirection();
            latitude = parseFloat($("#lat").val());
            longitude = parseFloat($("#lon").val());
            map.setCenter({lat: latitude, lng: longitude});
            z = $("#z").val();
            top_update = false;
            side_update = true;
            drawNewMap();
        }  
        else if ($(".sideview").css("display")!="none"){
            top_update = true;
            side_update = false;
            initPlot();
        }      
        // drawNewMap(); // for topview
        

         });
});