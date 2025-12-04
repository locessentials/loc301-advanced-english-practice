// Outline Loader - Loads unit data from units.json
class OutlineLoader {
  constructor() {
    this.units = null;
    this.selector = document.getElementById('unit-selector');
    this.contentDiv = document.getElementById('unit-content');
  }

  async loadUnits() {
    try {
      const response = await fetch('../data/units.json');
      const data = await response.json();
      this.units = data.units;
    } catch (error) {
      console.error('Error loading units data:', error);
    }
  }

  displayUnit(index) {
    if (!this.units || index === '') {
      this.contentDiv.style.display = 'none';
      return;
    }

    const unit = this.units[index];
    
    // Update title
    document.getElementById('unit-title').textContent = `Unit ${unit.number}: ${unit.title}`;
    
    // Update description
    document.getElementById('unit-description').textContent = unit.description;
    
    // Update objectives
    const objectivesList = document.getElementById('unit-objectives');
    objectivesList.innerHTML = unit.learning_objectives
      .map(obj => `<li>${obj}</li>`)
      .join('');
    
    // Update outline with links
    const outlineList = document.getElementById('unit-outline');
    
    // Special handling for Unit 4 (Final Project)
    if (unit.number === 4) {
      outlineList.innerHTML = `
        <li><a href="final-project-template.html?page=courseReview">Week 15: Course Review and Conclusions</a></li>
        <li><a href="final-project-template.html?page=finalProject">Week 16: Final Project Presentations</a></li>
        <li><a href="final-project-template.html?page=peerEvaluation">Week 17: Final Project Peer Evaluations</a></li>
      `;
    } else {
      // Standard handling for Units 1-3
      let outlineHTML = unit.outline
        .map(item => {
          // Extract week number from the outline string (e.g., "Week 1: ..." -> 1)
          const weekMatch = item.match(/Week (\d+)/);
          if (weekMatch) {
            const weekNum = weekMatch[1];
            return `<li><a href="week-template.html?week=${weekNum}&page=intro">${item}</a></li>`;
          }
          return `<li>${item}</li>`;
        })
        .join('');
      
      // Add exam link for Units 1 and 2
      if (unit.number === 1 || unit.number === 2) {
        outlineHTML += `<li style="font-weight: 600;"><a href="exam-template.html?unit=${unit.number}&page=review">Unit ${unit.number} Examination</a></li>`;
      }
      
      outlineList.innerHTML = outlineHTML;
    }
    
    // Update navigation buttons
    this.updateNavButtons(parseInt(index));
    
    // Show content
    this.contentDiv.style.display = 'block';
  }

  updateNavButtons(currentIndex) {
    const navButtonsDiv = document.querySelector('#unit-content + .nav-buttons');
    if (!navButtonsDiv) return;

    let buttonsHTML = '<a href="../index.html" class="btn">← Back to Home</a>';
    
    // Check if there's a next unit
    if (currentIndex < this.units.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextUnit = this.units[nextIndex];
      buttonsHTML += `<a href="#" class="btn btn-primary" onclick="selectUnitFromNav(${nextIndex}); return false;">Next: Unit ${nextUnit.number} →</a>`;
    } else {
      // Last unit - link to course completed page
      buttonsHTML += `<a href="../course-completed.html" class="btn btn-primary">Course Completed! →</a>`;
    }
    
    navButtonsDiv.innerHTML = buttonsHTML;
  }

  init() {
    this.selector.addEventListener('change', (e) => {
      this.displayUnit(e.target.value);
    });
  }

  async start() {
    await this.loadUnits();
    this.init();
  }
}

// Initialize when DOM is ready
let outlineLoaderInstance;

document.addEventListener('DOMContentLoaded', () => {
  const loader = new OutlineLoader();
  outlineLoaderInstance = loader;
  loader.start();
});

// Global function for navigation button clicks
function selectUnitFromNav(unitIndex) {
  if (outlineLoaderInstance) {
    // Update dropdown
    outlineLoaderInstance.selector.value = unitIndex;
    // Display the unit
    outlineLoaderInstance.displayUnit(unitIndex);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}