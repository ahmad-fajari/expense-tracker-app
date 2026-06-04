// pencatatan transaksi
const transactionForm = document.querySelector("#transactionForm");

// riwayat transaksi
const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

// daftar transaksi
const STORAGE_KEY = "transactions";
let transactionList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// membuat attribute max pada tanggal secara dinamis sesuai tanggal hari ini
const dateInput = document.querySelector("#transactionFormDateInput");
const dateTodayTimestamp = new Date();
// ubah menjadi format YYYY-MM-DD
const dateToday = dateTodayTimestamp.toISOString().split("T")[0];
dateInput.setAttribute("max", dateToday);

// =====================================
// FORM VALIDATIONS PENCATATAN TRANSAKSI
// =====================================
function validateTransaction(inputElement) {
  // 3. Evaluate using Constraint Validation API
  if (!inputElement.validity.valid) {
    let errorMessage = "";

    // 4. Determine which error message appears based on the type of error
    if (inputElement.validity.valueMissing) {
      errorMessage = inputElement.dataset.errorValue;
    } else if (inputElement.validity.rangeUnderflow) {
      errorMessage = inputElement.dataset.errorMin;
    } else if (inputElement.validity.rangeOverflow) {
      errorMessage = inputElement.dataset.errorMax;
    }

    if (errorMessage) {
      alert(errorMessage);
    }
    return false;
  } else {
    return true;
  }
}

// ========================================
// EVENT LISTENER FORM PENCATATAN TRANSAKSI
// ========================================

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!transactionForm.checkValidity()) {
    // tampilkan alert jika form tidak valid
    const errorInputs = transactionForm.querySelectorAll(":invalid");
    errorInputs.forEach((input) => {
      validateTransaction(input);
    });
  } else {
    // ambil data dari user input
    const formDataRaw = new FormData(transactionForm);
    const formData = Object.fromEntries(formDataRaw);

    const newTransaction = {
      // membuat transaction id secara otomatis menggunakan timestamp dengan format "tx-(timestamp)"
      id: "tx-" + Date.now(),
      // ambil semua user input
      ...formData,
      // ubah value nominal menjadi tipe data number
      amount: Number(formData.amount),
    };

    // masukkan transaction ke daftar transaksi
    transactionList.push(newTransaction);

    // simpan daftar transaksi ke local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionList));

    // reset form
    transactionForm.reset();
  }
});

console.log(transactionList);
