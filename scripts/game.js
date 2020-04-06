class Game {
    render() {
        const targetCameraX = -me.x * map.tileWidth,
            targetCameraY = -me.y * map.tileHeight;

        cameraZ = lerp(cameraZ, targetCameraZ, CAMERA_LERP * 10);
        cameraX = lerp(cameraX, targetCameraX, CAMERA_LERP * cameraZ);
        cameraY = lerp(cameraY, targetCameraY, CAMERA_LERP * cameraZ);

        g.resetTransform();
        g.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
        g.translate(gridOffsetX, gridOffsetY);
        g.scale(cameraZ, cameraZ);
        g.translate(cameraX, cameraY);

        map.draw(g);

        for (let user of userList) {
            user.drawShadow(g, map);
        }
        for (let user of userList) {
            user.drawAvatar(g, map);
        }
        for (let user of userList) {
            user.drawName(g, map);
        }

        drawMouse();
    }
}