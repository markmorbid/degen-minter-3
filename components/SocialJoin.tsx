'use client';

export default function SocialJoin() {
  return (
    <div 
      id="social_join"
      className="relative w-full max-w-[1320px] mx-auto rounded-degent-card overflow-hidden bg-degent-card isolate group/card"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover/card:scale-105" 
        style={{
          backgroundImage: 'url(https://degent.club/wp-content/uploads/2025/10/degens_grid-1030x579.jpg)'
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-degent-card/90" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-[60px] text-center">
        {/* Heading */}
        <h3 className="text-[32px] font-bold leading-[35px] text-white">
          Join the Members group.{' '}
          {/* Gradient Text */}
          <span className="bg-gradient-to-r from-degent-green to-degent-orange bg-clip-text text-transparent font-bold">
            Mint your legacy
          </span>
        </h3>

        {/* Subheading */}
        <div className="mt-2 text-lg font-bold text-white">
          <p className="text-[16px] font-light text-white/60">
            If everything's correctly set up, you'll automatically be allowed in. Just sit tight!
          </p>
        </div>

        {/* Divider/Spacer */}
        <div className="w-full max-w-[1200px] h-[30px] flex items-center" />

        {/* Button Row */}
        <div className="flex flex-wrap justify-center gap-2">
          {/* Telegram Button */}
          <a 
            href="https://t.me/+cneroYQ-0VpmM2Ix" 
            target="_blank" 
            rel="noopener noreferrer nofollow" 
            className="relative overflow-hidden group flex items-center justify-center h-[52px] min-w-[200px] px-8 rounded-md bg-[#2563eb] border-b border-[#2563eb] text-white font-semibold text-[16px] transition-all duration-[400ms] hover:text-degent-dark"
          >
            {/* Hover Slide Effect (Green Background) */}
            <span className="absolute inset-0 bg-degent-green translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]" />
            
            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-2">
              <span>Join Telegram</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 29 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.608 4.16q0.448-0.128 0.704 0.096t0.128 0.608q-0.064 0.192-2.304 9.92t-2.368 10.112q-0.064 0.448-0.448 0.608t-0.768-0.032l-8.896-4.8 0.704-0.832q12.416-13.44 12.608-13.632 0.128-0.128-0.032-0.288t-0.288-0.032l-17.6 12.864-3.584-1.408-6.080-2.432q-0.384-0.128-0.384-0.384t0.384-0.384q0.256-0.128 14.112-5.024t14.112-4.96zM9.984 27.456v-6.528l5.12 2.624q-4.16 3.712-4.544 4.096-0.576 0.448-0.576-0.192z" />
              </svg>
            </span>
          </a>

          {/* X (Twitter) Button */}
          <a 
            href="https://x.com/degentclub" 
            target="_blank" 
            rel="noopener noreferrer nofollow" 
            className="relative overflow-hidden group flex items-center justify-center h-[52px] min-w-[200px] px-8 rounded-md bg-degent-card border border-degent-border text-white font-semibold text-[16px] transition-all duration-[400ms] hover:text-degent-dark"
          >
            {/* Hover Slide Effect (Green Background) */}
            <span className="absolute inset-0 bg-degent-green translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]" />
            
            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-2">
              <span>Follow on X</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.32 3.008h4.416l-9.632 11.008 11.328 14.976h-8.864l-6.976-9.088-7.936 9.088h-4.416l10.304-11.776-10.88-14.208h9.12l6.272 8.288 7.264-8.288zM22.784 26.368h2.432l-15.776-20.864h-2.624l15.968 20.864z" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

