# Task 4 --- Full-Stack Application Development Plan

## 1. Project Overview

### Recommended Case Study

**Business Inventory & Order Management System**

The project will transform a real-world inventory and order management
problem into a complete database-driven full-stack web application.

The system will allow businesses to manage:

-   Products
-   Categories
-   Suppliers
-   Customers
-   Purchases
-   Sales orders
-   Order items
-   Stock
-   Payments
-   Users and roles

The application will use:

-   **Backend:** Django
-   **API:** Django REST Framework
-   **Frontend:** React
-   **Database:** PostgreSQL or SQLite during development
-   **Version Control:** Git + GitHub

The project will be designed from requirements first rather than
generating an application first and documenting it afterward.

------------------------------------------------------------------------

# 2. Project Objectives

The main objectives are to:

1.  Analyze a real-world business problem.
2.  Identify the required entities and relationships.
3.  Design a normalized relational database.
4.  Create a complete ERD.
5.  Implement the database using Django Models.
6.  Build REST APIs using Django REST Framework.
7.  Develop a React frontend.
8.  Connect React with the Django backend.
9.  Implement authentication and authorization.
10. Implement CRUD operations.
11. Demonstrate one-to-one, one-to-many, and many-to-many relationships
    where appropriate.
12. Test the complete system.
13. Document the design and implementation.
14. Maintain the project properly on GitHub.

------------------------------------------------------------------------

# 3. Development Philosophy

The project must demonstrate understanding rather than simply
demonstrate generated code.

For every major implementation decision, the project documentation
should be able to answer:

-   Why was this table required?
-   Why was this attribute included?
-   Why is this the primary key?
-   Why is this field a foreign key?
-   Why does this relationship exist?
-   Why was a many-to-many relationship resolved using an intermediate
    table?
-   Why was a particular API structure chosen?
-   How does Django represent the database?
-   How does React communicate with Django?
-   How does authentication work?
-   What happens when a user creates, updates, or deletes data?

The development process will therefore follow:

``` text
Case Study
    ↓
Problem Statement
    ↓
Requirements
    ↓
Entities
    ↓
Attributes
    ↓
Relationships
    ↓
Database Tables
    ↓
ERD
    ↓
System Architecture
    ↓
API Design
    ↓
Django Models
    ↓
Django REST APIs
    ↓
React Frontend
    ↓
Frontend–Backend Integration
    ↓
Testing
    ↓
Documentation
    ↓
GitHub Submission
```

------------------------------------------------------------------------

# 4. Case Study

## 4.1 Case Study Title

**Business Inventory & Order Management System**

## 4.2 Business Context

Small and medium-sized businesses often need to manage products,
suppliers, purchases, customers, sales orders, stock levels, and
payments.

If these activities are managed manually through spreadsheets or
disconnected systems, businesses may experience:

-   Incorrect stock levels
-   Duplicate records
-   Difficulty tracking purchases
-   Difficulty tracking customer orders
-   Poor visibility of low-stock products
-   Manual calculation errors
-   Difficulty finding transaction history
-   Lack of centralized reporting

The proposed system centralizes these activities into a single
database-driven web application.

------------------------------------------------------------------------

# 5. Problem Statement

Businesses need a centralized system that allows authorized staff to
manage inventory and sales operations efficiently.

The system should allow users to maintain product information,
categorize products, manage suppliers and customers, record purchases,
process sales orders, update stock, record payments, and monitor
business activity through a dashboard.

The application should reduce manual data management and provide
consistent, relationally structured information.

------------------------------------------------------------------------

# 6. Target Users

The system will initially support two main user roles.

## 6.1 Administrator

The administrator can:

-   Log in
-   Manage users
-   Manage products
-   Manage categories
-   Manage suppliers
-   Manage customers
-   View purchases
-   View sales
-   View stock
-   View payments
-   View dashboard statistics

## 6.2 Staff

Staff members can:

-   Log in
-   View products
-   Create and manage customers
-   Create sales orders
-   Record purchases where permitted
-   View stock
-   View order history

Administrative actions can be restricted using permissions.

------------------------------------------------------------------------

# 7. Functional Requirements

## Authentication

The system should:

-   Allow users to log in.
-   Authenticate users securely.
-   Allow users to log out.
-   Restrict unauthorized API access.
-   Support role-based permissions where required.

## Product Management

Users with appropriate permissions should be able to:

-   Create products.
-   View products.
-   Update products.
-   Delete products.
-   Search products.
-   Filter products by category.
-   View stock levels.

## Category Management

Users should be able to:

-   Create categories.
-   View categories.
-   Update categories.
-   Delete categories.
-   View products belonging to a category.

