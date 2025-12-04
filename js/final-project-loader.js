// Final Project Content Loader - Fetches finalproject.json and populates template
class FinalProjectLoader {
  constructor() {
    this.params = new URLSearchParams(window.location.search);
    this.page = this.params.get('page') || 'courseReview';
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch('../data/finalproject.json');
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading final project data:', error);
      return null;
    }
  }

  renderBreadcrumbs() {
    const pageNames = {
      'courseReview': 'Course Review',
      'finalProject': 'Final Project Presentations',
      'peerEvaluation': 'Final Project Peer Evaluation'
    };

    const breadcrumbsDiv = document.getElementById('breadcrumbs');
    if (!breadcrumbsDiv) return;

    const pageName = pageNames[this.page] || this.page;
    
    breadcrumbsDiv.innerHTML = `
      <a href="../index.html">Home</a>
      <span>/</span>
      <a href="?page=courseReview">Final Project</a>
      <span>/</span>
      <span>${pageName}</span>
    `;
  }

  renderCourseReview() {
    const { courseReview } = this.data;
    document.getElementById('page-title').textContent = 'Course Review';

    const introSection = document.getElementById('courseReview-intro');
    introSection.innerHTML = `
      <h2>Course Review & Reflection</h2>
      <p>${courseReview.introduction.overview}</p>
      <ul class="objectives">
        ${courseReview.introduction.objectives.map(obj => `<li>${obj}</li>`).join('')}
      </ul>
    `;

    const reviewContent = document.getElementById('courseReview-content');
    reviewContent.innerHTML = `
      ${courseReview.unitRecap.map(unit => `
        <div class="lecture-section">
          <h3>${unit.unit}</h3>
          <p><strong>Focus:</strong> ${unit.focus}</p>
          <h4>Key Topics:</h4>
          <ul class="list">
            ${unit.keyTopics.map(topic => `<li>${topic}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
      
      <div class="lecture-section" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-left: 4px solid var(--success);">
        <h3>Reflection Prompts</h3>
        <p>As you prepare your final project, consider these questions:</p>
        <ul class="objectives">
          ${courseReview.reflectionPrompts.map(prompt => `<li>${prompt}</li>`).join('')}
        </ul>
      </div>
    `;

    const navButtons = document.getElementById('courseReview-nav-buttons');
    navButtons.innerHTML = `
      <a href="../index.html" class="btn">← Back to Home</a>
      <a href="?page=finalProject" class="btn btn-primary">Next: Final Project Guidelines →</a>
    `;
  }

  renderFinalProject() {
    const { finalProject } = this.data;
    document.getElementById('page-title').textContent = 'Final Project';

    const introSection = document.getElementById('finalProject-intro');
    introSection.innerHTML = `
      <h2>Final Project Guidelines</h2>
      <p>${finalProject.introduction.overview}</p>
      <p><strong>Timeline:</strong> ${finalProject.introduction.timeline}</p>
    `;

    const projectContent = document.getElementById('finalProject-content');
    projectContent.innerHTML = `
      <h3>Project Options</h3>
      <p>Choose one of the following three project types for your group:</p>
      
      ${finalProject.projectOptions.map((option, index) => `
        <div class="lecture-section">
          <h4 style="margin-top: 0;">Option ${index + 1}: ${option.title}</h4>
          <p>${option.description}</p>
          <h5 style="font-size: 1rem; margin-top: 1.5rem;">Deliverables:</h5>
          <ul class="list">
            ${option.deliverables.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')}

      <div class="card">
        <h3>Presentation Guidelines</h3>
        <p>${finalProject.presentationGuidelines.overview}</p>
        
        <h4>Suggested Structure:</h4>
        <ul class="list">
          ${finalProject.presentationGuidelines.structureSuggestions.map(item => `
            <li>${item}</li>
          `).join('')}
        </ul>

        <h4>Requirements:</h4>
        <ul class="list">
          ${finalProject.presentationGuidelines.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>

      <div class="lecture-section" style="background: var(--bg);">
        <h4 style="margin-top: 0;">Presentation Tips</h4>
        <ul class="list">
          ${finalProject.presentationGuidelines.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>

      <div class="card">
        <h3>Submission Requirements</h3>
        <ul class="list">
          ${finalProject.submissionRequirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>

      <div class="card">
        <h3>Evaluation Criteria</h3>
        <p>${finalProject.evaluationCriteria.description}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
          <tr style="border-bottom: 2px solid var(--border); background: var(--bg);">
            <th style="text-align: left; padding: 0.75rem; font-family: 'Archivo', sans-serif;">Category</th>
            <th style="text-align: center; padding: 0.75rem; font-family: 'Archivo', sans-serif;">Points</th>
            <th style="text-align: left; padding: 0.75rem; font-family: 'Archivo', sans-serif;">Details</th>
          </tr>
          ${finalProject.evaluationCriteria.criteria.map(criterion => `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.75rem; font-weight: 600;">${criterion.category}</td>
              <td style="text-align: center; padding: 0.75rem; font-family: 'Archivo', sans-serif;">${criterion.points}</td>
              <td style="padding: 0.75rem;">${criterion.details}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;

    const navButtons = document.getElementById('finalProject-nav-buttons');
    navButtons.innerHTML = `
      <a href="?page=courseReview" class="btn">← Back to Course Review</a>
      <a href="?page=peerEvaluation" class="btn btn-primary">Next: Peer Evaluation Guidelines →</a>
    `;
  }

  renderPeerEvaluation() {
    const { peerEvaluation, conclusion } = this.data;
    document.getElementById('page-title').textContent = 'Final Project Peer Evaluation';

    const introSection = document.getElementById('peerEvaluation-intro');
    introSection.innerHTML = `
      <h2>Peer Evaluation Process</h2>
      <p>${peerEvaluation.introduction.overview}</p>
      <p><em>${peerEvaluation.introduction.instructions}</em></p>
    `;

    const evaluationContent = document.getElementById('peerEvaluation-content');
    evaluationContent.innerHTML = `
      <div class="card">
        <h3>Evaluation Form</h3>
        <p>Complete this evaluation for each of the three projects assigned to you:</p>
        
        ${peerEvaluation.evaluationForm.sections.map(section => `
          <div class="lecture-section" style="background: var(--bg);">
            <h4 style="margin-top: 0;">${section.section}</h4>
            <ul class="list">
              ${section.prompts.map(prompt => `<li>${prompt}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="lecture-section" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);">
        <h3 style="margin-top: 0;">Guidelines for Effective Peer Evaluation</h3>
        <ul class="list">
          ${peerEvaluation.evaluationForm.guidelines.map(guideline => `<li>${guideline}</li>`).join('')}
        </ul>
      </div>

      <div class="card">
        <h3>Submission Requirements</h3>
        <ul class="list">
          ${peerEvaluation.submissionRequirements.map(req => `<li>${req}</li>`).join('')}
        </ul>

        <h3 style="margin-top: 2rem;">Your Grade</h3>
        <p>${peerEvaluation.yourGrade.description}</p>
        <ul class="list">
          ${peerEvaluation.yourGrade.components.map(component => `<li>${component}</li>`).join('')}
        </ul>
      </div>
    `;

    const navButtons = document.getElementById('peerEvaluation-nav-buttons');
    navButtons.innerHTML = `
      <a href="?page=finalProject" class="btn">← Back to Final Project Guidelines</a>
      <a href="../course-completed.html" class="btn btn-primary">Course Completed! →</a>
    `;
  }

  async init() {
    await this.loadData();
    if (!this.data) {
      document.body.innerHTML = '<div class="container"><h1>Error loading content</h1></div>';
      return;
    }

    this.renderBreadcrumbs();

    switch(this.page) {
      case 'courseReview':
        this.renderCourseReview();
        break;
      case 'finalProject':
        this.renderFinalProject();
        break;
      case 'peerEvaluation':
        this.renderPeerEvaluation();
        break;
      default:
        this.renderCourseReview();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const loader = new FinalProjectLoader();
  loader.init();
});