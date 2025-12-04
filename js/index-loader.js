// Index Page - Load course topics from units.json
async function loadCourseTopics() {
  try {
    const response = await fetch('data/units.json');
    const data = await response.json();
    
    const units = data.units;
    
    // Build the topics HTML with tabbed interface
    let topicsHTML = '<h2 style="margin-top: 3rem;">Course Topics</h2>';
    
    // Create tabs
    topicsHTML += '<div class="tabs-container"><div class="tabs">';
    units.forEach((unit, index) => {
      const activeClass = index === 0 ? 'active' : '';
      topicsHTML += `<button class="tab-button ${activeClass}" onclick="switchTab(${index})">Unit ${unit.number}</button>`;
    });
    topicsHTML += '</div>';
    
    // Create tab content
    topicsHTML += '<div class="tab-contents">';
    units.forEach((unit, index) => {
      const activeClass = index === 0 ? 'active' : '';
      topicsHTML += `
        <div class="tab-content ${activeClass}" id="tab-${index}">
          <h3>${unit.title}</h3>
          <ul class="list">`;
      
      // Special handling for Unit 4 (Final Project)
      if (unit.number === 4) {
        // Week 15: Course Review
        topicsHTML += `<li><a href="templates/final-project-template.html?page=courseReview">Week 15: Course Review and Conclusions</a></li>`;
        
        // Week 16: Final Project
        topicsHTML += `<li><a href="templates/final-project-template.html?page=finalProject">Week 16: Final Project Presentations</a></li>`;
        
        // Week 17: Peer Evaluations
        topicsHTML += `<li><a href="templates/final-project-template.html?page=peerEvaluation">Week 17: Final Project Peer Evaluations</a></li>`;
      } else {
        // Standard handling for Units 1-3
        unit.outline.forEach(item => {
          // Extract week number from outline string
          const weekMatch = item.match(/Week (\d+)/);
          if (weekMatch) {
            const weekNum = weekMatch[1];
            topicsHTML += `<li><a href="templates/week-template.html?week=${weekNum}&page=intro">${item}</a></li>`;
          } else {
            topicsHTML += `<li>${item}</li>`;
          }
        });
        
        // Add exam link for Units 1 and 2
        if (unit.number === 1 || unit.number === 2) {
          topicsHTML += `<li style="font-weight: 600;"><a href="templates/exam-template.html?unit=${unit.number}&page=review">Unit ${unit.number} Examination</a></li>`;
        }
      }
      
      topicsHTML += '</ul></div>';
    });
    topicsHTML += '</div></div>';
    
    // Insert before the additional resources section
    const container = document.querySelector('.container');
    const additionalResources = container.querySelector('[style*="margin-top: 3rem"]');
    
    if (additionalResources) {
      additionalResources.insertAdjacentHTML('beforebegin', topicsHTML);
    }
    
  } catch (error) {
    console.error('Error loading course topics:', error);
  }
}

// Tab switching function
function switchTab(tabIndex) {
  // Remove active class from all tabs and contents
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Add active class to selected tab and content
  document.querySelectorAll('.tab-button')[tabIndex].classList.add('active');
  document.getElementById(`tab-${tabIndex}`).classList.add('active');
}

// Load topics when page loads
document.addEventListener('DOMContentLoaded', loadCourseTopics);