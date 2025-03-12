
# IRCTC Tatkal Ticket Booking Automation using Playwright

This project automates the process of booking General/Tatkal tickets on the IRCTC website using **Playwright** in **JavaScript**. It includes the capability to select specific trains and coaches dynamically based on user input, ensuring fast and reliable automation.

---

## 🚀 **Project Overview**
- Automates the process of booking General/Tatkal tickets on IRCTC.
- Uses **Playwright** for end-to-end browser automation.
- Handles dynamic selectors to select the correct train and coach.

---

## 🏗️ **Project Structure**
```
├── class
│   └── ticketClass.js   # Core automation logic
├── tests
│   └── script.spec.js         # Test cases for booking
├── utils
│   └── bookTicket.js        # Helper functions for automation
├── .gitignore
├── package.json
├── README.md
└── playwright.config.js       # Playwright configuration
```

---

## 📚 **Setup Instructions**
1. **Clone the Repository**  
```bash
git clone https://github.com/Vathsal27/irctc-automation.git
cd irctc-automation
```

2. **Install Dependencies**  
```bash
npm install
```

3. **Install Playwright Browsers**  
```bash
npx playwright install
```

## Supported Inputs
| Input        | Accepted Values                      |
|-------------|---------------------------------------|
| **Quota**     | `general`, `tatkal`                   |
| **Gender**    | `Male`, `Female`, `Transgender`        |
| **Coach Type**| `SL`, `3A`, `2A`, `1A`                |

---

## 🚦 **Usage**
### 1. **Set Up Environment**
- Add your IRCTC login details in the config file.
- Configure the train number and coach type in `tatkalTicket.js`.

### 2. **Run the Automation**
```bash
npm run test
```

---


## 📜 **License**
This project is licensed under the **MIT License**.

---

## 👨‍💻 **Author**
**Vathsal Tammewar** – Developer 

---

### ⭐️ If you found this project helpful, give it a star!  
