/**
 * Recalculates the UV coordinates for a BufferGeometry
 * object to be able to map to a Cubemap that is packed as
 * a cross-configuration in a single image.
 * @param {import("three").BufferGeometry} geom
 */
export function setGeometryUVsForCubemaps(geom) {
    const positions = geom.attributes.position;
    const normals = geom.attributes.normal;
    const uvs = geom.attributes.uv;

    for (let n = 0; n < normals.count; ++n) {
        const _x = n * normals.itemSize,
            _y = n * normals.itemSize + 1,
            _z = n * normals.itemSize + 2,
            nx = normals.array[_x],
            ny = normals.array[_y],
            nz = normals.array[_z],
            _nx_ = Math.abs(nx),
            _ny_ = Math.abs(ny),
            _nz_ = Math.abs(nz),
            px = positions.array[_x],
            py = positions.array[_y],
            pz = positions.array[_z],
            _px_ = Math.abs(px),
            _py_ = Math.abs(py),
            _pz_ = Math.abs(pz),
            _u = n * uvs.itemSize,
            _v = n * uvs.itemSize + 1;

        let u = uvs.array[_u],
            v = uvs.array[_v],
            largest = 0,
            mx = _nx_,
            max = _px_;

        if (_ny_ > mx) {
            largest = 1;
            mx = _ny_;
            max = _py_;
        }
        if (_nz_ > mx) {
            largest = 2;
            mx = _nz_;
            max = _pz_;
        }

        if (largest === 0) {
            if (px < 0) {
                //left
                u = -pz;
                v = py;
            }
            else {
                // right
                u = pz;
                v = py;
            }
        }
        else if (largest === 1) {
            if (py < 0) {
                // bottom
                u = px;
                v = -pz;
            }
            else {
                // top
                u = px;
                v = pz;
            }
        }
        else {
            if (pz < 0) {
                // front
                u = px;
                v = py;
            }
            else {
                // back
                u = -px;
                v = py;
            }
        }

        u = (u / max + 1) / 8;
        v = (v / max + 1) / 6;

        if (largest === 0) {
            if (px < 0) {
                //left
                u += 0;
                v += 1 / 3;
            }
            else {
                // right
                u += 0.5;
                v += 1 / 3;
            }
        }
        else if (largest === 1) {
            if (py < 0) {
                // bottom
                u += 0.25;
                v += 0;
            }
            else {
                // top
                u += 0.25;
                v += 2 / 3;
            }
        }
        else {
            if (pz < 0) {
                // front
                u += 0.25;
                v += 1 / 3;
            }
            else {
                // back
                u += 0.75;
                v += 1 / 3;
            }
        }

        uvs.array[_u] = u;
        uvs.array[_v] = v;
    }
}
