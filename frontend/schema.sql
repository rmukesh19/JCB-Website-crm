-- JCB360 MySQL Schema - Production Ready Enterprise ERP

CREATE DATABASE IF NOT EXISTS jcb360_erp;
USE jcb360_erp;

-- 1. Companies
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    gstin VARCHAR(15),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Branches
CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 3. Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'ACCOUNTANT', 'OPERATOR') NOT NULL DEFAULT 'MANAGER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 4. Machines
CREATE TABLE machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    plate_number VARCHAR(30) UNIQUE NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2) NOT NULL,
    monthly_rate DECIMAL(10,2) NOT NULL,
    chassis_number VARCHAR(100),
    engine_number VARCHAR(100),
    status ENUM('AVAILABLE', 'RUNNING', 'MAINTENANCE', 'OUT_OF_SERVICE') DEFAULT 'AVAILABLE',
    purchase_date DATE,
    last_service_date DATE,
    next_service_due_hours INT DEFAULT 250,
    current_hours INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 5. Customers
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    gstin VARCHAR(15),
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    billing_address TEXT,
    outstanding_balance DECIMAL(12,2) DEFAULT 0.00,
    credit_limit DECIMAL(12,2) DEFAULT 100000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- 6. Operators
CREATE TABLE operators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    salary_type ENUM('MONTHLY', 'DAILY') DEFAULT 'MONTHLY',
    salary_rate DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('AVAILABLE', 'ON_DUTY', 'ON_LEAVE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 7. Drivers
CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status ENUM('AVAILABLE', 'ON_DUTY', 'ON_LEAVE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 8. Bookings
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    customer_id INT NOT NULL,
    machine_id INT NOT NULL,
    operator_id INT NOT NULL,
    driver_id INT,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    start_hours INT NOT NULL,
    end_hours INT,
    billing_type ENUM('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CONTRACT') NOT NULL,
    billing_rate DECIMAL(10,2) NOT NULL,
    site_location VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (machine_id) REFERENCES machines(id),
    FOREIGN KEY (operator_id) REFERENCES operators(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- 9. Invoices
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    booking_id INT NOT NULL,
    customer_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    cgst_rate DECIMAL(5,2) DEFAULT 9.00,
    sgst_rate DECIMAL(5,2) DEFAULT 9.00,
    igst_rate DECIMAL(5,2) DEFAULT 0.00,
    cgst_amount DECIMAL(12,2) DEFAULT 0.00,
    sgst_amount DECIMAL(12,2) DEFAULT 0.00,
    igst_amount DECIMAL(12,2) DEFAULT 0.00,
    total_tax DECIMAL(12,2) NOT NULL,
    grand_total DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    outstanding_amount DECIMAL(12,2) NOT NULL,
    status ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'VOID') DEFAULT 'UNPAID',
    qr_code_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 10. Diesel Records
CREATE TABLE diesel_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    machine_id INT NOT NULL,
    operator_id INT NOT NULL,
    fill_date DATETIME NOT NULL,
    quantity_liters DECIMAL(8,2) NOT NULL,
    rate_per_liter DECIMAL(8,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    current_hours INT NOT NULL,
    vendor_name VARCHAR(100),
    slip_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (machine_id) REFERENCES machines(id),
    FOREIGN KEY (operator_id) REFERENCES operators(id)
);

-- 11. Maintenance Records
CREATE TABLE maintenance_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    machine_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- Scheduled, Breakdown, Preventive
    service_date DATE NOT NULL,
    service_hours INT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    description TEXT,
    technician_name VARCHAR(100),
    parts_replaced TEXT, -- JSON or text representation
    next_due_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (machine_id) REFERENCES machines(id)
);

-- 12. Accounts & Ledger
CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    balance DECIMAL(14,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT NOT NULL,
    transaction_date DATE NOT NULL,
    reference_number VARCHAR(50),
    description TEXT,
    type ENUM('RECEIPT', 'PAYMENT', 'JOURNAL', 'CONTRA') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE transaction_lines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    account_id INT NOT NULL,
    debit DECIMAL(14,2) DEFAULT 0.00,
    credit DECIMAL(14,2) DEFAULT 0.00,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- 13. Audit Logs
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
