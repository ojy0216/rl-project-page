function toggleMoreWorks() {
  const dropdown = document.getElementById("moreWorksDropdown");
  const button = document.querySelector(".more-works-btn");

  if (!dropdown || !button) {
    return;
  }

  dropdown.classList.toggle("show");
  button.classList.toggle("active");
}

function closeMoreWorks() {
  const dropdown = document.getElementById("moreWorksDropdown");
  const button = document.querySelector(".more-works-btn");

  if (!dropdown || !button) {
    return;
  }

  dropdown.classList.remove("show");
  button.classList.remove("active");
}

function copyBibTeX(targetId, button) {
  const bibtexElement = document.getElementById(targetId);
  const copyText = button ? button.querySelector(".copy-text") : null;

  if (!bibtexElement || !button || !copyText) {
    return;
  }

  const bibtexText = bibtexElement.textContent;

  const onCopySuccess = () => {
    button.classList.add("copied");
    copyText.textContent = "Copied";

    window.setTimeout(() => {
      button.classList.remove("copied");
      copyText.textContent = "Copy";
    }, 1800);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(bibtexText).then(onCopySuccess).catch(() => {
      fallbackCopy(bibtexText, onCopySuccess);
    });
    return;
  }

  fallbackCopy(bibtexText, onCopySuccess);
}

function fallbackCopy(text, onCopySuccess) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
    onCopySuccess();
  } finally {
    document.body.removeChild(textArea);
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function updatePageNavigation() {
  const pageNavLinks = Array.from(document.querySelectorAll(".page-nav-link"));

  if (!pageNavLinks.length) {
    return;
  }

  const currentSection = pageNavLinks.reduce((activeId, link) => {
    const targetId = link.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) {
      return activeId;
    }

    const section = document.querySelector(targetId);

    if (!section) {
      return activeId;
    }

    if (window.scrollY >= section.offsetTop - 180) {
      return targetId;
    }

    return activeId;
  }, pageNavLinks[0].getAttribute("href"));

  pageNavLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentSection);
  });
}

function updateFloatingUi() {
  const scrollButton = document.querySelector(".scroll-to-top");

  if (scrollButton) {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add("visible");
    } else {
      scrollButton.classList.remove("visible");
    }
  }

  updatePageNavigation();
}

window.addEventListener("scroll", updateFloatingUi);
window.addEventListener("load", updateFloatingUi);
window.addEventListener("resize", updatePageNavigation);

document.addEventListener("click", (event) => {
  const container = document.querySelector(".more-works-container");

  if (!container) {
    return;
  }

  if (!container.contains(event.target)) {
    closeMoreWorks();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMoreWorks();
  }
});
