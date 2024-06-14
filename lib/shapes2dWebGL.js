/* Classes com implementação WebGL dos objetos gráficos */



// Avoid using. Too much resource use for a simple point
// Prefer use WebGLPointList
class WebGLPoint2d extends Point2d{
    constructor (gl,program,x,y,color,size = 1){
        super(x,y,color,size);
        this.gl = gl;
        this.program = program;
    }

    /* Retorna um modelo WebGL do objeto gráfico */
    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        var coords = [this.x,this.y,0.0];
        var indices = [0];
        var colors = [this.color.r,this.color.g,this.color.g];

        const webGLPoint2dModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coords,indices,colors,null,null,null);
        webGLPoint2dModel.set(attribShaderVariables,uniformShaderVariables);
        return webGLPoint2dModel;
    }
}


class WebGLPointList extends PointList{
    constructor (gl,program){
        super();
        this.gl = gl;
        this.program = program;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var indices = [];
        var colors = [];
        var i;
        for (i=0;i<this.list.length;i++){
            var p = this.list[i];
            coords.push(p.x);
            coords.push(p.y);
            coords.push(0.0);
            indices.push(i);
            colors.push(p.color.r);
            colors.push(p.color.g);
            colors.push(p.color.b);
        }
        

        const webGLPointListModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coords,indices,colors,null,null,null);
        webGLPointListModel.set(attribShaderVariables,uniformShaderVariables);
      
        return webGLPointListModel;
    }
}

class WebGLTriangle extends Triangle{
    constructor (gl,program,p0,p1,p2,c,interpolation){
        super(p0,p1,p2,c);
        this.gl = gl;
        this.program = program;
        this.interpolation = interpolation;
    }

    translate(dx, dy) {
        this.p0.x += dx;
        this.p0.y += dy;
        this.p1.x += dx;
        this.p1.y += dy;
        this.p2.x += dx;
        this.p2.y += dy;
    }

    rotate(angle) {
        const centerX = (this.p0.x + this.p1.x + this.p2.x) / 3;
        const centerY = (this.p0.y + this.p1.y + this.p2.y) / 3;

        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);

        this.p0.x = centerX + (this.p0.x - centerX) * cosAngle - (this.p0.y - centerY) * sinAngle;
        this.p0.y = centerY + (this.p0.x - centerX) * sinAngle + (this.p0.y - centerY) * cosAngle;

        this.p1.x = centerX + (this.p1.x - centerX) * cosAngle - (this.p1.y - centerY) * sinAngle;
        this.p1.y = centerY + (this.p1.x - centerX) * sinAngle + (this.p1.y - centerY) * cosAngle;

        this.p2.x = centerX + (this.p2.x - centerX) * cosAngle - (this.p2.y - centerY) * sinAngle;
        this.p2.y = centerY + (this.p2.x - centerX) * sinAngle + (this.p2.y - centerY) * cosAngle;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        var coords = [this.p0.x,this.p0.y,0,
                      this.p1.x,this.p1.y,0,
                      this.p2.x,this.p2.y,0];
        
        var indices = [0,1,2]; 
        var colors;

        if (this.interpolation == true)
        {
            colors = [this.p0.color.r,this.p0.color.g,this.p0.color.b,
                      this.p1.color.r,this.p1.color.g,this.p1.color.b,
                      this.p2.color.r,this.p2.color.g,this.p2.color.b];
        }
        else{
            colors = [this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b];
        }    

        const webGLTriangleModel = new WebGLModel(this.gl,this.program,2,this.gl.TRIANGLES,coords,indices,colors,null,null,null);
        webGLTriangleModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLTriangleModel;
    }
}

