
// var wd;
// var ws;
// var Q;
// var mw;
// var sc;
// var latitude;
// var longitude;
// var map;
// var infoWindow;
// var rotation_angle_degs =wd;
// "wd" is wind direction, 
//     "ws" is wind speed, 
//     "Q" is amount of material released, 
//     "mw" is molecular weight, 
//     "sc" is stability class and 
//     "lat","lon" are latitude and longitude respectively.
var defaults = 
{
  "wd":180,
  "ws":5,
  "Q": 25000,
  "mw": 17,
  "sc": "rd",
  "lat": 53.5253,
  "lon": -113.525704
};
// This example creates a simple polygon representing the Bermuda Triangle.
// When the user clicks on the polygon an info window opens, showing
// information about the polygon's coordinates        
var config = {
  apiKey: "AIzaSyBuqgAHTym57lDY8g6e8Xuf80E2s8mw-9A",
  authDomain: "gauss-54e5b.firebaseapp.com",
  databaseURL: "https://gauss-54e5b.firebaseio.com",
  projectId: "gauss-54e5b",
  storageBucket: "gauss-54e5b.appspot.com",
  messagingSenderId: "1039094609006"
};


//SETUP
firebase.initializeApp(config);
var event = firebase.database().ref('TR')
var wd = defaults["wd"];
var ws = defaults["ws"];
var Q = defaults["Q"];
var mw = defaults["mw"];
var sc= defaults["sc"];
var latitude = defaults["lat"];
var longitude = defaults["lon"];
var map;
var infoWindow;
var rotation_angle_degs =wd;



d3.json("https://f.stdlib.com/thisdavej/weather/current/?loc=22.234076,91.8249187", function(data) {

    // console.log(data.iss_position.latitude);
    var cws = JSON.stringify(data.windspeed);
    cws = cws.match(/\d/g);
    cws = cws.join("");
    console.log(cws)

    var cwd = JSON.stringify(data.winddisplay);
    // var myString = cwd;
    var cwd = cwd.split("6 mph");
    cwd = cwd[1];

    if (cwd===undefined){
      cwd=1;
      console.log(cwd)
    }

  });  


