'use client';

export default function AIInstructions() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Degen.jpg';
    link.download = 'Degen.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🎨 Create Your Decentralized Gentleman 🎨</h2>
      
      <div className="space-y-4 text-gray-300">
        <div>
          <h3 className="font-semibold text-white mb-2">Image Requirements:</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Must be Pepe in a tuxedo</li>
            <li>Bowtie is <strong className="text-white">mandatory</strong></li>
            <li>Must include text: "DEGEN", "DEGENT", or "REGEN"</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-2">How to Generate:</h3>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Use any AI image generator (ChatGPT, Midjourney, etc.)</li>
            <li>Download our sample image below as reference</li>
            <li>Prompt: "Make one like this"</li>
          </ol>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex-shrink-0">
            <img 
              src="/Degen.jpg" 
              alt="Sample Degent" 
              className="w-48 h-48 rounded-lg border-2 border-blue-500 object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-3">
              Sample Degent image for reference
            </p>
            <button
              onClick={handleDownload}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              📥 Download Sample (Degen.jpg)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
