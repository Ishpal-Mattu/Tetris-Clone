import { getCollisionDirection, isAABBCollision } from "../../lib/CollisionHelpers.js";
import Vector from "../../lib/Vector.js";

export default class GameObject {

    /**
     * 
     * @param {Vector} dimensions 
     * @param {Vector} position 
     */
    constructor(dimensions, position){
        this.dimensions = dimensions;
        this.position = position;
        this.sprites = [];
        this.cleanUp = false;
        this.currentFrame = 0;

        this.isSolid = false;
        this.isCollidable = false;

        this.wasCollided = false;
    }

    update(dt){

    }

    render() {
        this.sprites[this.currentFrame].render(this.position.x, this.position.y);
    }

    onCollision(collider){
        this.wasCollided = true;
    }

    /**
     * @param {GameObject} gameObject
     * @returns Whether this game object collided with another object using AABB collision detection. 
     */
    didCollideWithObject(gameObject){
        return isAABBCollision(
            this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			gameObject.position.x,
			gameObject.position.y,
			gameObject.dimensions.x,
			gameObject.dimensions.y,
        );
    }

    /**
	 * @param {GameObject} gameObject
	 * @returns The direction that the object collided with this game object.
	 */
	getObjectCollisionDirection(gameObject) {
		return getCollisionDirection(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			gameObject.position.x,
			gameObject.position.y,
			gameObject.dimensions.x,
			gameObject.dimensions.y,
		);
	}
}