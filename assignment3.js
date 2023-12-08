import {defs, tiny} from './examples/common.js';

// Credit to Robert Lu

/*
// Pull these names into this module's scope for convenience:
const {vec3, vec4, vec, color, Matrix, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Cube, Axis_Arrows, Textured_Phong, Phong_Shader, Basic_Shader, Subdivision_Sphere} = defs
 */

import {Shape_From_File} from './examples/obj-file-demo.js'
import {
    Color_Phong_Shader, Shadow_Textured_Phong_Shader,
    Depth_Texture_Shader_2D, Buffered_Texture, LIGHT_DEPTH_TEX_SIZE, Textured_Shadow_Textured_Phong_Shader
} from './examples/shadow-demo-shaders.js'


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;
//const {Cube,Textured_Phong} = defs;
const {Cube, Axis_Arrows, Textured_Phong, Phong_Shader, Basic_Shader, Subdivision_Sphere} = defs


const Square =
    class Square extends tiny.Vertex_Buffer {
        constructor() {
            super("position", "normal", "texture_coord");
            this.arrays.position = [
                vec3(0, 0, 0), vec3(1, 0, 0), vec3(0, 1, 0),
                vec3(1, 1, 0), vec3(1, 0, 0), vec3(0, 1, 0)
            ];
            this.arrays.normal = [
                vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
                vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
            ];
            this.arrays.texture_coord = [
                vec(0, 0), vec(1, 0), vec(0, 1),
                vec(1, 1), vec(1, 0), vec(0, 1)
            ]
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
        this.indices.push(
            0, 1, 2,
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
            39, 40, 41
        );
        this.arrays.texture_coord = this.arrays.position;
    }
}

