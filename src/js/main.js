// pencatatan transaksi
const transactionForm = document.querySelector("#transactionForm");

// riwayat transaksi
const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

// template transaksi
const transactionTemplate = document.querySelector("#transaction-template");

// daftar transaksi
const STORAGE_KEY = "transactions";
let transactionList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

console.log(transactionList);

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

// =========================
// FUNCTION RENDER TRANSAKSI
// =========================

function renderTransaction() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  transactionList.forEach(function (transaction) {
    // clone element dari template
    const transactionData = transactionTemplate.content.cloneNode(true);

    // element yang akan diisi data dari form user input
    const transactionItemTitle = transactionData.querySelector(
      '[data-testid="transactionItemTitle"]',
    );
    const transactionItemAmount = transactionData.querySelector(
      '[data-testid="transactionItemAmount"]',
    );
    const transactionItemDate = transactionData.querySelector(
      '[data-testid="transactionItemDate"]',
    );
    const transactionItemType = transactionData.querySelector(
      '[data-testid="transactionItemType"]',
    );

    // isi transaksi dari transactionList
    transactionItemTitle.textContent = transaction.title;
    transactionItemAmount.textContent = `Rp. ${transaction.amount.toLocaleString("id-ID")}`;
    transactionItemDate.textContent = transaction.date;
    transactionItemType.textContent = transaction.type;

    // tampilkan transaksi di kolom yang sesuai dan sesuaikan warnanya
    if (transaction.type === "income") {
      transactionItemAmount.classList.add(
        "tracker-transaction-item__amount__income",
      );
      transactionItemAmount.classList.remove(
        "tracker-transaction-item__amount__expense",
      );
      incomeList.append(transactionData);
    } else {
      transactionItemAmount.classList.add(
        "tracker-transaction-item__amount__expense",
      );
      transactionItemAmount.classList.remove(
        "tracker-transaction-item__amount__income",
      );
      expenseList.append(transactionData);
    }
  });
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

    // tampilkan di history transaksi
    renderTransaction();

    // reset form
    transactionForm.reset();
  }
});

// Render list transaksi saat user membuka pertama kali
renderTransaction();