## Supplier Management

Users should be able to:

-   Create suppliers.
-   View suppliers.
-   Update suppliers.
-   Delete suppliers.
-   View supplier purchase history.

## Customer Management

Users should be able to:

-   Create customers.
-   View customers.
-   Update customers.
-   Delete customers.
-   View customer order history.

## Purchase Management

The system should allow users to:

-   Create purchase orders.
-   Select suppliers.
-   Add products to purchases.
-   Specify quantities.
-   Record purchase prices.
-   Confirm purchases.
-   Increase stock after a confirmed purchase.

## Sales Order Management

The system should allow users to:

-   Create customer orders.
-   Add products to an order.
-   Specify quantities.
-   Check available stock.
-   Calculate order totals.
-   Confirm orders.
-   Reduce stock after a confirmed order.

## Payment Management

The system should allow:

-   Recording payments.
-   Associating payments with sales orders.
-   Tracking payment status.
-   Viewing payment history.

## Dashboard

The dashboard should display useful information such as:

-   Total products
-   Total customers
-   Total suppliers
-   Current stock
-   Low-stock products
-   Total sales
-   Recent orders
-   Recent purchases

------------------------------------------------------------------------

# 8. Non-Functional Requirements

## Performance

The application should return normal API requests quickly and avoid
unnecessary database queries.

## Security

The application should:

-   Require authentication for protected operations.
-   Validate user input.
-   Restrict unauthorized operations.
-   Avoid exposing sensitive information.

## Usability

The interface should:

-   Be easy to navigate.
-   Use clear forms.
-   Provide validation messages.
-   Provide feedback after successful operations.
-   Use consistent UI components.

## Responsiveness

The React interface should work on:

-   Desktop
-   Tablet
-   Mobile-sized screens

## Maintainability

The project should use:

-   Clear folder structures.
-   Reusable React components.
-   Organized Django applications.
-   Meaningful variable and function names.
-   Git commits that represent logical development stages.

------------------------------------------------------------------------

# 9. Database Entity Analysis

The initial database design will contain the following major entities.

  Entity          Purpose
  --------------- ----------------------------------------------------
  User            Stores system users and authentication information
  Category        Groups products
  Product         Stores products sold by the business
  Supplier        Stores supplier information
  Customer        Stores customer information
  PurchaseOrder   Represents purchases made from suppliers
  PurchaseItem    Represents products contained in a purchase
  SalesOrder      Represents orders placed by customers
  OrderItem       Represents products contained in a sales order
  Stock           Stores current inventory information
  Payment         Stores payment information associated with sales

------------------------------------------------------------------------

# 10. Proposed Database Tables

## 10.1 User

Possible attributes:

-   `id` --- Primary Key
-   `username`
-   `email`
-   `password`
-   `role`
-   `is_active`
-   `date_joined`

Django's built-in user/authentication system should be considered
instead of unnecessarily recreating password management.

------------------------------------------------------------------------

## 10.2 Category

Attributes:

-   `id` --- Primary Key
-   `name`
-   `description`
-   `created_at`

------------------------------------------------------------------------

## 10.3 Product

Attributes:

-   `id` --- Primary Key
-   `category_id` --- Foreign Key
-   `name`
-   `sku`
-   `description`
-   `price`
-   `cost_price`
-   `reorder_level`
-   `created_at`
-   `updated_at`

Relationship:

``` text
Category 1 ───────────< Product
```

One category can contain many products.

------------------------------------------------------------------------

## 10.4 Supplier

Attributes:

-   `id` --- Primary Key
-   `name`
-   `email`
-   `phone`
-   `address`
-   `created_at`

------------------------------------------------------------------------

## 10.5 Customer

Attributes:

-   `id` --- Primary Key
-   `name`
-   `email`
-   `phone`
-   `address`
-   `created_at`

------------------------------------------------------------------------

## 10.6 PurchaseOrder

Attributes:

-   `id` --- Primary Key
-   `supplier_id` --- Foreign Key
-   `created_by_id` --- Foreign Key
-   `order_date`
-   `status`
-   `total_amount`

Relationship:

``` text
Supplier 1 ───────────< PurchaseOrder
User     1 ───────────< PurchaseOrder
```

A supplier can have many purchase orders.

A user can create many purchase orders.

------------------------------------------------------------------------

## 10.7 PurchaseItem

Attributes:

-   `id` --- Primary Key
-   `purchase_order_id` --- Foreign Key
-   `product_id` --- Foreign Key
-   `quantity`
-   `unit_cost`
-   `subtotal`

Relationship:

``` text
PurchaseOrder 1 ───< PurchaseItem >─── 1 Product
```

