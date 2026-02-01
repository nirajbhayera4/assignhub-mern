# AssignHub-mern

A premium, modern website for an assignment marketplace platform connecting students with expert helpers. Built with GSAP animations and ready for MERN stack integration.

## 🚀 Features

- **Premium Design**: Bold, modern aesthetic with distinctive typography
- **GSAP Animations**: Smooth, professional animations throughout
- **Fully Responsive**: Mobile-first design approach
- **Modular Architecture**: Separated CSS and JS files for easy maintenance
- **MERN Stack Ready**: Clean structure for backend integration
- **Performance Optimized**: Minimal dependencies, fast loading

## 📁 Project Structure

```
assignhub-landing/
├── index.html                 # Main HTML file
├── css/
│   ├── variables.css         # CSS custom properties (design tokens)
│   ├── base.css              # Reset, typography, utilities
│   ├── navigation.css        # Navigation bar styles
│   ├── hero.css              # Hero section styles
│   ├── stats.css             # Statistics section styles
│   ├── how-it-works.css      # Steps section styles
│   ├── features.css          # Features grid styles
│   ├── cta.css               # Call-to-action section styles
│   ├── footer.css            # Footer styles
│   └── responsive.css        # Mobile & tablet breakpoints
├── js/
│   ├── cursor.js             # Custom cursor animation
│   ├── navigation.js         # Navigation animations
│   ├── hero-animations.js    # Hero section GSAP animations
│   ├── stats-counter.js      # Animated statistics counter
│   ├── scroll-animations.js  # Scroll-triggered animations
│   └── smooth-scroll.js      # Smooth scroll navigation
├── assets/                   # Images, icons (to be added)
└── README.md                 # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with custom properties
- **JavaScript (ES6+)**: Vanilla JS for interactions
- **GSAP 3.12.5**: Animation library
- **Google Fonts**: Syne & JetBrains Mono

## 🎨 Design System

### Color Palette
```css
--primary: #0f0f0f      /* Black */
--accent: #00ff88       /* Neon Green */
--accent-2: #ff3366     /* Hot Pink */
--bg: #fafafa           /* Light Gray Background */
--text: #1a1a1a         /* Dark Text */
--text-light: #666      /* Light Text */
```

### Typography
- **Headings**: Syne (800, 700, 600)
- **Body**: Syne (400)
- **Monospace**: JetBrains Mono (500, 400)

## 📦 Getting Started

### 1. Basic Setup (Static)

Simply open `index.html` in a web browser:

```bash
# Navigate to project directory
cd assignhub-landing

# Open in default browser (macOS)
open index.html

# Or use a local server (recommended)
python -m http.server 8000
# Then visit: http://localhost:8000
```

### 2. Development Server

For a better development experience, use a local server:

```bash
# Using Node.js http-server
npx http-server -p 8000

# Using Python
python3 -m http.server 8000

# Using PHP
php -S localhost:8000
```

## 🔧 Integration with MERN Stack

### Step 1: Convert to React Components

The current structure makes it easy to convert to React:

1. **Create React App**
   ```bash
   npx create-react-app assignhub-frontend
   cd assignhub-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install gsap
   ```

3. **Component Structure**
   ```
   src/
   ├── components/
   │   ├── Navigation/
   │   │   ├── Navigation.jsx
   │   │   └── Navigation.css
   │   ├── Hero/
   │   │   ├── Hero.jsx
   │   │   └── Hero.css
   │   ├── Stats/
   │   ├── HowItWorks/
   │   ├── Features/
   │   ├── CTA/
   │   └── Footer/
   ├── styles/
   │   ├── variables.css
   │   └── base.css
   └── App.jsx
   ```

### Step 2: Backend Integration

1. **Create Express Server**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express mongoose cors dotenv
   ```

2. **API Endpoints to Create**
   - `POST /api/assignments` - Create new assignment
   - `GET /api/assignments` - Get all assignments
   - `POST /api/experts` - Register expert
   - `GET /api/experts` - Get experts list
   - `POST /api/auth/login` - User authentication
   - `POST /api/auth/register` - User registration

### Step 3: MongoDB Schema Examples

```javascript
// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  deadline: Date,
  budget: Number,
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in_progress', 'completed'] }
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'expert'] },
  rating: Number,
  completedAssignments: Number
});
```

## 🎯 Customization Guide

### Changing Colors

Edit `css/variables.css`:

```css
:root {
    --primary: #your-color;
    --accent: #your-accent;
    /* ... other variables */
}
```

### Modifying Animations

Edit the relevant JS file in the `js/` folder:

- **Speed**: Change `duration` values
- **Timing**: Adjust `ease` functions
- **Delays**: Modify `delay` properties

Example:
```javascript
// In js/hero-animations.js
gsap.from('.hero-text h1', {
    y: 100,
    opacity: 0,
    duration: 2,      // Slower animation
    delay: 0.5,       // More delay
    ease: 'elastic.out' // Different easing
});
```

### Adding New Sections

1. Create HTML in `index.html`
2. Create CSS file in `css/your-section.css`
3. Link CSS in `<head>` of index.html
4. Add animations in `js/scroll-animations.js`

## 📱 Responsive Breakpoints

- **Desktop**: > 968px
- **Tablet**: 577px - 968px
- **Mobile**: < 576px

## 🚀 Performance Tips

1. **Optimize Images**: Use WebP format, compress images
2. **Lazy Loading**: Add `loading="lazy"` to images
3. **Minify**: Use CSS/JS minification for production
4. **CDN**: Consider hosting fonts locally
5. **Code Splitting**: When converting to React

## 🔜 Future Enhancements

- [ ] Add mobile navigation menu (hamburger)
- [ ] Implement search functionality
- [ ] Add user authentication pages
- [ ] Create expert profile pages
- [ ] Build assignment posting form
- [ ] Add real-time chat interface
- [ ] Implement payment integration
- [ ] Add admin dashboard
- [ ] Create review/rating system
- [ ] Add notification system

## 📝 Best Practices Implemented

✅ Semantic HTML5  
✅ CSS Custom Properties  
✅ Modular CSS Architecture  
✅ Separated concerns (HTML/CSS/JS)  
✅ Mobile-first responsive design  
✅ Accessibility considerations  
✅ Performance optimized  
✅ Commented code  
✅ Consistent naming conventions  

## 🤝 Contributing

When adding new features:

1. Create new CSS file for new sections
2. Add animations in separate JS file
3. Update this README
4. Test on multiple devices
5. Ensure responsive behavior

## 📄 License

This project is created for educational and commercial use.

## 🙏 Credits

- **Fonts**: Google Fonts (Syne, JetBrains Mono)
- **Animation**: GSAP by GreenSock
- **Icons**: Emoji (can be replaced with icon library)

## 📞 Support

For questions or support:
- Create an issue in the repository
- Email: support@assignhub.com (update with your email)

---

**Made with ❤️ for AssignHub**


