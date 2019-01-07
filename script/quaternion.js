/**
 * A set of coordinates used to represent 3-d rotation.
 * @constructor
 * 
 * @param {Number} x The X component.
 * @param {Number} y The Y component. 
 * @param {Number} z The Z component. 
 * @param {Number} w The W component. 
 */
function Quaternion(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
}

/**
 * Computes the power of the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to compute.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.power = function (quaternion, power) {
    return Quaternion.exp(Quaternion.multiplyByScalar(Quaternion.ln(quaternion), power));
};


/**
 * Computes the exp of the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to compute.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.exp = function (quaternion) {
    let w = quaternion.w;
    let x = quaternion.x;
    let y = quaternion.y;
    let z = quaternion.z;

    let r = Math.sqrt(x * x + y * y + z * z);
    let et = Math.exp(w);
    let s = r > 0.0000001 ? et * Math.sin(r) / r : 0.0;
    return {
        w: et * Math.cos(r),
        x: x * s,
        y: y * s,
        z: z * s,
    };
};


/**
 * Computes the logarithm of the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to compute.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.ln = function (quaternion) {
    let w = quaternion.w;
    let x = quaternion.x;
    let y = quaternion.y;
    let z = quaternion.z;

    let r = Math.sqrt(x * x + y * y + z * z);
    let t = r > 0.000000001 ? Math.atan2(r, w) / r : 0.0;

    return {
        w: 0.5 * Math.log(Quaternion.magnitudeSquared(quaternion)),
        x: x * t,
        y: y * t,
        z: z * t,
    };
};



/**
 * Converts quaternion to matrix 3-d.
 * @memberof Quaternion
 * 
 * @param {Quaternion} quaternion The object to compute.
 * @param {Object} transform The object of 3-d transformations.
 * 
 * @returns {Object} Matrix 3-d.
 */
Quaternion.quaternionToMatrix3d = function (quaternion, transform = {}) {
    let w = quaternion.w;
    let x = quaternion.x;
    let y = quaternion.y;
    let z = quaternion.z;

    let n = w * w + x * x + y * y + z * z;
    let s = n === 0 ? 0 : 2 / n;

    let wx = s * w * x;
    let wy = s * w * y;
    let wz = s * w * z;

    let xx = s * x * x;
    let xy = s * x * y;
    let xz = s * x * z;

    let yy = s * y * y;
    let yz = s * y * z;
    let zz = s * z * z;

    let matrix3d = [
        1 - (yy + zz),
        xy - wz,
        xz + wy,
        0,
        xy + wz,
        1 - (xx + zz),
        yz - wx,
        0,
        xz - wy,
        yz + wx,
        1 - (xx + yy),
        0,
        transform.x || 0,
        transform.y || 0,
        transform.z || 0,
        1
    ];

    return matrix3d;
}


/**
 * Converts device orientation Tait-Bryan (Z-X-Y) angles to quaternion.
 * @memberof Quaternion
 *
 * @param {Number} alpha  The angle in degrees around z axis.
 * @param {Number} beta  The angle in degrees around x axis.
 * @param {Number} gamma  The angle in degrees around y axis.
 * @param {Quaternion} [result] The object onto which to store the result.
 * 
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.taitBryanToQuaternion = function (alpha, beta, gamma) {
    let rad = [
        (beta * Math.PI) / 180 / 2,
        (gamma * Math.PI) / 180 / 2,
        (alpha * Math.PI) / 180 / 2
    ];

    let cos = [Math.cos(rad[0]), Math.cos(rad[1]), Math.cos(rad[2])];
    let sin = [Math.sin(rad[0]), Math.sin(rad[1]), Math.sin(rad[2])];

    let result = new Quaternion();

    result.w = cos[0] * cos[1] * cos[2] - sin[0] * sin[1] * sin[2];
    result.x = sin[0] * cos[1] * cos[2] - cos[0] * sin[1] * sin[2];
    result.y = cos[0] * sin[1] * cos[2] + sin[0] * cos[1] * sin[2];
    result.z = cos[0] * cos[1] * sin[2] + sin[0] * sin[1] * cos[2];

    return result;
}


/**
 * Computes the conjugate of the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to conjugate.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.conjugate = function (quaternion) {
    let result = new Quaternion();

    result.x = -quaternion.x;
    result.y = -quaternion.y;
    result.z = -quaternion.z;
    result.w = quaternion.w;
    return result;
};


/**
 * Computes magnitude squared for the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to conjugate.
 * @returns {Number} The magnitude squared.
 */
Quaternion.magnitudeSquared = function (quaternion) {
    let w = quaternion.w;
    let x = quaternion.x;
    let y = quaternion.y;
    let z = quaternion.z;

    return x * x + y * y + z * z + w * w;
};


/**
 * Computes magnitude for the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to conjugate.
 * @returns {Number} The magnitude.
 */
Quaternion.magnitude = function (quaternion) {
    return Math.sqrt(Quaternion.magnitudeSquared(quaternion));
};


