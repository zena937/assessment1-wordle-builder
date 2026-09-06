'use client';

interface GenerateHTMLProps {
  htmlContent: string;
  filename: string;
}

const GenerateHTML = ({ htmlContent, filename }: GenerateHTMLProps) => {
  const handleDownload = () => {
    // Create blob from HTML content
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleDownload}
      className="btn btn-success btn-lg w-100"
    >
      📥 Download HTML Activity
    </button>
  );
};

export default GenerateHTML;