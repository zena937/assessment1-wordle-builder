'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="display-4 mb-4">🎯 Phoneme Activity Builder</h1>
      <p className="lead mb-5">
        Create engaging Wordle and Word Search activities for Speech Pathology students.
      </p>
      
      <div className="row g-4 mt-4">
        {/* Wordle Card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">🔤 Wordle</h3>
              <p className="card-text">
                Create phoneme-based Wordle games where students identify sounds in words.
              </p>
              <ul className="text-start" style={{ listStyle: 'none', padding: 0 }}>
                <li>✅ Single phoneme word</li>
                <li>✅ Hints with English equivalents</li>
                <li>✅ Downloadable standalone HTML</li>
              </ul>
              <Link href="/wordle" className="btn btn-primary mt-3">
                Create Wordle →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Word Search Card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">🔍 Word Search</h3>
              <p className="card-text">
                Generate phoneme-based word searches to reinforce sound recognition.
              </p>
              <ul className="text-start" style={{ listStyle: 'none', padding: 0 }}>
                <li>✅ Multiple phoneme words</li>
                <li>✅ Mouse-over phoneme hints</li>
                <li>✅ Downloadable standalone HTML</li>
              </ul>
              <Link href="/wordsearch" className="btn btn-primary mt-3">
                Create Word Search →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}