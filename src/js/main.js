// daftar transaksi
const STORAGE_KEY = "transactions";
let transactionList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

console.log(transactionList);

// dashboard
const balance = document.querySelector("#balance-amount");
const income = document.querySelector("#income-amount");
const expense = document.querySelector("#expense-amount");

// form pencatatan transaksi
const transactionForm = document.querySelector("#transactionForm");

// riwayat transaksi
const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

// template transaksi
const transactionTemplate = document.querySelector("#transaction-template");

// membuat attribute max pada tanggal secara dinamis sesuai tanggal hari ini
const dateInput = document.querySelector("#transactionFormDateInput");
const dateTodayTimestamp = new Date();
// mengubah formatnya menjadi YYYY-MM-DD
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

// ================
// RENDER TRANSAKSI
// ================

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

    // masukkan data transaksi ke kolom yang sesuai dan sesuaikan warnanya
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

// ==================
// HITUNG TOTAL SALDO
// ==================

function sumBalance() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactionList.forEach(function (transaction) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  // tampilkan saldo di dashboard
  balance.textContent = `Rp. ${totalBalance.toLocaleString("id-ID")}`;
  income.textContent = `Rp. ${totalIncome.toLocaleString("id-ID")}`;
  expense.textContent = `Rp. ${totalExpense.toLocaleString("id-ID")}`;
}

// ==================================================================
// UPDATE ARRAY, LOCAL STORAGE, DAN UI SETIAP ADA PERUBAHAN TRANSAKSI
// ==================================================================

function updateTransaction(newTransactionList) {
  // update daftar transaksi
  transactionList = newTransactionList;

  // simpan daftar transaksi ke local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionList));

  // tampilkan ke ui
  renderTransaction();

  // hitung saldo
  sumBalance();
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

    // jalankan function updateTransaction
    updateTransaction(transactionList);

    // reset form
    transactionForm.reset();
  }
});

// ==================
// APP INITIALIZATION
// ==================

function init() {
  renderTransaction();
  sumBalance();
}

init();
