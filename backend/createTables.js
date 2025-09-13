const db = require("./config/db");

const customersTable = `
  CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_mobile_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const productsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    selling_price DECIMAL(10,2) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category VARCHAR(50),
    image VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const billsTable = `
  CREATE TABLE IF NOT EXISTS bills (
    bill_number INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    total DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    grand_total DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH','UPI','CREDIT') DEFAULT 'CASH',
    status ENUM('Paid', 'Due') DEFAULT 'Due',
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )
`;

const billItemsTable = `
  CREATE TABLE IF NOT EXISTS bill_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`;

const appUsersTable = `
  CREATE TABLE IF NOT EXISTS app_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    app_user_designation VARCHAR(255) NOT NULL,
    app_user_mobile_number VARCHAR(10),
    app_user_email VARCHAR(100) UNIQUE NOT NULL,
    store_name VARCHAR(255),
    gst_number VARCHAR(20),
    currency VARCHAR(10) DEFAULT 'INR',
    language VARCHAR(10) DEFAULT 'en',
    bill_type ENUM('Retail','Wholesale') DEFAULT 'Retail',
    bill_prefix VARCHAR(20) DEFAULT 'BILL-',
    barcode_enabled TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const categoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const reportsTable = `
  CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(100) NOT NULL,
    report_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const plansTable = `
  CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    plan_price INT(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const subscriptionsTable = `
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    plan_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
  )
`;

const billPdfsTable = `
CREATE TABLE IF NOT EXISTS  bill_pdfs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
)`;

const purchasesTable = `CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    quantity INT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * purchase_price) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_purchases_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_purchases_category FOREIGN KEY (category_id) REFERENCES categories(id)
)`;

const salesTable = `CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_items_id INT NOT NULL,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    quantity INT NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * selling_price) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_bill_items FOREIGN KEY (bill_items_id) REFERENCES bill_items(id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_order_items_category FOREIGN KEY (category_id) REFERENCES categories(id)
)`;

async function createTables() {
  try {
    await db.query(customersTable);
    console.log("Customers table ready.");

    await db.query(productsTable);
    console.log("Products table ready.");

    await db.query(billsTable);
    console.log("Bills table ready.");

    await db.query(billItemsTable);
    console.log("Bill Items table ready.");

    await db.query(appUsersTable);
    console.log("App Users table ready.");

    await db.query(categoriesTable);
    console.log("Categories table ready.");

    await db.query(plansTable);
    console.log("Plans table ready.");

    await db.query(salesTable);
    console.log("Sales table ready.");

    await db.query(reportsTable);
    console.log("Reports table ready.");

    await db.query(subscriptionsTable);
    console.log("Subscriptions table ready.");

    await db.query(billPdfsTable);
    console.log("Bill PDFs table ready.");

    await db.query(purchasesTable);
    console.log("Purchase table ready.");

    console.log("All tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables:", err.message);
    process.exit(1);
  }
}

createTables();
