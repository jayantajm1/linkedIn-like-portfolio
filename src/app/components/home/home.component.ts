import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { VisitorTrackingService } from "../../services/visitor-tracking.service";

interface PostLink {
  title: string;
  description: string;
  url: string;
  github?: string;
  isArticle?: boolean;
}

interface Post {
  id: number;
  type: string;
  author: string;
  headline: string;
  avatar: string;
  timestamp: string;
  content: string;
  tags: string[];
  image?: string | null;
  link?: PostLink | null;
  likes: number;
  comments: number;
  shares: number;
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  isDarkTheme = false;
  profileViewers = 1234;
  postImpressions = 5678;

  posts: Post[] = [
    {
      id: 1,
      type: "project",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "2 days ago",
      content:
        " Excited to share: Community Events India Platform\n\nA community-driven events platform where community leaders/hosts can create events (with photos, description, registration), members join events with their community ID, comment and ask questions, search events by location/type, and where admins moderate and close events after completion.\n\n Key Features:\n Event creation with multimedia support\n Community-based registration system\n Location and type-based search\n Interactive comments and Q&A\n Admin moderation tools",
      tags: ["#Angular", "#AspNetCore", "#PostgreSQL", "#CommunityBuilding"],
      image: "assets/images/community-event-ind.jpg",
      link: {
        title: "Community Events India - Live Demo",
        description:
          "Check out the live platform for community-driven events management",
        url: "https://community-event.netlify.app",
        github: "https://github.com/jayantajm1/community-event-ind-ui",
      },
      likes: 234,
      comments: 42,
      shares: 28,
    },
    {
      id: 2,
      type: "project",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "5 days ago",
      content:
        " Web Tools Collection - Your All-in-One Developer Toolkit\n\nBuilt a comprehensive collection of useful web-based tools including converters, generators, and utilities for developers and designers.\n\n Perfect for:\n Quick format conversions\n Code generation\n Data transformation\n Developer utilities\n\nAll tools work offline and respect your privacy! ",
      tags: ["#JavaScript", "#WebTools", "#OpenSource", "#Productivity"],
      image: "assets/images/webtools.jpg",
      link: {
        title: "Web Tools Collection",
        description: "Useful web-based utilities for developers and designers",
        url: "https://jayantajm1.github.io/web-tools/",
        github: "https://github.com/jayantajm1/web-tools",
      },
      likes: 189,
      comments: 31,
      shares: 22,
    },
    {
      id: 3,
      type: "project",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "1 week ago",
      content:
        " Job Notifier - Never Miss an Opportunity!\n\nAn automated job notification system that alerts users about new job postings based on their preferences and criteria.\n\n Features:\n Automated job scraping\n Custom preference filters\n Real-time notifications\n Multi-platform support\n\nHelping job seekers stay ahead of the curve! ",
      tags: ["#Python", "#Automation", "#WebScraping", "#JobSearch"],
      image: "assets/images/job-notifier.jpg",
      link: {
        title: "Job Notifier - GitHub Repository",
        description:
          "Automated job notification system with preference-based filtering",
        url: "https://github.com/jayantajm1/Job-Notifier",
        github: "https://github.com/jayantajm1/Job-Notifier",
      },
      likes: 312,
      comments: 47,
      shares: 35,
    },
    {
      id: 4,
      type: "project",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "2 weeks ago",
      content:
        " Tritoybox - Your Comprehensive Toolkit Application\n\nA comprehensive toolkit application providing various utility tools and features for daily productivity and development tasks.\n\n Includes:\n Productivity tools\n Development utilities\n Quick converters\n Resource generators\n\nStreamlining your workflow, one tool at a time! ",
      tags: ["#React", "#NodeJS", "#MongoDB", "#ProductivityTools"],
      image: "assets/images/tritoybox.jpg",
      link: {
        title: "Tritoybox - Live Application",
        description: "Comprehensive toolkit for productivity and development",
        url: "https://jayantajm1.github.io/TriToyBox/",
        github: "https://github.com/jayantajm1/TriToyBox",
      },
      likes: 245,
      comments: 38,
      shares: 19,
    },
    {
      id: 5,
      type: "project",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "3 weeks ago",
      content:
        " Fun Proposal - Make Your Moment Special!\n\nAn interactive and creative web application designed for making memorable proposals with animations and engaging UI elements.\n\n Features:\n Beautiful animations\n Interactive elements\n Personalized experience\n Mobile responsive\n\nBecause special moments deserve special presentation! ",
      tags: ["#JavaScript", "#CSS3", "#Animation", "#Creative"],
      image: "assets/images/fun-proposal.jpg",
      link: {
        title: "Fun Proposal - Live Demo",
        description:
          "Interactive proposal application with beautiful animations",
        url: "https://fun-project-85yv.onrender.com/",
        github: "https://github.com/jayantajm1/fun-project",
      },
      likes: 428,
      comments: 89,
      shares: 61,
    },
    {
      id: 6,
      type: "achievement",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "1 month ago",
      content:
        " Proud to announce that our team successfully delivered the ePension platform!\n\n Impact:\n 100+ production APIs\n 20,000+ active users\n 30% reduction in defects\n Zero downtime in 6 months\n\nThanks to my amazing team at NIC for this incredible journey! ",
      tags: ["#TeamWork", "#Achievement", "#eGovernance", "#Success"],
      image: null,
      link: null,
      likes: 567,
      comments: 89,
      shares: 42,
    },
    {
      id: 7,
      type: "article",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "2 days ago",
      content:
        " New Article: An Ultimate Guide to Web Application Development\n\nWeb applications are pivotal for business growth, efficiency, and user experience. This comprehensive guide explores:\n\n Key Topics:\n Modern web architecture patterns\n Choosing the right tech stack\n Performance optimization strategies\n Security best practices\n Scalability considerations\n\nPerfect for CEOs, business owners, and developers looking to understand web development from a strategic perspective! ",
      tags: ["#WebDevelopment", "#JavaScript", "#Angular", "#DotNetCore"],
      image: "assets/images/web-app-blog.jpg",
      link: {
        title: "An Ultimate Guide to Web Application Development",
        description: "Comprehensive guide on building modern web applications",
        url: "#web-dev-blog",
        isArticle: true,
      },
      likes: 892,
      comments: 145,
      shares: 203,
    },
    {
      id: 8,
      type: "article",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "2 weeks ago",
      content:
        " New Article: Cybersecurity in Modern Applications\n\nIn today'''s digital landscape, security isn'''t optional—it'''s essential. Here'''s what every developer needs to know:\n\n Essential Practices:\n Implementing authentication & authorization\n Protecting against common vulnerabilities (OWASP Top 10)\n Secure API development\n Data encryption strategies\n Security testing & monitoring\n\nBuild secure, resilient applications that protect your users and your business! ",
      tags: ["#Cybersecurity", "#Security", "#DevSecOps", "#BestPractices"],
      image: "assets/images/cyber-security-blog.jpg",
      link: {
        title: "Cybersecurity in Modern Applications",
        description: "Essential security practices for developers",
        url: "#cyber-security-blog",
        isArticle: true,
      },
      likes: 734,
      comments: 98,
      shares: 156,
    },
    {
      id: 9,
      type: "article",
      author: "Jayanta Mardi",
      headline: "Software Developer at National Informatics Centre",
      avatar: "assets/images/index.jpg",
      timestamp: "3 days ago",
      content:
        " New Tool: HP WiFi Fixer Pro\n\nTired of WiFi connectivity issues on your HP Pavilion laptop? I'''ve got you covered!\n\n Features:\n Automatic driver cleanup\n Network reset automation\n Quick troubleshooting\n 5-minute fix guaranteed\n\nNo more endless troubleshooting—get back online fast! ",
      tags: ["#Tools", "#Windows", "#Networking", "#Productivity"],
      image: "assets/images/hp-wifi-fixer.jpg",
      link: {
        title: "Fix HP Pavilion WiFi Issues in 5 Minutes",
        description: "Automated tool for HP WiFi connectivity problems",
        url: "#hp-wifi-fixer",
        isArticle: true,
      },
      likes: 456,
      comments: 67,
      shares: 89,
    },
  ];