class WebGLTriangleList extends TriangleList{
    constructor (gl,program){
        super();
        this.gl = gl;
        this.program = program;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var indices = [];
        var colors = [];
        var i;
        for (i=0;i<this.list.length;i++){
            var t = this.list[i];
            coords.push(t.p0.x);
            coords.push(t.p0.y);
            coords.push(0);
            coords.push(t.p1.x);
            coords.push(t.p1.y);
            coords.push(0);
            coords.push(t.p2.x);
            coords.push(t.p2.y);
            coords.push(0);
            
            indices.push(3*i);
            indices.push(3*i+1);
            indices.push(3*i+2);

            if (this.interpolation == true)
                {
                    colors.push(t.p0.color.r);
                    colors.push(t.p0.color.g);
                    colors.push(t.p0.color.b);
                    colors.push(t.p1.color.r);
                    colors.push(t.p1.color.g);
                    colors.push(t.p1.color.b);
                    colors.push(t.p2.color.r);
                    colors.push(t.p2.color.g);
                    colors.push(t.p2.color.b);
                        }
                else{
                    colors.push(t.color.r);
                    colors.push(t.color.g);
                    colors.push(t.color.b);
                    colors.push(t.color.r);
                    colors.push(t.color.g);
                    colors.push(t.color.b);
                    colors.push(t.color.r);
                    colors.push(t.color.g);
                    colors.push(t.color.b);
            }


        }

        const webGLTriangleListModel = new WebGLModel(this.gl,this.program,2,this.gl.TRIANGLES,coords,indices,colors,null,null,null);
        webGLTriangleListModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLTriangleListModel;
    }
}

class WebGLRectangle extends Rectangle{
    constructor (gl,program,altura,largura,centro,color,interpolation){
        super(altura,largura,centro, color);
        this.gl = gl;
        this.program = program;
        this.interpolation = interpolation;
    }

    translate(dx, dy) {
        this.centro.x += dx;
        this.centro.y += dy;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){

        var coords = [this.centro.x-(this.largura/2),this.centro.y-(this.altura/2),0,
                    this.centro.x-(this.largura/2),this.centro.y+(this.altura/2),0,
                    this.centro.x+(this.largura/2),this.centro.y+(this.altura/2),0,
                    this.centro.x-(this.largura/2),this.centro.y-(this.altura/2),0,
                    this.centro.x+(this.largura/2),this.centro.y+(this.altura/2),0,
                    this.centro.x+(this.largura/2),this.centro.y-(this.altura/2),0];
        
        var indices = [0,1,2,3,4,5];
        var colors;

        if (this.interpolation == true)
        {
            colors = [this.centro.color.r,this.centro.color.g,this.centro.color.b,
                      this.centro.color.r,this.centro.color.g,this.centro.color.b,
                      this.centro.color.r,this.centro.color.g,this.centro.color.b,
                      this.centro.color.r,this.centro.color.g,this.centro.color.b,
                      this.centro.color.r,this.centro.color.g,this.centro.color.b,
                      this.centro.color.r,this.centro.color.g,this.centro.color.b,];
        }
        else{
            colors = [this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b];
        }
        

        const webGLRectangleModel = new WebGLModel(this.gl,this.program,2,this.gl.TRIANGLES,coords,indices,colors,null,null,null);
        webGLRectangleModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLRectangleModel;
    }
}



class WebGLLinha extends Linha{
    constructor (gl,program,p0,p1,color,interpolation){
        super(p0,p1,color,interpolation);
        this.gl = gl;
        this.program = program;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        var coords = [this.p0.x,this.p0.y,0,
                    this.p1.x,this.p1.y,0];

        var indices = [0,1]; 
        var colors;

        if (this.interpolation == true)
        {
        colors = [this.p0.color.r,this.p0.color.g,this.p0.color.b,
                    this.p1.color.r,this.p1.color.g,this.p1.color.b];
        }
        else{
        colors = [this.color.r,this.color.g,this.color.b,
                    this.color.r,this.color.g,this.color.b];
        }

        const webGLLinhaModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coords,indices,colors,null,null,null);
        webGLLinhaModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLLinhaModel;
    }
}


class WebGLElipse extends Elipse {
    constructor(gl, program, cx, cy, height, width, color, numSubdiv, filled) {
        super(cx, cy, height, width, numSubdiv, color);
        this.gl = gl;
        this.program = program;
        this.filled = filled;
    }

