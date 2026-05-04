import type { ResumeData } from '../types';

export const exampleResume: ResumeData = {
  header: {
    name: 'Muhammad Fezan',
    title: 'Full Stack Developer',
    email: 'm.fezan@example.com',
    phone: '+92 300 1234567',
    location: 'Lahore, Pakistan',
    linkedin: 'linkedin.com/in/muhammadfezan',
    github: 'github.com/fezan',
    website: 'fezan.dev',
    availability: ['Full-time', 'Remote', 'Open to Relocate'],
  },
  summary:
    'Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and delivering exceptional user experiences. Proficient in React, Node.js, TypeScript, and cloud technologies.',
  experience: [
    {
      id: 'exp_1',
      company: 'TechCorp Solutions',
      role: 'Senior Full Stack Developer',
      location: 'Lahore, Pakistan',
      startDate: 'Jan 2022',
      endDate: 'Present',
      bullets: [
        'Led development of a microservices-based e-commerce platform serving 50K+ daily users',
        'Reduced API response time by 40% through query optimization and caching strategies',
        'Mentored 4 junior developers and established code review best practices',
        'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
      ],
    },
    {
      id: 'exp_2',
      company: 'StartupXYZ',
      role: 'Full Stack Developer',
      location: 'Remote',
      startDate: 'Jun 2020',
      endDate: 'Dec 2021',
      bullets: [
        'Built real-time collaboration features using WebSockets for a SaaS product',
        'Developed RESTful APIs with Node.js and Express handling 10K+ requests/min',
        'Created responsive React components with TypeScript and Tailwind CSS',
        'Integrated third-party payment systems (Stripe, PayPal) processing $500K+ monthly',
      ],
    },
    {
      id: 'exp_3',
      company: 'WebAgency Pro',
      role: 'Frontend Developer',
      location: 'Lahore, Pakistan',
      startDate: 'Mar 2019',
      endDate: 'May 2020',
      bullets: [
        'Developed 15+ responsive client websites using React and modern CSS',
        'Improved Lighthouse performance scores from 45 to 90+ across all projects',
        'Collaborated with UX designers to implement pixel-perfect interfaces',
        'Introduced component-based architecture reducing code duplication by 60%',
      ],
    },
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Engineering and Technology',
      location: 'Lahore, Pakistan',
      gpa: '3.5/4.0',
      startDate: '2015',
      endDate: '2019',
    },
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'E-Commerce Platform',
      link: 'github.com/fezan/ecommerce',
      startDate: '2023',
      endDate: '2024',
      description:
        'Full-stack e-commerce platform with real-time inventory, payment processing, and admin dashboard.',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
    },
    {
      id: 'proj_2',
      name: 'Task Management App',
      link: 'github.com/fezan/taskmanager',
      startDate: '2022',
      endDate: '2023',
      description:
        'Collaborative task management tool with real-time updates, drag-and-drop, and team workspaces.',
      techStack: ['TypeScript', 'Next.js', 'Prisma', 'WebSocket'],
    },
    {
      id: 'proj_3',
      name: 'AI Resume Builder',
      startDate: '2024',
      endDate: 'Present',
      description:
        'Client-side resume builder with live preview, multiple templates, and PDF export.',
      techStack: ['React', 'Vite', '@react-pdf/renderer', 'Tailwind CSS'],
    },
  ],
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'Python'],
    },
    {
      category: 'Database',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'],
    },
    {
      category: 'DevOps & Tools',
      items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Vercel', 'Linux'],
    },
  ],
  awards: [
    {
      id: 'award_1',
      title: 'Best Final Year Project',
      issuer: 'University of Engineering and Technology',
      date: '2019',
      description: 'Recognized for building an AI-powered code review tool.',
    },
    {
      id: 'award_2',
      title: 'Hackathon Winner',
      issuer: 'TechFest Lahore',
      date: '2021',
      description: 'First place for building a real-time disaster response coordination app.',
    },
  ],
};
