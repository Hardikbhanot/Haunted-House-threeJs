import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Group, MeshStandardMaterial, PointLight } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')




// Scene
const scene = new THREE.Scene()

//fogg
const fogg= new THREE.Fog('#262837',1,15)
scene.fog=fogg


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
//door
const doorcolortexture= textureLoader.load('/textures/door/color.jpg')
const dooralphatexture= textureLoader.load('/textures/door/alpha.jpg')
const doorambienttexture= textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doornormaltexture= textureLoader.load('/textures/door/normal.jpg')
const doormetaltexture= textureLoader.load('/textures/door/metalness.jpg')
const doorroughtexture= textureLoader.load('/textures/door/roughness.jpg')
const doorheightexture= textureLoader.load('/textures/door/height.jpg')

//bricks
const brickscolortexture= textureLoader.load('/textures/bricks/color.jpg')
const bricksambienttexture= textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksnormaltexture= textureLoader.load('/textures/bricks/normal.jpg')
const bricksroughtexture= textureLoader.load('/textures/bricks/rough.jpg')

//grass
const grasscolortexture= textureLoader.load('/textures/grass/color.jpg')
const grassambienttexture= textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassnormaltexture= textureLoader.load('/textures/grass/normal.jpg')
const grassroughtexture= textureLoader.load('/textures/grass/rough.jpg')

grasscolortexture.repeat.set(8,8)
grassambienttexture.repeat.set(8,8)
grassnormaltexture.repeat.set(8,8)
grassroughtexture.repeat.set(8,8)

grasscolortexture.wrapS=  THREE.RepeatWrapping
grassambienttexture.wrapS=  THREE.RepeatWrapping
grassnormaltexture.wrapS=  THREE.RepeatWrapping
grassroughtexture.wrapS=  THREE.RepeatWrapping

grasscolortexture.wrapT=  THREE.RepeatWrapping
grassambienttexture.wrapT=  THREE.RepeatWrapping
grassnormaltexture.wrapT=  THREE.RepeatWrapping
grassroughtexture.wrapT=  THREE.RepeatWrapping
/**
 * House
 */
// Temporary sphere
const house=new THREE.Group()
scene.add(house)

//box
const walls=new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({ map:brickscolortexture,
        aoMap:bricksambienttexture,
        roughnessMap:bricksroughtexture,
        normalMap:bricksnormaltexture,
        
    })
)
walls.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))
walls.position.y=1.25
house.add(walls)
//roof
const roof= new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({
       
    })
)
roof.position.y=3
roof.rotation.y=Math.PI/4
house.add(roof)

//door
const door=new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map:doorcolortexture,
        alphaMap:dooralphatexture,
        transparent:true,
        aoMap:doorambienttexture,
        displacementMap:doorheightexture,
        displacementScale:0.1,
        normalMap:doornormaltexture,
        metalnessMap:doormetaltexture,
        
        roughness:doorroughtexture
    })
)
door.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))
door.position.z=2.01
door.position.y=1
house.add(door)

//Bushes
const bushgeometry= new THREE.SphereBufferGeometry(1,16,16)
const bushmaterial=new THREE.MeshStandardMaterial({color:0x89c854})


const bush1= new THREE.Mesh(bushgeometry,bushmaterial)
bush1.scale.set(0.25,0.25,0.25)
bush1.position.set(0.8,0.2,2.2)

const bush2= new THREE.Mesh(bushgeometry,bushmaterial)
bush2.scale.set(0.4,0.4,0.4)
bush2.position.set(1.4,0.1,2.1)

const bush3= new THREE.Mesh(bushgeometry,bushmaterial)
bush3.scale.set(0.25,0.25,0.25)
bush3.position.set(-0.8,0.1,2.2)

const bush4= new THREE.Mesh(bushgeometry,bushmaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)

house.add(bush1,bush2,bush3,bush4)

//graves
const graves= new THREE.Group()
scene.add(graves)
const gravegeometry=new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const garveMaterial=new THREE.MeshStandardMaterial({color:'#b2b6b1'})
for(let i=0;i<50;i++){
    const angle=Math.random()*Math.PI*2
    const radius=3.5+Math.random()*6
    const x= Math.sin(angle)*radius
    const z= Math.cos(angle)*radius
    const grave=new THREE.Mesh(gravegeometry,garveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y=(Math.random()-0.5)*4
    grave.rotation.z=(Math.random()-0.5)*4
    grave.castShadow=true
    graves.add(grave)
}




// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map:grasscolortexture,
        aoMap:grassambienttexture,
        normalMap:grassnormaltexture,
        roughnessMap:grassroughtexture,
      roughness:1
    })
)
floor.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow=true
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)

scene.add(moonLight)


//door light
const doorlight=new THREE.PointLight('#ff7d46',1,7)
doorlight.position.set(0,2.2,2.7)
house.add(doorlight)


/**
 * Ghosts
 */

const ghost1= new THREE.PointLight('#ff00ff',2,3)


const ghost2= new THREE.PointLight('#00ffff',2,3)


const ghost3= new THREE.PointLight('#fff0ff',2,3)
scene.add(ghost1,ghost2,ghost3)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Shadows
 */
renderer.shadowMap.enabled=true
renderer.shadowMap.type=THREE.PCFShadowMap
moonLight.castShadow=true
doorlight.castShadow=true
ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true

walls.castShadow=true
bush1.castShadow=true
bush3.castShadow=true
bush4.castShadow=true
bush2.castShadow=true
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    //ghost animation
    const ghostangle1=elapsedTime*0.5
    ghost1.position.x=Math.cos(ghostangle1)*4
    ghost1.position.z=Math.sin(ghostangle1)*4
    ghost1.position.y=Math.cos((ghostangle1)*3)
    
    const ghostangle2=-elapsedTime*0.3
    ghost2.position.x=Math.cos(ghostangle2)*5
    ghost2.position.z=Math.sin(ghostangle2)*5
    ghost2.position.y=Math.cos((ghostangle2)*4+Math.sin(elapsedTime*2.5))
    
    const ghostangle3=elapsedTime*0.2
    ghost3.position.x=Math.cos(ghostangle3)*(7+Math.sin(elapsedTime*0.32))
    ghost3.position.z=Math.sin(ghostangle3)*6
    ghost3.position.y=Math.cos((ghostangle3)*3)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()