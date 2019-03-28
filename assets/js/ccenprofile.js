
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function c_vs_x() {
    with (Math) {
        var Us = calculateUs();
        var deltaH = calculateDeltaH(Us);
        var H = h + deltaH;


        pro_plot = [[]];
        var y = 0; 
        var z = 0;
        var x = [1, 5, 10];           
        var k = 2;
        while (x[k] < Xmax-10){
             x.push(x[k]+10);  
             k=k+1;
        }
        
        var sigy =[];
        var sigz =[];
      
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

                   if (sigz[i]<(H/2.15)){
                        c = C_eq1(Q, sigy[i], sigz[i], Us, y, z, H);
                    }
                    else { //after plume hits the ground)   
                        c = C_eq2(Q, sigy[i], sigz[i], Us, y, z, H);
                   }
                   // if (c==0 && z[j]>H) continue; // more than half skip the empty zone
                   if (c!=0) pro_plot.push([x[i], c]);      
        }
        $.plot($("#profile"), [pro_plot]);
    }
};
// before plume hit's the ground
// function C_eq1(Q, sigy, sigz, Us, y, z, H) {
//         var base = Q/(2*3.1416*sigy*sigz*Us); 
//         c = base*Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z-H)/sigz,2))));
//         if (c<1 || isNaN(c)==true){
//             c = 0;
//         }
//     return c;
// };

// //after plume hits the ground
// function C_eq2(Q, sigy, sigz, Us, y, z, H) {
//         var base = Q/(2*3.1416*sigy*sigz*Us); 
//         c = base*(Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z-H)/sigz,2))))
//                   +Math.exp((-0.5*(Math.pow(y/sigy,2)))-(0.5*(Math.pow((z+H)/sigz,2)))));
//         if (c<1 || isNaN(c)==true){
//             c = 0;
//         }
//     return c;
// };