    getWebGLModel(attribShaderVariables = null, uniformShaderVariables = null) {
        var coords = [];
        var indices = [];
        var colors = [];
        var primitiveType;

        if (this.filled == true) {
            this.discreticizeFilled(this.numSubdiv, coords, indices, colors);
            primitiveType = this.gl.TRIANGLES;
        }
        else {
            this.discreticize(this.numSubdiv, coords, indices, colors);
            primitiveType = this.gl.LINE_LOOP;
        }

        const webGLElipseModel = new WebGLModel(this.gl, this.program, 2, primitiveType, coords, indices, colors, null, null, null);
        webGLElipseModel.set(attribShaderVariables, uniformShaderVariables);

        return webGLElipseModel;
    }
}


class WebGLPolygon extends Polygon {
    constructor(gl, program, color, interpolation) {
        super(color, interpolation);
        this.gl = gl;
        this.program = program;
    }

    earClipTriangulation() {
        const numPontos = this.pointList.size;
        if (numPontos < 3) return [];

        const _pointList = this.pointList.clone();

        const triangles = [];

        while (_pointList.size >= 3) {
            const earIndex = this.findEar(_pointList);
            const earTriangle = [
                _pointList.list[(earIndex - 1 + _pointList.size) % _pointList.size],
                _pointList.list[earIndex],
                _pointList.list[(earIndex + 1) % _pointList.size]
            ];
            triangles.push(earTriangle);

            _pointList.removeAt(earIndex);
        }

        return triangles;
    }

    findEar(pointList) {
        const numPontos = pointList.size;

        for (let i = 0; i < numPontos; i++) {
            const anterior = pointList.list[(i - 1 + numPontos) % numPontos];
            const atual = pointList.list[i];
            const proximo = pointList.list[(i + 1) % numPontos];

            if (this.isConvex(anterior, atual, proximo) && !this.isEar(pointList, i)) {
                return i;
            }
        }

        return -1;
    }

    isConvex(anterior, atual, proximo) {
        const crossProduct = (atual.x - anterior.x) * (proximo.y - atual.y) - (atual.y - anterior.y) * (proximo.x - atual.x);
        return crossProduct >= 0;
    }

    isEar(pointList, earIndex) {
        const numPontos = pointList.size;
        const prevIndex = (earIndex - 1 + numPoints) % numPoints;
        const nextIndex = (earIndex + 1) % numPoints;

        const anterior = pointList.list[prevIndex];
        const atual = pointList.list[earIndex];
        const proximo = pointList.list[nextIndex];

        for (let i = 0; i < numPoints; i++) {
            if (i !== prevIndex && i !== earIndex && i !== nextIndex) {
                const point = pointList.list[i];
                if (this.pointInTriangle(anterior, atual, proximo, point)) {
                    return false;
                }
            }
        }

        return true;
    }

    pointInTriangle(a, b, c, p) {
        const signAB = this.sign(p, a, b);
        const signBC = this.sign(p, b, c);
        const signCA = this.sign(p, c, a);

        const temNegativo = (signAB < 0 || signBC < 0 || signCA < 0);
        const temPositivo = (signAB > 0 || signBC > 0 || signCA > 0);

        return !(temNegativo && temPositivo);
    }

    sign(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }


    translate(dx, dy) {
        for (let i = 0; i < this.pointList.size; i++) {
            this.pointList.list[i].x += dx;
            this.pointList.list[i].y += dy;
        }
    }

    rotate(angle) {
        const centerX = this.calculateCentroid().x;
        const centerY = this.calculateCentroid().y;

        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);