class GolfHoleGrassEdge extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [0, 0, -Math.sqrt(2)], [-1, 0, -1], [-Math.sqrt(2), 0, -Math.sqrt(2)],
            [-Math.sqrt(2), 0, -Math.sqrt(2)], [-1, 0, -1], [-Math.sqrt(2), 0, 0]);
        this.arrays.normal = Vector3.cast(
            [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 3, 4, 5);
        this.arrays.texture_coord = Vector.cast([0, 0, -Math.sqrt(2)], [-1, 0, -1], [-Math.sqrt(2), 0, -Math.sqrt(2)],
            [-Math.sqrt(2), 0, -Math.sqrt(2)], [-1, 0, -1], [-Math.sqrt(2), 0, 0]);
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
            circle: new defs.Regular_2D_Polygon(1, 60),
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
            threeDGolfHoleCorner: new ThreeDGolfHoleCorner(),
            golfHoleGrassEdge: new GolfHoleGrassEdge(),
            angleBall: new defs.Subdivision_Sphere(4),
            cube1: new Cube(),
            "teapot": new Shape_From_File("assets/teapot.obj"),
            "sphere": new Subdivision_Sphere(6),
            "cube": new Cube(),
            "square_2d": new Square(),
 
        };


        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            ring: new Material(new Ring_Shader()),
            flat_terrain: new Material(new defs.Phong_Shader(), {
                ambient: 0.7, 
                diffusivity: 0.0, 
                specularity: 0.0, 
                color: hex_color("#30ff30")
            }),
            //wall: new Material(new defs.Phong_Shader(), {ambient: 0.7, diffusivity: 0.2, specularity: 0.0, color: hex_color("#f0f0f0")}),
            wall: new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
                color: hex_color("#000000"), ambient: 0.7, diffusivity: 0.2, specularity: 0.0, smoothness: 64,
                color_texture: new Texture("assets/wall.jpg", "NEAREST"),
                light_depth_texture: null
            }),
            // TODO:  Fill in as many additional material objects as needed in this key/value table.
            //        (Requirement 4)
            //flagPole: new Material(new defs.Phong_Shader(), {ambient: 0.7, diffusivity: 0.2, specularity: 0.0, color: hex_color("#000000")}),
            flagPole: new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
                color: hex_color("#000000"),
                ambient: 0.7, diffusivity: 0.2, specularity: 0.0, smoothness: 64,
                color_texture: new Texture("assets/flagpole.png"),
                light_depth_texture: null
            }),
            //flag: new Material(new defs.Phong_Shader(), {ambient: 0.7, diffusivity: 0.2, specularity: 0.0, color: hex_color("#FF0000")}),
            flag: new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
                ambient: 0.7, diffusivity: 0.2, specularity: 0.0, color: hex_color("#000000"),
                color_texture: new Texture("assets/uclalogo.png", "NEAREST"),
                light_depth_texture: null
            }),
            //golfBall: new Material(new defs.Phong_Shader(), {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            golfBall: new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
                ambient: 0.4, diffusivity: 0.0, specularity: 0.0, color: hex_color("#000000"),
                color_texture: new Texture("assets/170520_01_Golf_seamless_pattern_vector.jpg", "NEAREST"),
                light_depth_texture: null
            }),
            angleBall: new Material(new defs.Phong_Shader(), {color: hex_color("#c00000")}),
            //golfHole: new Material(new defs.Phong_Shader(), {ambient: .4, diffusivity: .6, color: hex_color("#bbbbbb")}),
            golfHole: new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
                color: hex_color("#000000"), ambient: 0.4, diffusivity: 0.6, specularity: 0.4, smoothness: 64,
                //texture: new Texture("assets/flagpole.png", "NEAREST"),
                color_texture: new Texture("assets/flagpole.png", "NEAREST"),
                light_depth_texture: null
            }),
            //grass: new Material(new Textured_Phong(), {
            grass: new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
                //color: hex_color("#000000"),
                //ambient: 1,
                //texture: new Texture("assets/grassTex.png", "NEAREST"),
                color: hex_color("#000000"), ambient: 0.0, diffusivity: 0.6, specularity: 0.4, smoothness: 64,
                color_texture: new Texture("assets/grassTex.png", "NEAREST"),
                light_depth_texture: null
            }),
            //sand: new Material(new Textured_Phong(), {
            sand: new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
                color: hex_color("#000000"),
                ambient: 1, 
                color_texture: new Texture("assets/sand.png", "NEAREST")
            }),
            sand2: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, 
                texture: new Texture("assets/sand2.png", "NEAREST")
            }),
            dirt: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, 
                texture: new Texture("assets/dirt.png", "NEAREST")
            }),
            mud: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, 
                texture: new Texture("assets/mud.png", "NEAREST")
            }),
            compass: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/img_1.png", "NEAREST")
            })
 
        }

        this.animated = true;
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.ball_moving = false;
        this.hit_power_change = false;
        //this.hit_direction_change = true;
        this.hit_direction_change = false;


        this.ball_location = Mat4.translation(85, 1, 0).times(Mat4.identity());
        this.ball_direction = vec3(1, 0, 0);
        this.ball_speed = 1.0;

        this.min_ball_speed_on_hit = 0.7;
        this.max_ball_speed_on_hit = 5.0;

        this.power_speed_ratio = 2.0;

        this.hit_power = this.ball_speed * this.power_speed_ratio;
        this.hit_power_increasing = true;
        this.hit_direction = this.ball_direction;
        this.angle_ball_location = this.angle_ball_location = Mat4.translation(...(this.hit_direction.times(this.hit_power))).times(this.ball_location.times(Mat4.scale(0.3,0.3,0.3)));

        this.ball_speed = 1.0;
        //really, this friction coefficient is friction coeff * g, but it is simpler to do this since g is a constant anyway
        this.friction_coefficient = 0.6;
        this.drag_coefficient = 0.5;
        this.speed_threshhold = 0.01;

        this.grav_vec = vec3(0,-0.01,0);
        this.norm_vec = vec3(0,0.01,0);
        this.grav_mult = 2.25;

        this.x_bound_low = -13.95; // 15 - 0.05 for wall width - 1 for radius of golf ball
        this.x_bound_high = 114.95;
        this.y_bound_low = -13.95;
        this.y_bound_high = 13.95;
        this.z_bound = 1.05; // 0.05 ground height + 1 radius of golf ball
        // some intersection with ground = golf is "in grass" rather than floating above
        this.entered_hole = false;

        this.cam_dir = 0.0;
        this.cam_angle = 0.0;
        this.cam_loc = Mat4.identity().times(Mat4.translation(-85,-61,-80));
        this.m_x = 1002.0; // center of compass
        this.m_y = 527.0; // center of compass
        this.enable_free_fly_cam = false;

        this.cube1_transform = Mat4.identity().times(Mat4.translation(0, 5, 0, 0));


        // For the teapot
        this.stars = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(.5, .5, .5, 1),
            ambient: .4, diffusivity: .5, specularity: .5,
            color_texture: new Texture("assets/grassTex.png"),
            light_depth_texture: null

        });
        // For the floor or other plain objects
        this.floor = new Material(new Textured_Shadow_Textured_Phong_Shader(1), {
            color: hex_color("#000000"), ambient: 0.0, diffusivity: 0.6, specularity: 0.4, smoothness: 64,
            color_texture: new Texture("assets/grassTex.png"),
            light_depth_texture: null
        })
        // For the first pass
        this.pure = new Material(new Color_Phong_Shader(), {
        })
        // For light source
        this.light_src = new Material(new Phong_Shader(), {
            color: color(1, 1, 1, 1), ambient: 1, diffusivity: 0, specularity: 0
        });
        // For depth texture display
        this.depth_tex =  new Material(new Depth_Texture_Shader_2D(), {
            color: color(0, 0, .0, 1),
            ambient: 1, diffusivity: 0, specularity: 0, texture: null
        });

        // To make sure texture initialization only does once
        this.init_ok = false;

        this.canv = document.querySelector("#main-canvas.canvas-widget");
        let canvelem = document.getElementById("main-canvas");
        this.canv.addEventListener("click", (event) => {
            if (0 === event.button) {
                canvelem = document.getElementById("main-canvas");
                let offset_x = parseFloat(getComputedStyle(canvelem).marginLeft.substring(0,3));
                let offset_y = parseFloat(getComputedStyle(canvelem).marginTop.substring(0,3));
                console.log((event.pageX - offset_x) + ":" + (event.pageY - offset_y));
                this.m_x = event.pageX - offset_x;
                this.m_y = event.pageY - offset_y;
            }
        });

        this.count_hits = 0;

    }


    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Move the golf ball", [" "],
            () => {
            //decided to forbid player from hitting while ball is still moving, this can be changed
            if(!(this.ball_moving || this.hit_direction_change || this.hit_power_change)) {
                /*if(this.angle_ball_rotation) {
                    this.angle_handler();
                }*/
                this.ball_moving = true;
                this.count_hits += 1;}
            });
        this.new_line();
        //for now, allow simple direction reversal
        this.key_triggered_button("Reverse the direction of the golf ball", ["x"],
            //() => this.ball_direction = Mat4.rotation(Math.PI, 0, 1, 0).times(this.ball_direction)
                    () => this.ball_direction = this.ball_direction.times(-1));
        this.new_line();
        //this.key_triggered_button("Select hit direction/power", ["k"],
            //() => this.hit_direction_change ? this.hit_direction_handler() : this.hit_power_handler());
        //make sure hit power can only be changed when the ball is NOT moving
        //probably code it very similarly to angle ball rotation, make sure to recalc new angle ball location BEFORE doing rotation
        this.new_line();
        this.key_triggered_button("Spin camera left", ["i"],
            () => this.cam_dir = -1.0);
        this.new_line();
        this.key_triggered_button("Hold camera", ["o"],
            () => this.cam_dir = 0.0);
        this.new_line();
        this.key_triggered_button("Spin camera right", ["p"],
            () => this.cam_dir = 1.0);

        // DEBUG
        this.new_line();
        this.key_triggered_button("Toggle free move camera", ["~"],
            () => this.enable_free_fly_cam = !this.enable_free_fly_cam);


    }

    set_angle_ball_location(){
        this.angle_ball_location = Mat4.translation(...(this.hit_direction.times(this.hit_power))).times(this.ball_location.times(Mat4.scale(0.3,0.3,0.3)));
    }

    hit_direction_handler(){
        if (this.ball_moving){
            return;
        }
        if (this.hit_direction_change) {
            this.ball_direction = this.hit_direction;
            this.hit_direction_change = false;
            this.hit_power_change = true;
        }
        else {
            this.hit_direction = vec3(this.ball_direction[0], 0, this.ball_direction[2]);
            this.set_angle_ball_location();
        }
    }

    hit_power_handler() {
        if (this.ball_moving) {
            return;
        }
        if (this.hit_power_change) {
            this.ball_speed = this.hit_power / this.power_speed_ratio;
            this.hit_power_change = false;
        } else {
            this.hit_power = this.ball_speed * this.power_speed_ratio;
            this.set_angle_ball_location();
        }
    }

    stopping_handler(){
        this.ball_moving = false;
        this.ball_speed = 1.0;
        this.hit_power_increasing = true;
        //set false just to make sure nothing breaks
        this.hit_direction_change = false;
        this.hit_direction_handler();
        this.hit_power_change = false;
        this.hit_power_handler();
        this.hit_direction_change = true;

        // New
        this.hit_power_change = false;
        this.hit_direction_change = false;

        this.hit_power = this.power_speed_ratio; // trying to make small ball further away from golf ball after golf ball moves but not working
        if(this.count_hits === 5){
            alert('Wow, at five strokes already?');
        }
        if(this.count_hits === 10){
            alert('Ten strokes\n Maybe golf isn\'t the game for you.');
        }
        if(this.count_hits === 100){
            alert('Just give up lol');
        }
    }

    get_norm_mult() {
        return this.norm_vec.times(this.grav_mult);
    }

    get_grav_mult() {
        return this.grav_vec.times(this.grav_mult);
    }


    texture_buffer_init(gl) {
        // Depth Texture
        this.lightDepthTexture = gl.createTexture();
        // Bind it to TinyGraphics
        this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);
        this.stars.light_depth_texture = this.light_depth_texture
        this.floor.light_depth_texture = this.light_depth_texture
        this.materials.grass.light_depth_texture = this.light_depth_texture
        this.materials.flagPole.light_depth_texture = this.light_depth_texture
        this.materials.flag.light_depth_texture = this.light_depth_texture
        this.materials.golfBall.light_depth_texture = this.light_depth_texture
        this.materials.golfHole.light_depth_texture = this.light_depth_texture

        this.lightDepthTextureSize = LIGHT_DEPTH_TEX_SIZE;
        gl.bindTexture(gl.TEXTURE_2D, this.lightDepthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,      // target
            0,                  // mip level
            gl.DEPTH_COMPONENT, // internal format
            this.lightDepthTextureSize,   // width
            this.lightDepthTextureSize,   // height
            0,                  // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT,    // type
            null);              // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Depth Texture Buffer
        this.lightDepthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,       // target
            gl.DEPTH_ATTACHMENT,  // attachment point
            gl.TEXTURE_2D,        // texture target
            this.lightDepthTexture,         // texture
            0);                   // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // create a color texture of the same size as the depth texture
        // see article why this is needed_
        this.unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.unusedTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.lightDepthTextureSize,
            this.lightDepthTextureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // attach it to the framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,        // target
            gl.COLOR_ATTACHMENT0,  // attachment point
            gl.TEXTURE_2D,         // texture target
            this.unusedTexture,         // texture
            0);                    // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:

        const gl = context.context;

        if (!this.init_ok) {
            const ext = gl.getExtension('WEBGL_depth_texture');
            if (!ext) {
                return alert('need WEBGL_depth_texture');  // eslint-disable-line
            }
            this.texture_buffer_init(gl);

            this.init_ok = true;
        }

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

        // Camera work
        this.cam_angle = (this.cam_angle + this.cam_dir * dt) % (2.0 * Math.PI);
        if (!this.enable_free_fly_cam && this.ball_location != null) {
            let desired = this.ball_location;
            //desired = desired.times(Mat4.rotation(this.cam_angle, 0, 1, 0));
            desired = desired.times(Mat4.rotation(this.cam_angle, 0, 1, 0));
            desired = desired.times(Mat4.rotation(-30.0*Math.PI/180.0, 1, 0, 0));
            //desired = desired.times(Mat4.translation(0, 20, 80));
            desired = desired.times(Mat4.translation(0, 0, 60));
            desired = Mat4.inverse(desired);
            desired = desired.map((x, i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1)); // blend factor second param
            // Small issue as suggested in spec: lag behind planet = not centered on planet anymore
            program_state.set_camera(desired);
            //this.cam_loc = desired;
            this.cam_loc = Mat4.inverse(desired);
        }

        // Test rotate light
        let light_transform = vec4(5, 5, 0, 1);
        this.light_color = hex_color("#ffffff");
        //light_transform = vec4(2.5+2.5*Math.sin(t), 30, 2.5+2.5*Math.cos(t), 1);
        light_transform = vec4(this.ball_location[0][3]+2.5*Math.sin(t), this.ball_location[1][3]+15, this.ball_location[2][3]+2.5*Math.cos(t), 1);
        //light_transform = vec4(this.ball_location[0][3], 100, this.ball_location[2][3], 1);
        if (this.ball_moving) {
            this.light_color = hex_color("#ff8888");
        } else {
            this.light_color = hex_color("#ffffff");
        }
        program_state.lights = [new Light(light_transform, this.light_color, 1000)];

        // This is a rough target of the light.
        // Although the light is point light, we need a target to set the POV of the light
        this.light_view_target = vec4(this.ball_location[0][3], this.ball_location[1][3], this.ball_location[2][3], 1);
        this.light_field_of_view = 130 * Math.PI / 180; // 130 degree

        // Step 1: set the perspective and camera to the POV of light
        this.light_position = light_transform;
        const light_view_mat = Mat4.look_at(
            vec3(this.light_position[0], this.light_position[1], this.light_position[2]),
            vec3(this.light_view_target[0], this.light_view_target[1], this.light_view_target[2]),
            vec3(0, 0, 1), // assume the light to target will have a up dir of +y, maybe need to change according to your case
        );
        const light_proj_mat = Mat4.perspective(this.light_field_of_view, 1, 0.5, 500);
        // Bind the Depth Texture Buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.viewport(0, 0, this.lightDepthTextureSize, this.lightDepthTextureSize);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Prepare uniforms
        program_state.light_view_mat = light_view_mat;
        program_state.light_proj_mat = light_proj_mat;
        program_state.light_tex_mat = light_proj_mat;
        program_state.view_mat = light_view_mat;
        program_state.projection_transform = light_proj_mat;
        this.render_scene(context, program_state, false, false, false);

        // Step 2: unbind, draw to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        program_state.view_mat = program_state.camera_inverse;
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.5, 500);
        this.render_scene(context, program_state, true, true, true);

        /*
        // Step 3: display the textures
        this.shapes.square_2d.draw(context, program_state,
            Mat4.translation(-.99, .08, 0).times(
                Mat4.scale(0.5, 0.5 * gl.canvas.width / gl.canvas.height, 1)
            ),
            this.depth_tex.override({texture: this.lightDepthTexture})
        );

         */

    }

    render_scene(context, program_state, shadow_pass, draw_light_source=false, draw_shadow=false) {

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();

        let light_position = this.light_position;
        let light_color = this.light_color;
        program_state.draw_shadow = draw_shadow;

        if (draw_light_source && shadow_pass) {
            this.shapes.sphere.draw(context, program_state,
                Mat4.translation(light_position[0], light_position[1], light_position[2]).times(Mat4.scale(.5,.5,.5)),
                this.light_src.override({color: light_color}));
        }
        //this.shapes.sphere4.draw(context, program_state, Mat4.identity().times(Mat4.translation(light_position[0],light_position[1]+1,light_position[2])).times(Mat4.scale(0.2,0.2,0.2)), shadow_pass? this.materials.angleBall.override({ambient: 1, color: light_color}) : this.pure);
        this.shapes.golfBall.draw(context, program_state, this.ball_location, shadow_pass? this.materials.golfBall : this.pure);

        //this.shapes.torus.draw(context, program_state, model_transform, this.materials.test.override({color: yellow}));

        // Ground 1
        let ground_transform = model_transform.times(Mat4.scale(15,0.01,15));
        //this.shapes.flat_terrain.draw(context, program_state, ground_transform, this.materials.sand);
        this.shapes.flat_terrain.draw(context, program_state, ground_transform, shadow_pass? this.materials.sand : this.pure);
        let wall_transform = Mat4.identity();
        for (let i = 0; i < 4; i++) {
            wall_transform = wall_transform.times(Mat4.translation(15,0,0));
            wall_transform = wall_transform.times(Mat4.scale(0.1,1,15.1));
            if (i !== 0) {
                //this.shapes.wall.draw(context, program_state, wall_transform, this.materials.wall);
                this.shapes.wall.draw(context, program_state, wall_transform, shadow_pass? this.materials.wall : this.pure);
            }
            wall_transform = wall_transform.times(Mat4.scale(10,1,1/15.1));
            wall_transform = wall_transform.times(Mat4.translation(-15,0,0));
            wall_transform = wall_transform.times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        }

        // Slope 1
        let my_m = Mat4.identity();
        my_m[1][0] = 17.5*2.0/Math.sqrt(3.0)*100.0; // Sheer to match slope
        let slope_transform = model_transform.times(Mat4.translation(50,17.5*2.0/Math.sqrt(3.0),0));
        //slope_transform = slope_transform.times(Mat4.rotation(30*Math.PI/180,0,0,1));
        //slope_transform = slope_transform.times(Mat4.scale(35.0*2.0/Math.sqrt(3.0),0.1,15));
        slope_transform = slope_transform.times(Mat4.scale(35,0.01,15));
        slope_transform = slope_transform.times(my_m);
        //this.shapes.flat_terrain.draw(context, program_state, slope_transform, this.materials.grass);
        this.shapes.flat_terrain.draw(context, program_state, slope_transform, shadow_pass? this.materials.grass : this.pure);
        // Slope walls
        my_m = Mat4.identity();
        my_m[1][2] = 17.5*2.0/Math.sqrt(3.0); // Sheer to match slope
        wall_transform = Mat4.identity().times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        //wall_transform = wall_transform.times(Mat4.translation(15,0, 15.1+35*Math.sqrt(3.0)/2.0));
        wall_transform = wall_transform.times(Mat4.translation(15,17.5*2.0/Math.sqrt(3.0), 15.0+35));
        wall_transform = wall_transform.times(Mat4.scale(0.1,1,35));
        wall_transform = wall_transform.times(my_m);
        //this.shapes.wall.draw(context, program_state, wall_transform, this.materials.wall);
        this.shapes.wall.draw(context, program_state, wall_transform, shadow_pass? this.materials.wall : this.pure);
        wall_transform = wall_transform.times(Mat4.inverse(my_m));
        wall_transform = wall_transform.times(Mat4.scale(10,1,1/15.0));
        wall_transform = wall_transform.times(Mat4.translation(-30,0,0));
        wall_transform = wall_transform.times(Mat4.scale(0.1,1,15.0));
        wall_transform = wall_transform.times(my_m);
        //this.shapes.wall.draw(context, program_state, wall_transform, this.materials.wall);
        this.shapes.wall.draw(context, program_state, wall_transform, shadow_pass? this.materials.wall : this.pure);
        wall_transform = wall_transform.times(Mat4.inverse(my_m));

        // Ground 2
        //ground_transform = Mat4.identity().times(Mat4.translation(100.0, 35.0*2.0/Math.sqrt(3.0), 0)).times(Mat4.scale(15,0.01,15));
        ground_transform = Mat4.identity().times(Mat4.translation(100.0, 35.0*2.0/Math.sqrt(3.0), 0));
        for (let i = 0; i < 4; i++) {
            ground_transform = ground_transform.times(Mat4.translation(8.5,0,0));
            ground_transform = ground_transform.times(Mat4.scale(6.5,0.01,2));
            //this.shapes.flat_terrain.draw(context, program_state, ground_transform, this.materials.grass);
            this.shapes.flat_terrain.draw(context, program_state, ground_transform, shadow_pass? this.materials.grass : this.pure);
            ground_transform = ground_transform.times(Mat4.scale(1/6.5,100,1/2));
            ground_transform = ground_transform.times(Mat4.translation(-8.5,0,0));
            ground_transform = ground_transform.times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        }
        for (let i = 0; i < 4; i++) {
            ground_transform = ground_transform.times(Mat4.translation(8.5,0,8.5));
            ground_transform = ground_transform.times(Mat4.scale(6.5,0.01,6.5));
            //this.shapes.flat_terrain.draw(context, program_state, ground_transform, this.materials.grass);
            this.shapes.flat_terrain.draw(context, program_state, ground_transform, shadow_pass? this.materials.grass : this.pure);
            ground_transform = ground_transform.times(Mat4.scale(1/6.5,100,1/6.5));
            ground_transform = ground_transform.times(Mat4.translation(-8.5,0,-8.5));
            ground_transform = ground_transform.times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        }
        //this.shapes.flat_terrain.draw(context, program_state, ground_transform, this.materials.flat_terrain);

        wall_transform = Mat4.identity().times(Mat4.translation(100.0, 35.0*2.0/Math.sqrt(3.0), 0));
        for (let i = 0; i < 4; i++) {
            wall_transform = wall_transform.times(Mat4.translation(15,0,0));
            wall_transform = wall_transform.times(Mat4.scale(0.1,1,15.0));
            if (i !== 2) {
                //this.shapes.wall.draw(context, program_state, wall_transform, this.materials.wall);
                this.shapes.wall.draw(context, program_state, wall_transform, shadow_pass? this.materials.wall : this.pure);
            }
            wall_transform = wall_transform.times(Mat4.scale(10,1,1/15.0));
            wall_transform = wall_transform.times(Mat4.translation(-15,0,0));
            wall_transform = wall_transform.times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        }

        // Golf hole
        let hole_transform = Mat4.identity();
        hole_transform = hole_transform.times(Mat4.translation(100,35.0*2.0/Math.sqrt(3.0),0));
        hole_transform = hole_transform.times(Mat4.scale(Math.sqrt(2),2,Math.sqrt(2)));
        //this.shapes.twoDGolfHole.draw(context, program_state, hole_transform, this.materials.golfHole);
        //this.shapes.threeDGolfHoleCorner.draw(context, program_state, hole_transform, this.materials.golfHole);
        this.display_golf_hole(context, program_state, hole_transform, shadow_pass);

        let flagPole = hole_transform.times(Mat4.translation(0,-0.67,0));
        flagPole = flagPole.times(Mat4.scale(.15,3,.15)).times(Mat4.translation(.1,.8,0));
        //this.shapes.cube1.draw(context,program_state,flagPole,this.materials.flagPole);
        this.shapes.cube1.draw(context,program_state,flagPole, shadow_pass? this.materials.flagPole : this.pure);
        let flag = flagPole;
        console.log(program_state.animation_time%2.0);
        flag = flag.times(Mat4.rotation(.5*Math.sin(t),0,1,0)).times(Mat4.scale(15,.3,.05)).times(Mat4.translation(1,2,0));
        //this.shapes.cube1.draw(context,program_state,flag,this.materials.flag);
        this.shapes.cube1.draw(context,program_state,flag, shadow_pass? this.materials.flag : this.pure);


        // Misc shadow sources
        let cloud_tf = Mat4.identity();
        cloud_tf = cloud_tf.times(Mat4.translation(0,10,0));
        cloud_tf = cloud_tf.times(Mat4.rotation(90.0*Math.PI/180.0,1,0,0));
        cloud_tf = cloud_tf.times(Mat4.scale(5,5,1));
        this.shapes.golfBall.draw(context, program_state,cloud_tf, shadow_pass? this.materials.flag : this.pure);
        

        //adds very basic boundaries
        /*
        if (this.ball_location[0][3] >= this.x_bound){
            this.ball_location[0][3] = this.x_bound - 0.01;
            this.reflect_ball_dir(vec3(-1,0,0)); // Automatic normalize in function
        }
         */
        if (this.ball_location[2][3] >= this.y_bound_high){
            this.ball_location[2][3] = this.y_bound_high - 0.01;
            this.reflect_ball_dir(vec3(0,0,-1));
        }
        if (this.ball_location[0][3] <= this.x_bound_low){
            this.ball_location[0][3] = this.x_bound_low + 0.01;
            this.reflect_ball_dir(vec3(1,0,0));
        }
        if (this.ball_location[2][3] <= this.y_bound_low){
            this.ball_location[2][3] = this.y_bound_low + 0.01;
            this.reflect_ball_dir(vec3(0,0,1));
        }
        if (this.ball_location[0][3] >= this.x_bound_high){
            this.ball_location[0][3] = this.x_bound_high - 0.01;
            this.reflect_ball_dir(vec3(-1,0,0)); // Automatic normalize in function
        }

        // Normals of ground
        let bx = this.ball_location[0][3];
        let bz = this.ball_location[2][3];
        this.norm_vec = vec3(0,0.01,0);
        this.z_bound = 1.00;
        //if ((bx > 15.0 && bx < 15.0+Math.sqrt(3.0)/2.0*10.0) && (bz > -2.5 && bz < 2.5)) {
        if ((bx > 15.0 && bx < 85.0)) {
            this.z_bound = (bx-15.0)/Math.sqrt(3.0) + 1.00;
            this.norm_vec = vec3(-0.01*0.5,0.01*Math.sqrt(3.0)/2.0,0); // Magnitude 0.01
        } else if (bx > 50.0) {
            if (this.entered_hole || bx > 98.0 && bx < 100.0 && bz > -2.0 && bz < 2.0 && this.ball_speed < 1.0 && this.ball_location[1][3] <= 70.0 / Math.sqrt(3.0) + 1.05) {
                this.z_bound = 70.0/Math.sqrt(3.0) + 1.00 - 3.0 * (1.0 - (Math.abs(bx - 100)/2.0)**2) * (1.0 - (Math.abs(bz)/2.0)**2);
                this.norm_vec = (vec3(-(bx-100.0), 0.01, -(bz))).normalized();
                if (Math.abs(bx - 100)**2 + Math.abs(bz)**2 < 1) {
                    //this.norm_vec = vec3(0,0.01,0);
                }
                this.x_bound_high = 100.0; // Entered the hole
                this.x_bound_low = 98.0;
                this.y_bound_low = -2.0;
                this.y_bound_high = 2.0;
                if(!this.entered_hole){
                    if(this.count_hits === 1){
                        alert('Hole in one')
                    }
                    else {
                        alert('You win! \nScore: ' + this.count_hits);
                    }
                }
                this.entered_hole = true;
            } else {
                this.z_bound = 70.0 / Math.sqrt(3.0) + 1.00;
            }
        }

        if (this.ball_location[1][3] < this.z_bound) {
            // Underground -> push back up, absorb all impact
            //this.ball_speed = Math.sqrt((this.get_ball_velocity()[0]**2)+(this.get_ball_velocity()[2]**2));
            //this.ball_direction[1] = 0;
            if (this.ball_direction[0] !== 0 || this.ball_direction[1] !== 0 || this.ball_direction[2] !== 0) {
                this.ball_direction = this.ball_direction.normalized();
            }
            this.ball_location[1][3] = this.z_bound;
        }

        if (this.ball_moving && shadow_pass) {
            this.grav_golf_ball(); // apply gravity before move
            this.move_golf_ball();
            if (this.ball_location[1][3] <= this.z_bound) {
                this.ground_norm_golf_ball(); // If on a ground plane, move parallel to plane
                this.friction_update(dt);
            } else {
                this.drag_update(dt);
            }
        }
        //this.shapes.golfBall.draw(context, program_state, this.ball_location, this.materials.golfBall);
        //this.shapes.golfBall.draw(context, program_state, this.ball_location, shadow_pass? this.materials.golfBall : this.pure);

        // Draw circle on screen
        this.shapes.circle.draw(context, program_state, this.cam_loc.times(Mat4.translation(6.25,-3,-10)), shadow_pass? this.materials.compass : this.pure);
        //this.shapes.circle.draw(context, program_state, program_state.camera_transform.times(Mat4.translation(6.25,-3,-10)), this.materials.compass);
        // Mouse picking from main-canvas in index.html
        //this.canv = document.querySelector("#main-canvas.canvas-widget");
        //let canvelem = document.getElementById("main-canvas");
        //this.canv = this.canv.getElementsByClassName()
        //this.my_gl = this.canv.getContext("webgl");
        //this.canv.addEventListener("mousemove", MouseMove, false);

        //if(this.hit_power_change){
            /*
            // Old version
            if (this.hit_power >= this.power_speed_ratio*this.max_ball_speed_on_hit){
                this.hit_power_increasing = false;
            }
            if (this.hit_power <= this.power_speed_ratio*this.min_ball_speed_on_hit){
                this.hit_power_increasing = true;
            }
            if(this.hit_power_increasing){
                this.hit_power += dt/(Math.PI/2)*(this.max_ball_speed_on_hit-this.min_ball_speed_on_hit);
            }else{
                this.hit_power -= dt/(Math.PI/2)*(this.max_ball_speed_on_hit-this.min_ball_speed_on_hit);
            }
             */
            // New version
            this.hit_power = (Math.pow((this.m_x-1002.0), 2) + Math.pow((this.m_y-527.0), 2)) / 400.0;
            console.log(this.hit_power);
            if (this.hit_power > this.max_ball_speed_on_hit * this.power_speed_ratio) {
                this.hit_power = this.max_ball_speed_on_hit * this.power_speed_ratio;
            }
            if (this.hit_power < this.min_ball_speed_on_hit * this.power_speed_ratio) {
                this.hit_power = this.min_ball_speed_on_hit * this.power_speed_ratio;
            }
        //}
        //if(this.hit_direction_change){

            // Old version
            //this.hit_direction = Mat4.rotation(2*dt, 0, 1, 0).times(this.hit_direction);

            // New version
            console.log(Math.atan2((this.m_y-527.0),(this.m_x-1002.0)));
            this.hit_direction = vec3(Math.sin(Math.atan2((this.m_y-527.0),(this.m_x-1002.0))),0,Math.cos(Math.atan2((this.m_y-527.0),(this.m_x-1002.0))));
        //}

        if (!this.ball_moving){
            this.ball_direction = this.hit_direction;
            this.ball_speed = this.hit_power / this.power_speed_ratio;
            this.set_angle_ball_location();
            this.shapes.angleBall.draw(context,program_state,this.angle_ball_location,this.materials.angleBall);
        }

    }

    get_ball_velocity(){
        return this.ball_direction.times(this.ball_speed);
    }

    grav_golf_ball() {
        let old_ball_speed = this.ball_speed;
        let old_ball_dir = this.ball_direction;
        let new_ball_vel = ((old_ball_dir.times(old_ball_speed)).plus(this.get_grav_mult()));
        this.ball_speed = new_ball_vel.norm();
        if (new_ball_vel[0] !== 0 || new_ball_vel[1] !== 0 || new_ball_vel[2] !== 0) {
            this.ball_direction = new_ball_vel.normalized();
        } else {
            this.ball_direction = vec3(0,0,0);
        }
        console.log(this.ball_speed);
        console.log(this.ball_direction);
    }

    ground_norm_golf_ball() {
        let old_ball_speed = this.ball_speed;
        let old_ball_dir = this.ball_direction;
        let new_ball_vel = ((old_ball_dir.times(old_ball_speed)).plus(this.get_norm_mult()));
        this.ball_speed = new_ball_vel.norm();
        if (new_ball_vel[0] !== 0 || new_ball_vel[1] !== 0 || new_ball_vel[2] !== 0) {
            this.ball_direction = this.ball_direction.minus(this.norm_vec.times((this.ball_direction[0]*this.norm_vec[0] + this.ball_direction[1]*this.norm_vec[1] + this.ball_direction[2]*this.norm_vec[2]) / 0.01 / 0.01));
            //this.ball_direction = this.ball_direction.minus(this.norm_vec.times(this.ball_direction.dot(this.norm_vec) / this.norm_vec.norm() / this.norm_vec.norm()));
            this.ball_speed = this.ball_speed * (this.ball_direction[0]*old_ball_dir[0] + this.ball_direction[1]*old_ball_dir[1] + this.ball_direction[2]*old_ball_dir[2]);
            if (this.ball_direction[0] === 0.0 && this.ball_direction[1] === 0.0 && this.ball_direction[2] === 0.0 ) {
                this.ball_direction = new_ball_vel.normalized();
                this.ball_speed = new_ball_vel.norm();
            }
        } else {
            this.ball_direction = vec3(0,0,0);
        }
    }

    move_golf_ball(){
        const velocity = this.get_ball_velocity();
        //if(this.ball_speed < this.speed_threshhold){
        if (this.ball_speed < (this.speed_threshhold * this.grav_mult) && this.norm_vec[0] === 0.0 && this.norm_vec[2] === 0.0) {
            this.stopping_handler();
            return;
        }
        this.ball_location = Mat4.translation(...velocity).times(this.ball_location);
    }


    display_golf_hole(context, program_state, hole_transform, shadow_pass) {
        for (let i = 0; i < 4; i++) {
            this.shapes.threeDGolfHoleCorner.draw(context, program_state, hole_transform, shadow_pass? this.materials.golfHole : this.pure);
            //this.shapes.threeDGolfHoleCorner.draw(context, program_state, hole_transform, shadow_pass? this.floor : this.pure);
            //this.shapes.golfHoleGrassEdge.draw(context, program_state, hole_transform, this.materials.grass);
            this.shapes.golfHoleGrassEdge.draw(context, program_state, hole_transform, shadow_pass? this.materials.grass : this.pure);
            hole_transform = hole_transform.times(Mat4.rotation(90*(Math.PI/180), 0, 1, 0));
        }
    }

    friction_update(dt) {
        //only decelerate as much as needed for each frame
        const friction_update = dt * this.friction_coefficient * this.ball_speed;
        //const friction_update = dt * this.friction_coefficient * 10.0;
        this.ball_speed = this.ball_speed - friction_update;
        if (this.ball_speed < 0.0) {
            this.ball_speed = 0.0;
            //this.stopping_handler();
        }
    }

    drag_update(dt) {
        //const drag_update = dt * this.drag_coefficient * this.ball_speed;
        const drag_update = dt * this.drag_coefficient * 1.0;
        this.ball_speed = this.ball_speed - drag_update;
        if (this.ball_speed < 0.0) {
            this.ball_speed = 0.0;
            //this.stopping_handler();
        }
    }

    reflect_ball_dir(norm_of_collider) {
        // norm_of_collider should be vec3
        norm_of_collider = norm_of_collider.normalized();
        // -1 * ball_direction + 2 * ball_direction.project_onto(normal)
        // (2 * this.ball_direction * norm_of_collider) norm_of_collider - this.ball_direction
        console.log(norm_of_collider.dot(this.ball_direction));
        //this.ball_direction = this.ball_direction.times(-1);
        //this.ball_direction = (norm_of_collider.times(2*norm_of_collider.dot(this.ball_direction.times(-1))));
        // Issue found -> class diagram has all vectors pointing away from surface
        this.ball_direction = (norm_of_collider.times(2*norm_of_collider.dot(this.ball_direction.times(-1)))).minus(this.ball_direction.times(-1));
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
        this.shapes.golfBall.draw(context, program_state, golf_model, shadow_pass? this.materials.golfBall : this.pure);
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


