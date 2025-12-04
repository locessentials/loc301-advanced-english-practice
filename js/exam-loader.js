// Exam Content Loader - Fetches JSON and populates exam templates for Units 1-3
class ExamLoader {
  constructor() {
    this.params = new URLSearchParams(window.location.search);
    this.unit = this.params.get('unit') || '1';
    this.page = this.params.get('page') || 'review';
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch(`../data/unit${this.unit}.json`);
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading exam data:', error);
      return null;
    }
  }

  renderBreadcrumbs() {
    const pageNames = {
      'review': 'Review',
      'exam': 'Exam',
      'conclusion': 'Conclusions'
    };

    const breadcrumbsDiv = document.getElementById('breadcrumbs');
    if (!breadcrumbsDiv) return;

    const pageName = pageNames[this.page] || this.page;
    
    breadcrumbsDiv.innerHTML = `
      <a href="../index.html">Home</a>
      <span>/</span>
      <a href="?unit=${this.unit}&page=review">Unit ${this.unit}</a>
      <span>/</span>
      <span>${pageName}</span>
    `;
  }

  renderReviewPage() {
    const { title, review } = this.data;
    document.getElementById('page-title').textContent = `${title} - Review`;

    // Render introduction
    const introSection = document.getElementById('review-intro');
    introSection.innerHTML = `
      <h2>Unit ${this.unit} Review</h2>
      <p>${review.introduction.overview}</p>
      <ul class="objectives">
        ${review.introduction.objectives.map(obj => `<li>${obj}</li>`).join('')}
      </ul>
    `;

    // Render review sections
    const reviewContent = document.getElementById('review-content');
    reviewContent.innerHTML = review.sections.map(section => `
      <div class="lecture-section">
        <h3>${section.heading}</h3>
        <p>${section.content}</p>
        ${section.keyTakeaways ? `
          <ul class="list">
            ${section.keyTakeaways.map(takeaway => `<li>${takeaway}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('') + `
      <div class="lecture-section" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-left: 4px solid var(--accent);">
        <h3>Study Tips for Success</h3>
        <ul class="list">
          ${review.studyTips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `;

    // Render navigation
    const navButtons = document.getElementById('review-nav-buttons');
    navButtons.innerHTML = `
      <a href="../index.html" class="btn">← Back to Home</a>
      <a href="?unit=${this.unit}&page=exam" class="btn btn-primary">Next: Unit ${this.unit} Exam →</a>
    `;
  }

  renderExamPage() {
    const { title, exam } = this.data;
    document.getElementById('page-title').textContent = `${title} - Exam`;

    const introSection = document.getElementById('exam-intro');
    introSection.innerHTML = `
      <h2>Unit ${this.unit} Examination</h2>
      <p>${exam.introduction.overview}</p>
      <p><strong>Format:</strong> ${exam.introduction.format}</p>
    `;

    const examContent = document.getElementById('exam-content');
    examContent.innerHTML = `
      ${exam.tasks.map(task => `
        <div style="margin: 2rem 0; padding: 1.5rem; background: var(--bg); border-left: 4px solid var(--primary-light);">
          <h3 style="margin-top: 0; color: var(--primary);">Task ${task.taskNumber}: ${task.title} (${task.points} points)</h3>
          <p>${task.instructions}</p>
          ${task.passage ? `
            <div class="example" style="margin: 1.5rem 0;">
              ${task.passage}
            </div>
          ` : ''}
          <h4 style="font-size: 1rem; margin-top: 1.5rem; color: var(--primary);">Deliverables:</h4>
          <ul class="list">
            ${task.deliverables.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')}

      <div style="margin: 2.5rem 0; padding: 2rem; background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 2px;">
        <h3 style="margin-top: 0; color: var(--primary);">Submission Guidelines</h3>
        <ul class="list">
          ${exam.submissionGuidelines.map(guideline => `<li>${guideline}</li>`).join('')}
        </ul>
      </div>

      <div style="margin: 2rem 0;">
        <h3>Grading Criteria</h3>
        <p>${exam.gradingCriteria.description}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
          <tr style="border-bottom: 2px solid var(--border); background: var(--bg);">
            <th style="text-align: left; padding: 0.75rem; font-family: 'Archivo', sans-serif;">Category</th>
            <th style="text-align: center; padding: 0.75rem; font-family: 'Archivo', sans-serif;">Points</th>
            <th style="text-align: left; padding: 0.75rem; font-family: 'Archivo', sans-serif;">Details</th>
          </tr>
          ${exam.gradingCriteria.criteria.map(criterion => `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.75rem; font-weight: 600;">${criterion.category}</td>
              <td style="text-align: center; padding: 0.75rem; font-family: 'Archivo', sans-serif;">${criterion.points}</td>
              <td style="padding: 0.75rem;">${criterion.details}</td>
            </tr>
          `).join('')}
          <tr style="border-top: 2px solid var(--border); font-weight: 600; background: var(--bg);">
            <td style="padding: 0.75rem;">Total</td>
            <td style="text-align: center; padding: 0.75rem;">${exam.gradingCriteria.total}</td>
            <td style="padding: 0.75rem;"></td>
          </tr>
        </table>
      </div>
    `;

    const navButtons = document.getElementById('exam-nav-buttons');
    navButtons.innerHTML = `
      <a href="?unit=${this.unit}&page=review" class="btn">← Back to Review</a>
      <a href="?unit=${this.unit}&page=conclusion" class="btn btn-primary">Next: Conclusions →</a>
    `;
  }

  renderConclusionPage() {
    const { title, conclusion } = this.data;
    document.getElementById('page-title').textContent = `${title} - Conclusions`;

    const introSection = document.getElementById('conclusion-intro');
    introSection.innerHTML = `
      <h2>Unit ${this.unit} Complete!</h2>
      <p>${conclusion.introduction.message}</p>
    `;

    const conclusionContent = document.getElementById('conclusion-content');
    conclusionContent.innerHTML = `
      <div class="lecture-section">
        <h3>What You've Achieved</h3>
        <ul class="objectives">
          ${conclusion.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
      </div>

      <div class="lecture-section" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-left: 4px solid var(--accent);">
        <h3>Looking Ahead</h3>
        <p>${conclusion.lookingAhead.message}</p>
        <ul class="list">
          ${conclusion.lookingAhead.preview.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="lecture-section" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-left: 4px solid var(--success); text-align: center;">
        <p style="font-size: 1.1rem; font-style: italic; margin: 0;">${conclusion.celebrateProgress}</p>
      </div>
    `;

    const navButtons = document.getElementById('conclusion-nav-buttons');
    navButtons.innerHTML = `
      <a href="?unit=${this.unit}&page=exam" class="btn">← Back to Exam</a>
      <a href="../index.html" class="btn btn-primary">Back to Home</a>
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
      case 'review':
        this.renderReviewPage();
        break;
      case 'exam':
        this.renderExamPage();
        break;
      case 'conclusion':
        this.renderConclusionPage();
        break;
      default:
        this.renderReviewPage();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ExamLoader();
  loader.init();
});