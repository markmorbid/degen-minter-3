'use client';

export default function HeroSection() {
  return (
    <section 
      className="hero-section"
      style={{
        backgroundImage: 'url(https://degent.club/wp-content/uploads/2025/10/degens_grid.jpg)'
      }}
    >      
      {/* Content */}
      <div className="container text-center">
          <h1>
            Degent <strong>Minter</strong>
          </h1>
          
          <section className="text-center">
            <h2>
              Create and Mint your own Degen!
              <br />
              <span className="text-degent-green text-sm">By Degent.Club</span>
            </h2>
            <p className="desc-text">
              All approved Degents become part of the official Decentralized Gentlemen Club collection and are eligible for member-only benefits.
            </p>
          </section>
      </div>
    </section>
  );
}

