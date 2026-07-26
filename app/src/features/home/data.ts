import { IoLogoJavascript } from 'react-icons/io5';
import { IoLogoReact } from 'react-icons/io5';
import { IoLogoNodejs } from 'react-icons/io5';
import { IoLogoFirebase } from 'react-icons/io5';
import { IoLogoWordpress } from 'react-icons/io5';
import { IoLogoHtml5 } from 'react-icons/io5';
import { IoLogoCss3 } from 'react-icons/io5';
import { IoLogoSass } from 'react-icons/io5';
import { IoLogoDocker } from 'react-icons/io5';
import { IoCodeSlashSharp } from 'react-icons/io5';
import { BiLogoMongodb } from 'react-icons/bi';
import { BiLogoTailwindCss } from 'react-icons/bi';
import { SiPhp } from 'react-icons/si';
import { SiMysql } from 'react-icons/si';
import { SiFlutter } from 'react-icons/si';
import { SiSanity } from 'react-icons/si';
import { SiComposer } from 'react-icons/si';
import { SiDart } from 'react-icons/si';
import { SiNextdotjs } from 'react-icons/si';
import { SiTraefikproxy } from 'react-icons/si';
import { SiExpress } from 'react-icons/si';
import { SiAxios } from 'react-icons/si';
import { SiBookstack } from 'react-icons/si';
import { FaGitAlt } from 'react-icons/fa';
import { FaCcStripe } from 'react-icons/fa';
import { FaDatabase } from 'react-icons/fa6';
import { VscVscode } from 'react-icons/vsc';
import { TbBrandFramerMotion } from 'react-icons/tb';
import { TbBrandRedux } from 'react-icons/tb';
import { TbDeviceImacCog } from 'react-icons/tb';
import { RiNpmjsFill } from 'react-icons/ri';
import { BsTools } from 'react-icons/bs';

import type { MenuItem } from '../../components/Menu';
import type { SocialLink } from '../../components/Socials';
import type { ExperienceEntry } from '../../components/Timeline';

import ecommerceImg from '../../assets/ecommerce.png';
import mernStackImg from '../../assets/mern-stack.jpg';
import firebaseAuthImg from '../../assets/firebase-auth.png';
import dockerImg from '../../assets/docker.png';

export const menuItems: MenuItem[] = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Resume', href: '/resume.pdf', external: true },
];

export const socials: SocialLink[] = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/itumulak', icon: 'linkedin' },
  { name: 'Github', url: 'https://github.com/itumulak', icon: 'github' },
];

export const languageStack = [
  { name: 'JavaScript', icon: IoLogoJavascript },
  { name: 'PHP', icon: SiPhp },
  { name: 'HTML', icon: IoLogoHtml5 },
  { name: 'CSS', icon: IoLogoCss3 },
  { name: 'Dart', icon: SiDart },
];

export const libraryStack = [
  { name: 'React', icon: IoLogoReact },
  { name: 'Flutter', icon: SiFlutter },
  { name: 'Node.js', icon: IoLogoNodejs },
  { name: 'Express.js', icon: SiExpress },
  { name: 'Tailwind CSS', icon: BiLogoTailwindCss },
  { name: 'Framer Motion', icon: TbBrandFramerMotion },
  { name: 'Redux', icon: TbBrandRedux },
  { name: 'Axios', icon: SiAxios },
  { name: 'Sass', icon: IoLogoSass },
  { name: 'Stripe', icon: FaCcStripe },
];

export const databaseStack = [
  { name: 'MySQL', icon: SiMysql },
  { name: 'MongoDB', icon: BiLogoMongodb },
  { name: 'Firebase', icon: IoLogoFirebase },
];

export const cmsStack = [
  { name: 'Wordpress', icon: IoLogoWordpress },
  { name: 'Sanity', icon: SiSanity },
];

export const toolStack = [
  { name: 'VS Code', icon: VscVscode },
  { name: 'Docker', icon: IoLogoDocker },
  { name: 'Git', icon: FaGitAlt },
  { name: 'NPM', icon: RiNpmjsFill },
  { name: 'Composer', icon: SiComposer },
  { name: 'Traefik Proxy', icon: SiTraefikproxy },
];

export const techStackIcons = {
  languages: IoCodeSlashSharp,
  libraries: SiBookstack,
  database: FaDatabase,
  cms: TbDeviceImacCog,
  tools: BsTools,
};