This table resolves the many-to-many relationship between purchase
orders and products.

------------------------------------------------------------------------

## 10.8 SalesOrder

Attributes:

-   `id` --- Primary Key
-   `customer_id` --- Foreign Key
-   `created_by_id` --- Foreign Key
-   `order_date`
-   `status`
-   `total_amount`

Relationship:

``` text
Customer 1 ───────────< SalesOrder
User     1 ───────────< SalesOrder
```

------------------------------------------------------------------------

## 10.9 OrderItem

Attributes:

-   `id` --- Primary Key
-   `sales_order_id` --- Foreign Key
-   `product_id` --- Foreign Key
-   `quantity`
-   `unit_price`
-   `subtotal`

Relationship:

``` text
SalesOrder 1 ───< OrderItem >─── 1 Product
```

This resolves the many-to-many relationship between sales orders and
products.

------------------------------------------------------------------------

## 10.10 Stock

Attributes:

-   `id` --- Primary Key
-   `product_id` --- Foreign Key
-   `quantity`
-   `updated_at`

Relationship:

``` text
Product 1 ─────────── 1 Stock
```

A product has one current stock record.

The database should enforce uniqueness on `product_id`.

------------------------------------------------------------------------

## 10.11 Payment

Attributes:

-   `id` --- Primary Key
-   `sales_order_id` --- Foreign Key
-   `amount`
-   `payment_method`
-   `status`
-   `payment_date`

Depending on the final business rules, one order can either have:

``` text
SalesOrder 1 ─────────── 1 Payment
```

or:

``` text
SalesOrder 1 ───────────< Payment
```

The second option is more flexible if partial payments or multiple
payments are required.

------------------------------------------------------------------------

# 11. Relationship Analysis

## One-to-One

Recommended example:

``` text
Product 1 ─────────── 1 Stock
```

A product should have one current stock record.

Django implementation can use a `OneToOneField`.

## One-to-Many

Examples:

``` text
Category 1 ───────────< Product

Supplier 1 ───────────< PurchaseOrder

Customer 1 ───────────< SalesOrder

SalesOrder 1 ─────────< OrderItem

PurchaseOrder 1 ─────< PurchaseItem
```

These relationships will normally be represented using Django
`ForeignKey`.

## Many-to-Many

Conceptually:

``` text
SalesOrder >────────< Product
```

An order can contain multiple products and a product can exist in
multiple orders.

Instead of directly storing a many-to-many relationship, the system
uses:

``` text
SalesOrder
     │
     ▼
 OrderItem
     │
     ▼
 Product
```

This is necessary because `OrderItem` contains additional information
such as:

-   Quantity
-   Unit price
-   Subtotal

The same concept applies to purchases:

``` text
PurchaseOrder
     │
     ▼
PurchaseItem
     │
     ▼
 Product
```

------------------------------------------------------------------------

# 12. ERD Plan

The ERD should be created using a tool such as:

-   draw.io
-   dbdiagram.io
-   Lucidchart
-   Microsoft Visio

The final ERD must clearly display:

-   Entity names
-   Attributes
-   Primary keys
-   Foreign keys
-   Relationship cardinality

A conceptual structure is:

``` text
                         ┌──────────────┐
                         │   Category   │
                         └──────┬───────┘
                                │ 1
                                │
                                │ *
                         ┌──────▼───────┐
                         │   Product    │
                         └──┬───────┬───┘
                            │       │
                         1:1│       │1
                            │       │
                     ┌──────▼──┐ ┌──▼──────┐
                     │  Stock  │ │Purchase │
                     └─────────┘ │ / Sales │
                                 └─────────┘

Supplier ─────< PurchaseOrder ─────< PurchaseItem >──── Product

Customer ─────< SalesOrder ─────────< OrderItem >─────── Product

SalesOrder ─────< Payment
```

The actual ERD should be created graphically and included in the final
documentation.

------------------------------------------------------------------------

# 13. System Architecture

The application will follow a client-server architecture.

``` text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│ Pages                        │
│ Components                   │
│ Forms                        │
│ Routing                      │
│ API Services                 │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               │
┌──────────────▼───────────────┐
│      Django REST API         │
│                              │
│ URLs                         │
│ Views / ViewSets             │
│ Serializers                  │
│ Authentication               │
│ Permissions                  │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│       Django Models          │
│                              │
│ Database Relationships       │
│ Validation                   │
│ Business Logic               │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│          Database            │
└──────────────────────────────┘
```

------------------------------------------------------------------------

# 14. API Architecture

The backend should expose RESTful endpoints.

## Authentication

Possible endpoints:

``` text
POST /api/auth/login/
POST /api/auth/logout/
GET  /api/auth/me/
```