  // Modal states
  showExperienceModal = false;
  showEducationModal = false;
  showAboutModal = false;
  showContactModal = false;
  showPostModal = false;
  showResumeModal = false;
  showChatAssistant = false;

  // Chat messages array
  chatMessages: { type: "user" | "bot"; content: string }[] = [
    {
      type: "bot",
      content:
        "👋 Hi! I'm your portfolio assistant. How can I help you today? Ask me about skills, experience, projects, or anything else!",
    },
  ];
  chatInput = "";

  // Chat Q&A Database
  private chatbotQA: { [key: string]: { keywords: string[]; answer: string } } =
    {
      greetings: {
        keywords: ["hi", "hello", "hlw", "hey", "hello there"],
        answer:
          "Hello 👋 I'm your quick assistant. How can I help you today? Ask me about my skills, experience, projects, or anything else you'd like to know.",
      },
      skills: {
        keywords: [
          "skill",
          "technology",
          "tech",
          "stack",
          "what can you do",
          "technologies",
        ],
        answer:
          "I specialize in: ASP.NET Core, Angular, PostgreSQL, Docker, RabbitMQ, C#, JavaScript, EF Core, Redis, and OpenTelemetry. I build scalable full-stack applications with clean architecture.",
      },
      experience: {
        keywords: ["experience", "work", "job", "career", "worked", "working"],
        answer:
          "I'm currently working as a Software Developer at National Informatics Centre (NIC), Kolkata, building e-Governance applications. I have 1+ year of professional experience in full-stack development.",
      },
      projects: {
        keywords: ["project", "portfolio", "work samples", "github", "built"],
        answer:
          "I've built several projects including Community Events India (event management platform), Job Notifier (automated job alerts), Feedback Management System, and HP WiFi Fixer Pro. Check out my GitHub at github.com/jayantajm1",
      },
      education: {
        keywords: [
          "education",
          "degree",
          "college",
          "university",
          "study",
          "studied",
        ],
        answer:
          "I hold a Bachelor of Computer Application (BCA) from Raiganj University (2020-2023) with a CGPA of 8.67. I also completed 12th from WBCHSE (85.6%) and 10th from WBBSE (76.14%).",
      },
      contact: {
        keywords: [
          "contact",
          "email",
          "reach",
          "connect",
          "hire",
          "collaboration",
        ],
        answer:
          "You can reach me via email or connect with me on LinkedIn at linkedin.com/in/mardijm/. I'm always open to interesting opportunities and collaborations!",
      },
      location: {
        keywords: ["location", "where", "based", "from", "live"],
        answer: "I'm based in Kolkata, India.",
      },
      linkedin: {
        keywords: ["linkedin", "social", "profile", "network"],
        answer:
          "Connect with me on LinkedIn at linkedin.com/in/mardijm/ to stay updated with my professional journey, posts, and achievements!",
      },
    };

