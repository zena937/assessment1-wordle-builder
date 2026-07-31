



'use client';

import { useState } from 'react';

export default function About() {
  const [showVideo, setShowVideo] = useState(true);
  
  return (
    <div>
      <h1 className="mb-4" style={{ color: 'var(--text-color)' }}>📋 About This Project</h1>
      
      {/* Project Description Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Assessment 1: Frontend Design and Usability</h5>
          <p className="mt-3">
            This application is a Wordle-style web application builder designed for 
            Speech Pathology students and teachers. It allows teachers to create 
            phoneme-based classroom activities that can be downloaded as standalone HTML files.
          </p>
          
          <h6 className="mt-3">Features:</h6>
          <ul>
            <li><strong>Wordle Game:</strong> Create phoneme-based Wordle games with hints</li>
            <li><strong>Word Search:</strong> Generate phoneme-based word searches</li>
            <li><strong>Theme Support:</strong> Light/Dark mode with persistence</li>
            <li><strong>Download:</strong> Export activities as standalone HTML files</li>
            <li><strong>Responsive:</strong> Works on all devices</li>
          </ul>
        </div>
      </div>
      
      {/* Student Information Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>👤 Student Information</h5>
          <p><strong>Name:</strong> Your Full Name</p>
          <p><strong>Student Number:</strong> 12345678</p>
          <p><strong>Course:</strong> CSE5006 - Web Development</p>
          <p><strong>Subject:</strong> CSE3CWA / CSE5006</p>
          <p><strong>Assessment:</strong> 1 - Frontend Design and Usability</p>
        </div>
      </div>
      
      {/* Video Tutorial */}
      <div className="card">
        <div className="card-body">
          <h5>🎥 How to Use This Website</h5>
          <p>Watch the demonstration below for a complete walkthrough:</p>
          
          {showVideo ? (
            <div className="text-center">
              <div className="ratio ratio-16x9 bg-light rounded" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <video controls className="w-100 rounded">
                  <source src="/demo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <button 
                onClick={() => setShowVideo(false)} 
                className="btn btn-secondary mt-3"
              >
                Hide Video
              </button>
              <p className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                Note: Replace /demo-video.mp4 with your actual video file
              </p>
            </div>
          ) : (
            <button 
              onClick={() => setShowVideo(true)} 
              className="btn btn-primary"
            >
              Show Video
            </button>
          )}
        </div>
      </div>
    </div>
  );
}