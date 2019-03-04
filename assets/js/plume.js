
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
var defaults = {
  "wd": 90, // it's wd-90 
  "ws":5,
  "Q": 25000000,
  "mw": 17,
  "sc": "rd",
  "lat": 53.5253, // Edmonton, Alberta U of A
  "lon": -113.5257,
  "h": 50,
  "Xmax": 10000,
  "Z1": 10,
  "Vs": 20,
  "ds": 2,
  "Ts": 400,
  "Ta": 283,
  "Pa": 1032
};       
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
var wd = defaults["wd"];
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
// setup map
var map;
var zoom = 12;
var center= {lat: latitude, lng: longitude};
var infoWindow;

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
    initMap();

}


function initMap() {
    //setTimeout(initMap,10000)
    //var a = Math.floor(Math.random() * 180);
    var Us = calculateUs();
    var deltaH = calculateDeltaH(Us);
    var H = h + deltaH;
    // cdes5 30, 160, 1100
    // color of triangle, word to display, area with so much μg/m^3 concentration for each section
    translate_coordinates('#FEFB35', 'Yellow', 5, Us, H); //yellow
    translate_coordinates('#FC6215', 'Orange', 10, Us, H);
    translate_coordinates('#FF0000', 'Red', 50, Us, H); //1100
}


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function translate_coordinates(strokeColor, ring_color, ppm_region, Us, H) {
    with (Math) {
                 // var xx, yy, r, ct, st, angle;
        var RADIANS =57.2957795;
        olat = latitude//23.7866104;
        olon = longitude//90.3696289;
        var xnew =[];
        var ynew = [];
        var yn = [];
        var z = H; // this is for topview
        var sigyn =[];
        var xoffset_mtrs = 0;
        var yoffset_mtrs = 0;

        var lat = [];
        var lng = [];
        xx = [];
        xx1 =[];
        yy = [];
        yy1 = [];
        r = [];
        r1 =[];
        ct = [];
        ct1 =[];
        st = [];
        st1 =[];
        xxx = [];
        xxx1 = [];
        yyy = [];
        yyy1 = [];
        d2rlon = [];
        d2rlat1 = [];
        d2rlat = [];
        d2rlon1 =[];
        plon = [];
        plon1 =[];
        plat = [];
        plat1 = [];
        angle =[0];
        angle1 =[0];

        // if (t2)
        var u = 5//Math.floor(Math.random() * 20);//m/s 
    //var u = //Math.floor(Math.random() * 20);//m/s
    //var Q = mat//10000//Math.floor(Math.random() * 1000);
        RADIANS = 57.2957795;
        var triangleCoords = [];
        var triangleCoords1 = [];
        var all = {};
    //x = [10, 100, 1000, 5000, 10000];
        x = [0.0000005, 100];
        var k = 1;
        while (x[k] < Xmax-100){
             x.push(x[k]+100);
             k=k+1;
        }

        var sigy =[];
        var sigy1 =[];
        var sigz =[];
        var sigz1 =[];
        var ccen =[];
        var ccen1 =[];
        var cdes5 = ppm_region;//160; //ppm
        var y5 = [];
        var y51 = [];
        var ynew1 =[];
        var lat1 = [];
        var lng1 = [];
        var latLng1 = [];
        var lattt = [];
        var lonnn =[];
        var latLng = {};
        var lat2 =[];
        var lng2 = [];
        var latt = [];
        var lonn =[];
        var lat0 =[];
        var lng0 = [];
        
        for (i in x){
                //rotation_angle_degs = rotation_angle_degs;
                xoffset_mtrs[i] = xoffset_mtrs;
                yoffset_mtrs[i] = yoffset_mtrs;
                //  RADIANS[i] =RADIANS;
                olat[i] = olat;
                olon[i]= olon;
                //d2rlat[i] =d2rlat ;
                //x[i] = count;

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
                   if (sigz[i] < (H/2.15)){
                        y5[i] = sigy[i]*(Math.pow(2*log(ccen[i]/cdes5)-(Math.pow((z-H)/sigz[i],2)),0.5));
                    }
                    else{ //after plume hits the ground)   
                         y5[i] = sigy[i]*(Math.pow(2*log((ccen[i]/cdes5)*(1/Math.exp(0.5*(Math.pow((z-H)/sigz[i],2))+0.5*(Math.pow((z+H)/sigz[i],2))))), 0.5));
                   }
                   yn[i] = -y5[i]  //get mirrored side of X axis//sigyn[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5);

                // for (i=0; i++; i<y5.length){
                //     if (isNaN(y5[i])==false){
                //         var c = i+1;
                //         ynew1 = y5.slice(0,c);
                //         ynew2 = yn.slice(0,c);
                //         ynew = ynew1.concat(yn);
                //     }
                // }
               while(isNaN(y5[i])==false){
                    var c = i+1;
                    ynew1 = y5.slice(0,c);
                    ynew2 = yn.slice(0,c);
                    ynew = ynew1.concat(yn);
                    //  if (isNaN(ynew[i])){
                    //    ynew[i] = ynew[i-1];
                    //  }
                    //  // console.log(ccen);
                    break;    //////////////////////////////WHATS UP WITH THISSSS??????
                }
        }
        
        for (i in ynew1){
            xx[i] = x[i] - xoffset_mtrs;
            //console.log(xx)
            yy[i] = ynew[i] - yoffset_mtrs;
            //console.log(yy)
            angle[i] = wd / RADIANS;//rotation_angle_degs/ RADIANS;
            r[i] = sqrt(xx[i] * xx[i] + yy[i] * yy[i]);
            //console.log(r[i])
            ct[i] = xx[i] / r[i];
            st[i] = yy[i] / r[i];
            xxx[i] = r[i] * ((ct[i] * cos(angle[i])) + (st[i] * sin(angle[i])));
            yyy[i] = r[i] * ((st[i] * cos(angle[i])) - (ct[i] * sin(angle[i])));
            d2rlat[i] = olat/RADIANS;
            d2rlon[i] = (111415.13 * cos(d2rlat[i])) - (94.55 * cos(3.0 * d2rlat[i])) + (0.12 * cos(5.0 * d2rlat[i]));
            d2rlat[i] = (111132.09 - (566.05 * cos(2.0 * d2rlat[i])) + (1.20 * cos(4.0 * d2rlat[i])) - (0.002 * cos(6.0 * d2rlat[i])));
            //console.log(d2rlat);
            // console.log(d2rlon);
            plon[i] = olon + xxx[i] / d2rlon[i];
            plat[i] = olat + yyy[i] / d2rlat[i];
            xx1[i] = x[i] - xoffset_mtrs;
            yy1[i] = ynew2[i] - yoffset_mtrs;
            angle1[i] = wd / RADIANS; //rotation_angle_degs/ RADIANS;
            r1[i] = sqrt(xx1[i] * xx1[i] + yy1[i] * yy1[i]);
            ct1[i] = xx1[i] / r1[i];
            st1[i] = yy1[i] / r1[i];
            xxx1[i] = r1[i] * ((ct1[i] * cos(angle1[i])) + (st1[i] * sin(angle1[i])));
            yyy1[i] = r1[i] * ((st1[i] * cos(angle1[i])) - (ct1[i] * sin(angle1[i])));
            d2rlat1[i] = olat/RADIANS;
            d2rlon1[i] = (111415.13 * cos(d2rlat1[i])) - (94.55 * cos(3.0 * d2rlat1[i])) + (0.12 * cos(5.0 * d2rlat1[i]));
            d2rlat1[i] = (111132.09 - (566.05 * cos(2.0 * d2rlat1[i])) + (1.20 * cos(4.0 * d2rlat1[i])) - (0.002 * cos(6.0 * d2rlat1[i])));
            //console.log(d2rlat);
            // console.log(d2rlon);
            plon1[i] = olon + xxx1[i] / d2rlon1[i];
            plat1[i] = olat + yyy1[i] / d2rlat1[i];

            lat0[i] =plat[i];
            lng0[i] = plon[i];
            lat1[i]=plat1[i]
            lng1[i] = plon1[i]
        };

        latt = lat0.reverse();
        lonn = lng0.reverse()//.reverse();
  
        var cityCircle = new google.maps.Circle({
            strokeColor: strokeColor,
            strokeOpacity: 0.2,
             // strokeWeight: 2,
              //fillColor: '#FF0000',
            fillOpacity: 0,
            map: map,
            center: {lat:latitude, lng: longitude},
            radius:Math.max(r[i])//Math.sqrt(citymap[city].population) * 100
        });
        //lng = lng.reverse();
        cityCircle.addListener('click', showNewRect)
        //for (i in lat){
        lattt = latt.concat(lat1);
        lonnn = lonn.concat(lng1);
        //lng.concat(lng);
        var maxRect = Math.max(r[i])/1000;
        // lat = lattt[i];
        // lng = lonnn[i];
        //var testdata = [];
        for (i in lattt){
            lat = lattt[i];
            lng = lonnn[i];
            latLng = {lat,lng};
             triangleCoords.push(latLng)//[i]=[{lat,lng}];
             //console.log(triangleCoords[i]);
             // console.log(lng);

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
            fillOpacity: 0.35,
            someRandomData: "I'm a custom tooltip :-)"

        });



         bermudaTriangle.addListener('click', function(event) {
            // get lat/lon of click
            var clickLat = event.latLng.lat();
            var clickLon = event.latLng.lng();
            // show in input box
        });

         function showNewRect(event){


            var infoWindow = new google.maps.InfoWindow();
            var contentString = 'Math.max(r[i])';
            //if(maxRect< Xmax/1000){
              infoWindow.setContent( ring_color+' Threat Zone-LOC:AEGL-1(60 min):'+ppm_region.toString()+' μg/m' + "3".sup()+'</br>'+'Maximum Downwind Distance='+maxRect.toFixed(2)+'km');
          //}else{
              //infoWindow.setContent(ring_color+ ' Threat Zone-LOC:AEGL-1(60 min):'+ppm_region.toString()+' μg/m' + "3".sup()+'</br>'+'Maximum Downwind Distance='+'More than '+ (Xmax/1000).toString()+' km');
          //}
          infoWindow.setPosition(latLng);
          infoWindow.open(map);
        } 

        bermudaTriangle.setMap(map);
    }
};


$( document ).ready(function() {
    console.log( "ready!" );
    // Update from user input changes
    $("#ws").on('change', function(){
        ws = parseInt($(this).val());
        drawNewMap();
    });
    $("#Q").on('change', function(){
        Q = parseInt($(this).val());
        drawNewMap();
    });
    $("#wd").on('change', function(){
        wd = $(this).val();
        drawNewMap();
    });
    $("#h").on('change', function(){
        h = parseInt($(this).val());
        drawNewMap();
    });
    $("#xRange").on('change', function(){
        Xmax = $(this).val();
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
    $("#Z1").on('change', function(){
        Z1 = $(this).val();
        drawNewMap();
    });
    $("#Vs").on('change', function(){
        Vs = $(this).val();
        drawNewMap();
    });
    $("#ds").on('change', function(){
        ds = $(this).val();
        drawNewMap();
    });
    $("#Ts").on('change', function(){
        Ts = $(this).val();
        drawNewMap();
    });
    $("#Ta").on('change', function(){
        Ta = $(this).val();
        drawNewMap();
    });
    $("#Pa").on('change', function(){
        Pa = $(this).val();
        drawNewMap();
    });

});

