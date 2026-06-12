// daftar transaksi
const STORAGE_KEY = "transactions";
let transactionList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;

// cutom event
const EVENT_UPDATE = "transaction:updated";

// dashboard
const balance = document.querySelector("#balance-amount");
const income = document.querySelector("#income-amount");
const expense = document.querySelector("#expense-amount");

// form pencatatan transaksi
const transactionForm = document.querySelector("#transactionForm");

// pencarian transaksi
const searchForm = document.querySelector("#searchTransactionForm");
const searchInput = searchForm.querySelector(
  "#searchTransactionFormTitleInput",
);

// riwayat transaksi
const transactionHistory = document.querySelector("#transaction-list");
const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

// template transaksi
const transactionTemplate = document.querySelector("#transaction-template");

// =====================================
// FORM VALIDATIONS PENCATATAN TRANSAKSI
// =====================================
function validateTransaction(inputElement) {
  // Evaluasi dengan Constraint Validation API
  if (!inputElement.validity.valid) {
    let errorMessage = "";

    // tentukan error message berdasarkan error type
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

function renderTransaction(renderedTransaction = transactionList) {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  renderedTransaction.forEach(function (transaction) {
    // clone element dari template
    const transactionClone = transactionTemplate.content.cloneNode(true);

    // element yang akan diisi data dari form
    const transactionItem = transactionClone.querySelector(
      '[data-testid="transactionItem"]',
    );
    const transactionItemTitle = transactionClone.querySelector(
      "#transaction-item-title",
    );
    const transactionItemAmount = transactionClone.querySelector(
      '[data-testid="transactionItemAmount"]',
    );
    const transactionItemDate = transactionClone.querySelector(
      '[data-testid="transactionItemDate"]',
    );
    const transactionItemType = transactionClone.querySelector(
      '[data-testid="transactionItemType"]',
    );

    //icon transaksi
    const transactionIcon = transactionClone.querySelector("#transaction-icon");

    // isi detail transaksi
    transactionItem.setAttribute("data-transaction-id", transaction.id);
    transactionItemTitle.textContent = transaction.title;
    transactionItemAmount.textContent = `Rp. ${transaction.amount.toLocaleString("id-ID")}`;
    transactionItemDate.textContent = transaction.date;
    transactionItemType.textContent = transaction.type;

    // tampilkan transaksi di history sesuai kolomnya, sesuaikan icon, dan sesuaikan warna pada nominal
    if (transaction.type === "income") {
      transactionItemAmount.classList.add("income");
      transactionItemAmount.classList.remove("expense");

      transactionIcon.classList.add("income");
      transactionIcon.classList.remove("expense");
      incomeList.append(transactionItem);
    } else {
      transactionItemAmount.classList.add("expense");
      transactionItemAmount.classList.remove("income");

      transactionIcon.classList.add(
        "tracker-transaction-icon--expense",
        "expense",
      );
      transactionIcon.classList.remove("income");
      expenseList.append(transactionItem);
    }
  });
}

// ================
// UPDATE DASHBOARD
// ================

function updateSummaryDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  // hitung total saldo
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

// ==============
// EDIT TRANSAKSI
// ==============

function editTransaction(transactionId) {
  const transactionListItem = transactionList.find(
    (transaction) => transaction.id === transactionId,
  );

  // form input yang akan diedit
  const transactionFormTitle = transactionForm.querySelector(
    '[data-testid="transactionFormTitleInput"]',
  );
  const transactionFormAmount = transactionForm.querySelector(
    '[data-testid="transactionFormAmountInput"]',
  );
  const transactionFormDate = transactionForm.querySelector(
    '[data-testid="transactionFormDateInput"]',
  );
  const transactionFormType = transactionForm.querySelector(
    '[data-testid="transactionFormTypeSelect"]',
  );

  // mengembalikan value input ke form
  transactionFormTitle.value = transactionListItem.title;
  transactionFormAmount.value = transactionListItem.amount;
  transactionFormDate.value = transactionListItem.date;
  transactionFormType.value = transactionListItem.type;

  editingId = transactionId;

  const submitButton = transactionForm.querySelector(
    '[data-testid="transactionFormSubmitButton"]',
  );
  submitButton.textContent = "Simpan Perubahan"; // ganti teks pada button

  transactionFormTitle.focus(); // fokus ke input pertama
}

// ================
// SIMPAN TRANSAKSI
// ================

function saveTransaction(transaction) {
  // ambil data dari user input
  const formDataRaw = new FormData(transactionForm);
  const formData = Object.fromEntries(formDataRaw);

  // MODE EDIT TRANSAKSI
  if (editingId != null) {
    const indexTransactionToEdit = transactionList.findIndex(
      (transaction) => transaction.id === editingId,
    );

    const updatedTransaction = {
      id: editingId, // gunakan id yang sama
      ...formData,
      amount: Number(formData.amount), // ubah format nominal dari string menjadi number
    };

    transactionList[indexTransactionToEdit] = updatedTransaction;

    editingId = null;

    const submitButton = document.querySelector(
      '[data-testid="transactionFormSubmitButton"]',
    );
    submitButton.textContent = "Catat Transaksi"; // kembalikan teks seperti semula
  }
  // MODE SIMPAN TRANSAKSI
  else {
    const newTransaction = {
      id: "tx-" + Date.now(), // buat id dari timestamp
      ...formData,
      amount: Number(formData.amount), // ubah format nominal dari string menjadi number
    };

    transactionList.push(newTransaction);
  }
}

// ==============
// CARI TRANSAKSI
// ==============

function searchTransaction(keywords) {
  const searchedTransaction = transactionList.filter(function (transaction) {
    return transaction.title.toLowerCase().includes(keywords);
  });

  renderTransaction(searchedTransaction);

  searchInput.focus();
}

// =========================
// BERSIHKAN KOLOM PENCARIAN
// =========================

function clearSearchBar() {
  searchInput.value = ""; // hapus search bar
  renderTransaction(); // tampilkan history transaksi
  searchInput.focus(); // focus ke search bar
}

// ===================
// UBAH TYPE TRANSAKSI
// ===================

function changeTransactionType(transactionId) {
  const transactionListItem = transactionList.find(
    (transaction) => transaction.id === transactionId,
  );

  if (transactionListItem.type === "income") {
    transactionListItem.type = "expense";
  } else {
    transactionListItem.type = "income";
  }
}

// ===============
// HAPUS TRANSAKSI
// ===============

function deleteTransaction(transactionId) {
  transactionList = transactionList.filter(
    (transaction) => transaction.id !== transactionId,
  );
}

// ======================
// SINKRONISASI TRANSAKSI
// ======================

function updateTransaction(newTransactionList) {
  // update daftar transaksi
  transactionList = newTransactionList;

  // simpan daftar transaksi ke local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionList));

  // tampilkan history transaksi
  renderTransaction();

  // tampilkan total saldo di dashboard
  updateSummaryDashboard();
}

// ========================================
// EVENT LISTENER FORM PENCATATAN TRANSAKSI
// ========================================

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // FORM VALIDATION
  if (!transactionForm.checkValidity()) {
    // tampilkan alert jika form tidak valid
    const errorInputs = transactionForm.querySelectorAll(":invalid");
    errorInputs.forEach((input) => {
      validateTransaction(input);
    });

    // focus ke input pertama yang tidak valid
    if (errorInputs.length > 0) {
      errorInputs[0].focus();
    }

    return;
  }

  saveTransaction(transactionForm); // simpan transaksi
  document.dispatchEvent(new Event(EVENT_UPDATE)); // pancarkan sinyal custom event
  transactionForm.reset(); // reset form
});

