"use client";

import React, { useRef, useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    Environment,
    Float,
    MeshTransmissionMaterial,
    MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────── CONSTANTS ─────────────────── */
const PRIMARY_BLUE = new THREE.Color("#0EA5E9");
const ACCENT_TEAL = new THREE.Color("#14B8A6");
const GLOW_CYAN = new THREE.Color("#67E8F9");
const WHITE = new THREE.Color("#FFFFFF");
const LOADER_DURATION = 7000; // ms

/* ─────────────────── HOSPITAL BUILDING ─────────────────── */
function HospitalBuilding({ phase }: { phase: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const windowsRef = useRef<THREE.InstancedMesh>(null);
    const windowCount = 80;

    // Generate window positions
    const windowData = useMemo(() => {
        const data: { position: THREE.Vector3; floor: number }[] = [];
        const floors = 8;
        const windowsPerFloor = 10;
        for (let f = 0; f < floors; f++) {
            for (let w = 0; w < windowsPerFloor; w++) {
                const x = (w - windowsPerFloor / 2 + 0.5) * 0.42;
                const y = f * 0.5 + 0.5;
                const z = 2.01;
                data.push({ position: new THREE.Vector3(x, y, z), floor: f });
            }
        }
        return data;
    }, []);

    // Setup instanced mesh
    useEffect(() => {
        if (!windowsRef.current) return;
        const dummy = new THREE.Object3D();
        windowData.forEach((w, i) => {
            dummy.position.copy(w.position);
            dummy.scale.set(0.35, 0.38, 0.05);
            dummy.updateMatrix();
            windowsRef.current!.setMatrixAt(i, dummy.matrix);
        });
        windowsRef.current.instanceMatrix.needsUpdate = true;
    }, [windowData]);

    // Animate windows lighting up floor by floor during scan phase
    useFrame(({ clock }) => {
        if (!windowsRef.current || phase < 2) return;
        const t = clock.getElapsedTime();
        const scanProgress = Math.min((phase - 2) * 1.5, 1);
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        windowData.forEach((w, i) => {
            dummy.position.copy(w.position);
            dummy.scale.set(0.35, 0.38, 0.05);
            dummy.updateMatrix();
            windowsRef.current!.setMatrixAt(i, dummy.matrix);

            const floorProgress = w.floor / 8;
            const isLit = floorProgress < scanProgress;

            if (isLit) {
                const pulse = Math.sin(t * 3 + w.floor * 0.5) * 0.3 + 0.7;
                color.copy(GLOW_CYAN).multiplyScalar(pulse);
            } else {
                color.set("#1a3a5c");
            }
            windowsRef.current!.setColorAt(i, color);
        });

        if (windowsRef.current.instanceColor) {
            windowsRef.current.instanceColor.needsUpdate = true;
        }
        windowsRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={groupRef} position={[0, -1.5, 0]}>
            {/* Main Building Body */}
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[5, 4.5, 4]} />
                <meshPhysicalMaterial
                    color="#e8f0f8"
                    roughness={0.15}
                    metalness={0.05}
                    clearcoat={0.8}
                    clearcoatRoughness={0.1}
                />
            </mesh>

            {/* Glass Facade */}
            <mesh position={[0, 2, 2.01]}>
                <planeGeometry args={[4.8, 4.3]} />
                <meshPhysicalMaterial
                    color="#b8d8f0"
                    transparent
                    opacity={0.3}
                    roughness={0}
                    metalness={0.1}
                    transmission={0.6}
                    thickness={0.1}
                />
            </mesh>

            {/* Windows (instanced) */}
            <instancedMesh ref={windowsRef} args={[undefined, undefined, windowCount]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    emissive="#1a3a5c"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.9}
                />
            </instancedMesh>

            {/* Building Top Section */}
            <mesh position={[0, 4.5, 0]} castShadow>
                <boxGeometry args={[5.2, 0.3, 4.2]} />
                <meshPhysicalMaterial color="#d0e4f0" roughness={0.2} metalness={0.1} />
            </mesh>

            {/* Entrance */}
            <mesh position={[0, 0.4, 2.05]}>
                <boxGeometry args={[1.2, 0.8, 0.1]} />
                <meshPhysicalMaterial
                    color="#0EA5E9"
                    emissive="#0EA5E9"
                    emissiveIntensity={phase >= 3 ? 2 : 0.3}
                    transparent
                    opacity={0.8}
                    roughness={0}
                />
            </mesh>

            {/* Ground Floor — Base */}
            <mesh position={[0, -0.05, 0]} receiveShadow>
                <boxGeometry args={[6, 0.1, 5]} />
                <meshStandardMaterial color="#c8d8e8" roughness={0.8} />
            </mesh>

            {/* Left Wing */}
            <mesh position={[-3.2, 1.2, 0]} castShadow>
                <boxGeometry args={[1.5, 2.5, 3.5]} />
                <meshPhysicalMaterial color="#dce8f2" roughness={0.2} metalness={0.05} clearcoat={0.5} />
            </mesh>

            {/* Right Wing */}
            <mesh position={[3.2, 1.2, 0]} castShadow>
                <boxGeometry args={[1.5, 2.5, 3.5]} />
                <meshPhysicalMaterial color="#dce8f2" roughness={0.2} metalness={0.05} clearcoat={0.5} />
            </mesh>
        </group>
    );
}

/* ─────────────────── MEDICAL CROSS HOLOGRAM ──────────────── */
function MedicalCross({ phase }: { phase: number }) {
    const crossRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (!crossRef.current) return;
        crossRef.current.rotation.y = clock.getElapsedTime() * 0.3;
        const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1;
        crossRef.current.scale.setScalar(pulse * (phase >= 1 ? 1 : 0));
    });

    return (
        <group ref={crossRef} position={[0, 3.8, 0]}>
            {/* Vertical bar */}
            <mesh>
                <boxGeometry args={[0.15, 0.6, 0.05]} />
                <meshStandardMaterial
                    color="#0EA5E9"
                    emissive="#0EA5E9"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            {/* Horizontal bar */}
            <mesh>
                <boxGeometry args={[0.6, 0.15, 0.05]} />
                <meshStandardMaterial
                    color="#0EA5E9"
                    emissive="#0EA5E9"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            {/* Glow sphere */}
            <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial
                    color="#0EA5E9"
                    emissive="#67E8F9"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.08}
                />
            </mesh>
        </group>
    );
}

