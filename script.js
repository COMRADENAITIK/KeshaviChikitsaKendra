/**
 * Keshavi Chikitsa Kendra - Clinic Website Controller
 * Native Vanilla ES6+ - Compact & Production Ready
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const header = document.getElementById("navbar");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const drawerLinks = document.querySelectorAll(".drawer-link");
  const navLinks = document.querySelectorAll(".nav-link");
  const currentYearSpan = document.getElementById("current-year");

  // Modal Elements
  const modalOverlay = document.getElementById("appointment-modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const openModalButtons = document.querySelectorAll("[data-open-modal='true']");
  const appointmentForm = document.getElementById("appointment-form");
  const patientNameInput = document.getElementById("patient-name");
  const patientPhoneInput = document.getElementById("patient-phone");
  const preferredDateInput = document.getElementById("preferred-date");
  const selectedTimeSlotInput = document.getElementById("selected-time-slot");
  const treatmentServiceSelect = document.getElementById("treatment-service");
  const timeChips = document.querySelectorAll(".time-chip");
  const modalErrorBox = document.getElementById("modal-error-box");
  const modalErrorMessage = document.getElementById("modal-error-message");

  /* 1. Dynamic Copyright Year */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* 2. Mobile Drawer Navigation */
  const openMobileMenu = () => {
    hamburgerBtn.setAttribute("aria-expanded", "true");
    mobileDrawer.setAttribute("aria-hidden", "false");
    mobileOverlay.setAttribute("aria-hidden", "false");
    mobileDrawer.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeMobileMenu = () => {
    hamburgerBtn.setAttribute("aria-expanded", "false");
    mobileDrawer.setAttribute("aria-hidden", "true");
    mobileOverlay.setAttribute("aria-hidden", "true");
    mobileDrawer.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (hamburgerBtn && mobileDrawer && mobileOverlay) {
    hamburgerBtn.addEventListener("click", openMobileMenu);
    drawerCloseBtn.addEventListener("click", closeMobileMenu);
    mobileOverlay.addEventListener("click", closeMobileMenu);
    drawerLinks.forEach((l) => l.addEventListener("click", closeMobileMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("active")) closeMobileMenu();
    });
  }

  /* 3. Header Scroll State */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }, { passive: true });

  /* 4. Smooth Anchor Scrolling */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: pos, behavior: "smooth" });
      }
    });
  });

  /* 5. ScrollSpy Active Nav */
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollPos = window.pageYOffset + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) link.classList.add("active");
        });
      }
    });
  }, { passive: true });

  /* 6. Seamless Infinite Loop for Reviews Marquee */
  const setupMarqueeTracks = () => {
    const tracks = document.querySelectorAll(".marquee-track");
    tracks.forEach((track) => {
      // Duplicate child review cards once for seamless looping
      const clone = track.innerHTML;
      track.insertAdjacentHTML("beforeend", clone);
    });
  };
  setupMarqueeTracks();

  /* 7. Appointment Modal & WhatsApp Integration */
  const setMinDateToToday = () => {
    if (preferredDateInput) {
      const today = new Date().toISOString().split("T")[0];
      preferredDateInput.min = today;
    }
  };

  const openAppointmentModal = (service = null) => {
    setMinDateToToday();
    if (modalErrorBox) modalErrorBox.style.display = "none";
    document.querySelectorAll(".form-control").forEach((el) => el.classList.remove("is-invalid"));

    if (service && treatmentServiceSelect) {
      const match = Array.from(treatmentServiceSelect.options).find((opt) =>
        opt.value.toLowerCase().includes(service.toLowerCase()) || opt.text.toLowerCase().includes(service.toLowerCase())
      );
      if (match) treatmentServiceSelect.value = match.value;
    }

    modalOverlay.setAttribute("aria-hidden", "false");
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    if (patientNameInput) setTimeout(() => patientNameInput.focus(), 150);
  };

  const closeAppointmentModal = () => {
    modalOverlay.setAttribute("aria-hidden", "true");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  openModalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (mobileDrawer && mobileDrawer.classList.contains("active")) closeMobileMenu();
      const serviceParam = btn.getAttribute("data-service");
      openAppointmentModal(serviceParam);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeAppointmentModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeAppointmentModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) closeAppointmentModal();
  });

  // Time slot chips
  timeChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      timeChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      if (selectedTimeSlotInput) selectedTimeSlotInput.value = chip.getAttribute("data-slot");
      if (modalErrorBox) modalErrorBox.style.display = "none";
    });
  });

  // Form Validation & WhatsApp Redirect
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = patientNameInput ? patientNameInput.value.trim() : "";
      const phone = patientPhoneInput ? patientPhoneInput.value.trim() : "";
      const date = preferredDateInput ? preferredDateInput.value.trim() : "";
      const time = selectedTimeSlotInput ? selectedTimeSlotInput.value.trim() : "";
      const concern = treatmentServiceSelect ? treatmentServiceSelect.value.trim() : "";

      if (!name || !phone || phone.length < 10 || !date || !time || !concern) {
        if (modalErrorBox && modalErrorMessage) {
          modalErrorMessage.textContent = "Please fill in all required fields and select a time slot.";
          modalErrorBox.style.display = "flex";
        }
        return;
      }

      // Format Date to DD/MM/YYYY
      let formattedDate = date;
      const parts = date.split("-");
      if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

      // Construct WhatsApp Message
      const message = `Hello Keshavi Chikitsa Kendra,
I would like to book an appointment.

Name: ${name}
Phone: ${phone}
Preferred Date: ${formattedDate}
Preferred Time: ${time}
Concern: ${concern}

Thank you.`;

      const whatsappUrl = `https://wa.me/918076515866?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      appointmentForm.reset();
      timeChips.forEach((c) => c.classList.remove("active"));
      if (selectedTimeSlotInput) selectedTimeSlotInput.value = "";
      closeAppointmentModal();
    });
  }

  /* 8. Lightweight Intersection Observer */
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("revealed"));
  }
});