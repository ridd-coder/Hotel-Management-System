# 🏨 LuxeStay - Hotel Management System

A modern **Hotel Management System** built using **DBMS concepts, SQL, and a web-based frontend** to streamline hotel operations such as room booking, guest management, reservations, and payment tracking.

## 📖 Overview

Traditional hotel management relies heavily on manual record-keeping, which often leads to data redundancy, inconsistency, and operational inefficiencies. LuxeStay provides a centralized database-driven solution for managing hotel information efficiently.

The system supports:

* Hotel and room management
* Guest registration and booking
* Reservation tracking
* Payment management
* Booking history
* Room availability checking
* Search and filtering options

---

## ✨ Features

### 👤 User Features

* Browse available hotels
* Search hotels by location and name
* Filter hotels by rating
* View room availability
* Book rooms instantly
* View booking history
* Download booking receipts
* Cancel reservations

### 🗄️ Database Features

* ER Model-based design
* Relational Schema implementation
* Normalized database structure
* Primary & Foreign Key relationships
* SQL DDL and DML operations
* Data integrity and consistency

---

## 🛠️ Technologies Used

| Technology    | Purpose             |
| ------------- | ------------------- |
| HTML          | Structure           |
| CSS           | Styling             |
| JavaScript    | Frontend Logic      |
| SQL           | Database Management |
| MySQL         | Data Storage        |
| DBMS Concepts | Database Design     |

---

## 📊 Database Design

The database includes the following entities:

* Hotels
* Rooms
* Guests
* Reservations
* Payments
* Staff
* Services

### Relationships

* One Hotel → Many Rooms
* One Guest → Many Reservations
* One Reservation → One Payment
* One Hotel → Many Staff Members

---

# 📸 Screenshots

## Home Page

The landing page of LuxeStay showcasing luxury hotel booking features.

![Home Page] <img width="1470" height="836" alt="a" src="https://github.com/user-attachments/assets/bfa4669d-316b-4ad7-bfbd-751269423403" />


---

## Hotels Listing Page

Users can browse available hotels, search by location, and apply filters.

![Hotels Page]<img width="1470" height="810" alt="b" src="https://github.com/user-attachments/assets/81081b0c-ff24-4eec-b4ad-3d1af1e454d5" />

---

## Booking Management Page

Users can manage and filter reservations using booking ID, status, and date ranges.

![Bookings Page]<img width="1470" height="807" alt="c" src="https://github.com/user-attachments/assets/576a487d-8709-478c-b2b1-bc60862b3a85" />

---

## Booking History

Displays all reservations along with payment details and receipt generation options.

![Booking History]<img width="1470" height="804" alt="d" src="https://github.com/user-attachments/assets/3fc8bcaf-ed03-4a27-96ef-6c5a088e874d" />

---

## Reservation Details

Detailed reservation information including room ID, booking status, check-in/check-out dates, and payment amount.

![Reservation Details]<img width="1470" height="956" alt="e" src="https://github.com/user-attachments/assets/4487436e-69db-4c95-bb0e-0ba95849288a" />

---

## 🚀 Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/Hotel-Management-System.git
```

2. Navigate to project folder

```bash
cd Hotel-Management-System
```

3. Import the SQL database

```sql
hotel_management.sql
```

4. Run the frontend

```bash
Open index.html
```

---

## 📂 Project Structure

```text
Hotel-Management-System/
│
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│
├── frontend/
│   ├── index.html
│   ├── hotels.html
│   ├── bookings.html
│   ├── css/
│   ├── js/
│
├── screenshots/
│
└── README.md
```

---

## 🎯 Learning Outcomes

This project demonstrates:

* Entity Relationship Modeling
* Database Normalization
* Relational Schema Design
* SQL Queries
* Primary & Foreign Keys
* CRUD Operations
* Database Integrity Constraints

---

## 🔮 Future Enhancements

* Online payment gateway integration
* Admin dashboard
* Email notifications
* User authentication system
* Advanced reporting and analytics
* Mobile responsive design

---

## 👨‍💻 Author

**Riddhiman Dutta**

GitHub: https://github.com/ridd-coder
