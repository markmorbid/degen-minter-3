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
    <div className="rounded-degent-card border border-degent-border bg-degent-card/50 backdrop-blur-sm p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
        <span className="bg-degent-green/10 border border-degent-green/20 icon-square p-3 rounded-degent-button">
          <i className="fas fa-palette text-degent-green"></i>
        </span>
        <span>
          <span className="text-degent-green">Create</span> Your Decentralized Gentleman
        </span>
      </h2>
      
      <div className="space-y-4 text-degent-muted">
        <div className="bg-degent-input/60 border border-degent-border/50 rounded-degent-card p-4">
          <h3 className="text-xl font-semibold text-degent-green mb-3 flex items-center gap-3">
            <span className="p-3 bg-degent-green/20 rounded-degent-button icon-square flex items-center justify-center">
              <i className="fas fa-list-check text-degent-green text-sm"></i>
            </span>
            Image Requirements:
          </h3>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-2">
              <i className="fas fa-check text-degent-green text-xs mt-0.5"></i>
              <span>Must be Pepe in a tuxedo</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-vest text-degent-green text-xs mt-0.5"></i>
              <span>Bowtie is <strong className="text-white">mandatory</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-font text-degent-green text-xs mt-0.5"></i>
              <span>Must include text: "DEGEN", "DEGENT", or "REGEN"</span>
            </li>
          </ul>
        </div>

        <div className="bg-degent-input/60 border border-degent-border/50 rounded-degent-card p-4">
          <h3 className="text-xl font-semibold text-degent-green mb-3 flex items-center gap-3">
            <span className="p-3 bg-degent-green/20 rounded-degent-button icon-square flex items-center justify-center">
              <i className="fas fa-magic text-degent-green text-sm"></i>
            </span>
            How to Generate:
          </h3>
          <ol className="list-none space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-degent-green font-bold">1.</span>
              <span>Use any AI image generator (ChatGPT, Midjourney, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-degent-green font-bold">2.</span>
              <span>Download our sample image below as reference</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-degent-green font-bold">3.</span>
              <span>Prompt: "Make one like this"</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-row flex-wrap content-stretch items-stretch justify-between gap-4">
          <div className="bg-degent-input/60 border border-degent-border/50 flex flex-col flex-grow gap-4 p-6 rounded-degent-card">
            <img 
              src="/Degen.jpg" 
              alt="Sample Degent" 
              className="border border-degent-green/20 icon-square mx-auto object-cover rounded-degent-card w-48"
              style={{
                boxShadow: '8px 8px 0px 0px #00000040'
              }}
            />
            <div className="flex-grow flex flex-col justify-evenly items-center">
              <p className="text-sm text-degent-muted mb-4">Sample Degent image for reference</p>
              <button
                onClick={handleDownload}
                className="bg-degent-gradient duration-300 flex font-bold gap-2 h-[45px] hover:opacity-90 items-center justify-center p-6 rounded-degent-button text-degent-dark text-md transition-all w-full whitespace-nowrap"
              >
                <i className="fas fa-download"></i>
                Download Sample
              </button>
            </div>
          </div>
          <div className="bg-degent-input/60 border border-degent-border/50 flex flex-col flex-grow gap-4 p-6 rounded-degent-card">
            <img 
              src="https://media.canva.com/v2/image-resize/format:PNG/height:800/quality:100/uri:ifs%3A%2F%2FM%2Fa403c82b-bcc4-4cea-9cee-fbe7e129f965/watermark:F/width:800?csig=AAAAAAAAAAAAAAAAAAAAAPxEdp0sIUFUjEBwKCaz7N5qYLAf4hXSqrLSlixGodMw&exp=1764136515&osig=AAAAAAAAAAAAAAAAAAAAAGSX9gwdokTxiDx7C7zyo2b3JQ8JeAJtyKiskZGfAP17&signer=media-rpc&x-canva-quality=screen" 
              alt="Canva Template" 
              className="border border-degent-green/20 icon-square mx-auto object-cover rounded-degent-card w-48"
              style={{
                backgroundColor: '#2d3730',
                backgroundImage: 'linear-gradient(to top right, #161617b5, #02b15b87)',
                boxShadow: '8px 8px 0px 0px #00000040'
              }}
            />
            <div className="flex-grow flex flex-col justify-evenly items-center">
              <p className="text-sm text-degent-muted mb-4">Edit the official Canva template</p>
              <a
                href="https://www.canva.com/design/DAGmbO5kaP4/DSXgcMcw540zRAkTF9M_Lw/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-degent-gradient duration-300 flex font-bold gap-2 h-[45px] hover:opacity-90 items-center justify-center p-6 rounded-degent-button text-degent-dark text-md transition-all w-full whitespace-nowrap"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                Open Template
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
