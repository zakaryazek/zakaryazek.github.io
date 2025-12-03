
// --- Couleurs accent aléatoires ---
const accentColors = [
  '#0078d7',
  '#e74c3c',
  '#2E8B57',
  '#9b59b6',
  '#f39c12',
  '#1abc9c',
  '#e91e63',
  '#00bcd4',
  '#ff5722',
  '#607d8b'
];

function setRandomAccentColor() {
  const randomColor = accentColors[Math.floor(Math.random() * accentColors.length)];
  document.documentElement.style.setProperty('--accent', randomColor);
}
setRandomAccentColor();

// --- Menu burger ---
const burgerBtn = document.getElementById('burger-btn');
const menu = document.getElementById('menu');

// Afficher le bouton burger sur mobile
function handleResize() {
  if (window.innerWidth <= 768) {
    burgerBtn.style.display = 'flex';
  } else {
    burgerBtn.style.display = 'none';
    menu.classList.remove('active');
    burgerBtn.classList.remove('active');
  }
}

window.addEventListener('resize', handleResize);
handleResize();

// Toggle du menu burger
burgerBtn.addEventListener('click', () => {
  menu.classList.toggle('active');
  burgerBtn.classList.toggle('active');
});

// Fermer le menu lors du clic sur un lien
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    burgerBtn.classList.remove('active');
  });
});


// Scroll smooth pour les boutons hero
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Thème sombre/clair ---
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// --- Canvas animation avec couleurs adaptées au thème ---
const canvas = document.querySelector('#accueil #canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawBranch(ctx, x, y, length, angle, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);

  const isDarkMode = body.classList.contains('dark-mode');
  const branchColor = isDarkMode ? '#4a7c6f' : '#5a8b7f';
  const leafColors = isDarkMode
    ? ['#5a8b7f', '#6b9a8d', '#3a7065', '#7cb8aa', '#4a8d7f']
    : ['#6ba89d', '#8bc9bf', '#4a8b7f', '#9dd4ca', '#5a9d91'];

  ctx.strokeStyle = branchColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.6;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.5, -length * 0.2, length, -length * 0.4);
  ctx.stroke();

  const leaves = [
    { x: length * 0.2, y: -length * 0.1, rot: -0.5, scale: 1 },
    { x: length * 0.35, y: -length * 0.15, rot: -0.3, scale: 0.9 },
    { x: length * 0.25, y: -length * 0.2, rot: -0.7, scale: 1.1 },
    { x: length * 0.5, y: -length * 0.25, rot: -0.4, scale: 1 },
    { x: length * 0.6, y: -length * 0.28, rot: -0.2, scale: 0.95 },
    { x: length * 0.7, y: -length * 0.32, rot: -0.5, scale: 1.05 },
    { x: length * 0.8, y: -length * 0.35, rot: -0.3, scale: 0.9 },
    { x: length * 0.9, y: -length * 0.38, rot: -0.4, scale: 1 },
  ];

  ctx.globalAlpha = 0.75;
  leaves.forEach((leaf, i) => {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rot);
    ctx.scale(leaf.scale, leaf.scale);
    ctx.fillStyle = leafColors[i % leafColors.length];
    ctx.beginPath();
    ctx.ellipse(0, 0, 35, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

let time = 0;

function animate() {
  const isDarkMode = body.classList.contains('dark-mode');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  if (isDarkMode) {
    gradient.addColorStop(0, '#1a2635');
    gradient.addColorStop(0.5, '#0f1825');
    gradient.addColorStop(1, '#162030');
  } else {
    gradient.addColorStop(0, '#e8f5f3');
    gradient.addColorStop(0.5, '#d4e9e6');
    gradient.addColorStop(1, '#f0f8f7');
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  time += 0.02;

  const sway = Math.sin(time) * 0.08;
  const swayY = Math.cos(time * 0.7) * 5;

  ctx.save();
  ctx.translate(150 + swayY * 2, 180 + swayY);
  ctx.rotate(sway * 0.5);
  drawBranch(ctx, 0, 0, 350, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(canvas.width - 150 + swayY * 2, canvas.height - 250 + swayY);
  ctx.rotate(-sway * 0.5);
  ctx.scale(-1, -1);
  drawBranch(ctx, 0, 0, 350, 0);
  ctx.restore();

  requestAnimationFrame(animate);
}

animate();

// --- Menu actif au scroll ---
const menuLinks = document.querySelectorAll('.menu a');

window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + window.innerHeight / 2;
  menuLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      link.classList.add('active-section');
    } else {
      link.classList.remove('active-section');
    }
  });
});