If token or JWT authentication is used, the authentication flow should
be documented.

## Categories

``` text
GET    /api/categories/
POST   /api/categories/
GET    /api/categories/<id>/
PUT    /api/categories/<id>/
PATCH  /api/categories/<id>/
DELETE /api/categories/<id>/
```

## Products

``` text
GET    /api/products/
POST   /api/products/
GET    /api/products/<id>/
PUT    /api/products/<id>/
PATCH  /api/products/<id>/
DELETE /api/products/<id>/
```

## Suppliers

``` text
GET    /api/suppliers/
POST   /api/suppliers/
GET    /api/suppliers/<id>/
PUT    /api/suppliers/<id>/
DELETE /api/suppliers/<id>/
```

## Customers

``` text
GET    /api/customers/
POST   /api/customers/
GET    /api/customers/<id>/
PUT    /api/customers/<id>/
DELETE /api/customers/<id>/
```

## Purchases

``` text
GET    /api/purchases/
POST   /api/purchases/
GET    /api/purchases/<id>/
PUT    /api/purchases/<id>/
DELETE /api/purchases/<id>/
```

## Sales Orders

``` text
GET    /api/orders/
POST   /api/orders/
GET    /api/orders/<id>/
PUT    /api/orders/<id>/
DELETE /api/orders/<id>/
```

## Stock

``` text
GET    /api/stock/
GET    /api/stock/<id>/
```

Stock should preferably be updated through controlled purchase/order
operations rather than allowing arbitrary stock modification from the
frontend.

## Payments

``` text
GET    /api/payments/
POST   /api/payments/
GET    /api/payments/<id>/
```

------------------------------------------------------------------------

# 15. Backend Development Plan

## Step 1 --- Create Django Project

Create the Django project and one or more logical applications.

Possible structure:

``` text
backend/
├── manage.py
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── accounts/
├── inventory/
├── orders/
└── requirements.txt
```

The exact app separation can be adjusted after requirements analysis.

## Step 2 --- Configure Database

Configure:

-   Database engine
-   Environment variables
-   Installed apps
-   Django REST Framework
-   Authentication
-   CORS configuration for React

Sensitive configuration should not be committed to GitHub.

## Step 3 --- Implement Models

Create Django models corresponding to the finalized ERD.

The model structure must match the database design.

Examples:

``` python
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
```

``` python
class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products"
    )
    name = models.CharField(max_length=150)
    sku = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
```

The final implementation should use the relationship decisions
established during database design.

## Step 4 --- Migrations

Run:

``` text
python manage.py makemigrations
python manage.py migrate
```

Verify the generated database structure.

## Step 5 --- Serializers

Create serializers for API communication.

Serializers should:

-   Convert model instances to JSON.
-   Convert validated JSON into model instances.
-   Validate incoming data.
-   Represent relationships appropriately.

## Step 6 --- API Views

Implement:

-   List operations
-   Detail operations
-   Create operations
-   Update operations
-   Delete operations
-   Business-specific operations

Use ViewSets where they make the API simpler and consistent.

## Step 7 --- URLs

Configure:

``` text
config/urls.py
```

and application-level routes.

## Step 8 --- Authentication

Implement authentication and permissions.

Protected endpoints should reject unauthorized requests.

------------------------------------------------------------------------

# 16. Business Logic

The most important business rules should be implemented on the backend.

## Purchase Rule

When a purchase is confirmed:

``` text
Purchase Confirmed
       ↓
Read PurchaseItems
       ↓
For each Product
       ↓
Increase Stock
       ↓
Save Updated Stock
```

## Sales Rule

When a sales order is confirmed:

``` text
Order Submitted
       ↓
Check Stock
       ↓
Is quantity available?
      / \
    No   Yes
    ↓     ↓
 Reject  Confirm Order
          ↓
       Reduce Stock
          ↓
       Calculate Total
          ↓
       Save Order
```

The backend should perform stock validation rather than trusting values
sent by React.

------------------------------------------------------------------------

# 17. React Frontend Plan

Possible structure:

``` text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
└── package.json
```

------------------------------------------------------------------------

# 18. React Pages

## Authentication

``` text
Login
```

## Dashboard

``` text
Dashboard
```

## Products

``` text
Products
Add Product
Edit Product
Product Details
```

## Categories

``` text
Categories
Add Category
Edit Category
```

## Suppliers

``` text
Suppliers
Add Supplier
Edit Supplier
Supplier Details
```

## Customers

``` text
Customers
Add Customer
Edit Customer
Customer Details
```

## Purchases

``` text
Purchases
Create Purchase
Purchase Details
```

