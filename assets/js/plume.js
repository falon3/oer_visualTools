
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
  //"mw": 17,
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
var event = firebase.database().ref('TR')
var wd = defaults["wd"]-90;
var ws = defaults["ws"];
var Q = defaults["Q"];
var mw = defaults["mw"];
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
d3.json("https://f.stdlib.com/thisdavej/weather/current/?loc=22.234076,91.8249187", function(data) {
    // console.log(data.iss_position.latitude);
    var cws = JSON.stringify(data.windspeed);
    cws = cws.match(/\d/g);
    cws = cws.join("");
    // THIS DOESNT LOOK RIGHT FOR GETTING WIND DIRECTION?? HARDCODED
    var cwd = JSON.stringify(data.winddisplay);
    // var myString = cwd;
    var cwd = cwd.split("6 mph");
    cwd = cwd[1];

    if (cwd===undefined){
      cwd=1;
    }
});  

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

function drawNewMap(){
    //keep old zoom
    if (map) {
        zoom = map.getZoom();
        center['lat'] = map.getCenter().lat();
        center['lng'] = map.getCenter().lng();
    }   
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: zoom,
      center: center,
      mapTypeId: 'satellite',
      labels:true
  });
    updateLegend();
    initMap();
}

function updateLegend(){
    for (i in Object.keys(polution_levels)){
        $("#level"+i.toString()).html(polution_levels[i]["level"]+"+");
    } 
}

function initMap() {
    //setTimeout(initMap,10000)
    //var a = Math.floor(Math.random() * 180);   
    var Us = calculateUs();
    var deltaH = calculateDeltaH(Us);
    var H = h + deltaH;
    // color of triangle, word to display, area with so much μg/m^3 concentration for each section
    for (l in Object.keys(polution_levels)){
        translate_coordinates(polution_levels[l]['color'], polution_levels[l]['level'], Us, H); //yellow
    }
}

