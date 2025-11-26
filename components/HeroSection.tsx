'use client';

export default function HeroSection() {
  return (
    <section 
      className="pt-32 md:pt-[180px] pb-20 relative bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://degent.club/wp-content/uploads/2025/10/degens_grid.jpg)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Degent <span className="text-degent-green">Minter</span>
          </h1>
          
          <section className="text-center">
            <h2 className="text-xl md:text-xl font-bold mb-2 text-white">
              Create and Mint your own Degen!
              <br />
              <span className="text-degent-green text-sm">By Degent.Club</span>
            </h2>
            <p className="text-xl text-gray-300 mt-4 hidden">
              All approved Degents become part of the official Decentralized Gentlemen Club collection and are eligible for member-only benefits.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