function initMap() {

    wd = defaults["wd"];
    ws = defaults["ws"];
    Q = defaults["Q"];
    mw = defaults["mw"];
    sc= defaults["sc"];
    latitude = defaults["lat"];
    longitude = defaults["lon"];
    //setTimeout(initMap,10000)
    var a = Math.floor(Math.random() * 180);
         // var max;
         map = new google.maps.Map(document.getElementById('map'), {

          zoom: 12,
          center: {lat: latitude, lng: longitude},
          mapTypeId: 'satellite',
          labels:true
        });
      
        
         translate_coordinates1();
         translate_coordinates2();
         translate_coordinates3();
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function translate_coordinates1() {
    with (Math) {
                 // var xx, yy, r, ct, st, angle;
                 var RADIANS =57.2957795;
                   olat = latitude//23.7866104;
                   olon = longitude//90.3696289;
                 // var d2rlat = [];
                 // var sigy = [];
                  // d2rlat[i] = olat[i]/RADIANS[i];
      //document.getElementById("Lat").innerHTML += data.iss_position.latitude +"<hr>";
      var xnew =[];
      var ynew = [];
      var yn = [];
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

       //var u = //Math.floor(Math.random() * 20);//m/s
       //var Q = mat//10000//Math.floor(Math.random() * 1000);
       RADIANS = 57.2957795;
       var triangleCoords = [];
       var triangleCoords1 = [];
       var all = {};
      //x = [10, 100, 1000, 5000, 10000];
      x = [];
      
      var sigy =[];
      var sigy1 =[];
      var sigz =[];
      var sigz1 =[];
      var ccen =[];
      var ccen1 =[];
      var cdes5 =30; //ppm
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
    // count = 0.005;

    x = [
    0.0000005,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    1100,
    1200,
    1300,
    1400,
    1500,
    1600,
    1700,
    1800,
    1900,
    2000,
    2100,
    2200,
    2300,
    2400,
    2500,
    2600,
    2700,
    2800,
    2900,
    3000,
    3100,
    3200,
    3300,
    3400,
    3500,
    3600,
    3700,
    3800,
    3900,
    4000,
    4100,
    4200,
    4300,
    4400,
    4500,
    4600,
    4700,
    4800,
    4900,
    5000,
    5100,
    5200,
    5300,
    5400,
    5500,
    5600,
    5700,
    5800,
    5900,
    6000,
    6100,
    6200,
    6300,
    6400,
    6500,
    6600,
    6700,
    6800,
    6900,
    7000,
    7100,
    7200,
    7300,
    7400,
    7500,
    7600,
    7700,
    7800,
    7900,
    8000,
    8100,
    8200,
    8300,
    8400,
    8500,
    8600,
    8700,
    8800,
    8900,
    9000,
    9100,
    9200,
    9300,
    9400,
    9500,
    9600,
    9700,
    9800,
    9900,
    10000
    ];
    x1 = [
    0.0000005,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    1100,
    1200,
    1300,
    1400,
    1500,
    1600,
    1700,
    1800,
    1900,
    2000,
    2100,
    2200,
    2300,
    2400,
    2500,
    2600,
    2700,
    2800,
    2900,
    3000,
    3100,
    3200,
    3300,
    3400,
    3500,
    3600,
    3700,
    3800,
    3900,
    4000,
    4100,
    4200,
    4300,
    4400,
    4500,
    4600,
    4700,
    4800,
    4900,
    5000,
    5100,
    5200,
    5300,
    5400,
    5500,
    5600,
    5700,
    5800,
    5900,
    6000,
    6100,
    6200,
    6300,
    6400,
    6500,
    6600,
    6700,
    6800,
    6900,
    7000,
    7100,
    7200,
    7300,
    7400,
    7500,
    7600,
    7700,
    7800,
    7900,
    8000,
    8100,
    8200,
    8300,
    8400,
    8500,
    8600,
    8700,
    8800,
    8900,
    9000,
    9100,
    9200,
    9300,
    9400,
    9500,
    9600,
    9700,
    9800,
    9900,
    10000
    ]
      //console.log(x1.length);
      for (i in x){
        //rotation_angle_degs = rotation_angle_degs;
        xoffset_mtrs[i] = xoffset_mtrs;
        yoffset_mtrs[i] = yoffset_mtrs;
     //  RADIANS[i] =RADIANS;
     olat[i] = olat;
     olon[i]= olon;
       //d2rlat[i] =d2rlat ;
          //x[i] = count;
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
       //console.log(sigy[i])
       sigyn[i] = -sigy[i];
       
       ccen[i] = (Q*Math.pow(10, 3))*24.45/(3.1416*sigy[i]*sigz[i]*ws*mw); //ppm
       //console.log(ccen[i])
       y5[i] = sigy[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5);
       //console.log(y5[i]);
       yn[i] = sigyn[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5)
      // console.log(y5)
      // console

      while(isNaN(y5[i])==false){
        var c = i+1;
        ynew1 = y5.slice(0,c);
        ynew2 = yn.slice(0,c);
        ynew = ynew1.concat(yn);
      //  if (isNaN(ynew[i])){
      //    ynew[i] = ynew[i-1];
      //  }

    //  // console.log(ccen);
    break;

  }
  //console.log(ynew)
}
for (i in ynew1){
  xx[i] = x[i] - xoffset_mtrs;
      //console.log(xx)
      yy[i] = ynew[i] - yoffset_mtrs;
      //console.log(yy)
      angle[i] = rotation_angle_degs/ RADIANS;
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
      angle1[i] = rotation_angle_degs/ RADIANS;
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
      //
      // console.log(lat1)


     //
   };
  latt = lat0.reverse();
  lonn = lng0.reverse()//.reverse();
  //console.log(lonn)
  //console.log(latt)
  var cityCircle = new google.maps.Circle({
    strokeColor: '#FEFB35',
    strokeOpacity: 0.2,
             // strokeWeight: 2,
              //fillColor: '#FF0000',
              fillOpacity: 0,
              map: map,
              center: {lat:latitude, lng: longitude},
              radius:Math.max(r[i])//Math.sqrt(citymap[city].population) * 100
            });
  console.log(cityCircle.radius);
  console.log(Math.max(r[i]));
  //lng = lng.reverse();
  cityCircle.addListener('click', showNewRect)
  //for (i in lat){
    lattt = latt.concat(lat1);
    lonnn = lonn.concat(lng1);
      //lng.concat(lng);
      console.log(Math.max(r[i]));
      var max30 = Math.max(r[i])/1000;
  // lat = lattt[i];
  // lng = lonnn[i];
  for (i in lattt){
    lat = lattt[i];
    lng = lonnn[i];
    latLng = {lat,lng};
     triangleCoords.push(latLng)//[i]=[{lat,lng}];
     //console.log(triangleCoords[i]);
     // console.log(lng);

   }

  //console.log(ynew2)



      //yy = y - yoffset_mtrs;

      var bermudaTriangle = new google.maps.Polygon({

        paths: triangleCoords,
        strokeColor: '#FEFB35',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FEFB35',
        fillOpacity: 0.35,
        someRandomData: "I'm a custom tooltip :-)"

      });

      bermudaTriangle.addListener('click', function(event) {
            // get lat/lon of click
            var clickLat = event.latLng.lat();
            var clickLon = event.latLng.lng();
            console.log(clickLat)
            // show in input box
            


          });
      function showNewRect(event){


        var infoWindow = new google.maps.InfoWindow();
        var contentString = 'Math.max(r[i])';
        if(max30<10){
          infoWindow.setContent('Yellow Threat Zone-LOC:AEGL-1(60 min):30ppm'+'</br>'+'Maximum Downwind Distance='+max30.toFixed(2)+'km');
        }else{
          infoWindow.setContent('Yellow Threat Zone-LOC:AEGL-1(60 min):30ppm'+'</br>'+'Maximum Downwind Distance='+'More than 10'+'km');
        }
        infoWindow.setPosition(latLng);
        infoWindow.open(map);
      } 




      bermudaTriangle.setMap(map);


   // setTimeout(translate_coordinates1,3000);
 }};
}
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function translate_coordinates2() {
    with (Math) {
         var RADIANS =57.2957795;
         olat = latitude//23.7866104;
         olon = longitude//90.3696289;
         var xnew =[];
         var ynew = [];
         var yn = [];
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

         var u = 5//Math.floor(Math.random() * 20);//m/s ///DIFFFFFFFFFFFFFFFFFFF
        // var Q = 10000//Math.floor(Math.random() * 1000);
        RADIANS = 57.2957795;
        var triangleCoords = [];
        var triangleCoords1 = [];
        var all = {};
        //x = [10, 100, 1000, 5000, 10000];
        x = [];
        var sigy =[];
        var sigy1 =[];
        var sigz =[];
        var sigz1 =[];
        var ccen =[];
        var ccen1 =[];
        var cdes5 =160; //microgram/m^3
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
      // count = 0.005;

      x = [
      0.0000005,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      1000,
      1100,
      1200,
      1300,
      1400,
      1500,
      1600,
      1700,
      1800,
      1900,
      2000,
      2100,
      2200,
      2300,
      2400,
      2500,
      2600,
      2700,
      2800,
      2900,
      3000,
      3100,
      3200,
      3300,
      3400,
      3500,
      3600,
      3700,
      3800,
      3900,
      4000,
      4100,
      4200,
      4300,
      4400,
      4500,
      4600,
      4700,
      4800,
      4900,
      5000,
      5100,
      5200,
      5300,
      5400,
      5500,
      5600,
      5700,
      5800,
      5900,
      6000,
      6100,
      6200,
      6300,
      6400,
      6500,
      6600,
      6700,
      6800,
      6900,
      7000,
      7100,
      7200,
      7300,
      7400,
      7500,
      7600,
      7700,
      7800,
      7900,
      8000,
      8100,
      8200,
      8300,
      8400,
      8500,
      8600,
      8700,
      8800,
      8900,
      9000,
      9100,
      9200,
      9300,
      9400,
      9500,
      9600,
      9700,
      9800,
      9900,
      10000
      ]
      x1 = [
      0.0000005,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      1000,
      1100,
      1200,
      1300,
      1400,
      1500,
      1600,
      1700,
      1800,
      1900,
      2000,
      2100,
      2200,
      2300,
      2400,
      2500,
      2600,
      2700,
      2800,
      2900,
      3000,
      3100,
      3200,
      3300,
      3400,
      3500,
      3600,
      3700,
      3800,
      3900,
      4000,
      4100,
      4200,
      4300,
      4400,
      4500,
      4600,
      4700,
      4800,
      4900,
      5000,
      5100,
      5200,
      5300,
      5400,
      5500,
      5600,
      5700,
      5800,
      5900,
      6000,
      6100,
      6200,
      6300,
      6400,
      6500,
      6600,
      6700,
      6800,
      6900,
      7000,
      7100,
      7200,
      7300,
      7400,
      7500,
      7600,
      7700,
      7800,
      7900,
      8000,
      8100,
      8200,
      8300,
      8400,
      8500,
      8600,
      8700,
      8800,
      8900,
      9000,
      9100,
      9200,
      9300,
      9400,
      9500,
      9600,
      9700,
      9800,
      9900,
      10000
      ]
//console.log(x1.length);
for (i in x){
          //rotation_angle_degs = rotation_angle_degs;
          xoffset_mtrs[i] = xoffset_mtrs;
          yoffset_mtrs[i] = yoffset_mtrs;
       //  RADIANS[i] =RADIANS;
       olat[i] = olat;
       olon[i]= olon;
         //d2rlat[i] =d2rlat ;
            //x[i] = count;
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
        //  sigy[i] = 0.04*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
         //console.log(sigy[i])
         sigyn[i] = -sigy[i];
        //  sigz[i] = 0.016*x[i]*Math.pow((1+0.0003*x[i]),-1);
         ccen[i] = (Q*24.45*Math.pow(10, 3))/(3.1416*sigy[i]*sigz[i]*ws*mw); //ppm
         y5[i] = sigy[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5);
         yn[i] = sigyn[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5)
        // console.log(y5)

        while(isNaN(y5[i])==false){


          var c = i+1;
          ynew1 = y5.slice(0,c);
          ynew2 = yn.slice(0,c);
          ynew = ynew1.concat(yn);

          break;

        }
    //console.log(ynew)
  }
  for (i in ynew1){
    xx[i] = x[i] - xoffset_mtrs;
    yy[i] = ynew[i] - yoffset_mtrs;
    angle[i] = rotation_angle_degs/ RADIANS;
    r[i] = sqrt(xx[i] * xx[i] + yy[i] * yy[i]);
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
        angle1[i] = rotation_angle_degs/ RADIANS;
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
        // plat.reverse();
       //console.log(plat)
       //console.log(plon)
    //      if (isNaN(plon[i])){

    //   plon[i] =plon[i-1];
    //   plat[i] = plat[i-1];
       //console.log(plon1)
    //              }
    //plat.reverse();
    lat0[i] =plat[i];
    lng0[i] = plon[i];
    lat1[i]=plat1[i]
    lng1[i] = plon1[i]
        //
        // console.log(lat1)


       //
     };
  //console.log(lng)
  //console.log(lng1)
  //plon.reverse();
  //console.log(lattt)
  //console.log(lonnn)
  latt = lat0.reverse();
  lonn = lng0.reverse()//.reverse();
  //console.log(lonn)
  //console.log(latt)
  //lng = lng.reverse();
  var cityCircle = new google.maps.Circle({
    strokeColor: '#FC6215',                                              ///////DIFFFFFFFFFFFFFFFFFFF
    strokeOpacity: 0.2,
   // strokeWeight: 2,
    //fillColor: '#FF0000',
    fillOpacity: 0,
    map: map,
    center: {lat: latitude, lng: longitude},
    radius:Math.max(r[i])//Math.sqrt(citymap[city].population) * 100
  });
  cityCircle.addListener('click', showNewRect)
  var Radius = Math.max(r[i]);                                           ///////DIFFFFFFFFFFFFFFFFFFF
  var max160 = Math.max(r[i])/1000;
  //for (i in lat){
    lattt = latt.concat(lat1);
    lonnn = lonn.concat(lng1);
      //lng.concat(lng);
      //console.log(lattt);
  // lat = lattt[i];
  // lng = lonnn[i];
  for (i in lattt){
    lat = lattt[i];
    lng = lonnn[i];
    latLng = {lat,lng};

     triangleCoords.push(latLng)//[i]=[{lat,lng}];
     //console.log(triangleCoords[i]);
     // console.log(lng);

   }


   var bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#FC6215',                                                         ///////DIFFFFFFFFFFFFFFFFFFF
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#FC6215',                                                           ///////DIFFFFFFFFFFFFFFFFFFF
    fillOpacity: 0.35
  });

   bermudaTriangle.addListener('click', function(event) {
    // get lat/lon of click
    var clickLat = event.latLng.lat();
    var clickLon = event.latLng.lng();
    console.log(clickLat)
    // show in input box
    


  });
   function showNewRect(event){


    var infoWindow = new google.maps.InfoWindow();
    var contentString = 'Math.max(r[i])';
    if(max160<10){                                                 ///////DIFFFFFFFFFFFFFFFFFFF
      infoWindow.setContent('Orange Threat Zone-LOC:AEGL-2(60 min):160ppm'+'</br>'+'Maximum Downwind Distance='+max160.toFixed(2)+'km');
    }else{
      infoWindow.setContent('Orange Threat Zone-LOC:AEGL-2(60 min):160ppm'+'</br>'+'Maximum Downwind Distance='+'More than 10'+'km');
    }
    infoWindow.setPosition(latLng);
    infoWindow.open(map);
  } 
  bermudaTriangle.setMap(map);
