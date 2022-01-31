import * as THREE from 'three'
import Experience from './Experience.js'
import Stats from 'stats.js'

export default class Performance
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.stats = new Stats()
            this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom)
        }
        
        // Setup 
        this.filterStrength = 5
        this.frameTime = 0
        this.lastLoop = new Date
        this.intervalSet = null

    }

    performanceCheck()
    {
        // Perform checks every 5 seconds
        if(this.intervalSet === null)
        {
            setInterval(() => {
                this.performanceCheck()
            }, 5000);
            this.intervalSet = true
        }

        // Check Performance
        this.frameRate = 1000/this.frameTime
        console.log(this.frameRate)

        if (this.frameRate <= 10) 
        {
            this.disablebloom()
            this.pauseVideos()
            // this.removeReflections()
        } else if (this.frameRate <=30)
        {
            this.pauseVideos()
            // this.removeReflections()
        } else if (this.frameRate <= 40)
        {
            // this.removeReflections()
        }
        
    }

    disablebloom()
    {
        // disable bloom
        this.experience.postProcessing.renderBloom = function dontRenderBloom (){}
        this.experience.postProcessing.bloomComposer.reset()

        // change materials
        this.experience.world.ramenShop.neonPink.material = new THREE.MeshBasicMaterial({color: new THREE.Color('#FFAEEA')})
        this.experience.world.ramenShop.neonBlue.material = new THREE.MeshBasicMaterial({color: new THREE.Color('#3BCBFF')})
        this.experience.world.ramenShop.arcadeRim.material = new THREE.MeshBasicMaterial({color: new THREE.Color('#3BCBFF')})
        this.experience.world.ramenShop.poleLight.material = new THREE.MeshBasicMaterial({color: new THREE.Color('#FCD4FF')})
        this.experience.world.ramenShop.neonGreen.material = new THREE.MeshBasicMaterial({color: new THREE.Color('#8FFF8F')})
    }

    pauseVideos()
    {
        for ( let i = 0; i < Object.keys(this.resources.video).length; i ++ ) {

            this.resources.video[Object.keys(this.resources.video)[i]].currentTime = 0
            this.resources.video[Object.keys(this.resources.video)[i]].pause()

        }
    }

    removeReflections()
    {
        this.experience.scene.remove(this.experience.world.reflections.groundMirror)
    }


    update()
    {
        if(this.debug.active)
        {
            this.stats.begin()
            this.stats.end()
        }

        this.thisFrameTime = (this.thisLoop=new Date) - this.lastLoop;
        this.frameTime+= (this.thisFrameTime - this.frameTime) / this.filterStrength;
        this.lastLoop = this.thisLoop;
    }
}