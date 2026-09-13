'use client';

import { useState } from 'react';

export default function About() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div>
      <h1 className="mb-4">📋 About This Project</h1>

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

      <div className="card mb-4">
        <div className="card-body">
          <h5>👤 Student Information</h5>
          <p><strong>Name:</strong> Zena Oosthuizen</p>
          <p><strong>Student Number:</strong> 22409698</p>
          <p><strong>Course:</strong> CSE5006 - Web Development</p>
          <p><strong>Subject:</strong> CSE3CWA</p>
          <p><strong>Assessment:</strong> 2 - Backend implementation and database integration</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>🎥 How to Use This Website</h5>
          <p>Watch the demonstration video included in your submission for a complete walkthrough.</p>
          <p className="text-muted small">
            Note: The video is not included in this draft submission.
          </p>
        </div>
      </div>
    </div>
  );
}