// setTimeout(translate_coordinates1,3000);
}};
///////////////////////////////////////////////////////
function translate_coordinates3() {
  with (Math) {

     // var xx, yy, r, ct, st, angle;
     var RADIANS =57.2957795;
       olat = latitude//23.7866104;
       olon = longitude//90.3696289;
     // var d2rlat = [];
     // var sigy = [];
      // d2rlat[i] = olat[i]/RADIANS[i];
    //var a = Math.floor(Math.random() * 180);
    //document.getElementById("Lat").innerHTML += data.iss_position.latitude +"<hr>";
    var xnew =[];
    var ynew = [];
    var yn = [];
    var sigyn =[];
    var xoffset_mtrs = 0;
    var yoffset_mtrs = 0;
     // var rotation_angle_degs =90;
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

       var u = 5//Math.floor(Math.random() * 20);//m/s
       //var Q = 10000//Math.floor(Math.random() * 1000);
       RADIANS = 57.2957795;
       var triangleCoords = [];
       var triangleCoords1 = [];
       var all = {};
      //x = [10, 100, 1000, 5000, 10000];
      x = [];
      var sigy =[];
      var sigy1 =[];
      var sigz =[];
      var sigz1 =[];
      var ccen =[];
      var ccen1 =[];
      var cdes5 =1100; //ppm
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
    // count = 0.005;

    x = [
    0.0000005,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    1100,
    1200,
    1300,
    1400,
    1500,
    1600,
    1700,
    1800,
    1900,
    2000,
    2100,
    2200,
    2300,
    2400,
    2500,
    2600,
    2700,
    2800,
    2900,
    3000,
    3100,
    3200,
    3300,
    3400,
    3500,
    3600,
    3700,
    3800,
    3900,
    4000,
    4100,
    4200,
    4300,
    4400,
    4500,
    4600,
    4700,
    4800,
    4900,
    5000,
    5100,
    5200,
    5300,
    5400,
    5500,
    5600,
    5700,
    5800,
    5900,
    6000,
    6100,
    6200,
    6300,
    6400,
    6500,
    6600,
    6700,
    6800,
    6900,
    7000,
    7100,
    7200,
    7300,
    7400,
    7500,
    7600,
    7700,
    7800,
    7900,
    8000,
    8100,
    8200,
    8300,
    8400,
    8500,
    8600,
    8700,
    8800,
    8900,
    9000,
    9100,
    9200,
    9300,
    9400,
    9500,
    9600,
    9700,
    9800,
    9900,
    10000
    ]
    x1 = [
    0.0000005,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    1100,
    1200,
    1300,
    1400,
    1500,
    1600,
    1700,
    1800,
    1900,
    2000,
    2100,
    2200,
    2300,
    2400,
    2500,
    2600,
    2700,
    2800,
    2900,
    3000,
    3100,
    3200,
    3300,
    3400,
    3500,
    3600,
    3700,
    3800,
    3900,
    4000,
    4100,
    4200,
    4300,
    4400,
    4500,
    4600,
    4700,
    4800,
    4900,
    5000,
    5100,
    5200,
    5300,
    5400,
    5500,
    5600,
    5700,
    5800,
    5900,
    6000,
    6100,
    6200,
    6300,
    6400,
    6500,
    6600,
    6700,
    6800,
    6900,
    7000,
    7100,
    7200,
    7300,
    7400,
    7500,
    7600,
    7700,
    7800,
    7900,
    8000,
    8100,
    8200,
    8300,
    8400,
    8500,
    8600,
    8700,
    8800,
    8900,
    9000,
    9100,
    9200,
    9300,
    9400,
    9500,
    9600,
    9700,
    9800,
    9900,
    10000
    ]
         //console.log(x1.length);
         for (i in x){
          //rotation_angle_degs = rotation_angle_degs;
          xoffset_mtrs[i] = xoffset_mtrs;
          yoffset_mtrs[i] = yoffset_mtrs;
       //  RADIANS[i] =RADIANS;
       olat[i] = olat;
       olon[i]= olon;
         //d2rlat[i] =d2rlat ;
            //x[i] = count;
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
        //  sigy[i] = 0.04*x[i]*Math.pow((1+0.0001*x[i]), -0.5);
         //console.log(sigy[i])
         sigyn[i] = -sigy[i];
        //  sigz[i] = 0.016*x[i]*Math.pow((1+0.0003*x[i]),-1);
         ccen[i] = (Q*Math.pow(10, 3))*24.45/(3.1416*sigy[i]*sigz[i]*ws*mw); //ppm
         y5[i] = sigy[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5);
         yn[i] = sigyn[i]*Math.pow((2*log(ccen[i]/cdes5)), 0.5)
        // console.log(y5)

        while(isNaN(y5[i])==false){


          var c = i+1;
          ynew1 = y5.slice(0,c);
          ynew2 = yn.slice(0,c);



        // ynew = y5[i];

        ynew = ynew1.concat(yn);
        //  if (isNaN(ynew[i])){
        //    ynew[i] = ynew[i-1];
        //  }

      //  // console.log(ccen);
      break;

    }
    //console.log(ynew)
  }
  for (i in ynew1){
    xx[i] = x[i] - xoffset_mtrs;
    yy[i] = ynew[i] - yoffset_mtrs;
    angle[i] = rotation_angle_degs/ RADIANS;
    r[i] = sqrt(xx[i] * xx[i] + yy[i] * yy[i]);
    ct[i] = xx[i] / r[i];
    st[i] = yy[i] / r[i];
    xxx[i] = r[i] * ((ct[i] * cos(angle[i])) + (st[i] * sin(angle[i])));
    yyy[i] = r[i] * ((st[i] * cos(angle[i])) - (ct[i] * sin(angle[i])));
    d2rlat[i] = olat/RADIANS;
    d2rlon[i] = (111415.13 * cos(d2rlat[i])) - (94.55 * cos(3.0 * d2rlat[i])) + (0.12 * cos(5.0 * d2rlat[i]));
    d2rlat[i] = (111132.09 - (566.05 * cos(2.0 * d2rlat[i])) + (1.20 * cos(4.0 * d2rlat[i])) - (0.002 * cos(6.0 * d2rlat[i])));

    plon[i] = olon + xxx[i] / d2rlon[i];
    plat[i] = olat + yyy[i] / d2rlat[i];

    xx1[i] = x[i] - xoffset_mtrs;
    yy1[i] = ynew2[i] - yoffset_mtrs;
    angle1[i] = rotation_angle_degs/ RADIANS;
    r1[i] = sqrt(xx1[i] * xx1[i] + yy1[i] * yy1[i]);
    ct1[i] = xx1[i] / r1[i];
    st1[i] = yy1[i] / r1[i];
    xxx1[i] = r1[i] * ((ct1[i] * cos(angle1[i])) + (st1[i] * sin(angle1[i])));
    yyy1[i] = r1[i] * ((st1[i] * cos(angle1[i])) - (ct1[i] * sin(angle1[i])));
    d2rlat1[i] = olat/RADIANS;
    d2rlon1[i] = (111415.13 * cos(d2rlat1[i])) - (94.55 * cos(3.0 * d2rlat1[i])) + (0.12 * cos(5.0 * d2rlat1[i]));
    d2rlat1[i] = (111132.09 - (566.05 * cos(2.0 * d2rlat1[i])) + (1.20 * cos(4.0 * d2rlat1[i])) - (0.002 * cos(6.0 * d2rlat1[i])));

    plon1[i] = olon + xxx1[i] / d2rlon1[i];
    plat1[i] = olat + yyy1[i] / d2rlat1[i];

    lat0[i] =plat[i];
    lng0[i] = plon[i];
    lat1[i]=plat1[i]
    lng1[i] = plon1[i]
      //
      // console.log(lat1)


     //
   };
  //console.log(lng)
  //console.log(lng1)
  //plon.reverse();
  //console.log(lattt)
  //console.log(lonnn)
  latt = lat0.reverse();
  lonn = lng0.reverse()//.reverse();
  //console.log(lonn)
  //console.log(latt)
  //lng = lng.reverse();
  var cityCircle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.2,
 // strokeWeight: 2,
  //fillColor: '#FF0000',
  fillOpacity: 0,
  map: map,
  center: {lat: latitude, lng: longitude},
  radius:Math.max(r[i])//Math.sqrt(citymap[city].population) * 100
});
  cityCircle.addListener('click', showNewRect)
  var maxRedZone = Math.max(r[i]);
  console.log(Math.max(r[i]));
  var max1100 = Math.max(r[i])/1000;
  //for (i in lat){
    lattt = latt.concat(lat1);
    lonnn = lonn.concat(lng1);
      //lng.concat(lng);
      //console.log(lattt);
  // lat = lattt[i];
  // lng = lonnn[i];
  for (i in lattt){
    lat = lattt[i];
    lng = lonnn[i];
    latLng = {lat,lng};

     triangleCoords.push(latLng)//[i]=[{lat,lng}];
     //console.log(triangleCoords[i]);
     // console.log(lng);

   }
   var date = new Date();
   var dd = date.getDate();
  var mm = date.getMonth()+1; //January is 0!

  var yyyy = date.getFullYear();
  var hr = date.getHours();
  var minute = date.getMinutes();
  var sec = date.getSeconds();
  if(dd<10){
    dd='0'+dd;
  }
  if(mm<10){
    mm='0'+mm;
  }
  var date = dd+'/'+mm+'/'+yyyy+','+hr+':'+minute+':'+sec;

  var simulationParameter = {
    Date :date,
    Event:'Toxic Release',
    Lat: latitude,
    Lon: longitude,
    Wind_Speed : ws+' m/s',
    Wind_direction : wd+' deg',
    Quantity :Q+' g/s',
    MaxRedZone : parseInt(maxRedZone)+(' m'),
  };
  
  event.set(simulationParameter);


  var bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });
  bermudaTriangle.addListener('click', function(event) {
    // get lat/lon of click
    var clickLat = event.latLng.lat();
    var clickLon = event.latLng.lng();
    console.log(clickLat)
    // show in input box
    


  });
  function showNewRect(event){


    var infoWindow = new google.maps.InfoWindow();
    var contentString = 'Math.max(r[i])';
    if(max1100<10){
      infoWindow.setContent('Red Threat Zone-LOC:AEGL-3(60 min):1100ppm'+'</br>'+'Maximum Downwind Distance='+max1100.toFixed(2)+'km');
    }else{
      infoWindow.setContent('Red Threat Zone-LOC:AEGL-3(60 min):1100ppm'+'</br>'+'Maximum Downwind Distance='+'More than 10'+'km');
    }
    infoWindow.setPosition(latLng);
    infoWindow.open(map);
  } 
  bermudaTriangle.setMap(map);
// setTimeout(translate_coordinates1,3000);
}};



    
 