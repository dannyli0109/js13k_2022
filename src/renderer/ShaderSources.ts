export const vsPhongSource = `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_textureCoord;
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewMatrix;

    out vec2 v_textureCoord;

    void main() {
        gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
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
        highp vec4 color = texture(u_sampler, v_textureCoord);
        if (color.a == 0.0) { discard; }
        out_color = color;
    }
`;

export const vsFrameBufferSource = `#version 300 es
    in vec4 a_position;
    in vec2 a_textureCoord;
    out vec2 v_textureCoord;

    void main() {
        vec4 pos = vec4(a_position.x * 2.0, a_position.y * 2.0, a_position.z * 2.0, 1.0);
        gl_Position = pos;
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