## Orders

``` text
Orders
Create Order
Order Details
```

## Stock

``` text
Stock
Low Stock
```

## Payments

``` text
Payments
Payment Details
```

------------------------------------------------------------------------

# 19. Reusable React Components

Create reusable components such as:

``` text
Navbar
Sidebar
DashboardCard
DataTable
SearchBar
FilterBar
Modal
FormInput
SelectInput
Button
LoadingSpinner
ErrorMessage
ConfirmationDialog
Pagination
```

Avoid duplicating the same UI logic across multiple pages.

------------------------------------------------------------------------

# 20. API Integration

Create a centralized API service layer.

Conceptually:

``` text
React Component
      ↓
API Service
      ↓
HTTP Request
      ↓
Django REST API
      ↓
Database
```

For example:

``` text
ProductPage
     ↓
productService.getProducts()
     ↓
GET /api/products/
     ↓
Django
     ↓
JSON response
     ↓
React state
     ↓
Product table
```

The frontend should not communicate directly with the database.

------------------------------------------------------------------------

# 21. Frontend State

The project should maintain appropriate state for:

-   Authentication
-   Current user
-   Products
-   Categories
-   Customers
-   Suppliers
-   Orders
-   Form data
-   Loading state
-   Error state

The exact state management approach can remain simple unless the
application becomes large enough to justify a dedicated library.

------------------------------------------------------------------------

# 22. UI/UX Plan

The interface should prioritize:

-   Clear navigation
-   Consistent spacing
-   Consistent typography
-   Readable tables
-   Clear action buttons
-   Form validation
-   Loading states
-   Empty states
-   Error states
-   Success feedback
-   Responsive layouts

The dashboard should visually communicate important business information
without becoming unnecessarily complex.

------------------------------------------------------------------------

# 23. Application Flow

## Login Flow

``` text
User
 ↓
Login Page
 ↓
Enter Credentials
 ↓
React sends API request
 ↓
Django authenticates
 ↓
Authentication response
 ↓
React stores authentication state
 ↓
Dashboard
```

## Product Creation Flow

``` text
User
 ↓
Products Page
 ↓
Add Product
 ↓
Fill Form
 ↓
Client Validation
 ↓
POST /api/products/
 ↓
Django Serializer Validation
 ↓
Django Model
 ↓
Database
 ↓
JSON Response
 ↓
React Updates UI
```

## Sales Flow

``` text
Customer Selected
       ↓
Products Selected
       ↓
Quantities Entered
       ↓
React sends order
       ↓
Django validates order
       ↓
Check stock
       ↓
Calculate totals
       ↓
Create SalesOrder
       ↓
Create OrderItems
       ↓
Update Stock
       ↓
Record Payment if applicable
       ↓
Return response
       ↓
React displays confirmation
```

------------------------------------------------------------------------

# 24. State Diagram

A state diagram should be created for an entity where status changes are
meaningful.

## Sales Order State

Possible states:

``` text
             ┌──────────┐
             │  Draft   │
             └────┬─────┘
                  │
                  ▼
             ┌──────────┐
             │ Pending  │
             └────┬─────┘
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
     ┌──────────┐     ┌───────────┐
     │ Confirmed│     │ Cancelled │
     └────┬─────┘     └───────────┘
          │
          ▼
     ┌──────────┐
     │ Completed│
     └──────────┘
```

The final state model should match the actual implementation.

------------------------------------------------------------------------

# 25. Testing Strategy

Testing should cover both backend and frontend behavior.

## Backend Testing

Test:

-   Model creation
-   Required fields
-   Unique constraints
-   Foreign key behavior
-   Serializer validation
-   API GET
-   API POST
-   API PUT/PATCH
-   API DELETE
-   Authentication
-   Permissions
-   Stock calculations
-   Order calculations

## Frontend Testing

Test:

-   Page navigation
-   Form submission
-   Validation
-   API loading
-   API errors
-   Successful creation
-   Successful updates
-   Delete confirmation
-   Authentication behavior
-   Responsive layouts

## Integration Testing

Test complete workflows.

Example:

``` text
Create Product
      ↓
Create Supplier
      ↓
Create Purchase
      ↓
Confirm Purchase
      ↓
Check Stock
      ↓
Create Customer
      ↓
Create Sales Order
      ↓
Confirm Order
      ↓
Check Stock Again
      ↓
Record Payment
```

------------------------------------------------------------------------

# 26. Test Case Format

Document testing using a table similar to:

  --------------------------------------------------------------------------
  Test ID     Feature     Input         Expected     Actual      Status
                                        Result       Result      
  ----------- ----------- ------------- ------------ ----------- -----------
  T001        Login       Valid         User logged  As expected Pass
                          credentials   in                       

  T002        Login       Invalid       Error        As expected Pass
                          credentials   displayed                

  T003        Product     Valid product Product      As expected Pass
                          data          created                  

  T004        Product     Duplicate SKU Validation   As expected Pass
                                        error                    

  T005        Order       Quantity      Order        As expected Pass
                          within stock  created                  

  T006        Order       Quantity      Order        As expected Pass
                          above stock   rejected                 

  T007        Purchase    Confirm       Stock        As expected Pass
                          purchase      increases                
  --------------------------------------------------------------------------

The final table should contain actual tests performed on the finished
application.

------------------------------------------------------------------------

# 27. GitHub Strategy

Create a dedicated repository.

Suggested repository name:

``` text
task-4-inventory-management-system
```

Suggested structure:

``` text
task-4-inventory-management-system/
├── backend/
├── frontend/
├── docs/
├── screenshots/
├── README.md
└── .gitignore
```

Do not commit:

``` text
.env
database files containing sensitive data
node_modules/
venv/
__pycache__/
build artifacts where unnecessary
secret keys
API credentials
```

------------------------------------------------------------------------

# 28. Git Commit Strategy

Commits should be regular and meaningful.

Example progression:

``` text
Initial project setup
Create Django backend
Configure database
Add category and product models
Add supplier and customer models
Add purchase models
Add sales order models
Add stock and payment models
Create database migrations
Implement serializers
Implement product APIs
Implement supplier APIs
Implement customer APIs
Implement purchase APIs
Implement order APIs
Implement authentication
Create React application
Create dashboard
Create product management UI
Create supplier management UI
Create customer management UI
Create purchase UI
Create sales UI
Integrate APIs
Add validation
Improve responsive UI
Add tests
Update documentation
Final cleanup
```

Avoid making one enormous commit containing the entire application.

------------------------------------------------------------------------

# 29. GitHub Collaborator

The repository must include:

``` text
AlinaBaber
```

as a GitHub collaborator.

Before submission, verify that the collaborator has actually been added
and that the repository permissions are correct.

------------------------------------------------------------------------

# 30. README Structure

The GitHub README should include:

``` text
# Business Inventory & Order Management System

## Project Overview

## Problem Statement

## Features

## Technology Stack

## System Architecture

## Database Design

## ERD

## API Documentation

## Installation

## Backend Setup

## Frontend Setup

## Environment Variables

## Running the Application

## Testing

## Screenshots

## Project Structure

## Future Improvements

## Contributors
```

The README should contain enough information for another developer to
understand and run the project.

------------------------------------------------------------------------

# 31. Documentation Structure

The final Google Drive documentation should follow this structure:

## 1. Introduction

Explain the project and its purpose.

## 2. Case Study

Explain the business scenario.

## 3. Problem Statement

Explain the business problem being solved.

## 4. Objectives

List project goals.

## 5. Requirements

Document functional and non-functional requirements.

## 6. Users and Roles

Explain administrator and staff capabilities.

## 7. Database Analysis

For every table explain:

-   Purpose
-   Attributes
-   Primary key
-   Foreign keys
-   Relationships
-   Reason for existence

## 8. ERD

Insert the final ERD.

## 9. Relationship Explanation

Explicitly explain:

-   One-to-one
-   One-to-many
-   Many-to-many

## 10. System Architecture

Insert architecture diagram.

## 11. API Architecture

Explain how the REST API works.

## 12. API Endpoints

Document important endpoints and their methods.

## 13. Application Flow

Insert flow diagrams.

## 14. State Diagram

Insert order state diagram.

## 15. Django Backend

Explain:

-   Models
-   Serializers
-   Views
-   URLs
-   Authentication
-   Permissions

## 16. React Frontend

Explain:

-   Pages
-   Components
-   Forms
-   Routing
-   API services
-   State

## 17. Integration

Explain how React communicates with Django.

## 18. Testing

Include test cases and results.

## 19. Screenshots

Include screenshots of major pages.

## 20. Results

Explain what the final application successfully accomplishes.

## 21. Challenges and Solutions

Document important implementation problems and how they were solved.

## 22. Future Improvements

Mention realistic future features.

## 23. GitHub Repository

Provide the repository link.

## 24. Conclusion

Summarize the project.

------------------------------------------------------------------------

# 32. Screenshot Requirements

Capture screenshots of at least:

1.  Login page
2.  Dashboard
3.  Product list
4.  Product creation/edit form
5.  Category management
6.  Supplier management
7.  Customer management
8.  Purchase creation
9.  Sales order creation
10. Stock management
11. Payment management
12. A successful transaction
13. A validation/error example
14. Responsive/mobile layout if implemented