  constructor(private visitorTracking: VisitorTrackingService) {}

  ngOnInit(): void {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.isDarkTheme = true;
      document.documentElement.setAttribute("data-theme", "dark");
    }

    // Update profile viewers from visitor tracking
    this.visitorTracking.visitors$.subscribe((visitors) => {
      this.profileViewers = visitors.length;
    });
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const theme = this.isDarkTheme ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // Modal methods
  openExperienceModal(): void {
    this.showExperienceModal = true;
  }

  closeExperienceModal(): void {
    this.showExperienceModal = false;
  }

  openEducationModal(): void {
    this.showEducationModal = true;
  }

  closeEducationModal(): void {
    this.showEducationModal = false;
  }

  openAboutModal(): void {
    this.showAboutModal = true;
  }

  closeAboutModal(): void {
    this.showAboutModal = false;
  }

  openContactModal(): void {
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }

  openPostModal(): void {
    this.showPostModal = true;
  }

  closePostModal(): void {
    this.showPostModal = false;
  }

  // Post interactions
  toggleLike(post: Post): void {
    // Toggle like - in real app this would call an API
    post.likes = post.likes + (Math.random() > 0.5 ? 1 : -1);
  }

  // Privacy/Terms alerts
  showPrivacy(): void {
    alert(
      "Privacy Policy: Your data is secure and never shared with third parties."
    );
  }

  showTerms(): void {
    alert(
      "Terms of Service: By using this portfolio, you agree to professional conduct standards."
    );
  }

  // Resume Modal Methods
  openResumeModal(): void {
    this.showResumeModal = true;
  }

  closeResumeModal(): void {
    this.showResumeModal = false;
  }

  // Chat Assistant Methods
  openChatAssistant(): void {
    this.showChatAssistant = true;
    this.chatMessages = [
      {
        type: "bot",
        content:
          "👋 Hi! I'm your portfolio assistant. How can I help you today? Ask me about skills, experience, projects, or anything else!",
      },
    ];
    this.chatInput = "";
  }

  closeChatAssistant(): void {
    this.showChatAssistant = false;
  }

  askQuestion(question: string): void {
    this.chatMessages.push({ type: "user", content: question });
    setTimeout(() => {
      const answer = this.findChatAnswer(question);
      this.chatMessages.push({ type: "bot", content: answer });
    }, 500);
  }

  sendChatMessage(): void {
    const message = this.chatInput.trim();
    if (!message) return;

    this.chatMessages.push({ type: "user", content: message });
    this.chatInput = "";

    setTimeout(() => {
      const answer = this.findChatAnswer(message);
      this.chatMessages.push({ type: "bot", content: answer });
    }, 500);
  }

  private findChatAnswer(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, qa] of Object.entries(this.chatbotQA)) {
      for (const keyword of qa.keywords) {
        if (lowerMessage.includes(keyword)) {
          return qa.answer;
        }
      }
    }

    return "I'm not sure about that. Try asking about my skills, experience, projects, education, or how to contact me!";
  }
}
