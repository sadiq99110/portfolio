// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: "Syed Sadiq Hussain",
  title: "Full-Stack & Mobile Software Engineer",
  location: "Karachi, Pakistan",
  email: "sadiq99110@gmail.com",
  phone: "+92 313 8212214",
  summary:
    "Software engineer with 5+ years of experience building and shipping cross-platform mobile and web applications, from MVPs to enterprise systems. I deliver end to end: React Native and Flutter apps on the App Store and Google Play, Next.js front ends, and NestJS microservice back ends.",
  links: {
    linkedin: "https://www.linkedin.com/in/sadiq-zaidi408ba41b9/",
    github: "https://github.com/sadiqgenetech110",
    medium: "https://medium.com/@sadiq99110",
  },
  // Put your resume PDF in /public as resume.pdf to enable the download button.
  resumeUrl: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/resume.pdf`,
};

export const stats = [
  { value: "5+", label: "Years shipping software" },
  { value: "8+", label: "Production projects" },
  { value: "2", label: "App stores published to" },
  { value: "M.S.", label: "Data Science" },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Mobile", items: ["React Native", "Flutter", "Kotlin", "Java", "Redux", "GetX", "Room", "Retrofit"] },
  { group: "Web", items: ["Next.js", "React.js", "TypeScript", "JavaScript", "Tailwind CSS"] },
  { group: "Back end", items: ["Node.js", "NestJS", "REST APIs", "Microservices", "RabbitMQ", "Webhooks"] },
  { group: "Data & Cloud", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Docker", "Azure", "Python", "Power BI"] },
  { group: "Integrations", items: ["Salesforce", "Zoho Creator", "Payment gateways", "Google & Apple Wallet", "Deep linking", "Push notifications"] },
];

export const experience = [
  {
    role: "Software Engineer",
    company: "Genetech Solutions",
    period: "Jul 2021 — Present",
    points: [
      "Build and ship web and mobile apps end to end with Next.js, React, Flutter, React Native and native Android.",
      "Develop NestJS microservices that communicate through RabbitMQ.",
      "Publish and maintain apps on the Apple App Store and Google Play.",
      "Integrated Salesforce through webhooks for real-time two-way data sync.",
      "Implemented Google Wallet and Apple Wallet passes for digital membership and ID cards.",
      "Built a suite of interconnected Zoho Creator business apps with shared workflows.",
    ],
  },
  {
    role: "React Native Developer",
    company: "Quatorze",
    period: "Mar 2021 — Jun 2021",
    points: [
      "Developed and maintained React Native apps with clean, consistent UI.",
      "Integrated Firebase Firestore for real-time tracking and push notifications.",
      "Handled database upgrades, schema migrations and back-end optimizations.",
    ],
  },
];

export const projects = [
  {
    name: "OneID Platform",
    kind: "Web platform",
    stack: ["Next.js", "NestJS", "OCR"],
    description:
      "Census and identity platform that digitizes online and OCR-scanned paper forms, and manages member profiles, ID cards and business directories.",
  },
  {
    name: "Hey Smarty",
    kind: "AI mobile app",
    stack: ["Mobile", "AI", "Speech"],
    description:
      "ChatGPT-style assistant with speech-to-text, voice-to-voice, Google and Apple sign-in, and chat folders stored on device.",
  },
  {
    name: "Islamic Library",
    kind: "Full-stack app",
    stack: ["NestJS", "Next.js", "Flutter"],
    description:
      "Reading app with downloads, favorites, PDF annotations with notes and snapshots, and ratings and reviews.",
  },
  {
    name: "Enrich Kids",
    kind: "Marketplace",
    stack: ["Next.js", "NestJS"],
    description:
      "Marketplace connecting parents with in-person children's courses such as karate, football and summer camps.",
  },
  {
    name: "AI PhotoBooth",
    kind: "AI mobile app",
    stack: ["Mobile", "Generative AI"],
    description:
      "Event photo booth that turns selfies into three AI-generated avatars while capturing customer leads for businesses.",
  },
  {
    name: "TradeFindry",
    kind: "iOS app",
    stack: ["React Native", "Redux", "Firebase"],
    description: "iOS app for designers to search vendor products and build their own design boards.",
  },
  {
    name: "TeeSquare",
    kind: "Android app",
    stack: ["Java", "Kotlin", "Room", "Retrofit"],
    description: "Native Android EdTech app delivering affordable, inclusive education across Pakistan.",
  },
  {
    name: "Multi Timer Stopwatch",
    kind: "Mobile app",
    stack: ["Mobile", "Voice"],
    description: "Runs multiple concurrent or sequential timer groups with voice commands and notifications.",
  },
];

export const education = [
  { degree: "M.S. Data Science", school: "NED University of Engineering and Technology", period: "2023 — 2024" },
  { degree: "B.S. Computer Science", school: "University of Karachi", period: "2018 — 2021" },
];
