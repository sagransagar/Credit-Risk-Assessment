// Custom cursor
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    }, 50);
});

document.addEventListener('mousedown', function() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    cursor.style.transform = 'scale(0.8)';
    follower.style.transform = 'scale(0.5)';
});

document.addEventListener('mouseup', function() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    cursor.style.transform = 'scale(1)';
    follower.style.transform = 'scale(1)';
});

// Initialize risk score chart
const ctx = document.getElementById('riskChart').getContext('2d');
const riskChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Risk Score', 'Remaining'],
        datasets: [{
            data: [0, 100],
            backgroundColor: [
                'rgba(78, 205, 196, 0.8)',
                'rgba(240, 240, 240, 0.5)'
            ],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '80%',
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    }
});

// Initialize trend chart
const trendCtx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(trendCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Risk Score Trend',
            data: [75, 78, 72, 80, 82, 85],
            fill: true,
            borderColor: '#4ECDC4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Handle form submission
document.getElementById('creditAssessmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    simulateRiskAssessment();
});

// Add hover effect to form sections
document.querySelectorAll('.form-section').forEach(section => {
    section.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    section.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

function simulateRiskAssessment() {
    // Show loading state
    document.getElementById('riskScore').textContent = 'Calculating...';
    document.querySelector('.custom-button').disabled = true;
    document.querySelector('.custom-button').innerHTML = `
        <span class="button-content">
            <i class="fas fa-spinner fa-spin"></i> Processing...
        </span>
    `;
    
    // Reset stats
    document.getElementById('processingTime').textContent = '0.0s';
    document.getElementById('dataPoints').textContent = '0';
    document.getElementById('confidence').textContent = '0%';
    
    // Animate processing time
    let time = 0;
    const timeInterval = setInterval(() => {
        time += 0.1;
        document.getElementById('processingTime').textContent = time.toFixed(1) + 's';
        if (time >= 1.5) clearInterval(timeInterval);
    }, 100);
    
    // Animate data points
    let points = 0;
    const pointsInterval = setInterval(() => {
        points += 50;
        document.getElementById('dataPoints').textContent = points.toLocaleString();
        if (points >= 1000) clearInterval(pointsInterval);
    }, 100);
    
    // Animate confidence
    let confidence = 0;
    const confidenceInterval = setInterval(() => {
        confidence += 5;
        document.getElementById('confidence').textContent = confidence + '%';
        if (confidence >= 95) clearInterval(confidenceInterval);
    }, 100);
    
    setTimeout(() => {
        // Simulate risk score calculation
        const riskScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
        
        // Animate chart update with glow effect
        const chartCanvas = document.querySelector('#riskChart');
        chartCanvas.style.filter = 'drop-shadow(0 0 10px rgba(78, 205, 196, 0.5))';
        setTimeout(() => {
            chartCanvas.style.filter = 'none';
        }, 1000);
        
        riskChart.data.datasets[0].data = [riskScore, 100 - riskScore];
        riskChart.update('active');
        
        // Update score display with animation
        animateValue('riskScore', 0, riskScore, 1500);
        
        // Update recommendation
        updateRecommendation(riskScore);
        
        // Update risk factors
        updateRiskFactors(riskScore);
        
        // Update trend chart
        updateTrendChart(riskScore);

        // Reset button with success animation
        document.querySelector('.custom-button').disabled = false;
        document.querySelector('.custom-button').innerHTML = `
            <span class="button-content">
                <i class="fas fa-check-circle"></i> Assessment Complete
            </span>
        `;
        setTimeout(() => {
            document.querySelector('.custom-button').innerHTML = `
                <span class="button-content">
                    <i class="fas fa-calculator"></i> Calculate Risk Score
                </span>
            `;
        }, 2000);
    }, 1500);
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;

    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        obj.textContent = value;
        if (value === end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

function updateRecommendation(score) {
    const recommendation = document.getElementById('recommendation');
    let message, color, icon;
    
    if (score >= 80) {
        message = 'Low Risk - Highly recommended for credit approval';
        color = '#2ecc71';
        icon = 'check-circle';
    } else if (score >= 70) {
        message = 'Moderate Risk - Consider with standard terms';
        color = '#f1c40f';
        icon = 'exclamation-circle';
    } else {
        message = 'High Risk - Additional verification recommended';
        color = '#e74c3c';
        icon = 'times-circle';
    }
    
    recommendation.innerHTML = `
        <i class="fas fa-${icon}" style="color: ${color}"></i>
        ${message}
    `;
    recommendation.style.color = color;
    
    // Add pulse animation
    recommendation.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        recommendation.style.animation = '';
    }, 500);
}

function updateRiskFactors(score) {
    const factors = [
        {
            title: 'Credit Score Impact',
            value: Math.floor(score * 0.4),
            max: 40,
            description: 'Based on traditional credit scoring',
            icon: 'chart-line',
            color: '#4ECDC4'
        },
        {
            title: 'Social Media Sentiment',
            value: Math.floor(score * 0.3),
            max: 30,
            description: 'Analysis of online presence and behavior',
            icon: 'comments',
            color: '#FF6B6B'
        },
        {
            title: 'Payment History',
            value: Math.floor(score * 0.3),
            max: 30,
            description: 'Based on utility and other regular payments',
            icon: 'history',
            color: '#45B7D1'
        }
    ];
    
    const riskFactorsDiv = document.getElementById('riskFactors');
    riskFactorsDiv.innerHTML = factors.map((factor, index) => `
        <div class="risk-factor-item" style="animation: fadeInUp 0.5s ${index * 0.2}s both">
            <div class="w-100">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <i class="fas fa-${factor.icon} me-2" style="color: ${factor.color}"></i>
                        <strong>${factor.title}</strong>
                    </div>
                    <span class="badge" style="background: ${factor.color}">${factor.value}/${factor.max}</span>
                </div>
                <div class="progress mb-2">
                    <div class="progress-bar" role="progressbar" 
                         style="width: 0%; background: ${factor.color}" 
                         aria-valuenow="${factor.value}" 
                         aria-valuemin="0" 
                         aria-valuemax="${factor.max}">
                    </div>
                </div>
                <small class="text-muted">${factor.description}</small>
            </div>
        </div>
    `).join('');
    
    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-bar').forEach((bar) => {
            const value = bar.getAttribute('aria-valuenow');
            const max = bar.getAttribute('aria-valuemax');
            bar.style.width = `${(value/max)*100}%`;
        });
    }, 100);
}

function updateTrendChart(latestScore) {
    // Add new score to trend data
    trendChart.data.datasets[0].data.push(latestScore);
    trendChart.data.datasets[0].data.shift();
    trendChart.update('active');
}

// Initialize tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Add hover effects to cards
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});
