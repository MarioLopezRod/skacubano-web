"use client"; // 1. Indica que este componente tiene "vida" en el navegador

import { useState, useEffect } from "react"; // 2. Importamos las herramientas correctas

// La lista de imágenes puede ir fuera de la función porque no cambia
const images = [
  "/images/hero/SkaImagen2.jpg",
  "/images/hero/SkaImagen1.jpg",
  "/images/hero/SkaImagen3.jpg",
  "/images/hero/SkaImagen4.jpg",
  "/images/hero/SkaImagen5.jpg",
  "/images/hero/SkaImagen6.jpg",
  "/images/hero/SkaImagen7.jpg",
  "/images/hero/SkaImagen8.jpg",
  "/images/hero/SkaImagen9.jpg",
  "/images/hero/SkaImagen10.jpg",
  "/images/hero/SkaImagen11.jpg",
  "/images/hero/SkaImagen12.jpg",
  "/images/hero/SkaImagen13.jpg",
  "/images/hero/SkaImagen14.jpg",
  "/images/hero/SkaImagen15.jpg",
  "/images/hero/SkaImagen16.jpg",
  "/images/hero/SkaImagen17.jpg"
];

export default function Hero() {
  // 3. Los Hooks SIEMPRE van al principio de la función
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => { // Corregido: setInterval
      setCurrentImageIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // 4. Todo el "dibujo" va dentro del return
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      
      {/* Las imágenes DENTRO de la sección */}
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Skacubano Hero ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

    </section>
  );
}