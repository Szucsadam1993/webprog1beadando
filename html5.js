const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = 10;
const speed = 2;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, 10, 50, 50);

    x += speed;
    if (x > canvas.width - 50) x = 10;

    requestAnimationFrame(animate);
}

animate();