        for (let i = 0; i < this.pointList.size; i++) {
            const px = this.pointList.list[i].x;
            const py = this.pointList.list[i].y;

            this.pointList.list[i].x = centerX + (px - centerX) * cosAngle - (py - centerY) * sinAngle;
            this.pointList.list[i].y = centerY + (px - centerX) * sinAngle + (py - centerY) * cosAngle;
        }
    }

    calculateCentroid() {
        let sumX = 0;
        let sumY = 0;
        for (let i = 0; i < this.pointList.size; i++) {
            sumX += this.pointList.list[i].x;
            sumY += this.pointList.list[i].y;
        }
        return new Vec3d(sumX / this.pointList.size, sumY / this.pointList.size, 0);
    }

    getWebGLModel(attribShaderVariables = null, uniformShaderVariables = null) {
        const triangles = this.earClipTriangulation();
        const coords = [];
        const indices = [];
        const colors = [];

        for (let i = 0; i < triangles.length; i++) {
            const triangle = triangles[i];
            for (let j = 0; j < 3; j++) {
                const p = triangle[j];
                coords.push(p.x);
                coords.push(p.y);
                coords.push(0.0);
                indices.push(coords.length / 3 - 1);

                if (this.interpolation == true) {
                    colors.push(this.color.r);
                    colors.push(this.color.g);
                    colors.push(this.color.b);
                } else {
                    colors.push(p.color.r);
                    colors.push(p.color.g);
                    colors.push(p.color.b);
                }
            }
        }

        const webGLPolygonModel = new WebGLModel(this.gl, this.program, 2, this.gl.TRIANGLES, coords, indices, colors, null, null, null);
        webGLPolygonModel.set(attribShaderVariables, uniformShaderVariables);

        return webGLPolygonModel;
    }
}



class WebGLCircle extends Circle{
    constructor (gl,program,cx,cy,radius,color,numSubdiv,filled,interpolation){
        super(cx,cy,radius,color,numSubdiv);
        this.gl = gl;
        this.program = program;
        this.interpolation = interpolation;
        this.filled = filled;
    
    }

    translate(dx, dy) {
        this.cx += dx;
        this.cy += dy;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var indices = [];
        var colors = [];
        var primitiveType;

        if (this.filled == true){
            this.discreticizeFilled(this.numSubdiv,coords,indices,colors);
            primitiveType = this.gl.TRIANGLES;
        }
        else{
            this.discreticize(this.numSubdiv,coords,indices,colors);
            primitiveType = this.gl.LINE_LOOP;
        }
 
        const webGLCircleModel = new WebGLModel(this.gl,this.program,2,primitiveType,coords,indices,colors,null,null,null);
        webGLCircleModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLCircleModel;
    }
}


class WebGLBezier extends Bezier{
    constructor (gl,program,color,controlPoints,degree,nDiv,filled = false, interpolation = false){
        super(controlPoints,degree,color);
        this.gl = gl;
        this.program = program;
        this.nDiv = nDiv;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var colors = [];
        var indices = [];
        var indicesEdges = [];
        var coordsPol = [];
        var colorsPol = [];
        var indicesPol = [];
        var indicesEdgesPol = [];
        
        this.discreticize(this.nDiv,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol);
      
        const webGLBezierControlPointsModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coordsPol,indicesPol,colorsPol,null,null,null);
        webGLBezierControlPointsModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBezierControlPointsEdgesModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coordsPol,indicesEdgesPol,colorsPol,null,null,null);
        webGLBezierControlPointsEdgesModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBezierModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coords,indicesEdges,colors,null,null,null);
        webGLBezierModel.set(attribShaderVariables,uniformShaderVariables);

        return [webGLBezierControlPointsModel,webGLBezierControlPointsEdgesModel,webGLBezierModel];
    }
}

class WebGLBSpline extends BSpline{
    constructor (gl,program,color,controlPoints,knots,degree,nDiv,filled = false, interpolation = false){
        super(controlPoints,knots,degree,color);
        this.gl = gl;
        this.program = program;
        this.nDiv = nDiv;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var colors = [];
        var indices = [];
        var indicesEdges = [];
        var coordsPol = [];
        var colorsPol = [];
        var indicesPol = [];
        var indicesEdgesPol = [];
        
        this.discreticize(this.nDiv,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol);
      
        const webGLBSplineControlPointsModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coordsPol,indicesPol,colorsPol,null,null,null);
        webGLBSplineControlPointsModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBSplineControlPointsEdgesModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coordsPol,indicesEdgesPol,colorsPol,null,null,null);
        webGLBSplineControlPointsEdgesModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBSplineModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coords,indicesEdges,colors,null,null,null);
        webGLBSplineModel.set(attribShaderVariables,uniformShaderVariables);

        return [webGLBSplineControlPointsModel,webGLBSplineControlPointsEdgesModel,webGLBSplineModel];
    }
}

