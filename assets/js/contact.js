/**
 * Right Asset's Property Consultants - Contact Page Script
 * Captures general enquiries, provides instant feedback toast,
 * logs leads in client storage, and routes inquiries to WhatsApp.
 */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("general-contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contact-name").value.trim();
      const phone = document.getElementById("contact-phone").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const purpose = document.getElementById("contact-purpose").value;
      const category = document.getElementById("contact-category").value;
      const budget = document.getElementById("contact-budget").value.trim();
      const message = document.getElementById("contact-message").value.trim();

      if (!name || !phone) {
        showToast("Please provide your Name and Phone Number.", "info");
        return;
      }

      const newLead = {
        clientName: name,
        phone: phone,
        email: email || "Not Provided",
        purpose: purpose,
        category: category,
        budget: budget || "Flexible",
        message: message,
        propertyTitle: `${purpose.toUpperCase()} - ${category.toUpperCase()}`
      };

      LeadService.saveLead(newLead);
      showToast("Thank you! Your inquiry has been received. Sanjeev Mehta & Nutan Madam will contact you shortly.", "success");
      contactForm.reset();

      // Offer immediate WhatsApp connect to Sanjeev Mehta
      setTimeout(() => {
        if (confirm("Would you like to connect directly with Sanjeev Mehta (Owner) on WhatsApp for immediate priority response?")) {
          const waMsg = `Hello Sanjeev Ji,\nMy name is ${name}.\nI am inquiring about: ${purpose.toUpperCase()} ${category.toUpperCase()} in Kandivali/Borivali/Malad.\nBudget: ${budget || 'Flexible'}\nPhone: ${phone}\nDetails: ${message || 'Please share available options.'}`;
          openWhatsAppMessage("918879541828", waMsg);
        }
      }, 500);
    });
  }
});