function translate_coordinates(strokeColor, zone, Us, H) {
    with (Math) {
                 // var xx, yy, r, ct, st, angle;
        var z_num; //convert z from the word decription to a number
        if (z=="plume") z_num = H;
        else if (z=="ground") z_num=0;

        var olat = latitude;
        var olon = longitude;
        var rotation_angle_degs = wd;
        var ynew = [];
        var xoffset = 0;
        var yoffset = 0;
        var last = 0;
        var r = [];
        var triangleCoords = [];
        var triangleCoords1 = [];
        var bounceCoords = [];
        var bounce_y = [];

    //x = [10, 100, 1000, 5000, 10000];
        var x = [0, 2];
        var k = 1;
        while (x[k] < Xmax-5){
             x.push(x[k]+1);
             k=k+1;
        }
        var sigy =[];
        var sigz =[];
        var ccen =[];
        var cdes5 = zone;//160; //ppm
        var y5 = [];
        var ynew1 =[];
        var lat1 = [];
        var lng1 = [];
        var lat0 =[];
        var lng0 = [];
        var blat0 = [];
        var blng0 = [];
        var blat1 = [];
        var blng1= [];
        var lattt = [];
        var lonnn = [];
        var blattt = [];
        var blonnn =[];
        var final_x = [];
        var final_y = [];
        var latLng = {};
        var blatLng = {};

        //OLLLDDDDDDDDDDDD?????????????????????.///////////////

        // var lat = [];
        // var lng = [];
        // var blattt = [];
        // var blonnn = [];
        // var lattt = [];
        // var lonnn = [];
        // xx = [];
        // xx1 =[];
        // yy = [];
        // yy1 = [];
        // r1 =[];
        // ct = [];
        // ct1 =[];
        // st = [];
        // st1 =[];
        // xxx = [];
        // xxx1 = [];
        // yyy = [];
        // yyy1 = [];
        // d2rlon = [];
        // d2rlat1 = [];
        // d2rlat = [];
        // d2rlon1 =[];
        // plon = [];
        // plon1 =[];
        // plat = [];
        // plat1 = [];
        // angle =[0];
        // angle1 =[0];
        // var u = 5;
        // var all = {};
        // var sigy =[];
        // var sigy1 =[];
        // var sigz =[];
        // var sigz1 =[];
        // var ccen =[];
        // var ccen1 =[];
        // var cdes5 = zone;//160; //ppm
        // var y5 = [];
        // var y51 = [];
        // var ynew1 =[];
        // var latLng1 = [];
        // var lattt = [];
        // var lonnn =[];
        // var latLng = {};
        // var lat2 =[];
        // var lng2 = [];
        // var latt = [];
        // var lonn =[];
        // var lat0 =[];
        // var lng0 = [];
        // var blatt = [];
        // var blonn = [];
        // var blattt = [];
        // var blonnn = [];
        // if (t2)
        
        //////END OLD?????????????????///////////////
        
        for (i in x){
                ///STABILITY CLASS A,B,C,D,E,F WITH 'R' RURAL OR 'U' URBAN  
                if (sc=="ra") {
                 sigy[i] = 0.22*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
                       sigz[i] = 0.20*x[i];//0.016*x[i]*Math.pow((1+0.0003*x[i]),-1);
                   }
                   else if(sc=="rb"){
                      sigy[i] = 0.16*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
                      sigz[i] = 0.12*x[i];
                  }
                  else if(sc=="rc"){
                      sigy[i] = 0.11*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
                      sigz[i] = 0.08*x[i]*Math.pow((1+0.0002*x[i]), -0.5);
                  }
                  else if(sc=="rd"){
                      sigy[i] = 0.08*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
                      sigz[i] = 0.06*x[i]*Math.pow((1+0.0015*x[i]), -0.5);
                  }
                  else if(sc=="re"){
                      sigy[i] = 0.06*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
                      sigz[i] = 0.03*x[i]*Math.pow((1+0.0003*x[i]), -1);
                  }
                  else if(sc=="rf"){
                      sigy[i] = 0.04*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
                      sigz[i] = 0.016*x[i]*Math.pow((1+0.0003*x[i]), -1);
                  }
                  else if(sc=="ua"||"ub"){
                      sigy[i] = 0.32*x[i]*Math.pow((1+0.0004*x[i]), -0.5);
                      sigz[i] = 0.24*x[i]*Math.pow((1+0.001*x[i]), -0.5);
                  }
                  else if(sc=="uc"){
                      sigy[i] = 0.22*x[i]*Math.pow((1+0.0004*x[i]), -0.5);
                      sigz[i] = 0.20*x[i];
                  }
                  else if(sc=="ud"){
                      sigy[i] = 0.16*x[i]*Math.pow((1+0.0004*x[i]), -0.5);
                      sigz[i] = 0.14*x[i]*Math.pow((1+0.003*x[i]), -0.5);
                  }
                  else if(sc=="ue"||"uf"){
                      sigy[i] = 0.11*x[i]*Math.pow((1+0.0004*x[i]), -0.5);
                      sigz[i] = 0.08*x[i]*Math.pow((1+0.0015*x[i]), -0.5);
                  }
                  //ccen[i] = (Q*24.45*Math.pow(10, 3))/(3.1416*sigy[i]*sigz[i]*ws*mw); //old form in ppm
                    ccen[i] = Q/(2*3.1416*sigy[i]*sigz[i]*Us); // OUR FORMULA
                   //console.log(ccen[i])

                   //y5[i] = sigy[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5); //old simpler formula
                   //find the Y that yields this C(x,y,z)==cdes5(max concentration for this region) and make that the bounding arcline
                   if (sigz[i]<(H/2.15)){
                        y5[i]  = sigy[i]*(Math.pow(2*log(ccen[i]/cdes5)-(Math.pow((z_num-H)/sigz[i],2)),0.5));
                    }
                    else { //after plume hits the ground)   
                         y5[i] = sigy[i]*(Math.pow(2*log((ccen[i]/cdes5)
                                                         *(Math.exp(-0.5*Math.pow((z_num-H)/sigz[i],2))
                                                                      +Math.exp(-0.5*(Math.pow((z_num+H)/sigz[i],2))))), 0.5));
                   } 
                   if (isNaN(y5[i])==false){
                        final_x.push(x[i]);
                        final_y.push(y5[i]);
                   }
                   // keep track of the line where the plume hits ground
                   if (abs(sigz[i]-(H/2.15))<0.5){
                            bounce_y.push(x[i]);
                        }
        }

        //console.log(ynew);
        for (i in final_y){
            //if (ynew[i]>=0){ // for half ellipticals
            ///////NEWWWWWWWWWWWWWW////////////////////
                var yy = final_y[i];
                var y_left = -final_y[i];
                var xx = final_x[i];


                // var yy = ynew[i] - yoffset;
                // var y_left = -(ynew[i] - yoffset);
                // var xx = x[i] - xoffset;
                var coords_right = xy_to_latlon(xx, yy, olon, olat, rotation_angle_degs, xoffset, yoffset);
                var coords_left = xy_to_latlon(xx, y_left, olon, olat, rotation_angle_degs, xoffset, yoffset);
                lat0[i]=coords_right.lat;
                lng0[i]=coords_right.lng;
                lat1[i]=coords_left.lat;
                lng1[i]=coords_left.lng;
                r[i] = sqrt(xx*xx + yy*yy);


                if (bounce_y.indexOf(final_x[i]) != -1){
                //if (bounce_y.indexOf(x[i]) != -1){
                    blat0[i] =lat0[i];
                    blng0[i] = lng0[i];
                    blat1[i]=lat1[i];
                    blng1[i] = lng1[i];
                }
            //}
        }
        
        lattt = lat0.reverse().concat(lat1);
        lonnn = lng0.reverse().concat(lng1);
        blattt = blat0.reverse().concat(blat1);
        blonnn = blng0.reverse().concat(blng1);

        ////////////NEWWWWWWWWWWWWWWWWWWWWW///////////////////

        // //     ///OLD//////////////////////
        //     xx[i] = x[i] - xoffset;
        //     //console.log(xx)
        //     yy[i] = ynew[i] - yoffset;
        //     //console.log(yy)
        //     angle[i] = wd / RADIANS;//rotation_angle_degs/ RADIANS;
        //     r[i] = sqrt(xx[i] * xx[i] + yy[i] * yy[i]);
        //     //console.log(r[i])
        //     ct[i] = xx[i] / r[i];
        //     st[i] = yy[i] / r[i];
        //     xxx[i] = r[i] * ((ct[i] * cos(angle[i])) + (st[i] * sin(angle[i])));
        //     yyy[i] = r[i] * ((st[i] * cos(angle[i])) - (ct[i] * sin(angle[i])));
        //     d2rlat[i] = olat/RADIANS;
        //     d2rlon[i] = (111415.13 * cos(d2rlat[i])) - (94.55 * cos(3.0 * d2rlat[i])) + (0.12 * cos(5.0 * d2rlat[i]));
        //     d2rlat[i] = (111132.09 - (566.05 * cos(2.0 * d2rlat[i])) + (1.20 * cos(4.0 * d2rlat[i])) - (0.002 * cos(6.0 * d2rlat[i])));
        //     //console.log(d2rlat);
        //     // console.log(d2rlon);
        //     plon[i] = olon + xxx[i] / d2rlon[i];
        //     plat[i] = olat + yyy[i] / d2rlat[i];


        //     xx1[i] = x[i] - xoffset;
        //     yy1[i] = -ynew[i] - yoffset;
        //     angle1[i] = wd / RADIANS; //rotation_angle_degs/ RADIANS;
        //     r1[i] = sqrt(xx1[i] * xx1[i] + yy1[i] * yy1[i]);
        //     ct1[i] = xx1[i] / r1[i];
        //     st1[i] = yy1[i] / r1[i];
        //     xxx1[i] = r1[i] * ((ct1[i] * cos(angle1[i])) + (st1[i] * sin(angle1[i])));
        //     yyy1[i] = r1[i] * ((st1[i] * cos(angle1[i])) - (ct1[i] * sin(angle1[i])));
        //     d2rlat1[i] = olat/RADIANS;
        //     d2rlon1[i] = (111415.13 * cos(d2rlat1[i])) - (94.55 * cos(3.0 * d2rlat1[i])) + (0.12 * cos(5.0 * d2rlat1[i]));
        //     d2rlat1[i] = (111132.09 - (566.05 * cos(2.0 * d2rlat1[i])) + (1.20 * cos(4.0 * d2rlat1[i])) - (0.002 * cos(6.0 * d2rlat1[i])));

        //     plon1[i] = olon + xxx1[i] / d2rlon1[i];
        //     plat1[i] = olat + yyy1[i] / d2rlat1[i];
        

            
        //     lat0[i] =plat[i];
        //     lng0[i] = plon[i];
        //     lat1[i]=plat1[i]
        //     lng1[i] = plon1[i] 
        //     if (bounce_y.indexOf(ynew[i]) != -1){
        //         blat0[i] =lat0[i];
        //         blng0[i] = lng0[i];
        //         blat1[i]=lat1[i];
        //         blng1[i] = lng1[i];
        //     } 


        // };
        // latt = lat0.reverse();
        // lonn = lng0.reverse();
        // lattt = latt.concat(lat1);
        // lonnn = lonn.concat(lng1);

        // console.log("LATTTT:", lattt);
        // console.log("LONNN:", lonnn);
        // blatt = blat0.reverse();
        // blonn = blng0.reverse();//.reverse();
        // blattt = blatt.concat(blat1);
        // blonnn = blonn.concat(blng1);

        /////ENDOLDDDD///////////////////////////////////
        

        var cityCircle = new google.maps.Circle({
            strokeColor: strokeColor,
            strokeOpacity: 0.3,
             // strokeWeight: 2,
              //fillColor: '#FF0000',
            fillOpacity: 0,
            map: map,
            center: {lat:latitude, lng: longitude},
            radius: Math.max(r[i])//Math.sqrt(citymap[city].population) * 100
        });
        //lng = lng.reverse();
        //cityCircle.addListener('click', showNewRect);

        var maxRect = Math.max(r[i])/1000;


        for (i in lattt){
            lat = lattt[i];
            lng = lonnn[i];
            latLng = {lat,lng};
            triangleCoords.push(latLng)//[i]=[{lat,lng}];
        }

        for (i in blattt){
            lat = blattt[i];
            lng = blonnn[i];
            blatLng = {lat,lng};
            bounceCoords.push(blatLng)
        }
        //console.log(triangleCoords);
        // This example creates a simple polygon representing the Bermuda Triangle.
        // When the user clicks on the polygon an info window opens, showing
        // information about the polygon's coordinates 
        var bermudaTriangle = new google.maps.Polygon({

            paths: triangleCoords,
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: strokeColor,
            fillOpacity: 0.5,
            someRandomData: "I'm a custom tooltip :-)"

        });
        
        var bounceTriangle = new google.maps.Polygon({

            paths: bounceCoords,
            strokeColor: '#080808',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#080808',
            fillOpacity: 0.2,
            someRandomData: "I'm a custom tooltip :-)"

        });

        // not used but may later for changing color codes for regions
        function addHexColor(c1, c2) {
            if (c1[0]=='#') c1=c1.slice(1);
            if (c2[0]=='#') c2=c2.slice(2);
            var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
            while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
            return '#'+hexStr;
        }

         function showNewRect(event){
            var infoWindow = new google.maps.InfoWindow();
            var contentString = 'Math.max(r[i])';
            if(maxRect< Xmax/1000){
              infoWindow.setContent( 'Threat Zone: '+zone.toString()+' μg/m' + "3".sup()+'</br>'+'Maximum Downwind Distance='+maxRect.toFixed(2)+'km');
          }else{
              infoWindow.setContent(' Threat Zone: '+zone.toString()+ ' μg/m' + "3".sup()+'</br>'+'Maximum Downwind Distance='+'More than '+ (Xmax/1000).toString()+' km');
          }
          infoWindow.setPosition(latLng);
          infoWindow.open(map);
        } 

        bermudaTriangle.setMap(map);
        bounceTriangle.setMap(map);
    }
};

