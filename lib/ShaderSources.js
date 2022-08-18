export const vsPhongSource = `
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
export const fsPhongSource = `
    varying highp vec2 v_textureCoord;
    uniform sampler2D u_sampler;

    void main()
    {
        gl_FragColor = texture2D(u_sampler, v_textureCoord);
    }
`;
export const vsFrameBufferSource = `
    attribute vec4 a_position;
    attribute vec2 a_textureCoord;

    varying highp vec2 v_textureCoord;

    void main() {
        gl_Position = a_position;
        v_textureCoord = a_textureCoord;
    }
`;
export const fsFrameBufferSource = `
    varying highp vec2 v_textureCoord;
    uniform sampler2D u_sampler;

    void main()
    {
        highp vec4 color = texture2D(u_sampler, v_textureCoord);
        gl_FragColor = vec4(color.r, color.g, color.b, color.a);
    }
`;
