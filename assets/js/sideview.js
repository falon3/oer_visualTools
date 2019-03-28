
function initPlot() {
    var Us = calculateUs();
    var deltaH = calculateDeltaH(Us);
    var H = h + deltaH;

    make_plot( Us, H);
    
}

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function make_plot(Us, H) {
    with (Math) {
                 // var xx, yy, r, ct, st, angle;
        var RADIANS =57.2957795;
        to_plot = [[ 'ID', 'X', 'Z', 'Concentration']];
        var y = 0; // sideview from y=0

        var x = [1, 5, 10];           
        var k = 2;
        while (x[k] < Xmax-10){
             x.push(x[k]+10);  
             k=k+1;
        }
        Zmax = H+350;
        var z = [0, 5];
        var k = 1;
        while (z[k] < Zmax-1){
             z.push(z[k]+5);  
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
                    //ccen[i] = Q/(2*3.1416*sigy[i]*sigz[i]*Us); // OUR FORMULA
                    for (j in z){
                       if (sigz[i]<(H/2.15)){
                            c = C_eq1(Q, sigy[i], sigz[i], Us, y, z[j], H);
                        }
                        else { //after plume hits the ground)   
                            c = C_eq2(Q, sigy[i], sigz[i], Us, y, z[j], H);
                       }
                       //console.log(['',x[i],z[i], c]);
                       if (c==0 && z[j]>H) continue; // more than half skip the empty zone
                       if (c!=0) to_plot.push(['',x[i],z[j], c]);
                          
                    }
                   // keep track of the line where the plume hits ground
                   // if (abs(sigz[i]-(H/2.15))<0.5){
                   //          bounce_y.push(y5[i], -y5[i]);
                   //      }
                   
        }
        //console.log("HERE");
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChart);

    }
};
// before plume hit's the ground
function C_eq1(Q, sigy, sigz, Us, y, z, H) {
        var base = Q/(2*3.1416*sigy*sigz*Us); 
        c = base*Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z-H)/sigz,2))));
        if (c<1 || isNaN(c)==true){
            c = 0;
        }
    return c;
};

//after plume hits the ground
function C_eq2(Q, sigy, sigz, Us, y, z, H) {
        var base = Q/(2*3.1416*sigy*sigz*Us); 
        c = base*(Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z-H)/sigz,2))))
                  +Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z+H)/sigz,2)))));
        if (c<1 || isNaN(c)==true){
            c = 0;
        }
    return c;
};

function drawChart() {
        if (chart){
            chart = chart.clearChart();
        }
        var filtered = to_plot.filter(function(value, index, arr){
            return arr[index][3] >= Cmin;
            });
        filtered.unshift([ 'ID', 'X', 'Z', 'Concentration']);
        var data = google.visualization.arrayToDataTable(filtered);

        var options = {
          colorAxis: {colors: ['yellow', 'red'], maxValue: Cmax, minValue: Cmin},
          sizeAxis: {minSize:7, minValue:0, maxSize:7},
            hAxis: {title: 'X (meters)', maxValue:Math.max(500, Xmax)},
            vAxis: {title: 'Z (meters)', maxValue:Math.max(300, Zmax), viewWindowMode:'pretty'},//maxValue:Math.max(400, Zmax)},
            sortBubblesBySize: false,
            bubble: {opacity: 0.6},
            chartArea:{width:'80%',height:'80%'},
            explorer: { keepInBounds: true },
           width: Math.max(900,Xmax*0.60),
           height: Math.max(700, Zmax*2)
        };

        chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }