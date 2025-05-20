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

---

## 🧑‍💼 **Passenger Details Configuration**
You can add passenger details by modifying the `data.json` file.  
- `passengerDetails` is an array where you can add up to **4 passengers** at once.  
- Just **duplicate the object structure** and update the user details accordingly.  

### Example:
```javascript
const passengerDetails = [
    {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        berthPreference: 'NA'
    },
    {
        name: 'Jane Doe',
        age: 28,
        gender: 'Female',
        berthPreference: 'UB'
    }
];
```
> You can add up to **4 passenger objects** in the array.

---

## 📥 **Supported Inputs**
| Input        | Accepted Values                      |
|-------------|---------------------------------------|
| **Quota**     | `general`, `tatkal`                   |
| **Gender**    | `Male`, `Female`, `Transgender`        |
| **Coach Type**| `2S`, `SL`, `3A`, `2A`, `1A`           |

---

## 🛏️ **Berth Code Mapping**
During seat preference selection, berth types are internally mapped to short codes used by IRCTC. The following mapping is used:

```javascript
{
  'NA': 'Any Berth',
  'LB': 'Lower Berth',
  'UB': 'Upper Berth',
  'MB': 'Middle Berth',
  'SLB': 'Side Lower',
  'SUB': 'Side Upper',
  'CB': 'Cabin',
  'CP': 'Coupe'
}
```

This mapping helps in dynamically converting user-friendly berth names into values recognized by the system.
For not giving any berth preference, enter "NA" in the field of berthPreference in .json file

---

## 🚦 **Usage**
### 1. **Set Up Data**
- Add your IRCTC login details in the `data.json` file.
- Enter the correct **source** and **destination station codes** carefully to avoid typos.  
- Specify the correct **quota** (`general` or `tatkal`).  
- Provide the **date, month, and year** of the journey accurately.  
- Enter the desired **train number** and **coach type** correctly.

### 2. **Run the Automation**
```bash
npm run script
```

---

## 📜 **License**
This project is licensed under the **MIT License**.

---

## 👨‍💻 **Author**
**Vathsal Tammewar** – Developer 

---

### ⭐️ If you found this project helpful, give it a star!  