function DEG_TO_RADIANS(x){
    return (x/RADIANS);
}
//helper functions for latlon conversion
function METERS_DEGLON(x)
{  
   with (Math)
   {
      var d2r=DEG_TO_RADIANS(x);
      return((111415.13 * cos(d2r))- (94.55 * cos(3.0*d2r)) + (0.12 * cos(5.0*d2r)));
   }
}

function METERS_DEGLAT(x)
{
   with (Math)
   {
      var d2r=DEG_TO_RADIANS(x);
      return(111132.09 - (566.05 * cos(2.0*d2r))+ (1.20 * cos(4.0*d2r)) - (0.002 * cos(6.0*d2r)));
   }
}

// #   xy_to_latlon
// #   routine to translate between geographic and cartesian coordinates
// #   user must supply following data on the cartesian coordinate system:
// #   location of the origin in lat/lon degrees;
// #   rotational skew from true north in degrees;
// #   N.B. sense of rotation i/p here is exactly as o/p by ORIGIN
// #   x/y offset in meters - only if an offset was used during the
// #   running of prog ORIGIN;
function xy_to_latlon(x, y, olon, olat, rotation_angle_degs, xoffset, yoffset){
   with(Math)
   {   
      var xx,yy,xxx,yyy,r,ct,st,angle;
      angle = DEG_TO_RADIANS(rotation_angle_degs); //0 
     /* X,Y to Lat/Lon Coordinate Translation  */
     xx = x - xoffset; // set offset to 0
     yy = y - yoffset;
     r = sqrt(xx*xx + yy*yy);

     if(r){
        ct = xx/r;
        st = yy/r;
        xxx = r * ( (ct * cos(angle))+ (st * sin(angle)) );
        yyy = r * ( (st * cos(angle))- (ct * sin(angle)) );
     }
     //olon,olat are origin lat/lon
     var plon = olon + xxx/METERS_DEGLON(olat);
     var plat = olat + yyy/METERS_DEGLAT(olat);

    var sll={lat:plat, lng:plon};
    return(sll);    
  }
};



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

function labelWindDirection(){
    var wstring = "";
    var display_wd = $("#wdOut").val();
    if ((0<=display_wd && display_wd<90) || (270<display_wd && display_wd<360)) wstring= "N";
    if (90<display_wd && display_wd<=180) wstring = "S";

    if (0<display_wd && display_wd<180) wstring=wstring.concat("E");
    if (180<display_wd && display_wd<360) wstring=wstring.concat("W");

    $("#wdLetter").html("&#176;"+wstring);
}


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