// ==================================
// EVENT LISTENER PENCARIAN TRANSAKSI
// ==================================

searchForm.addEventListener("input", function (e) {
  const keywords = searchInput.value.toLowerCase();

  searchTransaction(keywords);
});

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const keywords = searchInput.value.toLowerCase();

  searchTransaction(keywords);
});

searchForm.addEventListener("click", function (e) {
  const clearButton = e.target.closest("#clear-button");

  if (clearButton) {
    clearSearchBar();
  }
});

// =============================
// EVENT LISTENER EDIT TRANSAKSI
// =============================

transactionHistory.addEventListener("click", function (e) {
  const editButton = e.target.closest("#edit-button");

  if (editButton) {
    const transactionItem = e.target.closest("[data-testid='transactionItem']");
    const transactionId = transactionItem.dataset.transactionId;

    editTransaction(transactionId); // kembalikan ke form input
  }
});

// ==================================
// EVENT LISTENER UBAH TYPE TRANSAKSI
// ==================================

transactionHistory.addEventListener("click", function (e) {
  const changeButton = e.target.closest(
    "[data-testid='transactionItemEditTypeButton']",
  );

  if (changeButton) {
    const transactionItem = e.target.closest("[data-testid='transactionItem']");
    const transactionId = transactionItem.dataset.transactionId;

    changeTransactionType(transactionId); // ubah type transaksi dari daftar transaksi

    document.dispatchEvent(new Event(EVENT_UPDATE)); // pancarkan sinyal custom event
  }
});

// ==============================
// EVENT LISTENER HAPUS TRANSAKSI
// ==============================

transactionHistory.addEventListener("click", function (e) {
  const deleteButton = e.target.closest(
    "[data-testid='transactionItemDeleteButton']",
  );

  if (deleteButton) {
    const transactionItem = e.target.closest("[data-testid='transactionItem']");
    const transactionId = transactionItem.dataset.transactionId;

    deleteTransaction(transactionId); // hapus transaksi dari daftar transaksi

    document.dispatchEvent(new Event(EVENT_UPDATE)); // pancarkan sinyal custom event
  }
});

// ===========================
// EVENT LISTENER CUSTOM EVENT
// ===========================

document.addEventListener(EVENT_UPDATE, function () {
  updateTransaction(transactionList);
});

// ==================
// APP INITIALIZATION
// ==================

function init() {
  renderTransaction();
  updateSummaryDashboard();

  // generate timestamp
  const dateTodayTimestamp = new Date();

  // mengubah bulan di header menjadi bulan ini
  const dateFormatMonthYear = dateTodayTimestamp.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const headerDate = document.querySelector("#header-date");
  headerDate.textContent = dateFormatMonthYear;

  // mengubah attribute max pada input date menjadi tanggal hari ini
  const dateFormatYYYYMMDD = dateTodayTimestamp.toISOString().split("T")[0];
  const dateInput = document.querySelector("#transactionFormDateInput");
  dateInput.setAttribute("max", dateFormatYYYYMMDD);
}

init();