/* ─────────────────── SCANNING BEAM ──────────────────── */
function ScanningBeam({ phase }: { phase: number }) {
    const beamRef = useRef<THREE.Mesh>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(phase >= 2);
    }, [phase]);

    useFrame(({ clock }) => {
        if (!beamRef.current || !visible) return;
        const t = clock.getElapsedTime();
        const scanY = -1.5 + ((t * 0.8) % 1) * 5;
        beamRef.current.position.y = scanY;
    });

    if (!visible) return null;

    return (
        <mesh ref={beamRef} position={[0, 0, 0]}>
            <planeGeometry args={[7, 0.05]} />
            <meshStandardMaterial
                color="#0EA5E9"
                emissive="#67E8F9"
                emissiveIntensity={4}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/* ─────────────────── ATMOSPHERE PARTICLES ──────────── */
function AtmosphereParticles({ count = 300 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null);

    const [positions, sizes] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
            sizes[i] = Math.random() * 0.03 + 0.01;
        }
        return [positions, sizes];
    }, [count]);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const t = clock.getElapsedTime();
        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            posArray[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.001;
            posArray[i * 3] += Math.cos(t * 0.5 + i * 0.05) * 0.0005;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color="#67E8F9"
                transparent
                opacity={0.6}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

/* ─────────────────── ECG PULSE LINE ─────────────────── */
function ECGPulse({ phase }: { phase: number }) {
    const lineRef = useRef<THREE.Line>(null);
    const pointCount = 100;

    const positions = useMemo(() => {
        return new Float32Array(pointCount * 3);
    }, []);

    useFrame(({ clock }) => {
        if (!lineRef.current || phase < 2) return;
        const t = clock.getElapsedTime();
        const posArray = lineRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < pointCount; i++) {
            const x = (i / pointCount - 0.5) * 3;
            let y = 0;
            const wave = (i / pointCount + t * 0.5) % 1;

            // ECG-like waveform
            if (wave > 0.4 && wave < 0.42) y = 0.3;
            else if (wave > 0.42 && wave < 0.45) y = -0.15;
            else if (wave > 0.45 && wave < 0.48) y = 0.8;
            else if (wave > 0.48 && wave < 0.5) y = -0.2;
            else if (wave > 0.5 && wave < 0.52) y = 0.1;
            else y = Math.sin(wave * Math.PI * 2) * 0.02;

            posArray[i * 3] = x;
            posArray[i * 3 + 1] = y * 0.4;
            posArray[i * 3 + 2] = 0;
        }
        lineRef.current.geometry.attributes.position.needsUpdate = true;
    });

    if (phase < 2) return null;

    return (
        <group position={[-4.5, 2.5, 2.5]} rotation={[0, 0.3, 0]} scale={0.8}>
            {/* Background panel */}
            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[3.5, 1.2]} />
                <meshStandardMaterial
                    color="#0c1a2e"
                    transparent
                    opacity={0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <line ref={lineRef as any}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#22D3EE" linewidth={2} transparent opacity={0.9} />
            </line>
        </group>
    );
}