Screenshots should demonstrate actual functionality rather than only
showing empty pages.

------------------------------------------------------------------------

# 33. Demonstration Video Plan

If a demonstration video is submitted, keep it focused.

Suggested sequence:

``` text
1. Introduce project
2. Explain problem
3. Login
4. Show dashboard
5. Create/view product
6. Create supplier
7. Create purchase
8. Demonstrate stock increase
9. Create customer
10. Create sales order
11. Demonstrate stock decrease
12. Record payment
13. Show API/database functionality briefly
14. Show final result
```

The video should demonstrate a complete business workflow.

------------------------------------------------------------------------

# 34. Development Phases

## Phase 1 --- Research and Case Study

Tasks:

-   [ ] Finalize case study.
-   [ ] Define business scenario.
-   [ ] Write problem statement.
-   [ ] Identify target users.
-   [ ] Identify functional requirements.
-   [ ] Identify non-functional requirements.

Deliverable:

**Requirements document**

------------------------------------------------------------------------

## Phase 2 --- Database Design

Tasks:

-   [ ] Identify entities.
-   [ ] Identify attributes.
-   [ ] Define primary keys.
-   [ ] Define foreign keys.
-   [ ] Identify one-to-one relationships.
-   [ ] Identify one-to-many relationships.
-   [ ] Identify many-to-many relationships.
-   [ ] Normalize tables.
-   [ ] Create ERD.
-   [ ] Review ERD against requirements.

Deliverable:

**Final ERD + database table analysis**

------------------------------------------------------------------------

## Phase 3 --- System Architecture

Tasks:

-   [ ] Design system architecture.
-   [ ] Design API architecture.
-   [ ] Design application flow.
-   [ ] Design order state diagram.
-   [ ] Define API endpoints.
-   [ ] Decide authentication approach.

Deliverable:

**Architecture and API design**

------------------------------------------------------------------------

## Phase 4 --- Django Backend

Tasks:

-   [ ] Create Django project.
-   [ ] Configure database.
-   [ ] Configure Django REST Framework.
-   [ ] Configure CORS.
-   [ ] Implement models.
-   [ ] Run migrations.
-   [ ] Implement serializers.
-   [ ] Implement views/viewsets.
-   [ ] Implement URLs.
-   [ ] Implement authentication.
-   [ ] Implement permissions.
-   [ ] Implement business logic.
-   [ ] Test APIs.

Deliverable:

**Working Django REST backend**

------------------------------------------------------------------------

## Phase 5 --- React Frontend

Tasks:

-   [ ] Create React project.
-   [ ] Configure routing.
-   [ ] Create layout.
-   [ ] Create navigation.
-   [ ] Create dashboard.
-   [ ] Create product pages.
-   [ ] Create category pages.
-   [ ] Create supplier pages.
-   [ ] Create customer pages.
-   [ ] Create purchase pages.
-   [ ] Create order pages.
-   [ ] Create stock pages.
-   [ ] Create payment pages.
-   [ ] Create reusable components.
-   [ ] Add responsive design.

Deliverable:

**Working React frontend**

------------------------------------------------------------------------

## Phase 6 --- Integration

Tasks:

-   [ ] Connect login to Django.
-   [ ] Connect product APIs.
-   [ ] Connect category APIs.
-   [ ] Connect supplier APIs.
-   [ ] Connect customer APIs.
-   [ ] Connect purchase APIs.
-   [ ] Connect order APIs.
-   [ ] Connect stock APIs.
-   [ ] Connect payment APIs.
-   [ ] Handle loading states.
-   [ ] Handle API errors.
-   [ ] Handle successful operations.

Deliverable:

**Complete full-stack application**

------------------------------------------------------------------------

## Phase 7 --- Testing

Tasks:

-   [ ] Test authentication.
-   [ ] Test CRUD operations.
-   [ ] Test relationships.
-   [ ] Test validation.
-   [ ] Test stock calculations.
-   [ ] Test order calculations.
-   [ ] Test permissions.
-   [ ] Test frontend workflows.
-   [ ] Test responsive behavior.
-   [ ] Record test results.

Deliverable:

**Testing report**

------------------------------------------------------------------------

## Phase 8 --- Documentation

Tasks:

-   [ ] Finalize case study.
-   [ ] Finalize problem statement.
-   [ ] Finalize requirements.
-   [ ] Add database analysis.
-   [ ] Add ERD.
-   [ ] Add architecture diagram.
-   [ ] Add API architecture.
-   [ ] Add flow diagram.
-   [ ] Add state diagram.
-   [ ] Explain Django backend.
-   [ ] Explain React frontend.
-   [ ] Add screenshots.
-   [ ] Add testing results.
-   [ ] Add challenges and solutions.
-   [ ] Add conclusion.

