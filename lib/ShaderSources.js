export const vsPhongSource = `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_textureCoord;
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_modelViewMatrix;

    out vec2 v_textureCoord;

    void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
        v_textureCoord = a_textureCoord;
    }
`;
export const fsPhongSource = `#version 300 es
    precision highp float;
    in vec2 v_textureCoord;
    uniform sampler2D u_sampler;
    out vec4 out_color;

    void main()
    {
        out_color = texture(u_sampler, v_textureCoord);
    }
`;
export const vsFrameBufferSource = `#version 300 es
    in vec4 a_position;
    in vec2 a_textureCoord;

    out vec2 v_textureCoord;

    void main() {
        gl_Position = a_position;
        v_textureCoord = a_textureCoord;
    }
`;
export const fsFrameBufferSource = `#version 300 es
    precision highp float;
    in vec2 v_textureCoord;
    uniform sampler2D u_sampler;
    out vec4 out_color;

    void main()
    {
        highp vec4 color = texture(u_sampler, v_textureCoord);
        out_color = vec4(color.r, color.g, color.b, color.a);
    }
`;