export const projects = [
  {
    name: 'E-commerce app',
    summary:
      'A Next.js e-commerce app that utilize multiple microservices. Sanity for storing product info, Firebase for sign-in/sign-up, Stripe for payments, and MongoDB for storing orders. This app combines multiple services to provide a coherent e-commerce experience.',
    links: [{ type: 'github' as const, url: 'https://github.com/itumulak/ecommerce-project' }],
    stacks: [
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'React', icon: IoLogoReact },
      { name: 'Redux', icon: TbBrandRedux },
      { name: 'Firebase', icon: IoLogoFirebase },
      { name: 'MongoDB', icon: BiLogoMongodb },
      { name: 'Sanity', icon: SiSanity },
      { name: 'Stripe', icon: FaCcStripe },
    ],
    src: ecommerceImg,
  },
  {
    name: 'Twitter-like app',
    summary:
      'This is a MERN stack project completely functional from the sign in, sign up, to the creation, edit, and deletion of post. This showcase my full stack development capabilities.',
    links: [
      { type: 'video' as const, url: 'https://youtu.be/stAdJjquk2Q?si=fGz8Y4XoZsI3Z_kh' },
      { type: 'website' as const, url: 'https://itumulak-mern-stack.vercel.app/' },
      { type: 'github' as const, url: 'https://github.com/itumulak/memories-mern-stack' },
    ],
    stacks: [
      { name: 'MongoDB', icon: BiLogoMongodb },
      { name: 'Express.js', icon: SiExpress },
      { name: 'React', icon: IoLogoReact },
      { name: 'Node.js', icon: IoLogoNodejs },
      { name: 'Axios', icon: SiAxios },
      { name: 'Redux', icon: TbBrandRedux },
      { name: 'Tailwind CSS', icon: BiLogoTailwindCss },
    ],
    src: mernStackImg,
  },
  {
    name: 'Single Sign-on with Firebase',
    summary:
      'This is a WordPress plugin that lets you sign in or sign up with Social media such as Google and Facebook. Firebase acts as the middleware for authentication.',
    links: [{ type: 'github' as const, url: 'https://github.com/itumulak/firebase-sso' }],
    stacks: [
      { name: 'WordPress', icon: IoLogoWordpress },
      { name: 'Firebase', icon: IoLogoFirebase },
      { name: 'MySQL', icon: SiMysql },
      { name: 'PHP', icon: SiPhp },
      { name: 'HTML', icon: IoLogoHtml5 },
      { name: 'CSS', icon: IoLogoCss3 },
      { name: 'Sass', icon: IoLogoSass },
      { name: 'React', icon: IoLogoReact },
    ],
    src: firebaseAuthImg,
  },
  {
    name: 'WordPress Instance with Docker',
    summary:
      "This is a template starter for WordPress projects with Docker compose. Let's you spin up WordPress, MySQL, and PHPMyAdmin. Traefik serves as a middleware for url proxy.",
    links: [
      {
        type: 'github' as const,
        url: 'https://github.com/itumulak/wordpress-traefik-docker-swarm',
      },
    ],
    stacks: [
      { name: 'WordPress', icon: IoLogoWordpress },
      { name: 'Docker', icon: IoLogoDocker },
      { name: 'Traefik', icon: SiTraefikproxy },
    ],
    src: dockerImg,
  },
];

