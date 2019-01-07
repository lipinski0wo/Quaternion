let qsa = s => [].slice.call(document.querySelectorAll(s));
let id = s => document.getElementById(s);

let loadHtmlBoxes = (parent, fileName, callback) => {
    fetch(fileName).then(response => {
        return response.text();
    }).then(html => {
        parent.innerHTML = String(html);
    }).then(() => {
        callback();
    });
};

let containers = qsa('.container');
let fileNames = ['html/theater.html', 'html/flowers.html'];
let callbacks = [theater, flowers];

containers.map((element, index) => {
    fileNames[index] && loadHtmlBoxes(element, fileNames[index], callbacks[index])
});

function theater() {
    let clickHandle = id('cube_box');
    let theater = id('cube');

    runGyroscope(clickHandle, (calib, current) => {
        let multiply = Quaternion.multiply(calib, current);
        let toMatrix = Quaternion.quaternionToMatrix3d(multiply, { z: 160 });
        theater.style.transform = 'matrix3d(' + toMatrix + ')';
    });
}

function flowers() {
    let clickHandle = id('box_box');
    let plane = id('box');
    let particles = [];

    for (let i = 1; i <= 25; i++) {
        let particle = document.createElement('img');
        plane.appendChild(particle);
        particle.src = 'media/flower/image_part_' + ("000" + i).slice(-3) + '.jpg';
        particle.className = 'particle';
        particles.push(particle);
    }

    runGyroscope(clickHandle, (calib, current) => {
        let multiply = Quaternion.multiply(calib, current);
        let planeToMatrix = Quaternion.quaternionToMatrix3d(multiply);
        plane.style.transform = 'matrix3d(' + planeToMatrix + ')';

        particles.map((element, index) => {
            let trans = {
                x: (index % 5) * 70 - 0,
                y: Math.floor(index / 5) * 50 + 40,
                z: 100
            };
            let magic = Quaternion.quaternionToMatrix3d(Quaternion.conjugate(Quaternion.clone(multiply)), trans);
            element.style.transform = 'matrix3d(' + magic + ')';
        });
    });
}

function runGyroscope(clickHandle, drawingCallback) {
    let calib = new Quaternion(0, 0, 0, 1);
    let current = null;
    let snapStart = null;
    let snapEnd = null;
    let duration = 500;
    let start = null;
    let isAnimating = false;
    let fireCalbrationOnce = 1;


    clickHandle.addEventListener('click', evt => {
        if (isAnimating) return;
        isAnimating = true;

        snapStart = Quaternion.clone(calib);
        snapEnd = Quaternion.conjugate(Quaternion.clone(current));
        start = Date.now();
        runCenteringAnimation();
    });

    function applyEasing(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function runCenteringAnimation() {
        let progress = (Date.now() - start) / duration;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        let eased = applyEasing(progress);
        if (eased < 0) eased = 0;
        if (eased > 1) eased = 1;

        calib = Quaternion.slerp(snapStart, snapEnd, eased);

        drawingCallback(calib, current);

        if (progress === 1) {
            isAnimating = false;
            return;
        }
        requestAnimationFrame(runCenteringAnimation);
    }

    window.addEventListener('deviceorientation', evt => {
        current = Quaternion.taitBryanToQuaternion(evt.alpha, evt.beta, evt.gamma);
        if (fireCalbrationOnce > 0) {
            fireCalbrationOnce--;
        } else if (fireCalbrationOnce === 0) {
            calib = Quaternion.conjugate(current);
            old = calib;
            fireCalbrationOnce--;
        }
        drawingCallback(calib, current);
    });
}