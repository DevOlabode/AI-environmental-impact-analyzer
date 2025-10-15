# AI Environmental Impact Analyzer

A comprehensive web application that leverages AI to analyze the environmental footprint of consumer products. Users can input product details through multiple methods including manual forms, receipt uploads with OCR processing, and voice input. The application provides detailed sustainability reports, AI-generated eco-friendly product recommendations, and comprehensive analytics to help users make informed, environmentally conscious purchasing decisions.

## 🌟 Key Highlights

- **AI-Powered Sustainability Analysis**: Advanced machine learning algorithms assess carbon footprint, water usage, recyclability, and overall environmental impact
- **Multi-Modal Input**: Support for manual entry, receipt scanning, and voice commands
- **Personalized Recommendations**: AI suggests eco-friendly alternatives based on product characteristics
- **Comprehensive Dashboard**: Track environmental impact trends, category breakdowns, and sustainability goals
- **User-Centric Design**: Responsive interface with dark mode, favorites system, and bulk operations

## Features

- **AI-Powered Analysis**: Utilizes advanced machine learning algorithms to assess environmental impact including carbon footprint, water usage, and recyclability.
- **Product Recommendations**: AI-generated eco-friendly alternatives based on category, material, price, and sustainability score, displayed compactly in the product details section on the show page.
- **User Authentication**: Secure user accounts with Passport.js for personalized product tracking, including password reset via email verification.
- **Product Input Methods**:
  - Manual form input for product details
  - Receipt upload with OCR processing using Tesseract.js
  - Voice input for hands-free data entry
- **Product Management**: View, edit, and delete saved products with impact analysis.
- **Bulk Delete**: Select multiple products from the product list and delete them all at once for efficient management.
- **Favorites/Bookmarks**: Star important products for quick access and view them in a dedicated 'Favourites' page with search and filter options.
- **Comparison Tool**: Compare environmental impacts between different products.
- **Dashboard**: Comprehensive analytics including total CO2 footprint over time, category breakdown, monthly comparisons, and identification of top environmental impact products.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing in different lighting conditions.
- **Responsive Design**: Mobile-friendly interface with modern CSS and animations.
- **Security**: Rate limiting, input sanitization, and CSRF protection.

## Technologies Used

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **Passport.js** for authentication
- **Groq SDK** for AI analysis
- **Tesseract.js** for OCR on receipts
- **Multer** for file uploads
- **Nodemailer** for email services

### Frontend
- **EJS** templating engine with **ejs-mate**
- **CSS3** with custom properties and animations
- **JavaScript** for client-side interactions
- **Font Awesome** for icons

### Security & Utilities
- **Helmet** for security headers
- **express-rate-limit** for API rate limiting
- **express-mongo-sanitize** for MongoDB injection prevention
- **Joi** for input validation
- **connect-flash** for flash messages

## Live Demo