/* ─────────────────── DNA HELIX ──────────────────────── */
function DNAHelix({ phase }: { phase: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const sphereCount = 30;

    useFrame(({ clock }) => {
        if (!groupRef.current || phase < 2) return;
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    });

    if (phase < 2) return null;

    return (
        <group ref={groupRef} position={[4.5, 1.5, 2]} scale={0.6}>
            {Array.from({ length: sphereCount }).map((_, i) => {
                const t = i / sphereCount;
                const angle = t * Math.PI * 4;
                const y = (t - 0.5) * 4;
                return (
                    <React.Fragment key={i}>
                        <mesh position={[Math.cos(angle) * 0.5, y, Math.sin(angle) * 0.5]}>
                            <sphereGeometry args={[0.06, 8, 8]} />
                            <meshStandardMaterial
                                color="#0EA5E9"
                                emissive="#0EA5E9"
                                emissiveIntensity={1.5}
                            />
                        </mesh>
                        <mesh position={[Math.cos(angle + Math.PI) * 0.5, y, Math.sin(angle + Math.PI) * 0.5]}>
                            <sphereGeometry args={[0.06, 8, 8]} />
                            <meshStandardMaterial
                                color="#14B8A6"
                                emissive="#14B8A6"
                                emissiveIntensity={1.5}
                            />
                        </mesh>
                        {i % 3 === 0 && (
                            <mesh position={[0, y, 0]} rotation={[0, angle, 0]}>
                                <cylinderGeometry args={[0.01, 0.01, 1, 4]} />
                                <meshStandardMaterial
                                    color="#67E8F9"
                                    emissive="#67E8F9"
                                    emissiveIntensity={0.5}
                                    transparent
                                    opacity={0.4}
                                />
                            </mesh>
                        )}
                    </React.Fragment>
                );
            })}
        </group>
    );
}

/* ─────────────────── PROGRESS RING ──────────────────── */
function ProgressRing({ progress }: { progress: number }) {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!ringRef.current) return;
        const mat = ringRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1 + Math.sin(Date.now() * 0.005) * 0.5;
    });

    return (
        <group position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Background ring */}
            <mesh>
                <torusGeometry args={[4, 0.02, 8, 64]} />
                <meshStandardMaterial color="#1e3a5f" transparent opacity={0.3} />
            </mesh>
            {/* Progress ring */}
            <mesh ref={ringRef}>
                <torusGeometry args={[4, 0.04, 8, 64, Math.PI * 2 * Math.min(progress, 1)]} />
                <meshStandardMaterial
                    color="#0EA5E9"
                    emissive="#67E8F9"
                    emissiveIntensity={1.5}
                />
            </mesh>
            {/* Glow ring */}
            <mesh>
                <torusGeometry args={[4, 0.15, 8, 64, Math.PI * 2 * Math.min(progress, 1)]} />
                <meshStandardMaterial
                    color="#0EA5E9"
                    emissive="#0EA5E9"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.1}
                />
            </mesh>
        </group>
    );
}

/* ─────────────────── ANIMATED CAMERA ────────────────── */
function AnimatedCamera({ phase }: { phase: number }) {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3(0, 2, 10));
    const targetLookAt = useRef(new THREE.Vector3(0, 1.5, 0));

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        if (phase <= 1) {
            // Scene 1-2: Slow dolly in + slight orbit
            targetPos.current.set(
                Math.sin(t * 0.15) * 1.5,
                2.5 + Math.sin(t * 0.2) * 0.3,
                10 - Math.min(t * 0.3, 2)
            );
            targetLookAt.current.set(0, 1.5, 0);
        } else if (phase <= 2) {
            // Scene 3: Orbit around
            const angle = t * 0.1;
            targetPos.current.set(
                Math.sin(angle) * 8,
                2.5,
                Math.cos(angle) * 8
            );
            targetLookAt.current.set(0, 1.5, 0);
        } else {
            // Scene 4: Push toward entrance
            const pushProgress = Math.min((phase - 2.5) * 2, 1);
            const eased = pushProgress * pushProgress * (3 - 2 * pushProgress); // smoothstep
            targetPos.current.set(
                THREE.MathUtils.lerp(camera.position.x, 0, eased * 0.05),
                THREE.MathUtils.lerp(2.5, 0.8, eased),
                THREE.MathUtils.lerp(8, 3, eased)
            );
            targetLookAt.current.set(0, 0.5, 0);
        }

        camera.position.lerp(targetPos.current, 0.02);
        const lookAtVec = new THREE.Vector3().copy(targetLookAt.current);
        const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
        currentLookAt.lerp(lookAtVec, 0.02);
        camera.lookAt(lookAtVec);
    });

    return null;
}

