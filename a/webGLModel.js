/*Esta classe descreve um modelo WebGL contendo os dados que devem ser passados da CPU para a GPU*/
/*A classe mantem uma referência para o contexto gl e para o program shader */

class WebGLModel{
    constructor(gl,program,dim,primitiveType,coords,indices,colors,normals,tangents,textureCoords){
        this.gl = gl;
        this.program = program;
        this.dim = dim;
        this.primitiveType = primitiveType; 
        this.coords = coords; // Dados das coordenadas em CPU
        this.indices = indices; // Dados dos indices em CPU
        this.colors = colors; // Dados das cores em CPU
        this.normals = normals; // Dados das normais em CPU
        this.tangents = tangents; // Dados dos vetores tangente em CPU
        this.textureCoords = textureCoords; // Dados de coordenadas de texture em CPU
        this.VAO = null; // VAO
        this.coordsVBO = null; // Buffer de coordenadas
        this.colorsVBO = null; // Buffer de cores
        this.normalsVBO = null; // Buffer de vetores normais
        this.tangentsVBO = null; // Buffer de vetores tangentes
        this.textureCoordsVBO = null; // Buffer de coordenadas de textura
        this.IBO = null; // Buffer de indices
    }

    useProgram(){
        this.gl.useProgram(this.program); // Habilita o shader
    }

    /* Inicializa of buffers. Somente foram implementados os buffers de coordenadas, cores e indices */
    initBuffers(){
        // Create VAO
        this.VAO = this.gl.createVertexArray();

        // Bind VAO
        this.gl.bindVertexArray(this.VAO);

        //Create all VBOs
        this.coordsVBO = this.gl.createBuffer(); //VBO para as coordenadas
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.coordsVBO); // Ativar o buffer criado. Ele VBO ativo no momento atual
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.coords), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.program.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.program.aVertexPosition);

        //Passo 3
        this.colorsVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorsVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.program.aVertexColor, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.program.aVertexColor);
      
        //Passo 4
        this.IBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);


        // Clean
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

    }

    /* Metodo auxiliar que inicializa os buffers e o program shader */
    set(attribShaderVariables,uniformShaderVariables){
        this.initBuffers();
        this.useProgram();
    }

    /* Desenha o model */
    draw(){
 
        // Bind VAO
        this.gl.bindVertexArray(this.VAO);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        this.gl.drawElements(this.primitiveType, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
  

        // Clean
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}