You can access the live demo [here](https://ai-environmental-impact-analyzer-3.onrender.com/)


## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git** for version control

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DevOlabode/AI-environmental-impact-analyzer.git
   cd AI-environmental-impact-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will install all required packages including Express, Mongoose, Passport, Groq SDK, and other dependencies.

3. **Environment Configuration**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Application Settings
   SECRET=your-super-secure-session-secret-here
   PORT=3000

   # Database Configuration
   DATABASE_URL=mongodb://localhost:27017/ai-environmental-analyzer

   # AI Service (Groq)
   GROQ_KEY=your-groq-api-key-here

   # Email Service (for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Optional: Cloudinary for image storage (if using cloud uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_KEY=your-api-key
   CLOUDINARY_SECRET=your-api-secret
   ```

4. **Database Setup**:
   - **Local MongoDB**: Ensure MongoDB is running on port 27017
   - **MongoDB Atlas**: Update `DATABASE_URL` with your Atlas connection string
   - The application will automatically create collections when first run

5. **AI Service Setup**:
   - Sign up for [Groq](https://groq.com/) and get your API key
   - Add the key to your `.env` file as `GROQ_KEY`

6. **Run the application**:
   ```bash
   # Production mode
   npm start

   # Development mode (with auto-restart)
   npx nodemon index.js
   ```

7. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

### Troubleshooting
- **Port already in use**: Change the PORT in `.env` or kill the process using that port
- **MongoDB connection error**: Verify MongoDB is running and connection string is correct
- **AI service errors**: Check your Groq API key and internet connection

## Usage Guide

### Getting Started
1. **Create Account**: Register with your email and password to access personalized features like saving products and viewing analytics.

2. **Dashboard Overview**: After logging in, visit your dashboard to see:
   - Total environmental impact summary
   - Monthly trends and comparisons
   - Category-wise breakdown of your consumption
   - Top impact products identification

### Adding Products

#### Method 1: Manual Entry
- Navigate to "Add Product" from the main menu
- Fill in product details: name, brand, category, material, weight, origin country, price
- Submit to get instant AI analysis and recommendations

#### Method 2: Receipt Upload
- Go to "Upload Receipt" section
- Upload a clear image of your receipt
- AI automatically extracts product information using OCR
- Review and confirm extracted data before saving

#### Method 3: Voice Input
- Access "Voice Input" feature
- Speak product details clearly
- AI transcribes and processes your voice input
- Review transcribed data and submit for analysis

### Understanding Analysis Results

Each product analysis includes:
- **Sustainability Score** (1-10): Overall environmental rating
- **Carbon Footprint**: CO2 emissions in kg
- **Water Usage**: Water consumption in liters
- **Recyclability**: Low/Medium/High rating
- **AI Explanation**: Detailed reasoning for the scores

### Managing Your Products

#### Product List View
- Browse all your analyzed products
- Search by name, brand, or category
- Filter by category or brand
- Sort by date, sustainability score, or impact

#### Favorites System
- Star important products for quick access
- View dedicated favorites page with same search/filter capabilities
- Toggle favorite status from product detail or list view

#### Bulk Operations
- Select multiple products using checkboxes
- Delete multiple products at once
- Efficient management for large product collections

### Advanced Features

#### Product Comparison
- Select multiple products to compare side-by-side
- View detailed environmental metrics comparison
- Identify which products have better sustainability profiles

#### Edit & Update
- Modify product details after initial analysis
- Re-run AI analysis with updated information
- Update impact calculations automatically

### Best Practices

1. **Accurate Data Entry**: Provide as much detail as possible for better analysis accuracy
2. **Regular Monitoring**: Use the dashboard to track your environmental impact over time
3. **Eco-Friendly Choices**: Review AI recommendations to make sustainable purchasing decisions
4. **Data Management**: Regularly review and clean up old/unnecessary product entries

### Troubleshooting

- **Analysis Errors**: Ensure all required fields are filled and data is realistic
- **Upload Issues**: Check image quality for receipt uploads (clear, well-lit images work best)
- **Voice Recognition**: Speak clearly and in a quiet environment for best transcription results
- **Performance**: Large product collections may load slower; consider archiving old entries

## Project Structure

```
AI-environmental-impact-analyzer/
├── controllers/          # Route handlers
│   ├── auth.js
│   ├── comparison.js
│   ├── dashboard.js
│   ├── form.js
│   ├── receipt.js
│   ├── user.js
│   └── voiceInput.js
├── models/               # Mongoose schemas
│   ├── impact.js
│   ├── product.js
│   └── user.js
├── public/               # Frontend CSS and JS Code
│   ├── css/
│   ├── images/
│   └── js/
├── routes/               # Express routes
│   ├── auth.js
│   ├── comparison.js
│   ├── dashboard.js
│   ├── form.js
│   ├── receipt.js
│   ├── user.js
│   └── voiceInput.js
├── utils/                # Utility functions
│   ├── AI.js
│   ├── catchAsync.js
│   ├── emailService.js
│   ├── expressError.js
│   ├── mongoSanitizev5.js
│   └── multer.js
├── views/                # EJS templates
│   ├── auth/
│   ├── comparison/
│   ├── dashboard/
│   ├── form/
│   ├── layout/
│   ├── partials/
│   ├── receipt/
│   ├── user/
│   └── voiceInput/
├── middleware.js         # Custom middleware
├── schema.js            # Validation schemas
├── index.js             # Main application file
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Home page
- `GET /register` - User registration
- `POST /register` - Register new user
- `GET /login` - User login
- `POST /login` - Authenticate user
- `GET /logout` - Logout user
- `GET /form` - Product input form
- `POST /form/input` - Submit product data
- `GET /form/all-products` - View all user products
- `GET /form/show-products/:id` - View specific product
- `GET /form/edit/:id` - Edit product form
- `PUT /form/edit/:id` - Update product
- `DELETE /form/delete/:id` - Delete product
- `POST /form/toggle-favorite/:id` - Toggle favorite status for a product
- `GET /form/favorites` - View favorited products
- `GET /receipt` - Receipt upload page
- `POST /receipt/upload` - Process receipt upload
- `GET /comparison` - Product comparison page
- `POST /comparison/compare` - Compare products
- `GET /dashboard` - User dashboard
- `GET /user/profile` - User profile
- `PUT /user/profile` - Update profile
- `GET /voice-input` - Voice input page

## Development & Deployment

### Development Workflow

1. **Local Development**:
   ```bash
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Testing**:
   - Test AI analysis with various product types
   - Verify OCR accuracy with different receipt formats
   - Check responsive design across devices
   - Validate form inputs and error handling

3. **Code Quality**:
   - Follow ESLint configuration for JavaScript
   - Use consistent naming conventions
   - Add JSDoc comments for complex functions
   - Validate all environment variables

### Deployment Options

#### Option 1: Render (Recommended)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on git push
4. Use MongoDB Atlas for database

#### Option 2: Heroku
1. Create Heroku app
2. Set buildpacks for Node.js
3. Configure environment variables
4. Deploy via git push or GitHub integration

#### Option 3: DigitalOcean App Platform
1. Connect repository
2. Configure environment variables
3. Set up MongoDB database
4. Deploy with automatic SSL

### Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SECRET` | Session secret key | Yes | - |
| `PORT` | Server port | No | 3000 |
| `DATABASE_URL` | MongoDB connection string | Yes | - |
| `GROQ_KEY` | Groq AI API key | Yes | - |
| `EMAIL_HOST` | SMTP host | No | - |
| `EMAIL_PORT` | SMTP port | No | 587 |
| `EMAIL_USER` | SMTP username | No | - |
| `EMAIL_PASS` | SMTP password | No | - |

### Performance Optimization

- **Database Indexing**: Ensure proper indexes on frequently queried fields
- **Image Optimization**: Compress receipt images before upload
- **Caching**: Implement Redis for session storage in production
- **Rate Limiting**: Configure appropriate limits for AI API calls
- **CDN**: Use CDN for static assets in production

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Test thoroughly on different devices and browsers
5. Commit with clear, descriptive messages

### Contribution Guidelines
- **Code Style**: Follow existing code patterns and ESLint rules
- **Documentation**: Update README and add JSDoc comments for new functions
- **Testing**: Test all new features across different input methods
- **Security**: Ensure no security vulnerabilities are introduced
- **Performance**: Optimize for speed and efficiency

### Pull Request Process
1. Update the README.md with details of changes if needed
2. Ensure all tests pass and no linting errors
3. Provide clear description of the changes and their purpose
4. Wait for review and address any feedback

### Areas for Contribution
- **AI Model Improvements**: Enhance analysis accuracy and add new metrics
- **UI/UX Enhancements**: Improve responsive design and user experience
- **New Features**: Additional input methods or analysis categories
- **Performance Optimization**: Database queries, API calls, and frontend rendering
- **Internationalization**: Multi-language support
- **Accessibility**: WCAG compliance improvements

## Security Considerations

- **API Keys**: Never commit API keys to version control
- **Input Validation**: All user inputs are validated using Joi schemas
- **Rate Limiting**: API endpoints are protected against abuse
- **Data Sanitization**: MongoDB injection prevention implemented
- **Session Security**: Secure session configuration with httpOnly cookies
- **CSRF Protection**: All forms protected against cross-site request forgery

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Documentation**: Check the wiki for detailed guides

## Acknowledgments

- **AI Analysis**: Powered by [Groq](https://groq.com/) for fast, efficient AI processing
- **OCR Functionality**: [Tesseract.js](https://tesseract.projectnaptha.com/) for receipt text extraction
- **Icons**: [Font Awesome](https://fontawesome.com/) for beautiful, consistent iconography
- **UI Framework**: Custom CSS with modern design principles
- **Community**: Thanks to all contributors and users for their support and feedback

---

**Made with ❤️ for a sustainable future**
