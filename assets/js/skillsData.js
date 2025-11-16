/**
 * Skills Data Configuration
 * Centralized data for all skills - makes it easy to update percentages and add new skills
 */

const skillsData = {
    frontendTechnologies: {
        title: "Frontend Technologies",
        skills: [
            { name: "HTML5", percentage: 95, icon: "./assets/images/html5.png", cssClass: "html5" },
            { name: "CSS3", percentage: 90, icon: "./assets/images/css3.png", cssClass: "css3" },
            { name: "JavaScript", percentage: 100, icon: "./assets/images/js.png", cssClass: "js" },
            { name: "jQuery", percentage: 100, icon: "./assets/images/jquery.png", cssClass: "jquery" },
            { name: "React", percentage: 75, icon: "./assets/images/react logo.png", cssClass: "react" },
            { name: "Ajax", percentage: 75, icon: "./assets/images/ajax.png", cssClass: "ajax" }
        ]
    },
    backendTechnologies: {
        title: "Backend Technologies",
        skills: [
            { name: "PHP", percentage: 88, icon: "./assets/images/php.png", cssClass: "php" },
            { name: "Laravel", percentage: 82, icon: "./assets/images/laravel logo.jpg", cssClass: "laravel" },
            { name: "CodeIgniter", percentage: 100, icon: "./assets/images/codeigniter-logo.webp", cssClass: "codeigniter" }
        ]
    },
    databaseTechnologies: {
        title: "Database Technologies",
        skills: [
            { name: "MySQL", percentage: 100, icon: "./assets/images/mysql.png", cssClass: "mysql" },
            { name: "MongoDB", percentage: 78, icon: "./assets/images/mongo.png", cssClass: "mongodb" }
        ]
    },
    cmsAndTools: {
        title: "CMS & Tools",
        skills: [
            { name: "WordPress", percentage: 92, icon: "./assets/images/wordpress.png", cssClass: "wordpress" },
            { name: "WooCommerce", percentage: 87, icon: "./assets/images/woocommerce.png", cssClass: "woocomerce" },
            { name: "Perfex CRM", percentage: 85, icon: "./assets/images/perfex-logo.webp", cssClass: "perfex" }
        ]
    },
    versionControl: {
        title: "Version Control",
        skills: [
            { name: "Git", percentage: 90, icon: "./assets/images/git.png", cssClass: "git" },
            { name: "GitHub", percentage: 88, icon: "./assets/images/github.png", cssClass: "github" }
        ]
    },
    programmingLanguages: {
        title: "Programming Languages",
        skills: [
            { name: "Python", percentage: 70, icon: "./assets/images/python.png", cssClass: "python" },
            { name: "Java", percentage: 72, icon: "./assets/images/java-logo-1.png", cssClass: "java" },
            { name: "R", percentage: 65, icon: "./assets/images/R.png", cssClass: "R" }
        ]
    },
    dataAnalysisTools: {
        title: "Data Analysis Tools",
        skills: [
            { name: "Jupyter Notebook", percentage: 68, icon: "./assets/images/jupyter logo.png", cssClass: "jupyter" }
        ]
    }
};

/**
 * Dynamically render skills section
 */
function renderSkills() {
    const skillsContainer = document.querySelector('#skills .technical-skills');
    
    if (!skillsContainer) {
        console.error('Skills container not found');
        return;
    }
    
    // Clear existing content
    skillsContainer.innerHTML = '';
    
    // Loop through each category
    Object.values(skillsData).forEach(category => {
        // Create category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'skill-category-header';
        categoryHeader.innerHTML = `<h3 class="category-title">${category.title}</h3>`;
        skillsContainer.appendChild(categoryHeader);
        
        // Create skills for this category
        category.skills.forEach(skill => {
            const skillDiv = createSkillElement(skill);
            skillsContainer.appendChild(skillDiv);
        });
    });
    
    // Trigger animations after rendering
    if (typeof animateSkills === 'function') {
        setTimeout(animateSkills, 100);
    }
}

/**
 * Create a single skill element
 */
function createSkillElement(skill) {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill';
    skillDiv.setAttribute('data-percentage', skill.percentage);
    
    skillDiv.innerHTML = `
        <div class="icon">
            <img src="${skill.icon}" alt="${skill.name} Logo" loading="lazy">
        </div>
        <div class="info">
            <div class="skill-info">
                <p class="subject">${skill.name}</p>     
            </div>
            <div class="skill-progress ${skill.cssClass}"><span></span></div>
        </div>
        <div class="skill-percentage">${skill.percentage}%</div>
    `;
    
    return skillDiv;
}

/**
 * Initialize skills rendering on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with skills section
    if (document.querySelector('#skills')) {
        // Only render if the container is empty (to avoid double rendering)
        const container = document.querySelector('#skills .technical-skills');
        if (container && container.children.length === 0) {
            renderSkills();
        }
    }
});

/**
 * Export for use in other scripts if needed
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { skillsData, renderSkills };
}