// --- Modales formations ---
const formations = {
  bac: {
  titre: "Baccalauréat scientifique, option Systèmes d'information et numérique",
  etablissement: "Lycée polyvalent Les Iris",
  image: "images/bac.jpg",
  annee: "2020 - 2023",
  parcours: [
    "Série scientifique avec spécialités mathématiques et physique-chimie",
    "Cambridge English Certificate (CEC) obtenu avec le niveau C1",
    "Baccalauréat obtenu avec mention"
  ],
  competences: [
    "Mathématiques et logique algorithmique",
    "Bases du développement web (HTML/CSS) et de la programmation électronique (Arduino)",
    "Bases des réseaux (protocoles et adressage IP)",
    "ERASMUS : anglais courant"
  ]
},
  but: {
    titre: "BUT Informatique",
    etablissement: "IUT Gradignan",
    image: "images/but.jpg",
    annee: "2023 - actuellement",
    parcours: [
      "Formation axée sur le développement d'application",
      "Conception d'applications orientée objet",
      "Gestion de projet avec méthodologies Agile",
      "Stages en entreprise",
      "Plus encore..."
      
    ],
    competences: [
      "Développement full-stack (Frontend/Backend)",
      "Architecture logicielle et design patterns",
      "Systèmes et Réseaux approfondis",
      "Gestion de bases de données relationnelles",
      "Travail en équipe et communication professionnelle"
    ]
  },
  poursuite: {
    titre: "Master en Réseaux & Télécommunications",
    etablissement: "À définir (Master Réseau)",
    image: "images/master.jpg",
    annee: "2026+",
    parcours: [
      "Poursuite d'études en Master Informatique spécialité Réseaux",
      "Approfondissement en architecture réseau et sécurité",
      "Possibilité d'alternance en entreprise",
      "Préparation à des certifications réseau (CCNA, etc.)"
    ],
    competences: [
      "Architecture et administration de réseaux complexes",
      "Sécurité informatique et protocoles avancés",
      "Cloud computing et virtualisation",
      "Leadership et expertise technique"
    ]
  }
};

const modal = document.getElementById("formation-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");

