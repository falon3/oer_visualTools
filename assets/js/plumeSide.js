

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
  "sc": "ud",
  "h": 50,
  "Xmax": 1000,
  "Z1": 10,
  "Vs": 20,
  "ds": 2,
  "Ts": 400,
  "Ta": 283,
  "Pa": 1032
};       


//SETUP Globals
var wd = defaults["wd"];
var ws = defaults["ws"];
var Q = defaults["Q"];
var mw = defaults["mw"];
var sc= defaults["sc"];
var h = defaults["h"];
var Xmax = defaults["Xmax"];
var Z1 = defaults["Z1"];
var Vs = defaults["Vs"];
var ds = defaults["ds"];
var Ts = defaults["Ts"];
var Ta = defaults["Ta"];
var Pa = defaults["Pa"];


var to_plot = [[ 'ID', 'X', 'Z', 'Concentration']];
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



function initPlot() {
    //setTimeout(initMap,10000)
    //var a = Math.floor(Math.random() * 180);
    var Us = calculateUs();
    var deltaH = calculateDeltaH(Us);
    var H = h + deltaH;
    // cdes5 30, 160, 1100
    // color of triangle, word to display, area with so much μg/m^3 concentration for each section
    make_plot( Us, H); //yellow
    make_plot( Us, H);
    make_plot( Us, H); //1100
}

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function make_plot(Us, H) {
    with (Math) {
                 // var xx, yy, r, ct, st, angle;
        var RADIANS =57.2957795;
        var yn = [];
        var sigyn =[];


        // if (t2)
        var u = 5//Math.floor(Math.random() * 20);//m/s 
    //var u = //Math.floor(Math.random() * 20);//m/s
    //var Q = mat//10000//Math.floor(Math.random() * 1000);
        RADIANS = 57.2957795;
    //x = [10, 100, 1000, 5000, 10000];
        var x = [0, 10, 20];
        var z = [0, 5];
        var Zmax = 400;
        var y = 0;
        var k = 1;
        while (x[k] < Xmax-10){
             x.push(x[k]+10);  
             k=k+1;
        }
        var k = 1;
        while (z[k] < Zmax-1){
             z.push(z[k]+10);  
             k=k+1;
        }

        var sigy =[];
        var sigy1 =[];
        var sigz =[];
        var sigz1 =[];
        var ccen =[];
        var cfin = [];
        var y5 = [];
        var y51 = [];
        var ynew1 =[];
      
        //to_plot = [];
        for (i in x){

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
                    //ccen[i] = Q/(2*3.1416*sigy[i]*sigz[i]*Us); // OUR FORMULA
                   //console.log(ccen[i])

                    for (j in z){
                       if (sigz[i]<(H/2.15)){
                            c = C_eq1(Q, sigy[i], sigz[i], Us, y, z[j], H);
                        }
                        else { //after plume hits the ground)   
                            c = C_eq2(Q, sigy[i], sigz[i], Us, y, z[j], H);
                       }
                       console.log(c);
                       //console.log(['',x[i],z[i], c]);
                       if (c==0 && z[j]>H) continue;
                       if (c!=0) to_plot.push(['',x[i],z[j], c]);
                          
                    }
                   // keep track of the line where the plume hits ground
                   // if (abs(sigz[i]-(H/2.15))<0.5){
                   //          bounce_y.push(y5[i], -y5[i]);
                   //      }
                   
                   
               // while(isNaN(y5[i])==false){
               //      var c = i+1;
               //      ynew1 = y5.slice(0,c);
               //      ynew2 = yn.slice(0,c);
               //      ynew = ynew1.concat(yn);
               //      break;   
               //  }
        }
        console.log("HERE");
        google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      
      
    }
};
// before plume hit's the ground
function C_eq1(Q, sigy, sigz, Us, y, z, H) {
        var base = Q/(2*3.1416*sigy*sigz*Us); 
        //console.log(-0.5*(Math.pow((z-H)/sigz,2)));
        c = base*Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z-H)/sigz,2))));
        if (c<5 || isNaN(c)==true){
            c = 0;
        }
    return c;
};

//after plume hits the ground
function C_eq2(Q, sigy, sigz, Us, y, z, H) {
        var base = Q/(2*3.1416*sigy*sigz*Us); 
        c = base*(Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z-H)/sigz,2))))
                  +Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z+H)/sigz,2)))));
        if (c<5 || isNaN(c)==true){
            c = 0;
        }
    return c;
};

function drawChart() {
        var data = google.visualization.arrayToDataTable(to_plot);

        var options = {
          colorAxis: {colors: ['yellow', 'red'], maxValue: 200, minValue:5},
          sizeAxis: {minSize:3, minValue:0, maxSize:3},
            hAxis: {title: 'X'},
            vAxis: {title: 'Z', viewWindowMode: 'pretty'},
            sortBubblesBySize: false,
            bubble: {opacity: 0.6},
            chartArea:{width:'80%',height:'80%'}
        };


        var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
            
        

$( document ).ready(function() {
    initPlot();
    console.log( "ready!" );
    // Update from user input changes
    $("#ws").on('change', function(){
        ws = parseInt($(this).val());
        initPlot();
    });
    $("#Q").on('change', function(){
        Q = parseInt($(this).val());
        initPlot();
    });
    $("#wd").on('change', function(){
        wd = $(this).val();
        initPlot();
    });
    $("#h").on('change', function(){
        h = parseInt($(this).val());
        initPlot();
    });
    $("#xRange").on('change', function(){
        Xmax = $(this).val();
        initPlot();
    });
    $("#sclass").on('change', function(){
        var cl = $(this).val();
        var sloc = $("#sloc").val();
        sc = sloc+cl;
        //console.log(sc);
        initPlot();
    });
    $("#sloc").on('change', function(){
        var sloc = $(this).val();
        var cl = $("#sclass").val();
        sc = sloc+cl;
        //console.log(sc);
        initPlot();
    });
    $("#Z1").on('change', function(){
        Z1 = $(this).val();
        initPlot();
    });
    $("#Vs").on('change', function(){
        Vs = $(this).val();
        initPlot();
    });
    $("#ds").on('change', function(){
        ds = $(this).val();
        initPlot();
    });
    $("#Ts").on('change', function(){
        Ts = $(this).val();
        initPlot();
    });
    $("#Ta").on('change', function(){
        Ta = $(this).val();
        initPlot();
    });
    $("#Pa").on('change', function(){
        Pa = $(this).val();
        initPlot();
    });

});