import * as THREE from 'three';

// 1. إعداد المشهد
const scene = new THREE.Scene();

// 2. الكاميرا
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2; // تقريب الكاميرا أكثر

// 3. الريندرر (الرسام) بجودة سينمائية
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // دقة عالية للشاشات الحديثة
renderer.outputColorSpace = THREE.SRGBColorSpace; 
renderer.toneMapping = THREE.ACESFilmicToneMapping; // الفلتر السينمائي
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

// 4. الإضاءة
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); 
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 3.5); // شمس قوية جداً
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

// 5. إنشاء الكوكب (السطح)
const textureLoader = new THREE.TextureLoader();
const planetTexture = textureLoader.load('./texture.jpg');
planetTexture.colorSpace = THREE.SRGBColorSpace;

const planetGeometry = new THREE.SphereGeometry(1, 64, 64);
const planetMaterial = new THREE.MeshStandardMaterial({ 
    map: planetTexture,
    roughness: 0.6, // تقليل اللمعان قليلاً لواقعية الأرض
    metalness: 0.1,
});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// 6. 🔥 إضافة الغلاف الجوي (Atmosphere Glow) 🔥
// هذا الكود ينشئ كرة وهمية حول الكوكب تعطي توهجاً أزرق على الأطراف
const vertexShader = `
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vNormal;
    void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
`;

const atmosphereGeometry = new THREE.SphereGeometry(1.2, 64, 64); // أكبر قليلاً من الكوكب
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true // شفاف
});

const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// 7. النجوم (خلفية متحركة)
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({color: 0xffffff});
const starVertices = [];
for(let i=0; i<10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starVertices.push(x,y,z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


// 8. التحريك
function animate() {
    requestAnimationFrame(animate);

    // دوران الكوكب
    planet.rotation.y += 0.002; 
    
    // دوران النجوم ببطء لتعطي إحساساً بالعمق
    stars.rotation.y -= 0.0002;

    renderer.render(scene, camera);
}

animate();

// تعديل حجم العرض
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
