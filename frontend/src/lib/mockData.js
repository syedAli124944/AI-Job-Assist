/**
 * mockData.js — Static fallback data
 *
 * Used by Job Search, Job Detail, Cover Letter, and Job Recommendations
 * when the Adzuna API is not configured or unreachable.
 *
 * The shape matches the normalized job object returned by the backend's
 * job_provider.py so components work identically with real or mock data.
 */

export const MOCK_JOBS = [
  {
    id: "mock-1",
    title: "Senior Frontend Engineer",
    company: "Stripe",
    location: "Remote",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    experience: "3+ years",
    postedAt: "Sep 3, 2026",
    matchScore: 94,
    tags: ["React", "TypeScript", "GraphQL", "Tailwind"],
    description:
      "Join Stripe's web platform team to build world-class payment UIs. You'll own end-to-end features across our React component library, GraphQL layer, and design system. We value engineers who care about performance, accessibility, and elegant API design.",
    requirements: [
      "4+ years of experience with React and TypeScript",
      "Strong understanding of GraphQL and REST APIs",
      "Experience with performance profiling and optimization",
      "Excellent communication and cross-functional collaboration skills",
    ],
    about:
      "Stripe is a financial infrastructure platform for businesses. Millions of companies — from the world's largest enterprises to the most ambitious startups — use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.",
    url: "https://stripe.com/jobs",
  },
  {
    id: "mock-2",
    title: "Full Stack Developer",
    company: "Notion",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    experience: "2+ years",
    postedAt: "Sep 4, 2026",
    matchScore: 87,
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    description:
      "We're looking for a Full Stack Developer to help us build and scale the Notion product. You'll work on features used by millions of people every day, with a focus on data integrity, real-time collaboration, and mobile-first experience.",
    requirements: [
      "3+ years of full-stack development experience",
      "Proficiency in React, Node.js, and PostgreSQL",
      "Experience with real-time data (WebSockets or similar)",
      "Passion for productivity software and great UX",
    ],
    about:
      "Notion is a new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.",
    url: "https://notion.so/jobs",
  },
  {
    id: "mock-3",
    title: "Backend Engineer — Python",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$160,000 - $220,000",
    experience: "3+ years",
    postedAt: "Sep 2, 2026",
    matchScore: 81,
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
    description:
      "OpenAI is seeking a Backend Engineer to help build and scale the infrastructure powering the world's most advanced AI systems. You'll work on APIs, data pipelines, and platform services used by millions of developers.",
    requirements: [
      "3+ years of Python backend development",
      "Experience with FastAPI or Django",
      "Proficiency in PostgreSQL and distributed systems",
      "Familiarity with cloud infrastructure (AWS, GCP, or Azure)",
    ],
    about:
      "OpenAI's mission is to ensure that artificial general intelligence benefits all of humanity.",
    url: "https://openai.com/careers",
  },
  {
    id: "mock-4",
    title: "React Developer",
    company: "Linear",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    experience: "2+ years",
    postedAt: "Sep 5, 2026",
    matchScore: 76,
    tags: ["React", "TypeScript", "GraphQL"],
    description:
      "Linear is looking for a React Developer who loves building fast, delightful user interfaces. You'll work directly with our design and product team to craft experiences that feel native and performant on every platform.",
    requirements: [
      "Strong React and TypeScript skills",
      "Eye for design and attention to detail",
      "Experience with animations and micro-interactions",
      "Self-starter who thrives in a remote environment",
    ],
    about:
      "Linear is the issue tracking tool built for high-performance teams. It has helped thousands of high-impact companies streamline software projects and hit their goals.",
    url: "https://linear.app/jobs",
  },
  {
    id: "mock-5",
    title: "DevOps Engineer",
    company: "Vercel",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    experience: "3+ years",
    postedAt: "Sep 1, 2026",
    matchScore: 68,
    tags: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    description:
      "Vercel is hiring a DevOps Engineer to strengthen our infrastructure reliability and deployment automation. You'll work on cloud infrastructure, CI/CD pipelines, monitoring, and incident response for one of the fastest-growing developer platforms.",
    requirements: [
      "Experience with Kubernetes and Docker at scale",
      "Strong AWS or GCP infrastructure knowledge",
      "Proficiency in Terraform or Pulumi",
      "Experience with observability tools (Datadog, Grafana, etc.)",
    ],
    about:
      "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
    url: "https://vercel.com/careers",
  },
  {
    id: "mock-6",
    title: "Data Scientist",
    company: "Figma",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    experience: "2+ years",
    postedAt: "Aug 31, 2026",
    matchScore: 62,
    tags: ["Python", "SQL", "Machine Learning", "Data Analysis"],
    description:
      "Join Figma's data team to uncover insights that shape product direction. You'll analyze user behavior, build predictive models, and partner with product managers and engineers to drive data-informed decisions.",
    requirements: [
      "3+ years of data science or analytics experience",
      "Proficiency in Python (pandas, scikit-learn) and SQL",
      "Experience with A/B testing and experimentation",
      "Strong communication of findings to non-technical stakeholders",
    ],
    about:
      "Figma is a design platform for teams who build products together. Born on the Web, Figma helps the entire product team create, test, and ship better designs from start to finish.",
    url: "https://figma.com/careers",
  },
  {
    id: "mock-7",
    title: "Product Designer",
    company: "Loom",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $145,000",
    experience: "2+ years",
    postedAt: "Aug 30, 2026",
    matchScore: 55,
    tags: ["Figma", "UX Research", "Design Systems", "Prototyping"],
    description:
      "Loom is looking for a Product Designer to own and evolve core experiences in our recording and sharing flow. You'll work closely with engineers and product managers to ship beautiful, intuitive features for our 20M+ users.",
    requirements: [
      "3+ years of product design experience",
      "Expert proficiency in Figma",
      "Experience conducting user research and usability testing",
      "Portfolio demonstrating thoughtful, end-to-end product work",
    ],
    about:
      "Loom is a video messaging tool that helps you get your message across through instantly shareable videos. Trusted by 20M+ users at 200,000+ companies.",
    url: "https://loom.com/careers",
  },
];
