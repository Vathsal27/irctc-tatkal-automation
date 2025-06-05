# IRCTC Tatkal Ticket Booking Automation using Playwright

This project automates the process of booking General/Tatkal tickets on the IRCTC website using **Playwright** in **JavaScript**. It includes the capability to select specific trains and coaches dynamically based on user input, ensuring fast and reliable automation.

---

## 🚀 **Project Overview**
- Automates the process of booking General/Tatkal tickets on IRCTC.
- Uses **Playwright** for end-to-end browser automation.
- Handles dynamic selectors to select the correct train and coach.

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
        "name": "Monkey D. Luffy",
        "age": "19",
        "gender": "Male",
        "berthPreference": "NA"
    },
    {
        "name": "Boa Hancock",
        "age": "31",
        "gender": "Female",
        "berthPreference": "SUB"
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
For not giving any berth preference, enter `NA` in the field of berthPreference in .json file

---

## 🚦 **Usage**
### 1. **Set Up Data**
- Add your IRCTC login details in the `data.json` file.
- Enter the correct **source** and **destination station codes** carefully to avoid typos.  
- Specify the correct **quota** (`general` or `tatkal`).  
- Provide the **date, month, and year** of the journey accurately.  
- Enter the desired **train number** and **coach type** correctly.

### 2. **⏰ Set Test Timing**
- Set the booking time to 10:00:05 for AC Tatkal tickets and 11:00:05 for Sleeper Tatkal tickets by configuring the `testStartTime` variable in `tests/script.spec.js`
```bash
const testStartTime = "10:00:05"    # for AC tatkal
OR
const testStartTime = "11:00:05"    # for SL tatkal
```

### 3. **Run the Automation**
```bash
npm run script
```


---

## ⚠️ Disclaimer

This tool is intended **strictly for educational and personal learning purposes only**.  
It must **not** be used for any form of **commercial activity**, **business operations**, or for **generating profits**.  

The authors are **not responsible** for any misuse or violation of IRCTC's terms of service resulting from the use of this tool.  
Use it responsibly and at your own risk.

---

## 📜 **License**
This project is licensed under the **MIT License**.

---

## 👨‍💻 **Author**
**Vathsal Tammewar** – Developer 

---

### ⭐️ If you found this project helpful, give it a star!  