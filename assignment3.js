import {defs, tiny} from './examples/common.js';


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;
class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class TwoDGolfHole extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [0, 0, -Math.sqrt(2)], [-1, 0, -1], [-Math.sqrt(2), 0, 0],
            [0, 0, -Math.sqrt(2)], [-Math.sqrt(2), 0, 0], [-1, 0, 1],
            [0, 0, -Math.sqrt(2)], [-1, 0, 1], [0, 0, Math.sqrt(2)],
            [0, 0, -Math.sqrt(2)], [0, 0, Math.sqrt(2)], [1, 0, 1],
            [0, 0, -Math.sqrt(2)], [1, 0, 1], [Math.sqrt(2), 0, 0],
            [0, 0, -Math.sqrt(2)], [Math.sqrt(2), 0, 0], [1, 0, -1]);
        this.arrays.normal = Vector3.cast(
            [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [0, 1, 0], [0, 1, 0], [0, 1, 0]);
        // Cube normals = sets of 4, each correspond to outward of the face?
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            9, 10, 11,
            12, 13, 14,
            15, 16, 17);
    }
}

class ThreeDGolfHoleCorner extends Shape {
    constructor() {
        super("position", "normal",);
        // Messed up CCW on many of these sorry
        // Missing bottom
        this.arrays.position = Vector3.cast(
            // Insides
            [0, 0, -Math.sqrt(2)], [-0.5, -1, -0.5], [0, -1, -Math.sqrt(2)/2],
            [0, 0, -Math.sqrt(2)], [-1, 0, -1], [-0.5, -1, -0.5],
            [-1, 0, -1], [-Math.sqrt(2)/2, -1, 0], [-0.5, -1, -0.5],
            [-1, 0, -1], [-Math.sqrt(2), 0, 0], [-Math.sqrt(2)/2, -1, 0],
            [0, -1, -Math.sqrt(2)/2], [-0.5, -1, -0.5], [0, -1.5, 0],
            [-0.5, -1, -0.5], [-Math.sqrt(2)/2, -1, 0], [0, -1.5, 0],
            // Outsides
            [0, -1.5, -Math.sqrt(2)], [-1, 0, -1], [0, 0, -Math.sqrt(2)],
            [0, -1.5, -Math.sqrt(2)], [-1, -1.5, -1], [-1, 0, -1],
            [-1, -1.5, -1], [-Math.sqrt(2), 0, 0], [-1, 0, -1],
            [-1, -1.5, -1], [-Math.sqrt(2), -1.5, 0], [-Math.sqrt(2), 0, 0],
            // Not seen in final golf hole
            [0, -1.5, -Math.sqrt(2)], [0, -1, -Math.sqrt(2)/2], [0, 0, -Math.sqrt(2)],
            [0, -1.5, -Math.sqrt(2)], [0, -1.5, 0], [0, -1, -Math.sqrt(2)/2],
            // Not seen in final golf hole
            [-Math.sqrt(2), -1.5, 0], [-Math.sqrt(2), 0, 0], [-Math.sqrt(2)/2, -1, 0],
            [-Math.sqrt(2), -1.5, 0], [-Math.sqrt(2)/2, -1, 0], [0, -1.5, 0]);
        // Normals not init properly
        this.arrays.normal = Vector3.cast(
            [Math.sqrt(2)-1, Math.sqrt(2)/2, 1], [Math.sqrt(2)-1, Math.sqrt(2)/2, 1], [Math.sqrt(2)-1, Math.sqrt(2)/2, 1],
            [Math.sqrt(2)-1, Math.sqrt(2)/2, 1], [Math.sqrt(2)-1, Math.sqrt(2)/2, 1], [Math.sqrt(2)-1, Math.sqrt(2)/2, 1],
            [1, Math.sqrt(2)/2, Math.sqrt(2)-1], [1, Math.sqrt(2)/2, Math.sqrt(2)-1], [1, Math.sqrt(2)/2, Math.sqrt(2)-1],
            [1, Math.sqrt(2)/2, Math.sqrt(2)-1], [1, Math.sqrt(2)/2, Math.sqrt(2)-1], [1, Math.sqrt(2)/2, Math.sqrt(2)-1],
            [Math.sqrt(2)-1, Math.sqrt(2), 1], [Math.sqrt(2)-1, Math.sqrt(2), 1], [Math.sqrt(2)-1, Math.sqrt(2), 1],
            [1, Math.sqrt(2), Math.sqrt(2)-1], [1, Math.sqrt(2), Math.sqrt(2)-1], [1, Math.sqrt(2), Math.sqrt(2)-1],
            [1, 0, 1/(Math.sqrt(2)-1)], [1, 0, 1/(Math.sqrt(2)-1)], [1, 0, 1/(Math.sqrt(2)-1)],
            [1, 0, 1/(Math.sqrt(2)-1)], [1, 0, 1/(Math.sqrt(2)-1)], [1, 0, 1/(Math.sqrt(2)-1)],
            [(Math.sqrt(2)-1), 0, 1], [(Math.sqrt(2)-1), 0, 1], [(Math.sqrt(2)-1), 0, 1],
            [(Math.sqrt(2)-1), 0, 1], [(Math.sqrt(2)-1), 0, 1], [(Math.sqrt(2)-1), 0, 1],
            [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1],
            [0, 0, 1], [0, 0, 1], [0, 0, 1]);
        // Cube normals = sets of 4, each correspond to outward of the face?
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            9, 10, 11,
            12, 13, 14,
            15, 16, 17,
            18, 19, 20,
            21, 22, 23,
            24, 25, 26,
            27, 28, 29,
            30, 31, 32,
            33, 34, 35,
            36, 37, 38,
            39, 40, 41);
    }
}