/**
 * Computes the normalized form of the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to normalize.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.normalize = function (quaternion) {
    let inverseMagnitude = 1.0 / Quaternion.magnitude(quaternion);
    let x = quaternion.x * inverseMagnitude;
    let y = quaternion.y * inverseMagnitude;
    let z = quaternion.z * inverseMagnitude;
    let w = quaternion.w * inverseMagnitude;

    let result = new Quaternion();

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;

    return result;
};


/**
 * Computes the inverse of the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to normalize.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.inverse = function (quaternion) {
    let magnitudeSquared = Quaternion.magnitudeSquared(quaternion);
    return Quaternion.multiplyByScalar(quaternion, 1.0 / magnitudeSquared, quaternion);
};


/**
 * Multiplies the provided quaternion componentwise by the provided scalar.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to be scaled.
 * @param {Number} scalar The scalar to multiply with.
 * @returns {Quaternion} The Quaternion instance.

 */
Quaternion.multiplyByScalar = function (quaternion, scalar) {
    let result = new Quaternion();

    result.x = quaternion.x * scalar;
    result.y = quaternion.y * scalar;
    result.z = quaternion.z * scalar;
    result.w = quaternion.w * scalar;
    return result;
};

/**
 * Computes the multiplication of two quaternions.
 * @memberof Quaternion
 *
 * @param {Quaternion} left The first quaternion.
 * @param {Quaternion} right The second quaternion.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.multiply = function (left, right) {
    let leftX = left.x;
    let leftY = left.y;
    let leftZ = left.z;
    let leftW = left.w;

    let rightX = right.x;
    let rightY = right.y;
    let rightZ = right.z;
    let rightW = right.w;

    let x = leftW * rightX + leftX * rightW + leftY * rightZ - leftZ * rightY;
    let y = leftW * rightY - leftX * rightZ + leftY * rightW + leftZ * rightX;
    let z = leftW * rightZ + leftX * rightY - leftY * rightX + leftZ * rightW;
    let w = leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ;

    let result = new Quaternion();

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
};


/**
 * Computes the linear interpolation or extrapolation at t using the provided quaternions.
 * @memberof Quaternion
 *
 * @param {Quaternion} start The value corresponding to t at 0.0.
 * @param {Quaternion} end The value corresponding to t at 1.0.
 * @param {Number} t The point along t at which to interpolate.
 * @returns {Quaternion} The Quaternion instance .
 */
Quaternion.lerp = function (start, end, t) {
    let result = Quaternion.multiplyByScalar(start, 1.0 - t);
    return Quaternion.add(Quaternion.multiplyByScalar(end, t), result);
};


/**
 * Computes the spherical linear interpolation or extrapolation at t using the provided quaternions.
 * @memberof Quaternion
 *
 * @param {Quaternion} start The value corresponding to t at 0.0.
 * @param {Quaternion} end The value corresponding to t at 1.0.
 * @param {Number} t The point along t at which to interpolate.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.slerp = function (start, end, t) {
    let dot = Quaternion.dot(start, end);
    let r = end;

    if (dot < 0.0) {
        dot = -dot;
        r = slerpEndNegated = Quaternion.negate(end);
    }

    if (1.0 - dot < Number.EPSILON) {
        return Quaternion.lerp(start, r, t);
    }

    let theta = Math.acos(dot);
    let slerpScaledP = Quaternion.multiplyByScalar(start, Math.sin((1 - t) * theta));
    let slerpScaledR = Quaternion.multiplyByScalar(r, Math.sin(t * theta));
    let result = Quaternion.add(slerpScaledP, slerpScaledR);
    return Quaternion.multiplyByScalar(result, 1.0 / Math.sin(theta));
};


/**
* Computes the componentwise sum of two quaternions.
* @memberof Quaternion
*
* @param {Quaternion} left The first quaternion.
* @param {Quaternion} right The second quaternion.
* @returns {Quaternion} The Quaternion instance.
*/
Quaternion.add = function (left, right) {
    let result = new Quaternion();

    result.x = left.x + right.x;
    result.y = left.y + right.y;
    result.z = left.z + right.z;
    result.w = left.w + right.w;
    return result;
};

/**
* Computes the dot of two quaternions.
* @memberof Quaternion
*
* @param {Quaternion} left The first quaternion.
* @param {Quaternion} right The second quaternion.
* @returns {Number} The dot value.
*/
Quaternion.dot = function (left, right) {
    return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
};


/**
 * Negates the provided quaternion.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to be negated.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.negate = function (quaternion) {
    let result = new Quaternion();

    result.x = -quaternion.x;
    result.y = -quaternion.y;
    result.z = -quaternion.z;
    result.w = -quaternion.w;
    return result;
};


/**
 * Duplicates a Quaternion instance.
 * @memberof Quaternion
 *
 * @param {Quaternion} quaternion The quaternion to duplicate.
 * @returns {Quaternion} The Quaternion instance.
 */
Quaternion.clone = function (quaternion) {
    let result = new Quaternion();

    result.x = quaternion.x;
    result.y = quaternion.y;
    result.z = quaternion.z;
    result.w = quaternion.w;
    return result;
};
