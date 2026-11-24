type ProjectArtworkProps = {
  id: string;
};

const svgProps = {
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  focusable: false,
} as const;

function Frame({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 400 240" {...svgProps}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--cover-a)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--cover-b)" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`halo-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--cover-a)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--cover-a)" stopOpacity="0" />
        </radialGradient>
        <filter id={`glow-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="208" cy="118" r="104" fill={`url(#halo-${id})`} />
      <circle
        cx="208"
        cy="118"
        r="88"
        stroke="var(--cover-a)"
        strokeOpacity="0.16"
        strokeDasharray="3 9"
      />
      <circle
        cx="208"
        cy="118"
        r="112"
        stroke="var(--cover-b)"
        strokeOpacity="0.08"
      />
      <path
        d="M64 188h272"
        stroke="var(--cover-a)"
        strokeOpacity="0.12"
      />
      <g strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

function VCart() {
  return (
    <Frame id="vcart">
      <g filter="url(#glow-vcart)">
        <rect
          x="98"
          y="58"
          width="86"
          height="60"
          rx="8"
          stroke="var(--cover-b)"
          strokeOpacity="0.42"
        />
        <rect
          x="216"
          y="76"
          width="86"
          height="58"
          rx="8"
          stroke="var(--cover-a)"
          strokeOpacity="0.35"
        />
        <path
          d="M120 78h42M120 90h28"
          stroke="var(--cover-b)"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <path
          d="M240 96h38M240 108h24"
          stroke="var(--cover-a)"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
        <path
          d="M140 104h34l10 38h60l12-30h-70"
          stroke="url(#grad-vcart)"
          strokeWidth="3"
        />
        <circle cx="188" cy="154" r="6" stroke="var(--cover-a)" strokeWidth="2.5" />
        <circle cx="240" cy="154" r="6" stroke="var(--cover-a)" strokeWidth="2.5" />
        <path
          d="M180 70h34M197 56v28"
          stroke="var(--cover-a)"
          strokeOpacity="0.8"
          strokeWidth="2"
        />
        <circle cx="318" cy="70" r="14" stroke="var(--cover-b)" strokeOpacity="0.5" />
        <path d="M313 70h10M318 65v10" stroke="var(--cover-b)" strokeOpacity="0.7" />
      </g>
      <circle cx="98" cy="130" r="2.5" fill="var(--cover-a)" />
      <circle cx="206" cy="48" r="2" fill="var(--cover-b)" />
      <circle cx="318" cy="148" r="2.5" fill="var(--cover-a)" />
    </Frame>
  );
}

function HopeBridge() {
  return (
    <Frame id="hopebridge">
      <g filter="url(#glow-hopebridge)">
        <path
          d="M200 92c-10-18-38-14-38 8 0 20 24 30 38 42 14-12 38-22 38-42 0-22-28-26-38-8Z"
          stroke="url(#grad-hopebridge)"
          strokeWidth="2.6"
        />
        <path
          d="M116 160c18-16 34-10 48 2 8 7 16 12 26 12l14-1"
          stroke="var(--cover-b)"
          strokeWidth="3"
        />
        <path
          d="M284 160c-18-16-34-10-48 2-8 7-16 12-26 12l-14-1"
          stroke="var(--cover-a)"
          strokeWidth="3"
        />
        <circle cx="158" cy="142" r="7" stroke="var(--cover-b)" strokeOpacity="0.6" />
        <path d="M146 168c0-9 5-14 12-14s12 5 12 14" stroke="var(--cover-b)" strokeOpacity="0.5" />
        <circle cx="246" cy="126" r="7" stroke="var(--cover-a)" strokeOpacity="0.6" />
        <path d="M234 152c0-9 5-14 12-14s12 5 12 14" stroke="var(--cover-a)" strokeOpacity="0.5" />
        <path
          d="M300 82c12 8 12 26 0 34-12-8-12-26 0-34Z"
          stroke="var(--cover-a)"
          strokeOpacity="0.45"
        />
        <path d="M96 96c-10 7-10 21 0 28 10-7 10-21 0-28Z" stroke="var(--cover-b)" strokeOpacity="0.4" />
      </g>
      <circle cx="200" cy="182" r="2.5" fill="var(--cover-a)" />
      <circle cx="102" cy="140" r="2" fill="var(--cover-b)" />
      <circle cx="300" cy="130" r="2" fill="var(--cover-a)" />
    </Frame>
  );
}

function Portfolio() {
  return (
    <Frame id="portfolio">
      <g filter="url(#glow-portfolio)">
        <rect
          x="92"
          y="56"
          width="216"
          height="132"
          rx="12"
          stroke="url(#grad-portfolio)"
          strokeWidth="2"
        />
        <path d="M92 82h216" stroke="var(--cover-a)" strokeOpacity="0.35" />
        <circle cx="108" cy="69" r="3" stroke="var(--cover-b)" strokeOpacity="0.7" />
        <circle cx="119" cy="69" r="3" stroke="var(--cover-b)" strokeOpacity="0.45" />
        <circle cx="130" cy="69" r="3" stroke="var(--cover-b)" strokeOpacity="0.25" />
        <path d="M112 96h52M112 106h38" stroke="var(--cover-a)" strokeOpacity="0.5" strokeWidth="2" />
        <rect x="112" y="120" width="60" height="46" rx="6" stroke="var(--cover-b)" strokeOpacity="0.35" />
        <path d="M124 148l10-12 10 9 8-10 10 15" stroke="var(--cover-a)" strokeOpacity="0.6" strokeWidth="2" />
        <circle cx="264" cy="116" r="18" stroke="var(--cover-a)" strokeOpacity="0.7" />
        <path d="M264 108v16M256 116h16" stroke="var(--cover-a)" strokeOpacity="0.45" />
        <path d="M246 152h70M246 162h48" stroke="var(--cover-b)" strokeOpacity="0.35" strokeWidth="2" />
        <path
          d="M188 106l8-8 8 8M196 98v22"
          stroke="var(--cover-a)"
          strokeOpacity="0.35"
        />
      </g>
      <circle cx="306" cy="90" r="2.5" fill="var(--cover-b)" />
      <circle cx="86" cy="170" r="2" fill="var(--cover-a)" />
    </Frame>
  );
}

function Tnea() {
  return (
    <Frame id="tnea">
      <g filter="url(#glow-tnea)">
        <path
          d="M168 82l32-16 32 16-32 16-32-16Z"
          stroke="url(#grad-tnea)"
          strokeWidth="2.2"
        />
        <path d="M200 98v22" stroke="var(--cover-a)" strokeOpacity="0.5" />
        <path d="M168 82v22c0 8 14 16 32 16s32-8 32-16V82" stroke="var(--cover-a)" strokeOpacity="0.4" />
        <rect x="104" y="136" width="20" height="42" rx="3" stroke="var(--cover-b)" strokeOpacity="0.4" />
        <rect x="136" y="124" width="20" height="54" rx="3" stroke="var(--cover-b)" strokeOpacity="0.6" />
        <rect x="168" y="144" width="20" height="34" rx="3" stroke="var(--cover-a)" strokeOpacity="0.5" />
        <rect x="200" y="112" width="20" height="66" rx="3" stroke="url(#grad-tnea)" strokeOpacity="0.9" />
        <path d="M98 184h150" stroke="var(--cover-a)" strokeOpacity="0.3" />
        <path
          d="M254 126c0-12 20-12 20 0 0 8-10 16-10 20-10-4-10-12-10-20Z"
          stroke="var(--cover-b)"
          strokeOpacity="0.7"
        />
        <circle cx="264" cy="127" r="3" stroke="var(--cover-b)" strokeOpacity="0.8" />
        <path d="M282 86h28M282 96h18" stroke="var(--cover-a)" strokeOpacity="0.4" strokeWidth="2" />
      </g>
      <circle cx="264" cy="112" r="2" fill="var(--cover-a)" />
      <circle cx="98" cy="104" r="2.5" fill="var(--cover-b)" />
    </Frame>
  );
}

function AiChatbot() {
  return (
    <Frame id="ai-chatbot">
      <g filter="url(#glow-ai-chatbot)">
        <path
          d="M96 86a12 12 0 0 1 12-12h118a12 12 0 0 1 12 12v58a12 12 0 0 1-12 12h-78l-22 20v-20h-18a12 12 0 0 1-12-12V86Z"
          stroke="url(#grad-ai-chatbot)"
          strokeWidth="2.2"
        />
        <path d="M120 104h62M120 118h86M120 132h48" stroke="var(--cover-b)" strokeOpacity="0.5" strokeWidth="2" />
        <circle cx="296" cy="92" r="20" stroke="var(--cover-a)" strokeOpacity="0.55" />
        <path
          d="M296 80l3.5 9.5L309 93l-9.5 3.5L296 106l-3.5-9.5L283 93l9.5-3.5L296 80Z"
          stroke="var(--cover-a)"
          strokeWidth="1.8"
        />
        <circle cx="270" cy="152" r="12" stroke="var(--cover-b)" strokeOpacity="0.55" />
        <circle cx="318" cy="144" r="8" stroke="var(--cover-a)" strokeOpacity="0.4" />
        <circle cx="302" cy="174" r="6" stroke="var(--cover-b)" strokeOpacity="0.4" />
        <path d="M270 152l18-4M306 168l-6-15M282 156l20 14" stroke="var(--cover-a)" strokeOpacity="0.25" />
        <circle cx="252" cy="78" r="3" fill="var(--cover-a)" />
        <path d="M242 64l4 4M250 58l1 5" stroke="var(--cover-b)" strokeOpacity="0.6" />
      </g>
    </Frame>
  );
}

function PdfAnalyzer() {
  return (
    <Frame id="pdf-analyzer">
      <g filter="url(#glow-pdf-analyzer)">
        <rect x="118" y="60" width="110" height="132" rx="8" stroke="var(--cover-b)" strokeOpacity="0.3" transform="rotate(-7 173 126)" />
        <rect x="132" y="52" width="110" height="132" rx="8" stroke="var(--cover-b)" strokeOpacity="0.45" transform="rotate(-3 187 118)" />
        <rect
          x="146"
          y="46"
          width="110"
          height="138"
          rx="8"
          stroke="url(#grad-pdf-analyzer)"
          strokeWidth="2"
        />
        <path d="M166 72h44M166 88h64M166 102h64M166 116h40" stroke="var(--cover-a)" strokeOpacity="0.45" strokeWidth="2" />
        <path d="M166 144h58M166 158h34" stroke="var(--cover-b)" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M144 124h112" stroke="var(--cover-a)" strokeOpacity="0.8" strokeWidth="1.5" filter="url(#glow-pdf-analyzer)" />
        <circle cx="270" cy="140" r="26" stroke="var(--cover-a)" strokeOpacity="0.75" strokeWidth="2" />
        <path d="M289 159l18 18" stroke="var(--cover-a)" strokeWidth="4" />
        <path d="M258 140h24M270 128v24" stroke="var(--cover-a)" strokeOpacity="0.5" strokeWidth="1.6" />
        <path d="M300 76h18M300 88h10" stroke="var(--cover-b)" strokeOpacity="0.4" strokeWidth="2" />
      </g>
      <circle cx="108" cy="162" r="2.5" fill="var(--cover-b)" />
      <circle cx="316" cy="120" r="2" fill="var(--cover-a)" />
    </Frame>
  );
}

function StudentPredictor() {
  return (
    <Frame id="student-predictor">
      <g filter="url(#glow-student-predictor)">
        <path d="M110 58v112h190" stroke="var(--cover-b)" strokeOpacity="0.5" />
        <path d="M110 132h190M110 96h190M148 58v112M186 58v112M224 58v112M262 58v112" stroke="var(--cover-a)" strokeOpacity="0.09" />
        <path
          d="M128 152l38-22 34 12 38-42 34-24"
          stroke="url(#grad-student-predictor)"
          strokeWidth="2.6"
        />
        <circle cx="128" cy="152" r="4" fill="var(--cover-a)" />
        <circle cx="166" cy="130" r="4" fill="var(--cover-a)" />
        <circle cx="200" cy="142" r="4" fill="var(--cover-b)" />
        <circle cx="238" cy="100" r="4" fill="var(--cover-a)" />
        <circle cx="272" cy="76" r="5" fill="var(--cover-a)" />
        <path
          d="M120 170c18-30 44-38 64-24 18-16 44-8 58 24"
          stroke="var(--cover-b)"
          strokeOpacity="0.25"
        />
        <path d="M286 56v34M278 66l8-10 8 10" stroke="var(--cover-b)" strokeOpacity="0.5" />
      </g>
      <circle cx="300" cy="154" r="2.5" fill="var(--cover-b)" />
      <circle cx="96" cy="86" r="2" fill="var(--cover-a)" />
    </Frame>
  );
}

function InstaFlow() {
  return (
    <Frame id="instaflow">
      <g filter="url(#glow-instaflow)">
        <rect x="96" y="62" width="94" height="108" rx="10" stroke="var(--cover-b)" strokeOpacity="0.4" />
        <rect x="150" y="84" width="108" height="112" rx="10" stroke="url(#grad-instaflow)" strokeWidth="2" />
        <rect x="216" y="56" width="88" height="94" rx="10" stroke="var(--cover-b)" strokeOpacity="0.35" />
        <circle cx="204" cy="110" r="16" stroke="var(--cover-a)" strokeOpacity="0.6" />
        <path d="M190 152c8-12 20-12 28 0" stroke="var(--cover-a)" strokeOpacity="0.4" />
        <path d="M160 162h52M160 174h32" stroke="var(--cover-a)" strokeOpacity="0.35" strokeWidth="2" />
        <path
          d="M252 92c-4-7-15-5-15 3 0 8 9 12 15 17 6-5 15-9 15-17 0-8-11-10-15-3Z"
          stroke="var(--cover-a)"
          strokeOpacity="0.7"
        />
        <path d="M116 82h54M116 94h32M236 70h48" stroke="var(--cover-b)" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M292 160l12 0 4 12 4-20 4 8h12" stroke="var(--cover-a)" strokeOpacity="0.5" />
        <path d="M96 190c34-14 56 8 88-2" stroke="var(--cover-b)" strokeOpacity="0.2" />
      </g>
      <circle cx="304" cy="132" r="2.5" fill="var(--cover-a)" />
      <circle cx="86" cy="140" r="2" fill="var(--cover-b)" />
    </Frame>
  );
}

function Telegram() {
  return (
    <Frame id="telegram">
      <g filter="url(#glow-telegram)">
        <rect x="92" y="70" width="68" height="34" rx="8" stroke="var(--cover-b)" strokeOpacity="0.45" />
        <rect x="92" y="132" width="68" height="34" rx="8" stroke="var(--cover-b)" strokeOpacity="0.3" />
        <rect x="226" y="102" width="76" height="34" rx="8" stroke="var(--cover-a)" strokeOpacity="0.5" />
        <path d="M160 87h24c10 0 12 8 12 16v16c0 8 2 14 10 14h12" stroke="var(--cover-a)" strokeOpacity="0.6" />
        <path d="M160 149h20c10 0 14-6 14-12v-14" stroke="var(--cover-b)" strokeOpacity="0.45" />
        <circle cx="196" cy="87" r="3" fill="var(--cover-a)" />
        <circle cx="194" cy="149" r="3" fill="var(--cover-b)" />
        <path
          d="M302 78l-84 30 36 10 8 30 14-20"
          stroke="url(#grad-telegram)"
          strokeWidth="2.4"
        />
        <path d="M302 78l-48 70" stroke="var(--cover-a)" strokeOpacity="0.45" />
        <circle cx="112" cy="87" r="4" stroke="var(--cover-b)" strokeOpacity="0.6" />
        <circle cx="112" cy="149" r="4" stroke="var(--cover-b)" strokeOpacity="0.45" />
        <path d="M126 87h22M126 149h22" stroke="var(--cover-a)" strokeOpacity="0.3" />
      </g>
      <circle cx="314" cy="106" r="2.5" fill="var(--cover-a)" />
      <circle cx="84" cy="112" r="2" fill="var(--cover-b)" />
    </Frame>
  );
}

function Birthday() {
  return (
    <Frame id="birthday">
      <g filter="url(#glow-birthday)">
        <rect x="104" y="62" width="82" height="74" rx="8" stroke="var(--cover-b)" strokeOpacity="0.4" />
        <path d="M104 82h82M124 62v-8M162 62v-8" stroke="var(--cover-b)" strokeOpacity="0.45" />
        <path d="M120 100h12M146 100h12M120 118h12" stroke="var(--cover-a)" strokeOpacity="0.4" />
        <rect x="214" y="122" width="86" height="12" rx="4" stroke="var(--cover-a)" strokeOpacity="0.6" />
        <path d="M222 134v34c0 8 6 14 14 14h44c8 0 14-6 14-14v-34" stroke="url(#grad-birthday)" strokeWidth="2" />
        <path d="M220 150h76" stroke="var(--cover-b)" strokeOpacity="0.35" />
        <path d="M236 122v-20M252 122v-26M268 122v-18M284 122v-24" stroke="var(--cover-a)" strokeOpacity="0.65" />
        <path d="M236 96c-3-5 3-7 0-12M252 90c-3-5 3-7 0-12M268 98c-3-5 3-7 0-12M284 92c-3-5 3-7 0-12" stroke="var(--cover-a)" strokeOpacity="0.85" filter="url(#glow-birthday)" />
        <path d="M310 104l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" stroke="var(--cover-b)" strokeOpacity="0.7" />
        <path d="M94 166l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" stroke="var(--cover-a)" strokeOpacity="0.45" />
        <path d="M314 70v18M305 79h18" stroke="var(--cover-b)" strokeOpacity="0.3" />
      </g>
      <circle cx="96" cy="104" r="2.5" fill="var(--cover-b)" />
      <circle cx="328" cy="158" r="2" fill="var(--cover-a)" />
    </Frame>
  );
}

export default function ProjectArtwork({ id }: ProjectArtworkProps) {
  switch (id) {
    case "vcart":
      return <VCart />;
    case "hopebridge":
      return <HopeBridge />;
    case "portfolio":
      return <Portfolio />;
    case "tnea-guider":
      return <Tnea />;
    case "ai-chatbot":
      return <AiChatbot />;
    case "pdf-analyzer":
      return <PdfAnalyzer />;
    case "student-predictor":
      return <StudentPredictor />;
    case "instaflow":
      return <InstaFlow />;
    case "telegram-bot":
      return <Telegram />;
    case "birthday-automation":
      return <Birthday />;
    default:
      return <Portfolio />;
  }
}