export class Assignment3 extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();


        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            circle: new defs.Regular_2D_Polygon(1, 15),
            flat_terrain: new Cube(),
            wall: new Cube(),
            // TODO:  Fill in as many additional shape instances as needed in this key/value table.
            //        (Requirement 1)
            sphere1: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(1),
            sphere2: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            sphere3: new defs.Subdivision_Sphere(3),
            sphere4: new defs.Subdivision_Sphere(4),
            golfBall: new defs.Subdivision_Sphere(4),
            twoDGolfHole: new TwoDGolfHole(),
            threeDGolfHoleCorner: new ThreeDGolfHoleCorner()
 
        };


        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            ring: new Material(new Ring_Shader()),
            flat_terrain: new Material(new defs.Phong_Shader(), {ambient: 0.7, diffusivity: 0.0, specularity: 0.0, color: hex_color("#30ff30")}),
            wall: new Material(new defs.Phong_Shader(), {ambient: 0.7, diffusivity: 0.2, specularity: 0.0, color: hex_color("#f0f0f0")}),
            // TODO:  Fill in as many additional material objects as needed in this key/value table.
            //        (Requirement 4)
            golfBall: new Material(new defs.Phong_Shader(),
            {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            golfHole: new Material(new defs.Phong_Shader(), {ambient: .4, diffusivity: .6, color: hex_color("#bbbbbb")})

 
        }

        this.animated = true;
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.ball_moving = false;
        this.ball_location = Mat4.translation(0, 1, 0).times(Mat4.identity());
        //ball_direction should always be a unit vector
        this.ball_direction = vec3(-1.0/Math.sqrt(2.0), 0, -1.0/Math.sqrt(2.0));
        this.ball_speed = 1;
        //really, this friction coefficient is friction coeff * g, but it is simpler to do this since g is a constant anyway
        this.friction_coefficient = 0.6;
        this.speed_threshhold = 0.01;
        
    }


    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Move the golf ball", [" "],
            () => {
            //decided to forbid player from hitting while ball is still moving, this can be changed
            if(this.ball_moving === false) {
                this.ball_speed = 1;
                this.ball_moving = true}
            });
        this.new_line();
        //for now, allow simple direction reversal
        this.key_triggered_button("Reverse the direction of the golf ball", ["x"],
            () => this.ball_direction = Mat4.rotation(Math.PI, 0, 1, 0).times(this.ball_direction));
    }


    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        // TODO: Lighting (Requirement 2)
        const light_position = vec4(5, 5, 0, 1);
        // The parameters of the Light are: position, color, size
        //program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
        //let b_light_pos = vec4(0,5,5,1);
        //let g_light_pos = vec4(5,5,0,1);
        //program_state.lights = [new Light(light_position, color(1, 0, 0, 1), 1000), new Light(b_light_pos, color(0,0,1,1), 1000), new Light(g_light_pos, color(0,1,0,1), 1000)];


        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 3 and 4)
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();

        // Test rotate light
        let light_transform = vec4(5, 5, 0, 1);
        light_transform = vec4(2.5+2.5*Math.sin(t), 5, 2.5+2.5*Math.cos(t), 1);
        program_state.lights = [new Light(light_transform, color(1, 1, 1, 1), 1000)];

        //this.shapes.torus.draw(context, program_state, model_transform, this.materials.test.override({color: yellow}));

        // Ground
        let ground_transform = model_transform.times(Mat4.scale(15,0.1,15));
        this.shapes.flat_terrain.draw(context, program_state, ground_transform, this.materials.flat_terrain);
        let wall_transform = Mat4.identity();
        for (let i = 0; i < 4; i++) {
            wall_transform = wall_transform.times(Mat4.translation(15,0,0));
            wall_transform = wall_transform.times(Mat4.scale(0.1,1,15.1));
            this.shapes.wall.draw(context, program_state, wall_transform, this.materials.wall);
            wall_transform = wall_transform.times(Mat4.scale(10,1,1/15.1));
            wall_transform = wall_transform.times(Mat4.translation(-15,0,0));
            wall_transform = wall_transform.times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        }

        // Golf hole
        let hole_transform = Mat4.identity();
        hole_transform = hole_transform.times(Mat4.translation(2.5,3,2.5));
        //this.shapes.twoDGolfHole.draw(context, program_state, hole_transform, this.materials.golfHole);
        //this.shapes.threeDGolfHoleCorner.draw(context, program_state, hole_transform, this.materials.golfHole);
        this.display_golf_hole(context, program_state, hole_transform);
        
        if (this.ball_moving){
            this.move_golf_ball();
            this.friction_update(dt)
        }
        this.shapes.golfBall.draw(context, program_state, this.ball_location, this.materials.golfBall);

    }

    get_ball_velocity(){
        return this.ball_direction.times(this.ball_speed);
    }

    move_golf_ball(){
        const velocity = this.get_ball_velocity();
        if(this.ball_speed < this.speed_threshhold){
            this.ball_moving = false;
            return;
        }
        this.ball_location = Mat4.translation(...velocity).times(this.ball_location);
    }


    display_golf_hole(context, program_state, hole_transform) {
        for (let i = 0; i < 4; i++) {
            this.shapes.threeDGolfHoleCorner.draw(context, program_state, hole_transform, this.materials.golfHole);
            hole_transform = hole_transform.times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        }
    }

    friction_update(dt) {
        //only decelerate as much as needed for each frame
        const friction_update = dt * this.friction_coefficient * this.ball_speed;
        this.ball_speed = this.ball_speed - friction_update;
    }


    //note: the y here refers to z in the xyz plane
    display_golf_ball(context,program_state,golf_model,time,x,y){
        
        golf_model = golf_model.times(Mat4.translation(0,1,0));
        let saved_model = golf_model;
        if (this.animated){
            if (x/2 + Math.sin(time)*x/2 >= x-0.001){
                this.animated = false;
            }
            golf_model = golf_model.times(Mat4.translation(x/2 + Math.sin(time)*x/2,0,y/2 + Math.sin(time)*y/2));
        }
        else{
            golf_model = saved_model.times(Mat4.translation(x,0,y));
        }
        this.shapes.golfBall.draw(context, program_state, golf_model, this.materials.golfBall);
    }
}



class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)


    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }


    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;


        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        // ***** PHONG SHADING HAPPENS HERE: *****                                      
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the
                // light will appear directional (uniform direction from all points), and we
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to
                // the point light's location from the current surface point.  In either case,
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz -
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                            
                float distance_to_light = length( surface_to_light_vector );


                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
               
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }


    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
           
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
   
            void main(){                                                                  
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
            } `;
    }


    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                          
                // Compute an initial (ambient) color:
                gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
            } `;
    }


    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }


    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));


        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;


        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }


    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.


        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);


        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}


class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }


    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }


    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
       
        void main(){
         
        }`;
    }


    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
         
        }`;
    }
}



