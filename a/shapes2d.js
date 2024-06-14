/* Classes contendo a definição de objetos gráficos e classes básicas como cor e vetor 3d */
    class Vec3d{
        constructor(x,y,z){
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    
    class Color{
        constructor (r,g,b,a){
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    class Shape2d{
        constructor (color){
            this.color = color;
        }
        draw() {
            throw new Error("Method 'draw()' must be implemented.");
        }

    }
    //Represents a point
    class Point2d extends Shape2d{
        constructor (x,y,color,size = 1){
            super(color);
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = size;
        }
    }


    class Circle extends Shape2d{
        constructor(cx,cy,radius,color,numSubdiv){
            super(color);
            this.cx = cx;
            this.cy = cy;
            this.radius = radius;
            this.numSubdiv = numSubdiv;
        }

        evaluate(ang){
            var x,y;
            x = this.radius*Math.cos(ang)+this.cx;
            y = this.radius*Math.sin(ang)+this.cy;
            return [x,y];
        }

        discreticize(numSubdiv,coords,indices,colors){
            var delta = 2*Math.PI/numSubdiv;
            var i;
            for (i=0;i<numSubdiv;i++){
                var p = this.evaluate(i*delta);
                coords[3*i] = p[0];
                coords[3*i+1] = p[1];
                coords[3*i+2] = 0.0;

                colors[3*i] = this.color.r;
                colors[3*i+1] = this.color.g;
                colors[3*i+2] = this.color.b;

                indices[i] = i;
            }
        }

        discreticizeFilled(numSubdiv,coords,indices,colors){
            var delta = 2*Math.PI/numSubdiv;
            var i,j;

            coords[0] = 0.0+this.cx;
            coords[1] = 0.0+this.cy;
            coords[2] = 0.0;
            
            colors[0] = this.color.r;
            colors[1] = this.color.g;
            colors[2] = this.color.b;
            
            for (i=0,j=3;i<numSubdiv;){
                var p = this.evaluate(i*delta);
                //alert("("+p[0]+","+p[1]+")");
                coords[j] = p[0];
                coords[j+1] = p[1];
                coords[j+2] = 0.0;

                //colors[j] = 3*Math.random()/5;
                //colors[j+1] = 2*Math.random()/5;
                //colors[j+2] = 1*Math.random()/5;

                colors[j] = this.color.r;
                colors[j+1] = this.color.g;
                colors[j+2] = this.color.b;

                indices[3*i] = 0;
                indices[3*i+1] = (i+2)>numSubdiv?1:(i+2);
                indices[3*i+2] = i+1;
                i++;
                j+=3

            }
        }
    }

    class Triangle{
        constructor (p0,p1,p2,c){
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.color = c;
        }  
    }


        //Describes a point list data structure
    class TriangleList{
        constructor(){
            this.list = []
        }

        get size(){
            return this.list.length;
        }

        push(triangle){
            this.list.push(triangle);
        }

        // Draw all points in the poit list
        draw(){
        
            var i;
            for (i=0;i<this.size;i++){
                //Get a point
                var triangle = this.list[i];
                triangle.draw();
            }
        }
    }

    //Describes a point list data structure
    class PointList{
        constructor(){
            this.list = []
        }

        get size(){
            return this.list.length;
        }


        push(point){
            this.list.push(point);
        }

        // Draw all points in the poit list
        draw(){
        
            var i;
            for (i=0;i<this.size;i++){
                //Get a point
                var point = this.list[i];
                point.draw();
            }
        }
    }


    class Polygon extends Shape2d{
        constructor(color,interpolation){
            super(color);
            this.pointList = new PointList();
            this.interpolation = interpolation;
        }

        push(point){
            this.pointList.push(point);
        }
    }    


    function gcd(a, b) {
        var resto = a%b;
        if (resto==0) {
          return b;
        }
        else{
          return gcd(b, resto);
        }
      }
  
      //Baseado em: https://www.geeksforgeeks.org/program-to-calculate-the-value-of-ncr-efficiently/
  
      function nCr(n, r){
        
        // p holds the value of n*(n-1)*(n-2)...,
        // k holds the value of r*(r-1)...
        var p = 1;
        var k = 1;
  
        // C(n, r) == C(n, n-r),
        // choosing the smaller value
        if (n - r < r){
            r = n - r;
        }
  
        if (r != 0) {
            while (r) {
                p *= n;
                k *= r;
                // gcd of p, k
                m = gcd(p, k);
                // dividing by gcd, to simplify
                // product division by their gcd
                // saves from the overflow
                p /= m;
                k /= m;
                n--;
                r--;
            }
            // k should be simplified to 1
            // as C(n, r) is a natural number
            // (denominator should be 1 ) .
        }
        else{
            p = 1;
        }
  
        return p;
      }  
    
      function bezier_func(t,n,pts){
        var i;
        var pt = [0.0,0.0];
  
        for (i=0;i<=n;i++){
          var a = Math.pow(1-t,n-i);
          var b = Math.pow(t,i);
          var comb = nCr(n,i);
          pt[0] += comb*a*b*pts.list[i].x; //x(t)
          pt[1] += comb*a*b*pts.list[i].y; //y(t)
        }
  
        return pt;
  
      }
  

    class Bezier extends Shape2d{
        constructor (controlPoints, degree, color){
            super(color);  
            this.degree = degree;
            this.controlPoints = controlPoints;
            this.color = color;
          }
          
        discreticize(n_div,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol){
            var delta = 1/n_div;

            var i = 0;
            var pt;
            for (i = 0;i<=n_div;i++){
                var t = i*delta;
                pt = bezier_func(t,this.degree,this.controlPoints);

                coords.push(pt[0]);
                coords.push(pt[1]);
                coords.push(0.0);

                colors.push(this.color.r);
                colors.push(this.color.g);
                colors.push(this.color.b);
                
                indices.push(i);
            }

            
            for (i = 0;i<n_div;i++){
                indicesEdges.push(i);
                indicesEdges.push((i+1));
            }
            
            for (i = 0; i<this.controlPoints.size;i++){
                coordsPol.push(this.controlPoints.list[i].x);
                coordsPol.push(this.controlPoints.list[i].y);
                coordsPol.push(0.0);
        
                colorsPol.push(1.0);
                colorsPol.push(0.0);
                colorsPol.push(0.0);

                indicesPol.push(i);

            }

            for (i = 0;i<this.controlPoints.size-1;i++){
                indicesEdgesPol.push(i);
                indicesEdgesPol.push(i+1);
            }          
        }
    }


    function NB(i, p, t, knots){

        var m = knots.length-1;
        
        if (((i==0)&&(t==knots[0]))||((i==m-p-1)&&(t==knots[m]))){
        return 1;
        }
    /* else if (t<knots[i]||t>=knots[i+p+1]){
        return 0;
        }*/
        else 
        if (p==0){
        if ((knots[i]<=t) && (t<knots[i+1])){
            return 1;
        }
        else{
            return 0;
        }
        }
        else{
            
        var a = t - knots[i];
        var b = knots[i+p] - knots[i];
        var c = knots[i+p+1] - t;
        var d = knots[i+p+1] - knots[i+1];

        var m = 0;
        var n = 0;
        if (b!=0){
            m = a/b;
        }
        if (d!=0){
            n = c/d;
        }
        
        return m*NB(i,p-1,t,knots)+n*NB(i+1,p-1,t,knots);
        }
        
      }
  
    function find_span(t,p,knots,m){
        /*var n = m-p-1;
        if (t==knots[n]){
          return n-1;
        }
        else{*/
          var i;
          for (i=0;i<m;i++){
            if ((knots[i]<=t)&&(t<knots[i+1])){
              return i;
            }
          }
        //}
      }
   
  
    function compute_basis(span,t,p,knots,nPts,N){
        var i;
        var sum = 0.0;
        var res = false;
        for (i=0;i<nPts;i++){
          N[i] = 0.0;
        }
        for (i=0;i<nPts;i++){
          N[i] = NB(i,p,t,knots);
          if (N[i]!=0){
            sum += N[i];
          }
        }
        if ((sum - 1.0) < 0.01){
          res = true;
        }
        return res;
      }
  
    function bspline_func(t,p,pts,knots,m,pt){
        var i  = 0;
  
        span = find_span(t,p,knots,m);
        var N = [];
        var res = compute_basis(span,t,p,knots,pts.size,N);
        if (res == false){
          alert("erro");
        }
        for (i=0;i<pts.size;i++){
              pt[0] = pt[0] + pts.list[i].x*N[i];
              pt[1] = pt[1] + pts.list[i].y*N[i];
        }
        //return res;
      }
  
  
    class BSpline{   
        constructor (controlPoints, knots, degree, color){
            this.controlPoints = controlPoints;
            this.knots = knots;
            this.degree = degree;
            this.color = color;    
        }
    
        discreticize(n_div,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol){
            var m = this.knots.length;
            var p = this.degree;
            var ini = this.knots[p];
            var end = this.knots[m-p-1];
            var delta = (end-ini)/n_div;

            var pt = []; 
            var t = ini;
            var pts = this.controlPoints;

            var i = 0;
            for (i=0;i<=n_div;i++){
                pt[0] = 0.0;
                pt[1] = 0.0;

                bspline_func(t,p,pts,this.knots,m,pt);

                coords.push(pt[0]);
                coords.push(pt[1]);
                coords.push(0.0);

                colors.push(this.color.r);
                colors.push(this.color.g);
                colors.push(this.color.b);
                
              indices.push(i);
              t += delta;
              if (t>end){t=end;}
            
  
            }
  
            var j = 0;
            for (j = 0;j<n_div;j++){
              indicesEdges.push(j);
              indicesEdges.push((j+1));
            }
  
            for (i = 0; i<this.controlPoints.size;i++){
              coordsPol.push(this.controlPoints.list[i].x);
              coordsPol.push(this.controlPoints.list[i].y);
              coordsPol.push(0.0);
      
              colorsPol.push(1.0);
              colorsPol.push(0.0);
              colorsPol.push(0.0);
  
              indicesPol.push(i);
  
            }
  
            for (i = 0;i<this.controlPoints.size-1;i++){
              indicesEdgesPol.push(i);
              indicesEdgesPol.push(i+1);
            }
        }
    }
  
  