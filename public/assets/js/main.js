// ============================================================
// FUTBOLITO — main.js
//
// Interactividad del sitio. Este archivo maneja:
//   1. Año dinámico en el footer
//   2. Navbar: fondo transparente → oscuro al scrollear
//   3. Botón "volver arriba"
//   4. Sección activa en el nav (IntersectionObserver)
//   5. Demo de reserva
//   6. Formulario de contacto con validación
//
// Nota: el colapso del menú hamburguesa en mobile está
// manejado por Bootstrap JS (bootstrap.bundle.min.js).
// No necesitamos código propio para eso.
// ============================================================

"use strict";


// ─── 1. AÑO DINÁMICO EN EL FOOTER ───────────────────────────
// Evita tener que actualizar el año a mano cada año.

document.getElementById('year').textContent = new Date().getFullYear();


// ─── 2. NAVBAR: TRANSPARENTE → OSCURO AL SCROLLEAR ──────────
//
// El navbar arranca transparente (sin background en el CSS).
// Cuando el usuario baja 30px, se agrega la clase .scrolled
// que activa el fondo oscuro con blur (definido en styles.css).
//
// Esto es diferente a Farmear Aura, donde el nav siempre
// tiene el glassmorphism activo.

const siteNav  = document.getElementById('siteNav');
const backToTop = document.getElementById('backToTop');

function updateScrollState() {
  // Navbar: agregar/quitar .scrolled según la posición
  siteNav?.classList.toggle('scrolled', window.scrollY > 30);

  // Botón "volver arriba": mostrar después de 450px
  backToTop?.classList.toggle('visible', window.scrollY > 450);
}

window.addEventListener('scroll', updateScrollState, { passive: true });

// Llamamos una vez al cargar para setear el estado inicial
// (por si la página carga con scroll > 0, ej: al recargar)
updateScrollState();


// ─── 3. BOTÓN "VOLVER ARRIBA" ────────────────────────────────

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ─── 4. SECCIÓN ACTIVA EN EL NAV (IntersectionObserver) ──────
//
// Detecta qué sección está visible y resalta el link
// correspondiente en el nav con la clase "active".
//
// Por qué IntersectionObserver en vez de scroll event:
// - El scroll event se ejecuta decenas de veces por segundo
// - IntersectionObserver corre fuera del hilo principal
// - Es la API moderna y recomendada para este tipo de tarea
//
// Ver también: Farmear Aura usa el mismo patrón.

const navLinks = document.querySelectorAll('.ft-nav-link[data-section]');
const sections  = document.querySelectorAll('section[id]');

const observerOptions = {
  root: null,                    // el viewport del navegador
  rootMargin: '-25% 0px -65% 0px',
  // Explicación del rootMargin:
  // -25% arriba: la sección "activa" cuando su tope bajó 25%
  // -65% abajo: se desactiva cuando está en el tercio inferior
  // Resultado: solo la sección principal en pantalla se activa
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      // Quitamos "active" de todos los links
      navLinks.forEach(link => link.classList.remove('active'));

      // Buscamos el link que corresponde a esta sección
      const sectionId  = entry.target.id;
      const activeLink = document.querySelector(
        `.ft-nav-link[data-section="${sectionId}"]`
      );

      // Lo marcamos activo (dispara el subrayado lima en CSS)
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));


// ─── 5. DEMO DE RESERVA ──────────────────────────────────────
//
// Simula una reserva exitosa con feedback visual.
// Después de 4.5 segundos, el botón y el mensaje vuelven
// al estado original.
//
// En la etapa de backend esto enviará una petición a:
// POST /api/reservas en FastAPI

const reservationDemo = document.getElementById('reservationDemo');
const demoMessage     = document.getElementById('demoMessage');

reservationDemo?.addEventListener('click', () => {
  // Feedback inmediato al usuario
  demoMessage.textContent = '¡Demo realizada! En la siguiente etapa este botón podrá consultar disponibilidad en FastAPI.';

  // Cambiamos el texto del botón para reflejar el estado
  reservationDemo.innerHTML = '<i class="bi bi-check2-circle"></i> Reserva simulada';

  // Después de 4.5 segundos, reseteamos el estado
  setTimeout(() => {
    reservationDemo.innerHTML = '<i class="bi bi-calendar-plus"></i> Probar reserva';
    demoMessage.textContent   = '';
  }, 4500);
});


// ─── 6. FORMULARIO DE CONTACTO ───────────────────────────────
//
// Validación con la API nativa del navegador (HTML5).
// No necesitamos jQuery ni librerías externas.
//
// En la etapa de backend, reemplazar el cuerpo del submit con:
//   const data = Object.fromEntries(new FormData(contactForm));
//   fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), ... })
//
// Ver también: src/routes/contact.py (FastAPI router)


const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const data = Object.fromEntries(new FormData(contactForm).entries());

    if (formMessage) {
        formMessage.textContent = 'Enviando consulta...';
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail || 'No se pudo guardar el contacto.'
            );
        }

        if (formMessage) {
            formMessage.textContent =
                '¡Consulta guardada correctamente! Abriendo WhatsApp...';
        }

        const nombre = data.nombre || '';
        const email = data.email || '';
        const asunto = data.asunto || '';
        const mensaje = data.mensaje || '';

        const textoWhatsApp =
            `Hola, soy ${nombre}.\n` +
            `Email: ${email}\n` +
            `Asunto: ${asunto}\n` +
            `Mensaje: ${mensaje}`;

        const telefono = 1123435413;
        const urlWhatsApp =
            `https://wa.me/${telefono}?text=${encodeURIComponent(textoWhatsApp)}`;

        window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');

        contactForm.reset();

    } catch (error) {
        console.error('Error al enviar el contacto:', error);

        if (formMessage) {
            formMessage.textContent =
                'No se pudo enviar la consulta. Verificá que FastAPI esté funcionando e intentá nuevamente.';
        }
    }
});

// HU-011: Botón "Conocé más sobre Futbolito"


document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("btn-conoce-mas");
    const modal = document.getElementById("modal-conoce-mas");
    const cerrar = document.getElementById("cerrar-modal-conoce-mas");

    if (!boton || !modal || !cerrar) {
        console.error("HU-011: No se encontró el botón, el modal o el botón de cierre.");
        return;
    }

    // Abrir la ventana al pulsar el botón del medio
    boton.addEventListener("click", function (evento) {
        evento.preventDefault();
        modal.classList.add("ft-modal-visible");
        modal.setAttribute("aria-hidden", "false");
    });

    // Cerrar la ventana con la X
    cerrar.addEventListener("click", function () {
        modal.classList.remove("ft-modal-visible");
        modal.setAttribute("aria-hidden", "true");
    });

    // Cerrar al pulsar fuera del cuadro
    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            modal.classList.remove("ft-modal-visible");
            modal.setAttribute("aria-hidden", "true");
        }
    });

    // Cerrar al pulsar Escape
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            modal.classList.remove("ft-modal-visible");
            modal.setAttribute("aria-hidden", "true");
        }
    });
});