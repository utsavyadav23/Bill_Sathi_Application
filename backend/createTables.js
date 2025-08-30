const db = require("./db");

  // Customers
  const customersTable = `
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      customer_mobile_number VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Products
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

  // Bills
  const billsTable = `
    CREATE TABLE IF NOT EXISTS bills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT,
      total DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) DEFAULT 0,
      tax DECIMAL(10,2) DEFAULT 0,
      grand_total DECIMAL(10,2) NOT NULL,
      status ENUM('paid', 'due') DEFAULT 'due',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `;

  // Bill Items
  const billItemsTable = `
    CREATE TABLE IF NOT EXISTS bill_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bill_id INT,
      product_id INT,
      quantity INT NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) DEFAULT 0,
      tax DECIMAL(10,2) DEFAULT 0,
      grand_total DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bill_id) REFERENCES bills(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `;

  // App Users
  const appUsersTable = `
    CREATE TABLE IF NOT EXISTS app_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      app_user_designation VARCHAR(255) NOT NULL,
      app_user_mobile_number VARCHAR(10),
      app_user_email VARCHAR(100) UNIQUE NOT NULL,
      store_name VARCHAR(255),
      gst_number VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Categories
  const categoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Payments
  const paymentsTable = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bill_id INT,
      amount DECIMAL(10,2) NOT NULL,
      payment_mode ENUM('cash','card','upi','wallet') DEFAULT 'cash',
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bill_id) REFERENCES bills(id)
    )
  `;

  const salesTable = `
    CREATE TABLE IF NOT EXISTS sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT,
      total DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
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

  // Run all queries in sequence
  connection.query(customersTable, (err) => {
    if (err) throw err;
    console.log("Customers table ready.");

    connection.query(productsTable, (err) => {
      if (err) throw err;
      console.log("Products table ready.");

      connection.query(billsTable, (err) => {
        if (err) throw err;
        console.log("Bills table ready.");

        connection.query(billItemsTable, (err) => {
          if (err) throw err;
          console.log("Bill Items table ready.");

          connection.query(appUsersTable, (err) => {
            if (err) throw err;
            console.log("App Users table ready.");

            connection.query(categoriesTable, (err) => {
              if (err) throw err;
              console.log("Categories table ready.");

              connection.query(paymentsTable, (err) => {
                if (err) throw err;
                console.log("Payments table ready.");

                connection.query(salesTable, (err) => {
                  if (err) throw err;
                  console.log("Sales table ready.");

                  connection.query(reportsTable, (err) => {
                    if (err) throw err;
                    console.log("Reports table ready.");

                    connection.query(plansTable, (err) => {
                      if (err) throw err;
                      console.log("Plans table ready.");

                      connection.query(subscriptionsTable, (err) => {
                        if (err) throw err;
                        console.log("Subscriptions table ready.");
                        
                        connection.end();
                        console.log("All tables ready.");
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });