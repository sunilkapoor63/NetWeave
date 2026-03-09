import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function ThreeEnergyBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mountEl = mountRef.current
    if (!mountEl) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      52,
      mountEl.clientWidth / mountEl.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0.85, 6.1)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mountEl.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x48a6ff, 0.6)
    const cyanLight = new THREE.PointLight(0x3de8ff, 2.4, 20)
    const warmLight = new THREE.PointLight(0xf8d06e, 1.6, 12)
    const violetLight = new THREE.PointLight(0xb78cff, 1.2, 16)
    cyanLight.position.set(0, 0.65, 2.4)
    warmLight.position.set(0.45, 0.35, 1.2)
    violetLight.position.set(-0.55, 0.55, 1.5)
    scene.add(ambientLight, cyanLight, warmLight, violetLight)

    const crystalGroup = new THREE.Group()

    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x58e6ff,
      emissive: 0x0f5e7a,
      metalness: 0.45,
      roughness: 0.1,
      transmission: 0.65,
      transparent: true,
      opacity: 0.62,
      thickness: 1,
    })
    const shell = new THREE.Mesh(new THREE.OctahedronGeometry(1.18, 0), shellMat)

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf8d06e,
      emissive: 0xc58a1f,
      emissiveIntensity: 0.5,
      metalness: 0.2,
      roughness: 0.45,
      transparent: true,
      opacity: 0.92,
    })
    const core = new THREE.Mesh(new THREE.TetrahedronGeometry(0.6, 0), coreMat)

    const edgeGeo = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.2, 0))
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x88f2ff,
      transparent: true,
      opacity: 0.8,
    })
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat)

    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x3de8ff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 24), orbMat)

    crystalGroup.add(shell, core, edgeLines, orb)
    crystalGroup.position.set(0, 0.65, 0)
    scene.add(crystalGroup)

    let rafId = 0

    const animate = (timeMs) => {
      const time = timeMs * 0.001

      crystalGroup.rotation.y = time * 0.28
      crystalGroup.rotation.x = Math.sin(time * 0.75) * 0.12
      crystalGroup.position.y = 0.65 + Math.sin(time * 1.2) * 0.13
      core.rotation.y -= 0.008
      core.rotation.x += 0.005

      const pulse = 0.95 + Math.sin(time * 2.5) * 0.26
      orb.scale.setScalar(pulse)
      orb.material.opacity = 0.24 + pulse * 0.22
      warmLight.intensity = 1.05 + pulse * 0.62
      cyanLight.intensity = 1.5 + Math.sin(time * 2.2) * 0.9
      violetLight.intensity = 0.8 + Math.sin(time * 2.6 + 0.7) * 0.45

      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(animate)
    }
    rafId = window.requestAnimationFrame(animate)

    const handleResize = () => {
      if (!mountRef.current) return
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      shell.geometry.dispose()
      shellMat.dispose()
      core.geometry.dispose()
      coreMat.dispose()
      edgeGeo.dispose()
      edgeMat.dispose()
      orb.geometry.dispose()
      orbMat.dispose()
      violetLight.dispose?.()
      renderer.dispose()
      mountEl.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="three-energy-background" aria-hidden="true" ref={mountRef} />
}

export default ThreeEnergyBackground