/* ─────────────────── GROUND PLANE ────────────────────── */
function GroundPlane() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial
                color="#e0ecf5"
                roughness={0.9}
                metalness={0}
            />
        </mesh>
    );
}

/* ─────────────────── 3D SCENE ────────────────────────── */
function Scene({ phase, progress }: { phase: number; progress: number }) {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[10, 15, 10]}
                intensity={1.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[0, 5, 5]} intensity={0.8} color="#67E8F9" />
            <pointLight position={[-5, 3, -3]} intensity={0.4} color="#0EA5E9" />

            {/* Fog */}
            <fog attach="fog" args={["#f0f7ff", 8, 25]} />

            <AnimatedCamera phase={phase} />
            <AtmosphereParticles count={200} />
            <HospitalBuilding phase={phase} />
            <MedicalCross phase={phase} />
            <ScanningBeam phase={phase} />
            <ECGPulse phase={phase} />
            <DNAHelix phase={phase} />
            <ProgressRing progress={progress} />
            <GroundPlane />
        </>
    );
}

/* ─────────────────── LOADER UI OVERLAY ──────────────── */
const loaderTexts = [
    "Initializing Healthcare Systems…",
    "Connecting to AI Diagnostics & Emergency Network…",
    "Securing Patient Data & Preparing Environment…",
    "Welcome to Instabed",
];

function LoaderUI({ phase, progress }: { phase: number; progress: number }) {
    const textIndex = Math.min(phase, loaderTexts.length - 1);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-end pb-24">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3"
            >
                <div className="w-10 h-10 bg-[#0EA5E9] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-800">
                    Insta<span className="text-[#0EA5E9]">bed</span>
                </span>
            </motion.div>

            {/* Status Text */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={textIndex}
                    initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                    transition={{ duration: 0.6 }}
                    className="text-slate-500 text-sm md:text-base font-medium tracking-wide mb-6 text-center px-4"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {loaderTexts[textIndex]}
                </motion.p>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="w-64 md:w-80 h-1 bg-slate-200/60 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        background: "linear-gradient(90deg, #0EA5E9, #14B8A6, #67E8F9)",
                        width: `${progress * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Progress Percentage */}
            <motion.p
                className="text-[#0EA5E9] text-xs font-bold mt-3 tracking-[0.2em]"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {Math.round(progress * 100)}%
            </motion.p>
        </div>
    );
}

/* ─────────────────── MAIN LOADER COMPONENT ──────────── */
export default function HospitalCinematicLoader({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);
    const [exiting, setExiting] = useState(false);
    const startTime = useRef(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime.current;
            const p = Math.min(elapsed / LOADER_DURATION, 1);
            setProgress(p);

            // Phase transitions
            if (p < 0.28) setPhase(0);
            else if (p < 0.55) setPhase(1);
            else if (p < 0.82) setPhase(2);
            else setPhase(3);

            if (p >= 1) {
                clearInterval(interval);
                setTimeout(() => {
                    setExiting(true);
                    setTimeout(onComplete, 1200);
                }, 300);
            }
        }, 16);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!exiting ? (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999]"
                    style={{ background: "linear-gradient(180deg, #f8fcff 0%, #e8f4fd 50%, #f0f7ff 100%)" }}
                >
                    <Canvas
                        shadows
                        dpr={[1, 1.5]}
                        gl={{
                            antialias: true,
                            alpha: true,
                            powerPreference: "high-performance",
                        }}
                        camera={{ position: [0, 2.5, 12], fov: 45, near: 0.1, far: 100 }}
                    >
                        <Suspense fallback={null}>
                            <Scene phase={phase} progress={progress} />
                        </Suspense>
                    </Canvas>
                    <LoaderUI phase={phase} progress={progress} />

                    {/* Corner decorative elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-sky-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-teal-200/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
                </motion.div>
            ) : (
                <motion.div
                    key="exit-flash"
                    initial={{ opacity: 1, backgroundColor: "rgba(14, 165, 233, 0.1)" }}
                    animate={{ opacity: 0, backgroundColor: "rgba(255, 255, 255, 0)" }}
                    transition={{ duration: 1.2 }}
                    className="fixed inset-0 z-[9999] pointer-events-none"
                />
            )}
        </AnimatePresence>
    );
}