export const experience: ExperienceEntry[] = [
  {
    position: 'TMT Insurance',
    title: 'Lead Developer',
    dateRange: 'Jan 2025 - Present',
    description:
      'I lead a small team of developers. I handle both internal and client facing projects. My key responsibilities includes: Leading multiple full-cycle development projects, provide mentoring and guidance to junior developers, conducting research, feasibility studies by defining project requirements and scopes, take a hands-on role as a Senior Full Stack Developer.',
    workLabel: 'Associated Work',
    pills: [
      { name: 'TMT Insurance', url: 'https://www.tmtinsurance.com/' },
      { name: 'Avocado VA', url: 'https://www.avocadova.com/' },
      { name: 'Avocado Online Tutors', url: 'https://turors.avocadova.com/' },
      { name: 'Houston Medical Group', url: 'https://houstonmedicalgroup.org/' },
    ],
  },
  {
    position: 'Imagine Web',
    title: 'Senior Full Stack Engineer',
    dateRange: 'Nov 2024 - Feb 2025',
    description:
      'My responsibility is maintaining and enhancing their existing enterprise Booking CMS. I have worked on various payment gateways integration particularly with Stripe, Basys, Clearview, and Square.',
    workLabel: 'Associated Work',
    pills: [
      { name: 'RV Business Tech', url: 'https://rvbusinesstech.com/' },
      { name: 'Ridge Park RV Camp Ground', url: 'https://ridgeparkrvcampground.com/' },
      { name: 'Jamaica Beach RV Resors', url: 'https://jamaicabeachrvresort.com/' },
    ],
  },
  {
    position: 'Upwork',
    title: 'WordPress Contractor',
    dateRange: 'Apr 2010 - Jul 2024',
    description:
      'I have taken odds jobs and long-term WordPress projects throughout the duration of my stay in the platform. The work spans from quick fixes, small-scale work, to the large-scale enterprise projects. I have to walk away from this platform since it is now overrun with bot applicants, fake job posts, and predatorial fees.',
    workLabel: 'Associated Work',
    pills: [
      { name: '99banners', url: 'https://99banners.com/' },
      { name: 'Talk to walle', url: 'https://talktowalle.com/' },
      { name: 'Volt Edge', url: 'https://www.voltedge.com.au/' },
      { name: 'Wake-up World', url: 'https://wakeupworld.com/' },
      { name: 'in8sync', url: 'https://in8sync.com/' },
      { name: 'HSC Coworks', url: 'https://hsccoworks.com.au/' },
      { name: 'Arrow Root Media', url: 'https://arrowrootmedia.com/' },
      { name: 'Distressed Pro', url: 'https://www.distressedpro.com/' },
      { name: 'The web craftsmen', url: 'https://thewebcraftsmen.com/' },
      { name: 'ND5 Media LLC', url: 'https://www.linkedin.com/company/nd5-media-llc/' },
      { name: 'Mosier Data', url: 'https://mosierdata.com/' },
    ],
  },
  {
    position: 'FireKamp',
    title: 'Web Engineer',
    dateRange: 'Oct 2022 - Dec 2023',
    description:
      'I am engaged in diverse projects spanning WordPress, Shopify, Kajabi, and React applications. My primary responsibility is frontend development, with occasional involvement in the backend.',
    workLabel: 'Associated Work',
    pills: [
      { name: 'Network Chuck', url: 'https://networkchuck.com/' },
      { name: 'Network Chuck Academy', url: 'https://academy.networkchuck.com/' },
      { name: 'Weco Hosipitality', url: 'https://wecohospitality.com/' },
    ],
  },
  {
    position: 'The Code Co.',
    title: 'Frontend Developer',
    dateRange: 'Feb 2021 - Oct 2021',
    description:
      'I worked as a front developer, converting Figma/XD designs into WordPress themes. My responsibility involves working with Gutenberg blocks, ACF Blocks, mobile responsiveness, speed optimization, and data migration from Drupal to WordPress.',
    workLabel: 'Associated Work',
    pills: [
      { name: 'Her Campus', url: 'https://hercampus.com/' },
      { name: 'Games Hub', url: 'https://gameshub.com/' },
      { name: 'One Mile at a time', url: 'https://onemileatatime.com/' },
    ],
  },
  {
    position: 'IDX Web Designs',
    title: 'Junior Web Developer',
    dateRange: 'Sep 2012 - Aug 2011',
    description:
      'I work as a junior web developer for the company. As a junior level, my obligation was to familiarize myself with Soholaunch, Joomla, and WordPress. I was also given small roles in web design. After leaving the company, I opted to specialize as a WordPress developer and pursued my career in freelancing. NOTE: This company is no longer operating.',
    workLabel: 'Associated Work',
    pills: [{ name: 'Carolina web consultants', url: 'https://internetpeople.net/' }],
  },
  {
    position: 'Try BPO Outsourcing Solutions',
    title: 'SEO Specialist, Part-time web developer',
    dateRange: 'Jun 2009 - Aug 2010',
    description:
      'I work as their virtual assistant SEO specialist from their parent company, eLocal.com. During my tenure as an employee, I was given a web development project. This oppurtunity resulted in shifting my career as a web developer. NOTE: This company pivots into empireflippers.com.',
  },
];