Deliverable:

**Final documentation**

------------------------------------------------------------------------

## Phase 9 --- GitHub and Submission

Tasks:

-   [ ] Create dedicated GitHub repository.
-   [ ] Push backend.
-   [ ] Push frontend.
-   [ ] Add README.
-   [ ] Add `.gitignore`.
-   [ ] Verify commit history.
-   [ ] Add `AlinaBaber` as collaborator.
-   [ ] Verify repository can be accessed.
-   [ ] Upload documentation to Google Drive.
-   [ ] Add screenshots.
-   [ ] Record demonstration video if required.
-   [ ] Submit Google Drive documentation link.
-   [ ] Submit GitHub repository link.

Deliverable:

**Final submission package**

------------------------------------------------------------------------

# 35. Definition of Done

The project should only be considered complete when all of the following
are true:

-   [ ] The case study is clearly defined.
-   [ ] The problem statement is documented.
-   [ ] Requirements are documented.
-   [ ] Database entities are justified.
-   [ ] Tables are finalized.
-   [ ] Primary and foreign keys are defined.
-   [ ] Relationships are justified.
-   [ ] ERD is complete.
-   [ ] Django models match the ERD.
-   [ ] Database migrations work.
-   [ ] REST APIs are functional.
-   [ ] Authentication works.
-   [ ] Permissions work.
-   [ ] CRUD operations work.
-   [ ] Business logic works.
-   [ ] React frontend is functional.
-   [ ] React communicates with Django through APIs.
-   [ ] Forms work.
-   [ ] Validation works.
-   [ ] Stock calculations work.
-   [ ] Order calculations work.
-   [ ] Application is reasonably responsive.
-   [ ] Testing has been completed.
-   [ ] Screenshots have been captured.
-   [ ] Documentation is complete.
-   [ ] README is complete.
-   [ ] GitHub repository is organized.
-   [ ] `AlinaBaber` has been added as collaborator.
-   [ ] Google Drive documentation is uploaded.
-   [ ] Final submission links are ready.

------------------------------------------------------------------------

# 36. Final Submission Checklist

## Google Drive

-   [ ] Final documentation PDF/document
-   [ ] ERD
-   [ ] Architecture diagrams
-   [ ] Flow diagram
-   [ ] State diagram
-   [ ] Screenshots
-   [ ] Testing results
-   [ ] Demonstration video if applicable

## GitHub

-   [ ] Backend source code
-   [ ] Frontend source code
-   [ ] README
-   [ ] `.gitignore`
-   [ ] Meaningful commit history
-   [ ] `AlinaBaber` collaborator
-   [ ] No secrets committed

## Submission Form

Provide:

``` text
Google Drive Documentation:
<LINK>

GitHub Repository:
<LINK>

Demonstration Video:
<LINK, if applicable>
```

------------------------------------------------------------------------

# 37. Recommended Order of Actual Work

Do not try to build everything simultaneously.

Use this exact order:

``` text
1. Finalize case study
2. Write requirements
3. Identify entities
4. Identify attributes
5. Define PKs/FKs
6. Define relationships
7. Normalize database
8. Create ERD
9. Review ERD
10. Design system architecture
11. Design API endpoints
12. Create Django project
13. Implement models
14. Run migrations
15. Implement serializers
16. Implement APIs
17. Implement authentication
18. Test backend independently
19. Create React project
20. Build layout/navigation
21. Build dashboard
22. Build CRUD pages
23. Connect APIs
24. Implement business workflows
25. Test complete application
26. Fix bugs
27. Improve UI
28. Capture screenshots
29. Complete documentation
30. Finalize README
31. Push final code
32. Add collaborator
33. Upload documentation
34. Submit links
```

This sequence minimizes rework because the database and API design are
established before the UI is built.

------------------------------------------------------------------------

# 38. Key Principle for the Project

The strongest submission is not the one with the largest number of
features.

The strongest submission is the one where you can confidently explain:

> **Why the system was designed this way, how the database represents
> the real-world problem, how Django implements that database, how the
> API exposes the functionality, and how React consumes those APIs to
> create a complete working application.**

Every major part of the project should connect logically:

``` text
Real-world requirement
        ↓
Database requirement
        ↓
ERD relationship
        ↓
Django model
        ↓
REST API
        ↓
React component
        ↓
User workflow
```

If this chain is consistent throughout the project, the application will
satisfy the technical requirements of Task 4 while also demonstrating
genuine understanding of full-stack development.