document.querySelectorAll(".timeline-item").forEach(item => {
  item.addEventListener("click", () => {
    const key = item.dataset.modal;
    const formation = formations[key];

    const modal = document.getElementById("formation-modal");
    const modalContent = document.querySelector('#formation-modal .modal-content');

    modalContent.innerHTML = `
      <div class="formation-modal-header">
        <h3>${formation.titre}</h3>
        <button id="close-formation-modal" class="close-btn">✕</button>
      </div>
      
      <div class="formation-modal-image">
        <img src="${formation.image}" alt="${formation.titre}" onerror="this.style.display='none'">
      </div>
      
      <div class="formation-modal-body">
        <div class="formation-info-bar">
          <div class="info-item">
            <span class="info-label">Établissement</span>
            <p class="info-value">${formation.etablissement}</p>
          </div>
          <div class="info-item">
            <span class="info-label">Période</span>
            <p class="info-value">${formation.annee}</p>
          </div>
        </div>
        
        <div class="formation-content-grid">
          <div class="formation-section">
            <h4>📚 Parcours</h4>
            <ul>
              ${formation.parcours.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          
          <div class="formation-section">
            <h4>💡 Compétences acquises</h4>
            <ul>
              ${formation.competences.map(comp => `<li>${comp}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      
      <div class="formation-modal-footer">
        <p class="footer-text">Formation enrichissante et structurante pour mon parcours professionnel</p>
      </div>
    `;

    modal.classList.add("show");

    document.getElementById('close-formation-modal').addEventListener('click', () => {
      modal.classList.remove("show");
    });
  });
});

closeModal.addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("show");
});

// --- Données des projets ---
const projectsData = [
  {
    id: 1,
    title: "Application Java de Gestion",
    description: "Interface graphique Swing pour la gestion de tâches",
    image: "images/projet1.jpg",
    tags: ["programmation logicielle"],
    github: "https://github.com/votre-username/gestion-taches-java",
    fullDescription: {
      resume: "Développement d'une application de bureau complète permettant la gestion de tâches avec une interface graphique intuitive. Le projet incluait la création d'un système de suivi des tâches, la gestion des priorités et des échéances, ainsi qu'un système de notifications.",
      outils: ["Java 17", "Swing pour l'interface graphique", "MySQL pour la base de données", "JDBC pour la connexion", "Maven pour la gestion des dépendances", "Git pour le versioning"],
      competences: ["Maîtrise de l'architecture MVC", "Conception d'interfaces utilisateur ergonomiques", "Gestion de bases de données relationnelles", "Programmation orientée objet avancée", "Tests unitaires avec JUnit", "Documentation technique complète"]
    }
  },
  {
    id: 2,
    title: "Site Web Dynamique",
    description: "Site vitrine interactif avec animations CSS",
    image: "images/projet2.jpg",
    tags: ["développement web"],
    github: "https://github.com/votre-username/site-web-dynamique",
    fullDescription: {
      resume: "Création d'un site web moderne et responsive pour une entreprise locale. Le projet comprenait la conception graphique, l'intégration d'animations fluides et la mise en place d'un formulaire de contact fonctionnel.",
      outils: ["HTML5 / CSS3", "JavaScript ES6+", "Sass pour les styles", "Webpack pour le build", "Git / GitHub", "Figma pour le design"],
      competences: ["Maîtrise du responsive design", "Animations CSS avancées", "Optimisation des performances web", "Accessibilité web (WCAG)", "SEO et référencement", "Cross-browser compatibility"]
    }
  },
  {
    id: 3,
    title: "Base de Données SQL",
    description: "Système de gestion de bibliothèque",
    image: "images/projet3.jpg",
    tags: ["programmation logicielle"],
    github: "https://github.com/votre-username/gestion-bibliotheque",
    fullDescription: {
      resume: "Conception et implémentation d'une base de données complète pour gérer l'inventaire d'une bibliothèque, incluant la gestion des livres, des membres, des emprunts et des réservations.",
      outils: ["MySQL", "PHPMyAdmin", "StarUML pour la modélisation", "SQL Workbench", "Git pour le versioning"],
      competences: ["Modélisation de bases de données (MCD/MLD)", "Normalisation des données", "Requêtes SQL complexes (jointures, sous-requêtes)", "Procédures stockées et triggers", "Optimisation des performances", "Gestion des transactions"]
    }
  },
  {
    id: 4,
    title: "Application Mobile",
    description: "App de suivi sportif en React Native",
    image: "images/projet4.jpg",
    tags: ["développement web"],
    github: "https://github.com/votre-username/app-sport-mobile",
    fullDescription: {
      resume: "Développement d'une application mobile cross-platform permettant aux utilisateurs de suivre leurs activités sportives, enregistrer leurs performances et visualiser leurs statistiques.",
      outils: ["React Native", "Expo", "Firebase pour le backend", "Redux pour la gestion d'état", "React Navigation", "Chart.js pour les graphiques"],
      competences: ["Développement mobile cross-platform", "Gestion d'état avec Redux", "Intégration d'APIs externes", "Utilisation de capteurs mobiles", "Authentification utilisateur", "Stockage local et synchronisation cloud"]
    }
  },
  {
    id: 5,
    title: "API REST",
    description: "Backend Symfony pour e-commerce",
    image: "images/projet5.jpg",
    tags: ["développement web"],
    github: "https://github.com/votre-username/api-ecommerce",
    fullDescription: {
      resume: "Création d'une API REST complète pour une plateforme e-commerce, gérant les produits, les commandes, les utilisateurs et les paiements avec un système d'authentification sécurisé.",
      outils: ["PHP 8", "Symfony 6", "Doctrine ORM", "JWT pour l'authentification", "Swagger/OpenAPI", "PostgreSQL"],
      competences: ["Architecture RESTful", "Sécurité des APIs (JWT, OAuth)", "Documentation API avec Swagger", "Tests d'intégration", "Gestion des erreurs et validation", "Optimisation des requêtes"]
    }
  },
  {
    id: 6,
    title: "Dashboard Analytics",
    description: "Tableau de bord avec visualisations de données",
    image: "images/projet6.jpg",
    tags: ["développement web"],
    github: "https://github.com/votre-username/dashboard-analytics",
    fullDescription: {
      resume: "Développement d'un tableau de bord interactif permettant de visualiser et d'analyser des données commerciales en temps réel avec différents types de graphiques et indicateurs clés.",
      outils: ["React.js", "D3.js", "Chart.js", "Material-UI", "Node.js / Express", "MongoDB"],
      competences: ["Visualisation de données complexes", "Création de graphiques interactifs", "Traitement et agrégation de données", "Interface utilisateur avancée", "Performance et optimisation", "Responsive design pour tableaux de bord"]
    }
  },
  {
    id: 7,
    title: "Bot Discord",
    description: "Bot de modération et divertissement en Python",
    image: "images/projet7.jpg",
    tags: ["programmation logicielle"],
    github: "https://github.com/votre-username/bot-discord",
    fullDescription: {
      resume: "Création d'un bot Discord multifonction avec des commandes de modération, des mini-jeux, un système de niveaux et de récompenses, ainsi qu'une intégration avec des APIs externes.",
      outils: ["Python 3.10", "Discord.py", "SQLite", "APIs externes (météo, traduction)", "Heroku pour l'hébergement", "Git / GitHub"],
      competences: ["Programmation asynchrone en Python", "Intégration d'APIs Discord", "Gestion de base de données SQLite", "Gestion d'événements en temps réel", "Déploiement et maintenance", "Documentation utilisateur"]
    }
  },
  {
    id: 8,
    title: "Simulateur Réseau",
    description: "Simulation d'architectures réseau avec Filius",
    image: "images/projet8.jpg",
    tags: ["réseaux & systèmes"],
    github: "https://github.com/votre-username/simulateur-reseau",
    fullDescription: {
      resume: "Conception et simulation de différentes architectures réseau incluant la configuration de serveurs DNS, DHCP, serveurs web et tests de connectivité. Analyse des protocoles et résolution de problèmes.",
      outils: ["Filius", "Wireshark", "Cisco Packet Tracer", "VMware", "Linux (Ubuntu Server)", "Draw.io pour les schémas"],
      competences: ["Configuration réseau (TCP/IP, DNS, DHCP)", "Analyse de protocoles réseau", "Diagnostic et résolution de problèmes", "Sécurité réseau de base", "Documentation d'architecture", "Configuration de serveurs Linux"]
    }
  },
  {
    id: 9,
    title: "Serveur Web Linux",
    description: "Configuration complète d'un serveur web sécurisé",
    image: "images/projet9.jpg",
    tags: ["réseaux & systèmes"],
    github: "https://github.com/votre-username/serveur-web-linux",
    fullDescription: {
      resume: "Installation et configuration d'un serveur web complet sous Linux avec Apache, MySQL, PHP, mise en place de certificats SSL, configuration du pare-feu et optimisation des performances.",
      outils: ["Ubuntu Server 22.04", "Apache2", "MySQL", "PHP 8.1", "Let's Encrypt (SSL)", "UFW (firewall)"],
      competences: ["Administration système Linux", "Configuration de serveurs web", "Sécurisation de serveurs (SSL, firewall)", "Gestion des permissions et utilisateurs", "Optimisation des performances", "Maintenance et monitoring"]
    }
  },
  {
    id: 10,
    title: "Script d'Automatisation Bash",
    description: "Scripts pour automatiser les tâches d'administration",
    image: "images/projet10.jpg",
    tags: ["réseaux & systèmes"],
    github: "https://github.com/votre-username/scripts-automation",
    fullDescription: {
      resume: "Développement de scripts Bash pour automatiser les tâches récurrentes d'administration système : sauvegardes automatiques, surveillance des ressources, génération de rapports et nettoyage de logs.",
      outils: ["Bash", "Cron pour la planification", "Linux (Debian/Ubuntu)", "Git", "Rsync pour les sauvegardes", "Mail pour les notifications"],
      competences: ["Script Bash avancé", "Automatisation de tâches système", "Gestion des processus et services", "Surveillance système", "Planification de tâches (cron)", "Gestion des logs et rapports"]
    }
  }
];

// Variables globales pour le carrousel
let currentPage = 0;
let projectsPerPage = 8;
let filteredProjects = [...projectsData];
let currentFilter = 'all';

// --- Génération des cartes projets ---
function generateProjects() {
  const container = document.getElementById("projects-container");
  container.innerHTML = '';

  const startIndex = currentPage * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const projectsToShow = filteredProjects.slice(startIndex, endIndex);

  projectsToShow.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.projectId = project.id;
    card.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p class="muted">${project.description}</p>
      </div>
    `;
    container.appendChild(card);
  });

  updateCarouselButtons();
}

// --- Mise à jour des boutons du carrousel ---
function updateCarouselButtons() {
  const leftBtn = document.getElementById('carousel-left');
  const rightBtn = document.getElementById('carousel-right');

  leftBtn.disabled = currentPage === 0;
  rightBtn.disabled = (currentPage + 1) * projectsPerPage >= filteredProjects.length;
}

// --- Navigation carrousel ---
function navigateCarousel(direction) {
  const maxPage = Math.ceil(filteredProjects.length / projectsPerPage) - 1;

  if (direction === 'left' && currentPage > 0) {
    currentPage--;
  } else if (direction === 'right' && currentPage < maxPage) {
    currentPage++;
  }

  generateProjects();
}

// --- Filtrage des projets ---
function filterProjects(filter) {
  currentFilter = filter;
  currentPage = 0;

  if (filter === 'all') {
    filteredProjects = [...projectsData];
  } else {
    filteredProjects = projectsData.filter(project =>
      project.tags.includes(filter.toLowerCase())
    );
  }

  generateProjects();
}

// --- Gestion des modales projets ---
function openProjectModal(projectId) {
  const projectModal = document.getElementById("project-modal");
  const project = projectsData.find(p => p.id === parseInt(projectId));
  if (project) {
    const modalContent = document.querySelector('#project-modal .modal-content');

    modalContent.innerHTML = `
      <div class="project-modal-header">
        <h3>${project.title}</h3>
        <button id="close-project-modal" class="close-btn">✕</button>
      </div>
      
      <div class="project-modal-image">
        <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">
      </div>
      
      <div class="project-modal-body">
        <div class="project-section">
          <h4>📋 Résumé du projet</h4>
          <p>${project.fullDescription.resume}</p>
        </div>
        
        <div class="project-section tools">
          <h4>🔧 Outils et technologies</h4>
          <ul>
            ${project.fullDescription.outils.map(outil => `<li>${outil}</li>`).join('')}
          </ul>
        </div>
        
        <div class="project-section skills">
          <h4>💡 Compétences acquises</h4>
          <ul>
            ${project.fullDescription.competences.map(comp => `<li>${comp}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="project-modal-footer">
        <a href="${project.github}" target="_blank" class="github-btn">
          Voir le code sur GitHub
        </a>
      </div>
    `;

    projectModal.classList.add("show");

    document.getElementById('close-project-modal').addEventListener('click', () => {
      projectModal.classList.remove("show");
    });
  }
}

// --- Gestion de la section Qui suis-je ---
const aboutContent = {
  presentation: {
    text: `<h3>Petite présentation</h3>
      <p>Je suis <strong>Zakarya Zekhnini</strong>, étudiant passionné en BUT Informatique. Depuis toujours fasciné par la technologie et l'innovation, j'ai développé une véritable passion pour le développement logiciel et web.</p>
      <p>Mon parcours m'a permis d'acquérir des compétences solides en programmation, en conception d'applications et en gestion de projets. J'aime particulièrement relever des défis techniques et transformer des idées en solutions concrètes et fonctionnelles.</p>
      <p>Au-delà du code, je suis quelqu'un de curieux, toujours en quête d'apprentissage et d'amélioration.</p>`,
    image: "images/portrait.jpg"
  },
  langues: {
    text: `<h3>Langues</h3>
      <ul>
        <li><strong>Français</strong> : Langue maternelle</li>
        <li><strong>Anglais</strong> : Niveau B2 - Lecture technique fluide</li>
        <li><strong>Arabe</strong> : Notions de base</li>
      </ul>
      <p>Je suis capable de lire et comprendre la documentation technique en anglais, et de communiquer efficacement dans un contexte professionnel international.</p>`,
    image: "images/langues.jpg"
  },
  communication: {
    text: `<h3>Communication</h3>
      <p>Je possède d'excellentes compétences en communication, tant à l'écrit qu'à l'oral. Je sais adapter mon discours selon mon interlocuteur et le contexte.</p>
      <ul>
        <li>Présentation claire d'idées techniques</li>
        <li>Rédaction de documentation structurée</li>
        <li>Écoute active et empathie</li>
        <li>Capacité à vulgariser des concepts complexes</li>
      </ul>`,
    image: "images/communication.jpg"
  },
  teamwork: {
    text: `<h3>Travail en équipe</h3>
      <p>Le travail collaboratif est au cœur de mes valeurs professionnelles. J'apprécie particulièrement les projets de groupe où chacun apporte sa pierre à l'édifice.</p>
      <ul>
        <li>Collaboration avec Git/GitHub</li>
        <li>Méthodologies Agile/Scrum</li>
        <li>Esprit d'entraide et de partage</li>
        <li>Respect des délais et engagements</li>
      </ul>`,
    image: "images/teamwork.jpg"
  },
  musculation: {
    text: `<h3>Musculation</h3>
      <p>Passionné de musculation depuis plusieurs années, je pratique régulièrement pour maintenir une bonne condition physique et développer ma discipline personnelle.</p>
      <p>Cette activité m'apprend la persévérance, la rigueur et l'importance de se fixer des objectifs à long terme - des qualités que je transpose dans mon travail de développeur.</p>`,
    image: "images/musculation.jpg"
  },
  depannage: {
    text: `<h3>Dépannage PC</h3>
      <p>Depuis mon adolescence, je me passionne pour le dépannage informatique. J'aide régulièrement mon entourage à résoudre leurs problèmes techniques.</p>
      <ul>
        <li>Diagnostic matériel et logiciel</li>
        <li>Installation et configuration de systèmes</li>
        <li>Optimisation des performances</li>
        <li>Récupération de données</li>
      </ul>`,
    image: "images/depannage.jpg"
  },
  electronique: {
    text: `<h3>Électronique</h3>
      <p>L'électronique est une passion qui complète parfaitement mes compétences en informatique. J'aime comprendre comment fonctionnent les appareils et créer mes propres circuits.</p>
      <p>Je travaille régulièrement avec Arduino et Raspberry Pi pour réaliser des projets personnels alliant programmation et électronique.</p>`,
    image: "images/electronique.jpg"
  }
};

function changeAboutContent(section) {
  const dynamicText = document.getElementById('dynamic-text');
  const aboutImage = document.getElementById('about-image');
  const content = aboutContent[section];

  if (content) {
    dynamicText.style.opacity = '0';
    aboutImage.style.opacity = '0';

    setTimeout(() => {
      dynamicText.innerHTML = content.text;
      aboutImage.src = content.image;
      aboutImage.alt = section;
      dynamicText.style.opacity = '1';
      aboutImage.style.opacity = '1';
    }, 200);
  }
}

// --- Fonction de copie d'email ---
function copyEmail() {
  const email = document.getElementById('email-text').textContent;
  const copyBtn = document.getElementById('copy-text');

  navigator.clipboard.writeText(email).then(() => {
    const btn = copyBtn.parentElement;
    btn.classList.add('copied');
    copyBtn.textContent = '✓ Copié !';

    setTimeout(() => {
      btn.classList.remove('copied');
      copyBtn.textContent = 'Copier';
    }, 2000);
  }).catch(err => {
    console.error('Erreur lors de la copie:', err);
    alert('Email : ' + email);
  });
}

// --- Initialisation au chargement ---
document.addEventListener("DOMContentLoaded", () => {
  // Générer les projets
  generateProjects();

  // Gestion des filtres
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter);
    });
  });

  // Gestion des flèches du carrousel
  document.getElementById('carousel-left').addEventListener('click', () => navigateCarousel('left'));
  document.getElementById('carousel-right').addEventListener('click', () => navigateCarousel('right'));

  // Gestion des clics sur les projets
  const projectsContainer = document.getElementById("projects-container");
  projectsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (card) {
      openProjectModal(card.dataset.projectId);
    }
  });

  // Fermeture modale projet
  const projectModal = document.getElementById("project-modal");
  projectModal.addEventListener("click", e => {
    if (e.target === projectModal) projectModal.classList.remove("show");
  });

  // Contenu initial "Qui suis-je"
  changeAboutContent('presentation');

  // Boutons principaux "Qui suis-je"
  document.querySelectorAll('.about-menu-item[data-section]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.about-menu-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      changeAboutContent(btn.dataset.section);
    });
  });

  // Boutons des dropdowns "Qui suis-je"
  document.querySelectorAll('.dropdown-content button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.about-menu-item').forEach(b => b.classList.remove('active'));

      // Activer le bouton parent du dropdown
      const parentDropdown = btn.closest('.about-menu-dropdown');
      if (parentDropdown) {
        const parentBtn = parentDropdown.querySelector('.about-menu-item');
        if (parentBtn) {
          parentBtn.classList.add('active');
        }
      }

      changeAboutContent(btn.dataset.section);
    });
  });
});

