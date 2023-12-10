# MiniGolf
Mini golf animation for CS174A @ UCLA


## Members
- Kyle Machnicki kmachnickiwork@gmail.com 605586917
- Curtis Chen curtischen0406@g.ucla.edu 705699396
- Victor Li vli2002@g.ucla.edu 7605730268
- Lukas Brockenbrough lukasbroc@gmail.com 505620894

## Project Theme:	
![image](https://i.imgur.com/4H7oApm.png)
![image2](https://i.imgur.com/A690oSt.png)
This project is essentially a mini golf video game. The singular level features varying terrains and slopes, a golf ball, and a hole. The goal is exactly like mini golf: hit the ball into the hole to win the level, using as few strokes as possible. The player chooses an amount of force and an angle to hit the golf ball for each stroke, controlled by the user’s mouse. The player’s point of view is third person focused on the golf ball, with limited adjustment using the keyboard. The game involves many of the physics expected of mini golf, particularly kinematics and collisions.

## Topics from the Course:
### Transformation matrices
- Movement of the ball, as well as movement of any dynamic objects in the scene
- Translation mostly, but also some rotation
- Setting up the environment uses translation, scaling, etc.
### Eye matrices
- Game can be played from POV of an eye in the sky
- Camera can be moved to the POV of an actual golfer on the course. It can also rotate around the ball.
### Lighting
- Lighting follows the golf ball and applies shadow, facilitated by custom shadow shader to mix two-pass z-buffer with texture 
- Phong shading for the golf ball
### Reflections
- Typically apply reflection equations to light rays, but in this case, use for ball bouncing off an obstacle
- Follow the typical equation that calculates the reflection vector based on the initial movement vector and the normal of the reflecting surface
### Texture
- Apply texture to the field, walls, flag, and ball

## Interactivity:
While the ball is still moving, a red light signals to wait. The light turns white when the player can perform a stroke. Then the position of the mouse on the screen space relative to the center of the UI compass dictates the power and direction of the hit.  In order to better view the course, users can move the camera to the POV of a golfer on the course and can rotate the camera around the ball. Users can also choose a bird’s eye view.

## Advanced Features:
### Collision detection
- Ensures ball stays within level bounds and does not phase through obstacles
- Golf ball bounces off walls upon collision 
### Mouse picking
- Choose the direction and power of golf ball hit by clicking a point on a compass
- Distance from center of compass = power
- The compass is locked to a stationary position based on the camera view, making it easy to pick with the mouse
### Physics-based simulation
- Friction applies negative acceleration to slow the ball down
- Slope of terrain affects normal force
- Gravity accelerates the ball down when in the air
- Air resistance/drag applied to ball when in the air
- Collisions are elastic and conserve momentum in direction parallel to wall; kinetic energy is also conserved

## Delivered Implementations:
- Rectangular course with walls and slope
- Moving ball with angle and power selected by player mouse
- Physics on ball include gravity, normal force, drag
- Wall collisions reflect ball movement vector in appropriate axes
- Hole to score ball, wins level when ball enters
- Custom golf hole model

## Controls:
- (i) Spins the camera left around the ball
- (o) Stops the camera from spinning
- (p) Spins the camera right around the ball
- (space) Hits the ball in the direction and power that the mouse selects
