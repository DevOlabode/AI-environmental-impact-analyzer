# AI Environmental Impact Analyzer

A web application that leverages AI to analyze the environmental footprint of consumer products. Users can input product details through forms, upload receipts via OCR, use voice input, and receive detailed sustainability reports with actionable insights.

## Features

- **AI-Powered Analysis**: Utilizes advanced machine learning algorithms to assess environmental impact including carbon footprint, water usage, and recyclability.
- **Product Recommendations**: AI-generated eco-friendly alternatives based on category, material, price, and sustainability score, displayed compactly in the product details section on the show page.
- **User Authentication**: Secure user accounts with Passport.js for personalized product tracking, including password reset via email verification.
- **Product Input Methods**:
  - Manual form input for product details
  - Receipt upload with OCR processing using Tesseract.js
  - Voice input for hands-free data entry
- **Product Management**: View, edit, and delete saved products with impact analysis.
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

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DevOlabode/AI-environmental-impact-analyzer.git
   cd AI-environmental-impact-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```
   SECRET=your-session-secret-here
   PORT=3000
   # Add other environment variables as needed (e.g., email service credentials)
   ```

4. **Start MongoDB**:
   Ensure MongoDB is running locally on port 27017, or update the connection string in `index.js`.

5. **Run the application**:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npx nodemon index.js
   ```

6. **Access the app**:
   Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or log in to access personalized features.
2. **Input Product Data**:
   - Use the form to manually enter product details
   - Upload a receipt image for automatic data extraction
   - Use voice input for quick data entry
3. **View Analysis**: See detailed environmental impact reports with sustainability scores and AI-recommended eco-friendly alternatives.
4. **Manage Products**: Edit, delete, or compare your saved products.
5. **Favorites**: Star products from the list or detail view, and access them quickly via the 'Favourites' link in the user menu.
6. **Dashboard**: Monitor your environmental impact trends and insights.

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- AI analysis powered by Groq
- OCR functionality provided by Tesseract.js
- Icons from Font Awesome
