const projects = [
    {
        id: "main",
        title: "This app",
        logo: "/images/ratchet.svg",
        logoStyle: "width: 60px;",
        status: "running",
        description:
            "Testing monitoring dashboard app, sitting on mikr.us VPS",
        links: [
            { url: "#", text: "github.com/project/api-gateway" },
            { url: "#", text: "docs.project.io/api" },
            { url: "#", text: "status.project.io" },
        ],
        monitorCommand: 'ssh project_monitor --name="api-gateway"',
    },
    {
        id: "zairymon",
        title: "Zairy, Air Monitoring",
        logo: "/images/zairy.svg",
        status: "not-running",
        description: "",
        links: [
            { url: "#", text: "github.com/project/data-pipeline" },
            { url: "#", text: "docs.project.io/pipeline" },
        ],
        monitorCommand: 'ssh project_monitor --name="data-pipeline"',
    },
    {
        id: "mondi",
        title: "Mondi Simet",
        logo: "/images/mondi.png",
        status: "running",
        description:
            "",
        links: [
            { url: "#", text: "github.com/project/monitoring" },
            { url: "#", text: "docs.project.io/monitoring" },
            { url: "#", text: "demo.project.io/dashboard" },
        ],
        monitorCommand: 'ssh project_monitor --name="monitoring-dashboard"',
    },
];

function createProjectPanel(project) {
    const panel = document.createElement("div");
    panel.className = "project-panel";
    panel.id = `project-${project.id}`;

    panel.innerHTML = `
    <div class="project-header">
      <h2 class="project-title">${project.title}</h2>
      <div class="project-logo">
        <img src="${project.logo}" alt="${project.title} Logo" style="${project.logoStyle || ""} ">
      </div>
    </div>

    <div class="project-status">
      <div class="status-badge ${project.status}">
        <span class="status-icon"></span>
        <span class="status-text">${project.status === "running" ? "Running" : "Not Running"
        }</span>
      </div>
    </div>

    <div class="project-section">
      <h3><span class="prompt">$</span> cat description.txt</h3>
      <p class="project-description">${project.description}</p>
    </div>

    <div class="project-section">
      <h3><span class="prompt">$</span> ls ./links</h3>
      <div class="project-links">
        ${project.links
            .map(
                (link) => `<a href="${link.url}" class="terminal-link">${link.text}</a>`
            )
            .join("")}
      </div>
    </div>

    <div class="project-footer">
      <a href="#" class="terminal-button">
        <span class="prompt">$</span> ${project.monitorCommand}
      </a>
    </div>
  `;

    return panel;
}

function renderProjects() {
    const projectsGrid = document.getElementById("projects-grid");
    const responseElement = document.querySelector(".terminal-header .response");

    // Reset project grid
    projectsGrid.innerHTML = "";

    responseElement.textContent = `Found ${projects.length} projects. Displaying details...`;

    projects.forEach((project) => {
        const panel = createProjectPanel(project);
        projectsGrid.appendChild(panel);
    });
}

document.addEventListener("DOMContentLoaded", renderProjects);

function addProject(projectData) {
    projects.push(projectData);
    renderProjects();
}
