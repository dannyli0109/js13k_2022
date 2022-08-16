export const vsSource = `
    attribute vec4 a_position;
    attribute vec2 a_textureCoord;
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_modelViewMatrix;

    varying highp vec2 v_textureCoord;

    void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
        v_textureCoord = a_textureCoord;
    }
`;
export const fsSource = `
    varying highp vec2 v_textureCoord;
    uniform sampler2D u_sampler;

    void main()
    {
        gl_FragColor = texture2D(u_sampler, v_textureCoord);
    }
`;
