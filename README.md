# SNS Institutions AI Education Landing Page

A professional single-page website for SNS Institutions showcasing AI and Machine Learning education programs in partnership with Analytics Vidhya. The website features an interactive 3D robot model, program showcases, and an enrollment form.

## Project Overview

This landing page was developed to promote SNS Institutions' flagship AI and ML education programs. The website combines modern web design with interactive 3D elements to create an engaging user experience for prospective students.

### Key Features

- Interactive 3D robot model powered by Spline
- Single-page responsive design
- Three flagship AI/ML program showcases
- Modal-based enrollment form
- Social media integration (Instagram, YouTube, LinkedIn)
- Shadow effects and smooth animations
- Mobile-responsive layout
- Custom color scheme matching brand identity

## Technology Stack

### Frontend Framework
- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5.0.0

### Libraries and Dependencies
- jQuery 3.4.1
- WOW.js (scroll animations)
- Animate.css (animation library)
- Easing.js (smooth scrolling effects)
- Waypoints.js (scroll-triggered events)
- Font Awesome 7.0.0 (icons)
- Bootstrap Icons
- Google Fonts (Josefin Sans, Work Sans)

### 3D Integration
- Spline 3D (embedded iframe for robot model)

### Version Control
- Git
- GitHub Repository

## Project Structure

```
landing/
│
├── css/
│   ├── bootstrap.min.css          # Bootstrap framework styles
│   ├── style.css                  # Main template stylesheet
│   └── custom-overrides.css       # Custom color and style overrides
│
├── img/
│   ├── logo.png                   # SNS Institutions logo
│   ├── blackbelt.jpg              # AI & ML Blackbelt program image
│   ├── av.png                     # Analytics Vidhya logo
│   └── [other image assets]
│
├── js/
│   └── main.js                    # Main JavaScript functionality
│
├── lib/
│   ├── animate/
│   │   ├── animate.css
│   │   └── animate.min.css
│   ├── easing/
│   │   ├── easing.js
│   │   └── easing.min.js
│   ├── waypoints/
│   │   └── waypoints.min.js
│   └── wow/
│       ├── wow.js
│       └── wow.min.js
│
├── index.html                     # Main landing page
├── README.md                      # Project documentation
├── LICENSE.txt                    # License information
└── .venv/                        # Python virtual environment (for development)
```

## Page Sections

### 1. Header Section
- SNS Institutions logo
- Enroll Now button with modal trigger
- Sticky navigation

### 2. Hero Section
- Full viewport 3D robot model (Spline embed)
- Interactive and auto-loading animation

### 3. Opening Section
- Introduction to SNS Institutions
- Partnership with Analytics Vidhya
- Image placeholder for additional content

### 4. GenZ Section
- Target audience messaging
- Benefits of the programs
- Image placeholder for additional content

### 5. Programs Section
Three flagship programs with individual showcases:

**Program 1: AI & ML BLACKBELT PLUS**
- Comprehensive AI and Machine Learning training
- Real-world project experience
- Portfolio development focus

**Program 2: GenAI PINNACLE PLUS**
- Generative AI specialization
- ChatGPT and AI tools mastery
- Creative AI applications

**Program 3: AGENTIC AI PIONEER**
- Autonomous AI systems
- Decision-making AI agents
- Cutting-edge AI research

### 6. Combined Information Section
- Certification from Western State University
- Mentor support details
- Call to action messaging

### 7. Footer Section
- Social media links (Instagram, YouTube, LinkedIn)
- Copyright information

### 8. Enrollment Modal
- Contact form with fields:
  - First Name
  - Last Name
  - Email Address
  - Phone Number
  - Message
  - Terms of Service agreement checkbox
  - Submit button

## Color Scheme

- Primary Background: #C7C6C3 (Light Gray)
- Accent Color: #ffcc00 (Gold/Yellow for CTA buttons)
- Text Color: #000000 (Black)
- Shadow Effects: rgba(0, 0, 0, 0.15-0.3)

## Design Features

### Visual Effects
- Shadow effects on content sections for depth
- Smooth scroll animations using WOW.js
- Hover effects on program containers
- Directional shadows on left/right program sections

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### Performance Optimizations
- Removed unused template libraries
- Optimized image loading
- Minified CSS and JavaScript where applicable
- Efficient 3D model loading

## Setup and Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional for development)
- Git (for version control)

### Installation Steps



2. Open the project:
   - Simply open `index.html` in a web browser, or
   - Use a local development server (recommended)

3. For local development server (Python):
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`

## Development Workflow

### File Modification Guidelines

**HTML (index.html)**
- Main structure and content
- Modal forms and popups
- Section organization

**CSS (custom-overrides.css)**
- Color customizations
- Typography overrides
- Custom component styling

**CSS (style.css)**
- Template base styles
- Layout structures
- Responsive breakpoints

### Making Changes

1. Edit content in `index.html`
2. Customize colors in `css/custom-overrides.css`
3. Test responsiveness across devices
4. Commit changes with descriptive messages
5. Push to repository

## Browser Compatibility

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Content Sources

### Text Content
- Extracted from `AV - (1).docx` document
- Partnership details: SNS Institutions + Analytics Vidhya
- Program descriptions aligned with institution offerings

### Images
- Logo: SNS Institutions official branding
- Program images: AI/ML themed graphics
- Placeholder sections for manual image insertion

### 3D Model
- Spline-designed robot character
- Hosted on Spline CDN
- Interactive and auto-loading

## Social Media Integration

- Instagram: https://www.instagram.com/snsinstitutions
- YouTube: https://youtube.com/@snsinstitutions
- LinkedIn: https://www.linkedin.com/school/snsinstitutions/

## Deployment

The website is deployed via GitHub Pages and can be accessed through the repository settings.

### Deployment Steps
1. Commit all changes to main branch
2. Push to GitHub repository
3. Configure GitHub Pages in repository settings
4. Access via provided GitHub Pages URL

## Version History

### Current Version
- Single-page design with 3D hero section
- Three program showcases
- Enrollment modal form
- Social media integration
- Custom color scheme implementation
- Shadow effects and animations

## Credits

### Template Base
- Original Template: ThemeWagon Poseify
- Modified and customized for SNS Institutions

### Content Partners
- SNS Institutions
- Analytics Vidhya
- Western State University

### Design Elements
- 3D Model: Spline Design Platform
- Icons: Font Awesome, Bootstrap Icons
- Fonts: Google Fonts

## License

This project is licensed under the terms specified in LICENSE.txt.

## Contact Information

For inquiries about the programs or website:
- Website: SNS Institutions Landing Page
- Social Media: Instagram, YouTube, LinkedIn (links in footer)

## Maintenance and Updates

### Regular Updates
- Content updates as programs evolve
- Image replacements in placeholder sections
- Form integration with backend systems
- Performance monitoring and optimization

### Future Enhancements
- Backend integration for form submissions
- Analytics tracking
- Additional program sections
- Video content integration
- Testimonials section
- Alumni success stories

---

**Last Updated:** January 2026  
**Maintained by:** SNS Institutions Development Team

Developed by: **Lokesh Kumar M S,Sriram R P**